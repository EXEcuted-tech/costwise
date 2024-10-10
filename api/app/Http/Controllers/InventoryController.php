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

class InventoryController extends Controller
{
    protected $fileModel;
    protected $monthYear;
    protected $inventoryIds = [];

    public function retrieveInventory () {
        $inventory = Inventory::all();
        return response()->json($inventory);
    }

    public function upload(Request $request)
    {
$file = $request->file('file');
        $this->monthYear = $request->input('month_year');
        $fileName = $request->input('file_name');
        $fileNameWithExt = $request->input('file_name_with_extension');
        $extension = $file->getClientOriginalExtension();

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

            $this->processExcel($file->getRealPath());

            $settings['inventory_ids'] = $this->inventoryIds;
            $this->fileModel['settings'] = json_encode($settings);

            File::create($this->fileModel);

            return response()->json(['message' => 'File uploaded successfully']);
        }

        return response()->json(['error' => 'Unsupported file type'], 400);
    }

    private function processExcel($filePath)
    {
        $spreadsheet = IOFactory::load($filePath);
        $worksheets = [
            'Purchases' => $spreadsheet->getSheetByName('Purchases'),
            'Inventory' => $spreadsheet->getSheetByName('Inventory'),
            'Usages' => $spreadsheet->getSheetByName('Usages'),
        ];

        $purchasesData = $this->processPurchasesSheet($worksheets['Purchases']);
        $inventoryData = $this->processInventorySheet($worksheets['Inventory']);
        $usagesData = $this->processUsagesSheet($worksheets['Usages']);

        $this->createInventoryRecords($purchasesData, $inventoryData, $usagesData);
    }

    private function processPurchasesSheet($worksheet)
    {
        $data = $worksheet->toArray();
        $headers = array_shift($data);
        $purchasesData = [];

        foreach ($data as $row) {
            $rowData = array_combine($headers, $row);
            $itemCode = $rowData['Item Code'];
            $itemDescription = $rowData['Item Description'];
            $itemCost = $rowData['Unit Cost'];
            $purchasedQty = $rowData['Quantity'];
            $date = $rowData['Month'];

            if (!$itemCode || !$date) {
                continue;
            }

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

            $material = Material::firstOrCreate(
                ['material_code' => $itemCode],
                [
                    'material_desc' => $itemDescription,
                    'material_cost' => $itemCost,
                    'date' => $formattedDate,
                    'unit' => 'N/A'
                ]
            );

            $purchasesData[$itemCode] = [
                'material_id' => $material->material_id,
                'purchased_qty' => $purchasedQty,
            ];
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
            $unit = $rowData['Unit'];
            $inventoryQty = $rowData['Quantity'];

            $inventoryData[$itemCode] = [
                'unit' => $unit,
                'inventory_qty' => $inventoryQty,
            ];
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

            $usagesData[$itemCode] = [
                'usage_qty' => $usageQty,
            ];
        }

        return $usagesData;
    }

    private function createInventoryRecords($purchasesData, $inventoryData, $usagesData)
    {
        $categories = [
            'RM-MM' => 'meat_material',
            'RM-NM-MA' => 'meat_alternate',
            'RM-NM-PK' => 'packaging',
            'RM-NM-FI' => 'food_ingredient',
            'RM-NM-CA' => 'casing',
            'RM-NM-TC' => 'tin_can',
            '' => 'other',
        ];

        foreach ($inventoryData as $itemCode => $inventoryItem) {
            $material = Material::where('material_code', $itemCode)->first();

            if (!$material) {
                continue;
            }

            if (!$material->unit) {
                $material->unit = $inventoryItem['unit'];
                $material->save();
            }

            // Determine the category based on the item code
            $category = 'other';
            foreach ($categories as $prefix => $categoryName) {
                if (strpos($itemCode, $prefix) === 0) {
                    $category = $categoryName;
                    break;
                }
            }

            //Clean data
            $purchased_qty = $this->cleanNumericValue($purchasesData[$itemCode]['purchased_qty'] ?? 0);
            $usage_qty = $this->cleanNumericValue($usagesData[$itemCode]['usage_qty'] ?? 0);
            $total_qty = $this->cleanNumericValue($inventoryItem['inventory_qty'] ?? 0);

            //Determine stock status
            $stockStatus = 'In Stock';
            if ($total_qty < $usage_qty) {
                $stockStatus = 'Low Stock';
            }

            $now = now();

            $inventoryRecord = Inventory::create([
                'material_id' => $material->material_id,
                'material_category' => $category,
                'stock_status' => $stockStatus,
                'purchased_qty' => $purchased_qty,
                'usage_qty' => $usage_qty,
                'total_qty' => $total_qty,
                'created_at' => $now,
                'updated_at' => $now,
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
