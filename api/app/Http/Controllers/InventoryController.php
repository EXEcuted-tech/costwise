<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use League\Csv\Reader;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\File;
use App\Models\Material;
use Carbon\Carbon;
use App\Models\Inventory;

class InventoryController extends ApiController
{
    protected $fileModel;
    protected $monthYear;
    protected $inventoryIds = [];

    public function retrieveAll ()
    {
        try {
            $inventory = Inventory::all();

            $this->status = 200;
            return response()->json($inventory);
        } catch (\Throwable $th) {

            $this->status = $th->getCode() ?: 500;
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }

    public function retrieve(Request $request)
    {
        $allowedColumns = [
            'inventory_id',
            'material_id',
            'material_category',
            'stock_status',
            'purchased_qty',
            'usage_qty',
            'total_qty',
        ];

        $col = $request->query('col');
        $val = $request->query('val');

        if (!in_array($col, $allowedColumns)) {
            $this->status = 400;
            return $this->getResponse("Invalid column specified.");
        }

        try {
            $records = Inventory::where($col, $val)->get();

            if ($records->isEmpty()) {
                $this->status = 404;
                return $this->getResponse("No records found.");
            }

            $this->status = 200;
            $this->response['data'] = $records;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    public function retrieveBatch(Request $request)
    {
        $allowedColumns = [
            'inventory_id',
            'material_id',
            'material_category',
            'stock_status',
            'purchased_qty',
            'usage_qty',
            'total_qty',
        ];

        $col = $request->query('col');
        $val = $request->query('val');


        if (!in_array($col, $allowedColumns)) {
            $this->status = 400;
            return $this->getResponse("Invalid column specified.");
        }

        if (empty($val) || !is_array($val)) {
            $this->status = 400;
            return $this->getResponse("Values should be a non-empty array.");
        }

        try {
            $records = Inventory::whereIn($col, $val)->get();

            if ($records->isEmpty()) {
                $this->status = 404;
                return $this->getResponse("No records found.");
            }

            $this->status = 200;
            $this->response['data'] = $records;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    public function upload(Request $request)
    {
        $file = $request->file('file');
        $this->monthYear = $request->input('month_year');

        // Check if monthYear is valid
        $currentMonth = Carbon::now()->format('Y-m');
        $uploadMonth = Carbon::createFromFormat('Y-m', $this->monthYear);

        if ($uploadMonth->format('Y-m') > $currentMonth) {
            $this->status = 400;
            return $this->getResponse("Cannot process data for future months. Please select a month up to the current month.");
        }

        $fileName = $request->input('file_name');
        $fileNameWithExt = $request->input('file_name_with_extension');
        $extension = $file->getClientOriginalExtension();

        if (strpos($fileName, "Inventory") === false) {
            $this->status = 400;
            return $this->getResponse("Invalid file. Please upload a valid inventory file.");
        }

        $user = Auth::user();
        $userName = "{$user->first_name} {$user->middle_name} {$user->last_name}";

        $settings = [
            'file_name' => $fileName,
            'file_name_with_extension' => $fileNameWithExt,
            'user' => $userName,
            'monthYear' => $this->monthYear,
        ];

        if ($extension == 'xlsx') {
            $this->fileModel = [
                'file_type' => 'inventory_file',
                'settings' => json_encode($settings),
            ];

            //Process Excel file
            try {
                $this->processExcel($file->getRealPath(), $this->monthYear);
            } catch (\Exception $e) {
                $this->status = 400;
                $this->response['message'] = $e->getMessage();
                return $this->getResponse();
            }

            $settings['inventory_ids'] = $this->inventoryIds;
            $this->fileModel['settings'] = json_encode($settings);

            File::create($this->fileModel);

            return response()->json(['message' => 'File uploaded successfully']);
        }

        return response()->json(['error' => 'Unsupported file type'], 400);
    }

    private function processExcel($filePath, $monthYear)
    {
        try {
            $spreadsheet = IOFactory::load($filePath);

            // Process each sheet
            $worksheets = [
                'Purchases' => $spreadsheet->getSheetByName('Purchases'),
                'Inventory' => $spreadsheet->getSheetByName('Inventory'),
                'Usages' => $spreadsheet->getSheetByName('Usages'),
            ];

            $purchasesData = $this->processPurchasesSheet($worksheets['Purchases'], $monthYear);
            $inventoryData = $this->processInventorySheet($worksheets['Inventory']);
            $usagesData = $this->processUsagesSheet($worksheets['Usages']);

            //Create inventory record
            $this->createInventoryRecords($purchasesData, $inventoryData, $usagesData);

        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    private function processPurchasesSheet($worksheet, $monthYear)
    {
        $data = $worksheet->toArray();
        $headers = array_shift($data);
        $purchasesData = [];
        $isMonthYearPresent = false;

        $defaultUnits = [
            'RM-MM' => 'kg',
            'RM-NM-FI' => 'kg',
            'RM-NM-MA' => 'kg',
            'RM-NM-ME' => 'blks',
            'RM-NM-ME-WA' => 'N/A',
            'RM-NM-PK' => 'pc',
            'RM-NM-PK-OT-FM' => 'roll',
            'RM-NM-PK-OT-HN' => 'mtr',
            'RM-NM-PK-OT-TH' => 'cones',
            'RM-NM-TC' => 'tin',
            'BP-RM-MM' => 'N/A',

            'RM-NM-CA-DE' => 'mtrs',
            'RM-NM-CA-HI' => 'pc',
            'RM-NM-CA-HO' => 'hank',
            'RM-NM-CA-IP-PL' => 'pc',
            'RM-NM-CA-IP-SH' => 'meter',
            'RM-NM-CA-NA-FI' => 'meter',
            'RM-NM-CA-ND' => 'strd',
            'RM-NM-CA-NO' => 'strd',
            'RM-NM-CA-PR' => 'mtr',
            'RM-NM-CA-VE-PL' => 'pc',
            'RM-NM-CA-VE-PR' => 'strd',
            'RM-NM-CA-VI-CL' => 'strd',
            'RM-NM-CA-VI-CO' => 'meter',
            'RM-NM-CA-VI-PR' => 'strd',
            'RM-NM-CA-VI-RE' => 'strd',
        ];

        // //Check if monthYear is present in the date column
        // foreach ($data as $row) {
        //     if (strpos($row[0], $monthYear) !== false) {
        //         $isMonthYearPresent = true;
        //         break;
        //     }
        // }

        // if (!$isMonthYearPresent) {
        //     $this->status = 400;
        //     return $this->getResponse("The selected Month/Year date is not present in the Inventory file.");
        // }

        // If present, process the data
        foreach ($data as $row) {
            $rowData = array_combine($headers, $row);
            $itemCode = $rowData['Item Code'];
            $itemDescription = $rowData['Item Description'];
            $itemCost = $rowData['Unit Cost'];
            $purchasedQty = $rowData['Quantity'];
            $date = $rowData['Month'];
            $unit = $rowData['Unit'] ?? 'N/A';

            if (!$itemCode || !$date) {
                continue;
            }

            //clean up date column
            $cleanDate = str_replace('\\', '', $date);
            try {
                $carbonDate = Carbon::createFromFormat('n/d/Y', $cleanDate);
            } catch (\Exception $e) {
                try {
                    $carbonDate = Carbon::createFromFormat('n/j/Y', $cleanDate);
                } catch (\Exception $e) {
                    $carbonDate = Carbon::now();
                }
            }


            $formattedDate = $carbonDate->format('Y-m-d');

            //assign default units if not provided
            if (!$unit || $unit == 'N/A') {
                foreach ($defaultUnits as $prefix => $defaultUnit) {
                    if (strpos($itemCode, $prefix) === 0) {
                        $unit = $defaultUnit;
                        break;
                    }
                }
            }

            $material = Material::updateOrCreate(
                ['material_code' => $itemCode],
                [
                    'material_desc' => $itemDescription,
                    'material_cost' => $itemCost,
                    'date' => $formattedDate,
                    'unit' => $unit,
                ]
            );
            //only include purchases for the specified monthYear in purchasesData
            if ($carbonDate->format('Y-m') === $monthYear) {
                $purchasesData[$material->material_id] = [
                    'purchased_qty' => $this->cleanNumericValue($purchasedQty),
                ];
            }
        }

        return $purchasesData;
    }

    private function processInventorySheet($worksheet)
    {
        $data = $worksheet->toArray();
        $headers = array_shift($data);
        $inventoryData = [];

        foreach ($data as $row) {
            $rowData = array_combine($headers, $row);
            $itemCode = $rowData['Item Code'];
            $inventoryQty = $rowData['Quantity'];

            //update existing material
            $material = Material::where('material_code', $itemCode)->first();

            if ($material) {
                $inventoryData[$material->material_id] = [
                    'inventory_qty' => $this->cleanNumericValue($inventoryQty),
                ];
            }
        }
        return $inventoryData;
    }

    private function processUsagesSheet($worksheet)
    {
        $data = $worksheet->toArray();
        $headers = array_shift($data);
        $usagesData = [];

        foreach ($data as $row) {
            $rowData = array_combine($headers, $row);
            $itemCode = $rowData['Item Code'];
            $usageQty = $rowData['Quantity'];

            $material = Material::where('material_code', $itemCode)->first();

            if ($material) {
                $usagesData[$material->material_id] = [
                    'usage_qty' => $this->cleanNumericValue($usageQty),
                ];
            }

        }

        return $usagesData;
    }

    private function createInventoryRecords($purchasesData, $inventoryData, $usagesData)
    {
        $allMaterialIds = array_unique(array_merge(
            array_keys($purchasesData),
            array_keys($inventoryData),
            array_keys($usagesData)
        ));

        $categories = [
            'RM-MM' => 'meat_material',
            'RM-NM-MA' => 'meat_alternate',
            'RM-NM-PK' => 'packaging',
            'RM-NM-FI' => 'food_ingredient',
            'RM-NM-CA' => 'casing',
            'RM-NM-TC' => 'tin_can',
            '' => 'other',
        ];

        foreach ($allMaterialIds as $materialId) {
            $material = Material::find($materialId);

            if (!$material) {
                continue;
            }

            // Determine the category based on the item code
            $category = 'other';
            foreach ($categories as $prefix => $categoryName) {
                if (strpos($material->material_code, $prefix) === 0) {
                    $category = $categoryName;
                    break;
                }
            }

            $purchasedQty = $purchasesData[$materialId]['purchased_qty'] ?? 0;
            $inventoryQty = $inventoryData[$materialId]['inventory_qty'] ?? 0;
            $usageQty = $usagesData[$materialId]['usage_qty'] ?? 0;

            //Determine stock status
            $stockStatus = $inventoryQty < $usageQty ? 'Low Stock' : 'In Stock';

            $inventoryRecord = Inventory::create([
                'material_id' => $materialId,
                'material_category' => $category,
                'stock_status' => $stockStatus,
                'purchased_qty' => $purchasedQty,
                'usage_qty' => $usageQty,
                'total_qty' => $inventoryQty,
            ]);

            $this->inventoryIds[] = $inventoryRecord->inventory_id;
        }

        return response()->json(['message' => 'Inventory records created successfully']);
    }

    private function cleanNumericValue($value)
    {
        // Remove any non-numeric characters except for the decimal point
        $cleaned = preg_replace('/[^0-9.]/', '', $value);
        // Convert to float
        return floatval($cleaned);
    }
}
