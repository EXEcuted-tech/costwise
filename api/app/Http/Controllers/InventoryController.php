<?php

namespace App\Http\Controllers;

use App\Models\Bom;
use App\Models\FinishedGood;
use App\Models\Fodl;
use App\Models\Formulation;
use App\Models\Transaction;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use League\Csv\Reader;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\File;
use App\Models\Material;
use Carbon\Carbon;
use App\Models\Inventory;
use Illuminate\Support\Facades\DB;

class InventoryController extends ApiController
{
    protected $fileModel;
    protected $monthYear;
    protected $inventoryIds = [];

    public function retrieveAll()
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

    public function archiveInventoryList(Request $request)
    {
        $file = File::where('file_type', 'inventory_file')->get();

        $inventoryIdList = $request->input('inventory_ids');
        $materialIdList = $request->input('material_ids');
        $inventoryMonthYear = $request->input('inventory_monthYear');

        try {
            DB::beginTransaction();

            foreach ($materialIdList as $materialId) {
                $material = Material::where('material_id', $materialId)
                    ->where('inventory_record', 1)
                    ->whereYear('date', substr($inventoryMonthYear, 0, 4))
                    ->whereMonth('date', substr($inventoryMonthYear, 5, 2))
                    ->first();

                if ($material) {
                    $existingMaterial = DB::connection('archive_mysql')->table('materials')->where('material_id', $materialId)->first();
                    if (!$existingMaterial) {
                        $materialRecords = $material->toArray();
                        Material::on('archive_mysql')->create($materialRecords);
                    }

                    $material->delete();
                }
            }

            foreach ($inventoryIdList as $inventoryId) {
                $inventory = Inventory::where('inventory_id', $inventoryId)->first();

                if ($inventory) {
                    $inventoryRecords = $inventory->toArray();

                    $inventoryRecords['material_id'] = null;
                    $inventoryRecords['created_at'] = $inventory->created_at->format('Y-m-d H:i:s');
                    $inventoryRecords['updated_at'] = $inventory->updated_at->format('Y-m-d H:i:s');

                    Inventory::on('archive_mysql')->create($inventoryRecords);
                    $inventory->delete();
                }
            }

            foreach ($file as $fileData) {
                $fileSettings = json_decode($fileData->settings);
                $monthYear = $fileSettings->monthYear;

                if ($monthYear === $inventoryMonthYear) {
                    $inventoryFile = $fileData->toArray();

                    $inventoryFile['created_at'] = $fileData->created_at->format('Y-m-d H:i:s');
                    $inventoryFile['updated_at'] = $fileData->updated_at->format('Y-m-d H:i:s');

                    File::on('archive_mysql')->create($inventoryFile);
                    $fileData->delete();
                }
            }
            
            $boms = Bom::where('created_at', 'LIKE', "$inventoryMonthYear%")->get();
            if (!$boms->isEmpty()) {
                $this->calculateLeastCost($boms);
            }
            DB::commit();

            return response()->json(['message' => 'Inventory list archived successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function calculateLeastCost($boms)
    {
        foreach ($boms as $bom) {
            $formulations = json_decode($bom->formulations, true);
            $leastCost = PHP_FLOAT_MAX;
            $leastCostFormulationId = null;

            foreach ($formulations as $formulationId) {
                $formulation = Formulation::findOrFail($formulationId);

                $materialQtyList = json_decode($formulation->material_qty_list, true);
                foreach ($materialQtyList as &$item) {
                    foreach ($item as &$data) {
                        if (isset($data['status'])) {
                            unset($data['status']);
                        }
                    }
                }
                $formulation->material_qty_list = json_encode($materialQtyList);
                $formulation->save();

                $finishedGood = FinishedGood::firstOrCreate(
                    ['fg_id' => $formulation->fg_id],
                );

                $totalMaterialCost = $this->calculateFormulationCost($formulation) / $finishedGood->total_batch_qty;
                $finishedGood->update(['rm_cost' => $totalMaterialCost]);

                $fodl = Fodl::where('fodl_id', $finishedGood->fodl_id)->first();
                $totalCost = $totalMaterialCost + ($fodl->factory_overhead ?? 0) + ($fodl->direct_labor ?? 0);
                $finishedGood->update(['total_cost' => $totalCost]);
                $finishedGood->update(['is_least_cost' => false]);
                if ($totalMaterialCost < $leastCost) {
                    $leastCost = $totalMaterialCost;
                    $leastCostFormulationId = $formulationId;
                }
            }

            if ($leastCostFormulationId) {
                $leastCostFormulation = Formulation::findOrFail($leastCostFormulationId);
                $leastCostFinishedGood = FinishedGood::where('fg_id', $leastCostFormulation->fg_id)->first();

                if ($leastCostFinishedGood) {
                    $leastCostFinishedGood->update(['is_least_cost' => true]);
                }
            }
        }
    }

    private function calculateFormulationCost($formulation)
    {
        $materialQtyList = json_decode($formulation->material_qty_list, true);

        $totalCost = 0;

        foreach ($materialQtyList as $item) {
            foreach ($item as $materialId => $data) {
                $material = Material::findOrFail($materialId);
                $quantity = $data['qty'];
                $materialCost = $material->material_cost;
                $productCost = $materialCost * $quantity;

                $totalCost += $productCost;
            }
        }

        return $totalCost;
    }

    private function retrieveAllMonthYear()
    {
        try {
            $inventoryFiles = File::where('file_type', 'inventory_file')->get();
            $monthYearList = [];

            foreach ($inventoryFiles as $inventoryFile) {
                $fileSettings = json_decode($inventoryFile->settings);
                $monthYear = $fileSettings->monthYear;

                if (!in_array($monthYear, $monthYearList)) {
                    $monthYearList[] = $monthYear;
                }
            }

            if (!empty($monthYearList)) {
                return $monthYearList;
            } else {
                throw new \Exception("No month/year data found.");
            }
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function retrieveInventoryList()
    {
        $inventoryFiles = File::where('file_type', 'inventory_file')->get();
        $monthYearList = $this->retrieveAllMonthYear();
        $inventoryList = [];


        try {
            foreach ($inventoryFiles as $inventoryFile) {

                $fileSettings = json_decode($inventoryFile->settings);
                $month_year = $fileSettings->monthYear;
                $inventoryIds = $fileSettings->inventory_ids;
                $inventoryInfo = Inventory::whereIn('inventory_id', $inventoryIds)->get();
                $materialsList = $this->retrieveMaterials($inventoryIds);

                $existingIndex = array_search($month_year, array_column($inventoryList, 'month_year'));

                if ($existingIndex !== false) {
                    $inventoryList[$existingIndex]['inventory_ids'] = array_merge(
                        $inventoryList[$existingIndex]['inventory_ids'],
                        $inventoryIds
                    );

                    $inventoryList[$existingIndex]['inventory_ids'] = array_unique($inventoryList[$existingIndex]['inventory_ids']);

                    $inventoryList[$existingIndex]['inventory_info'] = Inventory::whereIn('inventory_id', $inventoryList[$existingIndex]['inventory_ids'])->get();
                    $inventoryList[$existingIndex]['materials'] = $this->retrieveMaterials($inventoryList[$existingIndex]['inventory_ids']);
                } else {
                    $inventoryInfo = Inventory::whereIn('inventory_id', $inventoryIds)->get();
                    $materialsList = $this->retrieveMaterials($inventoryIds);

                    $inventoryList[] = [
                        'inventory_ids' => $inventoryIds,
                        'materials' => $materialsList,
                        'inventory_info' => $inventoryInfo,
                        'month_year' => $month_year,
                    ];
                }

                usort($inventoryList, function ($a, $b) {
                    return strcmp($b['month_year'], $a['month_year']);
                });
            }

            if (!empty($inventoryList)) {
                $this->status = 200;
                $this->response['data'] = $inventoryList;
                return $this->getResponse();
            } else {
                $this->status = 404;
                return $this->getResponse(['message' => "No inventory data found."]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);

        }
    }

    private function retrieveMaterials($inventoryIds)
    {
        try {
            $materialIds = Inventory::whereIn('inventory_id', $inventoryIds)->pluck('material_id');
            $materials = Material::whereIn('material_id', $materialIds)->get();

            return $materials;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function upload(Request $request)
    {
        $file = $request->file('file');
        $this->monthYear = $request->input('month_year');

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

        $fileCategories = [
            'MM',
            'MA',
            'CA',
            'FI',
            'PK',
            'TC',
        ];

        try {
            $inventoryFiles = File::where('file_type', 'inventory_file')->get();

            foreach ($inventoryFiles as $inventoryFile) {
                $fileSettings = json_decode($inventoryFile->settings);
                $existingFileName = $fileSettings->file_name;
                $month_Year = $fileSettings->monthYear;

                if ($month_Year === $uploadMonth->format('Y-m')) {
                    foreach ($fileCategories as $category) {
                        if (strpos($existingFileName, $category) !== false && strpos($fileName, $category) !== false) {
                            throw new \Exception("{$category} Inventory file for the month of {$uploadMonth->format('Y-m')} already exists.");
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            throw $e;
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

            try {
                $this->processExcel($file->getRealPath(), $this->monthYear);
            } catch (\Exception $e) {
                $this->status = 400;
                $this->response['message'] = $e->getMessage();
                return $this->getResponse($this->response['message']);
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
            $requiredSheets = ['Purchases', 'Inventory', 'Usages'];
            $missingSheets = [];

            foreach ($requiredSheets as $sheet) {
                if ($spreadsheet->getSheetByName($sheet) === null) {
                    $missingSheets[] = $sheet;
                }
            }

            if (!empty($missingSheets)) {
                throw new \Exception("Missing required sheets: " . implode(', ', $missingSheets));
            }

            $worksheets = [
                'Purchases' => $spreadsheet->getSheetByName('Purchases'),
                'Inventory' => $spreadsheet->getSheetByName('Inventory'),
                'Usages' => $spreadsheet->getSheetByName('Usages'),
            ];

            $purchasesData = $this->processPurchasesSheet($worksheets['Purchases'], $monthYear);
            $inventoryData = $this->processInventorySheet($worksheets['Inventory']);
            $usagesData = $this->processUsagesSheet($worksheets['Usages']);

            $this->createInventoryRecords($purchasesData, $inventoryData, $usagesData);

        } catch (\Exception $e) {
            throw $e;
        }
    }

    private function processPurchasesSheet($worksheet, $monthYear)
    {
        $data = $worksheet->toArray();
        $headers = array_shift($data);
        $purchasesData = [];
        $isMonthYearPresent = false;

        $defaultUnits = [
            'RM-XX' => 'kg',
            'RM-MM' => 'kg',
            'SA' => 'kg',
            'BP' => 'kg',
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

        foreach ($data as $row) {
            if (!empty($row[0])) {
                $carbonDate = Carbon::createFromFormat('m/d/Y', $row[0]);

                if ($carbonDate) {
                    $rowMonthYear = $carbonDate->format('Y-m');
                    if ($rowMonthYear === $monthYear) {
                        $isMonthYearPresent = true;
                        break;
                    }
                } else {
                    throw new \Exception("Invalid date format in the Inventory file.");
                }
            } else {
                break;
            }
        }

        if (!$isMonthYearPresent) {
            throw new \Exception("The selected Month/Year date is not present in the Inventory file.");
        }

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

            if (!$unit || $unit == 'N/A') {
                foreach ($defaultUnits as $prefix => $defaultUnit) {
                    if (strpos($itemCode, $prefix) === 0) {
                        $unit = $defaultUnit;
                        break;
                    }
                }
            }

            $material = Material::where('material_code', $itemCode)
                ->where('inventory_record', 1)
                ->first();

            if (!$material) {
                $material = Material::create([
                    'material_code' => $itemCode,
                    'material_desc' => $itemDescription,
                    'material_cost' => $itemCost,
                    'date' => $formattedDate,
                    'unit' => $unit,
                    'inventory_record' => 1,
                ]);
            }

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

            $material = Material::where('material_code', $itemCode)
                ->where('inventory_record', 1)
                ->first();

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

            $material = Material::where('material_code', $itemCode)
                ->where('inventory_record', 1)
                ->first();

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

            $transactions = Transaction::whereNotNull('material_id')
                ->get()
                ->filter(function ($transaction) use ($material) {
                    $materialRecord = Material::find($transaction->material_id);
                    if ($materialRecord && $materialRecord->material_code === $material->material_code) {
                        $settings = json_decode($transaction->settings, true);
                        $transactionDate = Carbon::parse($transaction->date);
                        return isset($settings['qty']) &&
                            $settings['qty'] < 0 &&
                            $transactionDate->format('Y-m') === $this->monthYear;
                    }
                    return false;
                });

            $negativeQtySum = 0;
            if (!$transactions->isEmpty()) {
                $negativeQtySum = $transactions->sum(function ($transaction) {
                    $settings = json_decode($transaction->settings, true);
                    return abs($settings['qty']);
                });
            }

            $finalUsageQty = $usageQty + $negativeQtySum;

            $stockStatus = $inventoryQty < $finalUsageQty ? 'Low Stock' : 'In Stock';
            $inventoryRecord = Inventory::create([
                'material_id' => $materialId,
                'material_category' => $category,
                'stock_status' => $stockStatus,
                'purchased_qty' => $purchasedQty,
                'usage_qty' => $finalUsageQty,
                'total_qty' => $inventoryQty,
                'curr_stock' => $inventoryQty - $finalUsageQty,
            ]);

            if (!$transactions->isEmpty()) {
                $bomRecords = Bom::all();

                foreach ($bomRecords as $bom) {
                    $formulationIds = json_decode($bom->formulations, true);
                    $formulations = Formulation::whereIn('formulation_id', $formulationIds)->get();

                    foreach ($formulations as $formulation) {
                        $materialQtyList = json_decode($formulation->material_qty_list, true);
                        foreach ($materialQtyList as $index => $materialDetails) {
                            foreach ($materialDetails as $materialId => $details) {
                                // Verify material code matches
                                $materialRecord = Material::find($materialId);

                                if ($materialRecord && $materialRecord->material_code === $material->material_code) {
                                    $requiredQty = $details['qty'];

                                    // Check if current stock is less than required quantity
                                    if ($inventoryRecord->curr_stock < $requiredQty) {
                                        $materialQtyList[$index][$materialId]['status'] = 0;
                                        $formulation->material_qty_list = json_encode($materialQtyList);
                                        $formulation->save();
                                        // Get FG record and set is_least_cost to 0
                                        $fgRecord = FinishedGood::find($formulation->fg_id);
                                        if ($fgRecord) {
                                            $fgRecord->update(['is_least_cost' => 0]);

                                            $lowestRmCost = PHP_FLOAT_MAX;
                                            $lowestCostFormulation = null;

                                            // Find next formulation with sufficient stock
                                            foreach ($formulations as $altFormulation) {
                                                $altMaterialQtyList = json_decode($altFormulation->material_qty_list, true);
                                                $hasStock = true;

                                                foreach ($altMaterialQtyList as $index => $altMaterialDetails) {
                                                    foreach ($altMaterialDetails as $altMaterialId => $altDetails) {
                                                        $altMaterialRecord = Material::find($altMaterialId);

                                                        if ($altMaterialRecord && $altMaterialRecord->material_code === $material->material_code) {
                                                            $requiredQty = $altDetails['qty'];

                                                            if ($inventoryRecord->curr_stock < $altDetails['qty']) {
                                                                $hasStock = false;
                                                                break;
                                                            }
                                                        }
                                                    }

                                                    if ($hasStock) {
                                                        // Update FG record with new least cost formulation
                                                        $altFgRecord = FinishedGood::find($altFormulation->fg_id);
                                                        if ($altFgRecord && $altFgRecord->rm_cost < $lowestRmCost) {
                                                            $lowestRmCost = $altFgRecord->rm_cost;
                                                            $lowestCostFormulation = $altFgRecord;
                                                        }
                                                        break;
                                                    }
                                                }
                                            }

                                            if ($lowestCostFormulation) {
                                                $lowestCostFormulation->update(['is_least_cost' => 1]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            $this->inventoryIds[] = $inventoryRecord->inventory_id;
        }

        return response()->json(['message' => 'Inventory records created successfully']);
    }

    private function cleanNumericValue($value)
    {
        $cleaned = preg_replace('/[^0-9.]/', '', $value);
        return floatval($cleaned);
    }
}
