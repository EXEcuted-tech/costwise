<?php

namespace App\Http\Controllers;

use App\Http\Controllers\ApiController;
use App\Helpers\DateHelper;
use App\Helpers\ControllerHelper;
use App\Models\Bom;
use App\Models\Fodl;
use App\Models\Formulation;
use App\Models\Transaction;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;
use League\Csv\Reader;
use App\Models\ProductCosting;
use App\Models\FodlCost;
use Illuminate\Support\Facades\Validator;
use App\Models\File;
use App\Models\MaterialCosts;
use App\Models\FinishedGood;
use App\Models\Material;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use ZipArchive;
use Illuminate\Support\Facades\Response;

class FileController extends ApiController
{
    protected $fileModel;
    protected $monthYear;
    private $fgId;
    private $fgCode;
    private $formulationCode;
    private $emulsion;

    // For Transactional Files
    private $trMaterialId = null;
    private $trFgId = null;

    // Handle Errors Gracefully MAyolskie!
    // Basic CRUD
    public function retrieveAll()
    {
        try {
            $allRecords = File::whereIn('file_type', ['master_file', 'transactional_file'])
                              ->orderBy('created_at', 'desc')
                              ->get();
            $this->status = 200;
            $this->response['data'] = $allRecords;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    public function retrieve(Request $request)
    {
        $allowedColumns = ['file_id', 'file_type'];

        $col = $request->query('col');
        $value = $request->query('value');

        if (!in_array($col, $allowedColumns)) {
            $this->status = 400;
            return $this->getResponse("Invalid column specified.");
        }

        try {
            $records = File::where($col, $value)->orderBy('created_at', 'desc')->get();

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

    public function delete(Request $request)
    {
        $allowedColumns = ['file_id'];
        $col = $request->input('col');
        $value = $request->input('value'); //expected that this is file_id

        if (!in_array($col, $allowedColumns)) {
            $this->status = 400;
            return $this->getResponse("Invalid column specified.");
        }

        try {
            $records = File::where($col, $value)->get();

            if ($records->isEmpty()) {
                $this->status = 404;
                return $this->getResponse("No records found to delete.");
            }

            foreach ($records as $record) {
                if ($record->file_type == 'transactional_file') {
                    $settings = json_decode($record->settings, true);
                    $transactionIds = $settings['transaction_ids'];

                    foreach ($transactionIds as $key => $transactionId) {
                        $result = TransactionController::deleteTransaction($transactionId);
                        if ($result) {
                            unset($transactionIds[$key]);
                        }
                    }

                    $settings['transaction_ids'] = array_values($transactionIds);
                    $record->settings = json_encode($settings);
                    $record->save();
                } else if ($record->file_type == 'master_file') {
                    $settings = json_decode($record->settings, true);

                    // Assuming that what is on the formulations, are on the material sheets
                    if (isset($settings['bom_ids'])) {
                        foreach ($settings['bom_ids'] as $bomId) {
                            $this->deleteFormulationByBOM($bomId);
                        }
                    }

                    if (isset($settings['fodls'])) {
                        $fodlIds = array_column($settings['fodls'], 'fodl_id');
                        FodlController::deleteBulkFodlInFile($fodlIds, $value);
                    }

                    if (isset($settings['material_ids'])) {
                        MaterialController::deleteBulkInFile($settings['material_ids'], $value);
                    }
                }

                File::on('archive_mysql')->create($record->toArray());
            }

            $records->each->delete();

            $this->status = 200;
            return $this->getResponse("Records successfully deleted.");
        } catch (\Exception $e) {
            $this->status = 500;
            return $this->getResponse($e->getMessage());
        }
    }

    public function deleteFormulationByBOM($bomId)
    {
        \DB::beginTransaction();

        try {
            $bom = Bom::findOrFail($bomId);

            $formulationIds = json_decode($bom->formulations, true) ?? [];
            $fgIds = Formulation::whereIn('formulation_id', $formulationIds)->pluck('fg_id')->toArray();

            FormulationController::deleteBulkWithFGInFile($fgIds, $bomId);

            Bom::on('archive_mysql')->create($bom->toArray());
            $bom->delete();

            \DB::commit();

            $this->status = 200;
            return $this->getResponse('BOM and associated data deleted successfully');
        } catch (\Exception $e) {
            \DB::rollBack();
            $this->status = 500;
            $this->response['error'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    // Importing Process
    public function upload(Request $request)
    {
        $file = $request->file('file');
        $uploadType = $request->input('type');
        $extension = $file->getClientOriginalExtension();
        $fileNameWithExtension = $file->getClientOriginalName();
        $fileNameWithoutExtension = pathinfo($fileNameWithExtension, PATHINFO_FILENAME);

        $baseFileName = pathinfo($fileNameWithExtension, PATHINFO_FILENAME);
        $counter = 1;
        while (File::where('settings->file_name', $fileNameWithoutExtension)->exists()) {
            $fileNameWithoutExtension = $baseFileName . " ({$counter})";
            $fileNameWithExtension = $fileNameWithoutExtension . '.' . $extension;
            $counter++;
        }

        $user = Auth::user();
        $userName = "{$user->first_name} {$user->last_name}";

        $settings = [
            'file_name' => $fileNameWithoutExtension,
            'file_name_with_extension' => $fileNameWithExtension,
            'user' => $userName
        ];

        if ($extension == 'xlsx') {
            $this->fileModel = [
                'file_type' => $uploadType == 'master' ? 'master_file' : 'transactional_file',
                'settings' => json_encode($settings),
            ];

            $this->processExcel($file->getRealPath(), $uploadType);

            if ($uploadType == 'master') {
                $this->calculateLeastCost($this->fileModel);
            }
            File::create($this->fileModel);

            $this->status = 200;
            return $this->getResponse();
        }

        $this->status = 400;
        $this->response['error'] = 'Unsupported file type';
        return $this->getResponse();
    }

    private function processExcel($file, $uploadType)
    {
        $spreadsheet = IOFactory::load($file);
        $worksheets = [];

        foreach ($spreadsheet->getWorksheetIterator() as $worksheet) {
            $worksheets[$worksheet->getTitle()] = $worksheet;
        }

        // dump(array_keys($worksheets));
        if ($uploadType == 'master') {
            $sheetProcessingOrder = [
                'FODL Cost' => 'processFODLCostSheet',
                'Material Cost' => 'processMaterialCostSheet',
                '/^BOM/' => 'processBOMSheet',
            ];

            foreach ($sheetProcessingOrder as $sheetPattern => $processingMethod) {
                $isRegex = $sheetPattern[0] === '/';

                if ($isRegex) {
                    foreach ($worksheets as $sheetName => $worksheet) {
                        if (preg_match($sheetPattern, $sheetName)) {
                            $data = $worksheet->toArray();
                            if (empty($data)) {
                                $this->status = 400;
                                return $this->getResponse("No data found in the {$sheetName} sheet.");
                            } else {
                                $this->$processingMethod($sheetName, $data);
                            }
                        }
                    }
                } else {
                    if (isset($worksheets[$sheetPattern])) {
                        $worksheet = $worksheets[$sheetPattern];
                        $data = $worksheet->toArray();

                        if (empty($data)) {
                            $this->status = 400;
                            return $this->getResponse("No data found in the {$sheetPattern} sheet.");
                        } else {
                            $this->$processingMethod($data);
                        }
                    } else {
                        $this->status = 400;
                        return $this->getResponse("Lacking required sheet.");
                    }
                }
            }
        } else if ($uploadType == 'transactional') {
            if (isset($worksheets["Production Transactions"])) {
                $worksheet = $worksheets["Production Transactions"];
                $data = $worksheet->toArray();
                if (empty($data)) {
                    $this->status = 400;
                    return $this->getResponse("No data found in the Production Transactions sheet.");
                } else {
                    $this->processTransactionsSheet($data);
                }
            }
        }
    }

    private function processTransactionsSheet($data)
    {
        $headers = $data[0];
        unset($data[0]);

        $transactionIds = [];

        if (isset($data[1][2])) {
            $firstDate = $data[1][2];
            $monthYearInt = Carbon::parse($firstDate)->format('Ym');
            $settings = json_decode($this->fileModel['settings'], true) ?? [];
            $settings['monthYear'] = (int) $monthYearInt;
            $this->fileModel['settings'] = json_encode($settings);
        }

        foreach ($data as $row) {
            $rowData = [];
            foreach ($headers as $column => $header) {
                $rowData[$header] = $row[$column] ?? null;
            }

            $year = $rowData['Year'] ?? null;
            $month = $rowData['Month'] ?? null;
            $date = $rowData['Date'] ?? null;
            $journal = $rowData['Journal'] ?? null;
            $entryNumber = $rowData['Entry Number'] ?? null;
            $description = $rowData['Description'] ?? null;
            $project = $rowData['Project'] ?? null;
            $glAccount = $rowData['GL Account'] ?? null;
            $glDesc = $rowData['GL Description'] ?? null;
            $warehouse = $rowData['Warehouse'] ?? null;
            $itemCode = $rowData['Item Code'] ?? null;
            $itemDesc = $rowData['Item Description'] ?? null;
            $qty = floatval($rowData['Qty'] ?? null);
            $amount = floatval($rowData['Amount'] ?? null);
            $unit = isset($rowData['Unit Code']) ? trim($rowData['Unit Code']) : "";

            if (is_null($description) || $qty == null) {
                continue;
            }

            $dateOnly = Carbon::createFromFormat('n/j/y h:i A', $date)->format('Y-m-d');
            $yearMonth = Carbon::createFromFormat('n/j/y h:i A', $date)->format('Ym');
            $yearMonthInt = (int) $yearMonth;

            $material = Material::where('material_code', $itemCode)
                ->where('material_cost', $amount / $qty)
                ->where('date', $dateOnly)
                ->first();

            $fg = FinishedGood::where('fg_code', $itemCode)
                ->where('rm_cost', $amount / $qty)
                ->where('monthYear', $yearMonthInt)
                ->first();

            $materialId = $material->material_id ?? null;
            $finishedGoodId = $fg->fg_id ?? null;

            $timestamp = Carbon::createFromFormat('n/j/y h:i A', $date)->format('Y-m-d H:i:s');

            $settings;
            if (!$material && (str_starts_with($itemCode, 'RM') || str_starts_with($itemCode, 'SA'))) {
                $newMaterial = Material::create([
                    'material_code' => $itemCode,
                    'material_desc' => $itemDesc,
                    'material_cost' => $amount / $qty,
                    'unit' => $unit,
                    'date' => $dateOnly
                ]);

                $settings = [
                    'qty' => $qty,
                ];

                $materialId = $newMaterial->material_id;
            } else if (!$fg && !(str_starts_with($itemCode, 'EMULSION') || str_starts_with($itemCode, 'REWORK') || str_starts_with($itemCode, 'RM') || str_starts_with($itemCode, 'SA'))) {
                $newFinishedGood = FinishedGood::create([
                    'fodl_id' => null,
                    'fg_code' => $itemCode,
                    'fg_desc' => $itemDesc,
                    'total_batch_qty' => $qty,
                    'rm_cost' => $amount / $qty,
                    'unit' => $unit,
                    'monthYear' => $yearMonthInt
                ]);

                $settings = [];
                $finishedGoodId = $newFinishedGood->fg_id;
            }

            if ($finishedGoodId == null && $materialId == null) {
                $settings = [
                    'item_code' => $itemCode,
                    'item_desc' => $itemDesc,
                    'qty' => $qty,
                    'amount' => $amount / $qty,
                    'unit' => $unit
                ];
            }

            if ($materialId != null) {
                $settings = [
                    'qty' => $qty,
                ];
            }

            $passSettings = empty($settings) ? json_encode(new \stdClass()) : json_encode($settings);

            $transaction = Transaction::create([
                'material_id' => $materialId,
                'fg_id' => $finishedGoodId,
                'journal' => $journal,
                'entry_num' => $entryNumber,
                'trans_desc' => $description,
                'project' => $project,
                'gl_account' => $glAccount,
                'gl_desc' => $glDesc,
                'warehouse' => $warehouse,
                'date' => $timestamp,
                'month' => $month,
                'year' => $year,
                'settings' => $passSettings
            ]);

            $settings = [];
            $transactionIds[] = $transaction->transaction_id;
        }

        if ($this->fileModel) {
            $settings = json_decode($this->fileModel['settings'], true) ?? [];
            $existingTransactionIds = $settings['transaction_ids'] ?? [];
            $mergedTransactionIds = array_values(array_unique(array_merge($existingTransactionIds, $transactionIds)));
            $settings['transaction_ids'] = $mergedTransactionIds;
            $this->fileModel['settings'] = json_encode($settings);
        }
    }

    private function processFODLCostSheet($data)
    {
        $monthYearStr = $data[1];
        $monthYearInt = DateHelper::convertMonthYearStrToInt($monthYearStr[0]);
        $this->monthYear = $monthYearInt;

        unset($data[0], $data[1], $data[2], $data[3], $data[4]);

        $fodls = [];
        foreach ($data as $row) {
            if (is_null($row[3]) || is_null($row[4]) || trim($row[3]) === '' || trim($row[4]) === '') {
                continue;
            }

            $fgCode = $row[0];
            $foCost = floatval(trim($row[3]));
            $dlCost = floatval(trim($row[4]));

            $fodl = Fodl::firstOrCreate([
                'fg_code' => $fgCode,
                'monthYear' => $monthYearInt,
                'factory_overhead' => $foCost,
                'direct_labor' => $dlCost,
            ]);

            $fodls[] = [
                'fodl_id' => $fodl->fodl_id,
                'fg_code' => $fgCode,
            ];
        }

        if ($this->fileModel) {
            $settings = json_decode($this->fileModel['settings'], true) ?? [];
            $existingFODLs = $settings['fodls'] ?? [];
            $existingFODLIds = array_column($existingFODLs, 'fodl_id');

            foreach ($fodls as $newFodl) {
                if (!in_array($newFodl['fodl_id'], $existingFODLIds)) {
                    $existingFGs[] = $newFodl;
                }
            }

            $settings['fodls'] = $existingFGs;
            $settings['monthYear'] = $monthYearInt;
            $this->fileModel['settings'] = json_encode($settings);
        }
    }

    private function processMaterialCostSheet($data)
    {
        $monthYearStr = $data[1];
        $monthYearInt = DateHelper::convertMonthYearStrToInt($monthYearStr[0]);

        $year = intval(substr($monthYearInt, 0, 4));
        $month = intval(substr($monthYearInt, 4, 2));

        $date = new DateTime();
        $date->setDate($year, $month, 1);
        $formattedDate = $date->format('Y-m-d');

        $headers = $data[4];
        unset($data[0], $data[1], $data[2], $data[3], $data[4]);

        $materialIds = [];

        foreach ($data as $row) {
            $rowData = [];
            foreach ($headers as $column => $header) {
                $rowData[$header] = $row[$column] ?? null;
            }

            $itemCode = $rowData['ITEM CODE'] ?? null;
            $itemDescription = $rowData['ITEM DESCRIPTION'] ?? null;
            $unit = $rowData['UNIT'] ?? " ";
            $unitIndex = array_search('UNIT', $headers);
            $costColumn = $headers[$unitIndex + 1] ?? null;
            $cost = floatval($rowData[$costColumn] ?? 0);

            if (is_null($itemCode) || $cost <= 0) {
                continue;
            }

            $material = Material::create([
                'material_code' => $itemCode,
                'material_desc' => $itemDescription,
                'material_cost' => $cost,
                'unit' => $unit,
                'date' => $formattedDate,
            ]);

            $materialIds[] = $material->material_id;
        }

        if ($this->fileModel) {
            $settings = json_decode($this->fileModel['settings'], true) ?? [];
            $existingMaterialIds = $settings['material_ids'] ?? [];
            $mergedMaterialIds = array_values(array_unique(array_merge($existingMaterialIds, $materialIds)));
            $settings['material_ids'] = $mergedMaterialIds;
            $this->fileModel['settings'] = json_encode($settings);
        }
    }

    private function processBOMSheet($sheetName, $data)
    {
        $formulations = [];
        $currentFormulation = [];
        $rmCost = 0;
        $totalCost = 0;
        unset($data[0]);

        foreach ($data as $key => $row) {
            if (empty(array_filter($row))) {
                if (isset($data[$key + 1]) && !empty(array_filter($data[$key + 1]))) {
                    if (!empty($currentFormulation)) {
                        $formulation = Formulation::create([
                            'fg_id' => $this->fgId,
                            'formula_code' => $this->formulationCode,
                            'emulsion' => json_encode($this->emulsion ?? (object) []),
                            'material_qty_list' => json_encode($currentFormulation),
                        ]);
                        $formulations[] = $formulation->formulation_id;
                        $currentFormulation = [];
                        $this->emulsion = null;
                    }
                }
                continue;
            }

            $this->formulationCode = $row[0] ?? $this->formulationCode;
            $level = $row[1];
            $code = $row[2];
            $description = $row[3];
            $batchQty = floatval(str_replace(',', '', trim($row[5])));
            $unit = $row[6];

            if (!is_null($this->formulationCode) && !is_null($code) && !is_null($description) && !is_null($row[4])) {
                $this->fgCode = $code;
                $fodl = Fodl::where('fg_code', $this->fgCode)->first();
                $finishedGood = FinishedGood::Create(
                    [
                        'fodl_id' => $fodl->fodl_id ?? null,
                        'fg_code' => $this->fgCode,
                        'fg_desc' => $description,
                        'total_batch_qty' => $batchQty,
                        'unit' => $unit,
                        'formulation_no' => $row[4],
                        'monthYear' => $this->monthYear,
                    ]
                );
                $this->fgId = $finishedGood->fg_id;
            } else if ($description == 'EMULSION') {
                $this->emulsion = [
                    'level' => $level,
                    'batch_qty' => $batchQty,
                    'unit' => $unit
                ];
            } else if (!is_null($level) && !is_null($code)) {
                $materialCode = $code;
                $materialLevel = intval($level);
                $materialQty = $batchQty;

                $material = Material::where('material_code', $materialCode)->first();
                if ($material) {
                    $currentFormulation[] = [
                        $material->material_id => [
                            'level' => $materialLevel,
                            'qty' => $materialQty,
                            'total_cost' => $material->material_cost * $materialQty,
                        ],
                    ];
                }
            }
        }

        if (!empty($currentFormulation)) {
            $formulation = Formulation::create([
                'fg_id' => $this->fgId,
                'formula_code' => $this->formulationCode,
                'emulsion' => json_encode($this->emulsion ?? (object) []),
                'material_qty_list' => json_encode($currentFormulation),
            ]);
            $formulations[] = $formulation->formulation_id;
            $this->emulsion = null;
        }

        $bom = Bom::create([
            'bom_name' => $sheetName,
            'formulations' => json_encode($formulations),
        ]);

        if ($this->fileModel) {
            $settings = json_decode($this->fileModel['settings'], true) ?? [];
            $existingBomIds = $settings['bom_ids'] ?? [];
            if (!in_array($bom->bom_id, $existingBomIds)) {
                $existingBomIds[] = $bom->bom_id;
            }
            $settings['bom_ids'] = $existingBomIds;
            $this->fileModel['settings'] = json_encode($settings);
        }
    }

    private function calculateLeastCost($file)
    {
        $settings = json_decode($file['settings'], true);
        $bomIds = $settings['bom_ids'] ?? [];

        foreach ($bomIds as $bomId) {
            $bom = Bom::findOrFail($bomId);
            $formulations = json_decode($bom->formulations, true);
            $leastCost = PHP_FLOAT_MAX;
            $leastCostFormulationId = null;

            foreach ($formulations as $formulationId) {
                $formulation = Formulation::findOrFail($formulationId);

                $finishedGood = FinishedGood::firstOrCreate(
                    ['fg_id' => $formulation->fg_id],
                );

                $totalMaterialCost = $this->calculateFormulationCost($formulation) / $finishedGood->total_batch_qty;
                $finishedGood->update(['rm_cost' => $totalMaterialCost]);

                $fodl = FODL::where('fodl_id', $finishedGood->fodl_id)->first();
                $totalCost = $totalMaterialCost + ($fodl->factory_overhead ?? 0) + ($fodl->direct_labor ?? 0);
                $finishedGood->update(['total_cost' => $totalCost]);

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
    // private function calculateLeastCost($file)
    // {
    //     $settings = json_decode($file['settings'], true);

    //     $bomIds = $settings['bom_ids'] ?? [];
    //     $leastCost = PHP_FLOAT_MAX;

    //     foreach ($bomIds as $bomId) {
    //         $bom = Bom::findOrFail($bomId);
    //         $formulations = json_decode($bom->formulations,true);


    //         foreach ($formulations as $formulationId) {
    //             $formulation = Formulation::findOrFail($formulationId);
    //             $rmCost = $this->calculateFormulationCost($formulation);
    //             $finishedGood = FinishedGood::firstOrCreate(
    //                 ['fg_id' => $formulation->fg_id],
    //             );

    //             $finishedGood->update(['rm_cost' => $rmCost]);
    //             $leastCost = min($leastCost, $rmCost);
    //         }
    //     }

    //     $leastCostFormulation = Formulation::whereIn('formulation_id', $formulations)
    //         ->whereHas('finishedGood', function ($query) use ($leastCost) {
    //             $query->where('rm_cost', $leastCost);
    //         })
    //         ->first();

    //     if ($leastCostFormulation) {
    //         $leastCostFinishedGood = $leastCostFormulation->finishedGood;
    //         $leastCostFinishedGood->update(['is_least_cost' => true]);
    //     }
    // }

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

    // private function processSummarySheet($data)
    // {
    //     $monthYearStr = $data[1];
    //     $monthYearInt = DateHelper::convertMonthYearStrToInt($monthYearStr[0]);
    //     $headers = $data[3];

    //     unset($data[0], $data[1], $data[2], $data[3]);

    //     $fgIds = [];
    //     $fodlIds = [];

    //     foreach ($data as $row) {
    //         var_dump($row);
    //         $rowData = [];
    //         foreach ($headers as $column => $header) {
    //             $rowData[$header] = $row[$column];
    //         }

    //         $itemCode = $rowData['Item Code'] ?? null;
    //         $itemDescription = $rowData['Item Description'] ?? null;
    //         $rmCost = $rowData['RM Cost'] ?? 0;
    //         $factoryOverhead = $rowData['Factory Overhead'] ?? 0;
    //         $directLabor = $rowData['Direct Labor'] ?? 0;
    //         $total = $rowData['TOTAL'] ?? 0;

    //         $fodl = ControllerHelper::findOrCreateFODL($monthYearInt, $factoryOverhead, $directLabor);

    //         $fodlId = $fodl->fodl_id;

    //         // TO BE CHANGED!
    //         $finishedGood = FinishedGood::create([
    //             'fg_code' => $itemCode,
    //             'fg_desc' => $itemDescription,
    //             'rm_cost' => $rmCost,
    //             'total_cost' => $total,
    //             'monthYear' => $monthYearInt,
    //             'fodl_id' => $fodlId,
    //         ]);

    //         $fgIds[] = $finishedGood->fg_id;
    //         $fodlIds[] = $fodlId;
    //     }

    //     $fodlIds = array_values(array_unique($fodlIds));
    //     if ($this->fileModel) {
    //         $settings = json_decode($this->fileModel['settings'], true);
    //         $settings['monthYear'] = $monthYearInt;
    //         $settings['fg_ids'] = $fgIds;
    //         $this->fileModel['settings'] = json_encode($settings);
    //     }
    // }



    // EXPORTING PROCESS
    public function export(Request $request)
    {
        try {
            $fileId = $request->input('file_id');
            $file = File::findOrFail($fileId);

            $spreadsheet = new Spreadsheet();

            if ($file->file_type === 'master_file') {
                $this->addMasterFileSheets($spreadsheet, $file);
            } elseif ($file->file_type === 'transactional_file') {
                $this->addTransactionalFileSheet($spreadsheet, $file);
            }

            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $fileName = $file->file_name_with_extension;

            $tempFile = tempnam(sys_get_temp_dir(), $fileName);
            $writer->save($tempFile);

            return response()->download($tempFile, $fileName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = "Export failed: " . $e->getMessage();
            return $this->getResponse();
        }
    }

    public function exportAll(Request $request)
    {
        try {
            $files = File::all();

            if ($files->isEmpty()) {
                \Log::info('No files to export');
                return response()->json(['message' => 'No files to export'], 404);
            }

            $zipDir = storage_path('app/temp');
            if (!file_exists($zipDir)) {
                mkdir($zipDir, 0755, true);
            }

            $zipFileName = 'exported_files_' . time() . '.zip';
            $zipFilePath = storage_path("app/temp/$zipFileName");

            $zip = new ZipArchive();
            if ($zip->open($zipFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
                throw new \RuntimeException("Unable to create zip file");
            }

            foreach ($files as $file) {
                $spreadsheet = new Spreadsheet();

                if ($file->file_type === 'master_file') {
                    $this->addMasterFileSheets($spreadsheet, $file);
                } elseif ($file->file_type === 'transactional_file') {
                    $this->addTransactionalFileSheet($spreadsheet, $file);
                }

                $settings = json_decode($file->settings, true);
                $fileName = $settings['file_name_with_extension'];
                $fileDate = new DateTime($file->created_at);
                $folderName = $fileDate->format('Y_m');

                $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
                $tempFile = tempnam(sys_get_temp_dir(), 'excel_');
                $writer->save($tempFile);

                $zip->addFile($tempFile, $folderName . '/' . $fileName);

                $spreadsheet->disconnectWorksheets();
                unset($spreadsheet);
                gc_collect_cycles();
            }

            $zip->close();

            return response()->download($zipFilePath, $zipFileName, [
                'Content-Type' => 'application/zip',
            ])->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            $tempFiles = glob(sys_get_temp_dir() . '/excel_*');
            foreach ($tempFiles as $tempFile) {
                if (is_file($tempFile)) {
                    unlink($tempFile);
                }
            }

            $this->status = 500;
            $this->response['message'] = "Export failed: " . $e->getMessage();
            return $this->getResponse();
        }
    }

    private function addMasterFileSheets($spreadsheet, $file)
    {
        $settings = json_decode($file->settings, true);
        $this->monthYear = $settings["monthYear"];

        if (isset($settings['fodls'])) {
            $this->addFODLSheet($spreadsheet, $settings['fodls']);
        }

        if (isset($settings['material_ids'])) {
            $this->addMaterialSheet($spreadsheet, $settings['material_ids']);
        }

        if (isset($settings['bom_ids'])) {
            $bomIds = $settings['bom_ids'];
            foreach ($bomIds as $bomId) {
                $bom = Bom::find($bomId);
                $this->addBOMSheet($spreadsheet, $bom);
            }
        }
    }

    private function addTransactionalFileSheet($spreadsheet, $file)
    {
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Production Transactions');
        $headers = ['Year', 'Month', 'Date', 'Journal', 'Entry Number', 'Description', 'Project', 'GL Account', 'GL Description', 'Warehouse', 'Item Code', 'Item Description', 'Qty', 'Amount', 'Unit Code'];
        $sheet->fromArray($headers, NULL, 'A1');
        $dataRange = 'A1:O1';
        $sheet->setAutoFilter($dataRange);

        $sheet->getColumnDimension('A')->setWidth(7.71);
        $sheet->getColumnDimension('B')->setWidth(8);
        $sheet->getColumnDimension('C')->setWidth(19.14);
        $sheet->getColumnDimension('D')->setWidth(9.43);
        $sheet->getColumnDimension('E')->setWidth(15.38);
        $sheet->getColumnDimension('F')->setWidth(26.38);
        $sheet->getColumnDimension('G')->setWidth(22.38);
        $sheet->getColumnDimension('H')->setWidth(19.38);
        $sheet->getColumnDimension('I')->setWidth(30.38);
        $sheet->getColumnDimension('J')->setWidth(11.14);
        $sheet->getColumnDimension('K')->setWidth(19.29);
        $sheet->getColumnDimension('L')->setWidth(21.29);
        $sheet->getColumnDimension('M')->setWidth(11.57);
        $sheet->getColumnDimension('N')->setWidth(11.57);
        $sheet->getColumnDimension('O')->setWidth(9.57);

        $settings = json_decode($file->settings, true);
        if (isset($settings['transaction_ids'])) {
            $transactionIds = $settings['transaction_ids'];

            $row = 2;
            foreach ($transactionIds as $transactionId) {
                $transaction = Transaction::find($transactionId);
                $settings = json_decode($transaction->settings, true);

                $date = new DateTime($transaction->date);
                $formattedDate = $date->format('m/d/y h:i A');

                $sheet->setCellValue("A$row", $transaction->year);
                $sheet->setCellValue("B$row", $transaction->month);
                $sheet->setCellValue("C$row", $formattedDate);
                $sheet->setCellValue("D$row", $transaction->journal);
                $sheet->setCellValue("E$row", $transaction->entry_num);
                $sheet->setCellValue("F$row", $transaction->trans_desc);
                $sheet->setCellValue("G$row", $transaction->project);
                $sheet->setCellValue("H$row", $transaction->gl_account);
                $sheet->setCellValue("I$row", $transaction->gl_desc);
                $sheet->setCellValue("J$row", $transaction->warehouse);

                if ($transaction->material_id != null) {
                    $material = Material::find($transaction->material_id);

                    $sheet->setCellValue("K$row", $material->material_code);
                    $sheet->setCellValue("L$row", $material->material_desc);
                    $sheet->setCellValue("M$row", $settings['qty']);
                    $sheet->setCellValue("N$row", $material->material_cost);
                    $sheet->setCellValue("O$row", $material->unit);
                }

                if ($transaction->fg_id != null) {
                    $fg = FinishedGood::find($transaction->fg_id);

                    $sheet->setCellValue("K$row", $fg->fg_code);
                    $sheet->setCellValue("L$row", $fg->fg_desc);
                    $sheet->setCellValue("M$row", $fg->total_batch_qty);
                    $sheet->setCellValue("N$row", $fg->rm_cost);
                    $sheet->setCellValue("O$row", $fg->unit);
                }

                if ($transaction->material_id == null && $transaction->fg_id == null) {
                    $sheet->setCellValue("K$row", $settings['item_code']);
                    $sheet->setCellValue("L$row", $settings['item_desc']);
                    $sheet->setCellValue("M$row", $settings['qty']);
                    $sheet->setCellValue("N$row", $settings['amount']);
                    $sheet->setCellValue("O$row", $settings['unit']);
                }


                $row++;
            }
        }
    }

    private function addFODLSheet($spreadsheet, $fodlIds)
    {
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('FODL Cost');

        $monthYear = DateHelper::formatMonthYear($this->monthYear);
        $sheet->setCellValue('A2', "for the month of $monthYear");
        $sheet->getStyle('A2')->getFont()->setItalic(true)->setBold(true)->setName('Arial')->setSize(10)->setColor(new Color(Color::COLOR_RED));

        $sheet->getColumnDimension('A')->setWidth(10.29);
        $sheet->getColumnDimension('B')->setWidth(36.57);
        $sheet->getColumnDimension('C')->setWidth(11.29);
        $sheet->getColumnDimension('D')->setWidth(11.29);
        $sheet->getColumnDimension('E')->setWidth(11.29);

        $sheet->setCellValue('A1', 'FO/DL Cost');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(12)->setName('Arial');

        $sheet->getRowDimension('3')->setRowHeight(29);
        $sheet->getRowDimension('4')->setRowHeight(21.5);
        $sheet->getRowDimension('5')->setRowHeight(50.25);

        $sheet->setCellValue('D4', date('Y'));
        $sheet->mergeCells('D4:E4');
        $sheet->getStyle('D4')->getFont()->setBold(true)->setSize(11);
        $sheet->getStyle('D4')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);

        $headers = ['ITEM CODE', 'ITEM DESCRIPTION', 'UNIT', 'FO', 'DL'];
        $sheet->fromArray($headers, NULL, 'A5');

        $headerStyle = $sheet->getStyle('A5:E5');
        $headerStyle->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
        $headerBorders = $headerStyle->getBorders();
        $headerBorders->getOutline()->setBorderStyle(Border::BORDER_MEDIUM);

        $headerStyleAtoC = $sheet->getStyle('A5:C5');
        $headerStyleAtoC->getFont()->setBold(true)->setSize(9)->setName('Arial');
        $headerStyleAtoC->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('E6B8B7');
        $headerStyleAtoC->getFont()->setBold(true);

        $headerStyleDtoE = $sheet->getStyle('D5:E5');
        $headerStyleDtoE->getFont()->setBold(true)->setSize(11);
        $headerStyleDtoE->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('F2DCDB');
        $headerStyleDtoE->getFont()->setBold(true)->getColor()->setRGB('0000FF');

        $row = 6;
        foreach ($fodlIds as $fodlData) {
            $fodl = Fodl::find($fodlData['fodl_id']);
            $fg = FinishedGood::where('fodl_id', $fodlData['fodl_id'])->first();
            if ($fodl) {
                $sheet->setCellValue("A$row", $fodl->fg_code);
                $sheet->setCellValue("B$row", $fg->fg_desc);
                $sheet->setCellValue("C$row", $fg->unit);
                $sheet->setCellValue("D$row", $fodl->factory_overhead);
                $sheet->setCellValue("E$row", $fodl->direct_labor);

                $sheet->getStyle("D$row")->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
                $sheet->getStyle("E$row")->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);

                $sheet->getStyle("A$row:C$row")->getFont()->setSize(8)->setName('Arial');
                $sheet->getStyle("D$row:E$row")->getFont()->setSize(11)->setBold(true)->getColor()->setRGB('0000FF');

                $row++;
            }
        }

        $dataRange = 'A5:E' . ($row - 1);
        $sheet->setAutoFilter($dataRange);
    }

    private function addMaterialSheet($spreadsheet, $materialIds)
    {
        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle('Material Cost');

        $sheet->getColumnDimension('A')->setWidth(10.29);
        $sheet->getColumnDimension('B')->setWidth(36.57);
        $sheet->getColumnDimension('C')->setWidth(5.86);
        $sheet->getColumnDimension('D')->setWidth(11.29);

        $sheet->getRowDimension('3')->setRowHeight(29);
        $sheet->getRowDimension('4')->setRowHeight(21.5);
        $sheet->getRowDimension('5')->setRowHeight(50.25);

        $sheet->setCellValue('A1', 'Material Cost');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(12)->setName('Arial');

        $monthYear = DateHelper::formatMonthYear($this->monthYear);
        $sheet->setCellValue('A2', "for the month of $monthYear");
        $sheet->getStyle('A2')->getFont()->setItalic(true)->setBold(true)->setName('Arial')->setSize(10)->getColor()->setRGB('FF0000');

        $sheet->setCellValue('D4', date('Y'));
        $sheet->getStyle('D4')->getFont()->setBold(true)->setSize(11);
        $sheet->getStyle('D4')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);

        $month = DateHelper::formatMonth($this->monthYear);
        $headers = ['ITEM CODE', 'ITEM DESCRIPTION', 'UNIT', (string) $month];
        $sheet->fromArray($headers, NULL, 'A5');

        $headerStyle = $sheet->getStyle('A5:D5');
        $headerStyle->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
        $headerBorders = $headerStyle->getBorders();
        $headerBorders->getOutline()->setBorderStyle(Border::BORDER_MEDIUM);

        $headerStyleAtoB = $sheet->getStyle('A5:C5');
        $headerStyleAtoB->getFont()->setBold(true)->setSize(9)->setName('Arial');
        $headerStyleAtoB->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('E6B8B7');

        $headerStyleD = $sheet->getStyle('D5');
        $headerStyleD->getFont()->setBold(true)->setSize(11);
        $headerStyleD->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('F2DCDB');
        $headerStyleD->getFont()->getColor()->setRGB('0000FF');

        $row = 6;
        foreach ($materialIds as $materialId) {
            $material = Material::where('material_id', $materialId)->first();
            $sheet->setCellValue("A$row", $material['material_code']);
            $sheet->setCellValue("B$row", $material['material_desc']);
            $sheet->setCellValue("C$row", $material['unit']);
            $sheet->setCellValue("D$row", $material['material_cost']);

            $sheet->getStyle("A$row:C$row")->getFont()->setSize(8)->setName('Arial');

            $styleRowD = $sheet->getStyle("D$row");
            $styleRowD->getFont()->setSize(11)->setBold(true)->getColor()->setRGB('0000FF');

            $styleRowD->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);

            $row++;
        }

        $dataRange = 'A5:D' . ($row - 1);
        $sheet->setAutoFilter($dataRange);
    }

    private function addBOMSheet($spreadsheet, $bom)
    {
        $sheet = $spreadsheet->createSheet();
        $bomName = $bom['bom_name'];
        $sheet->setTitle((string) $bomName);

        $headers = ['Formula', 'Level', 'Item Code', 'Description', 'Formulation', 'Batch Quantity', 'unit'];
        $sheet->fromArray($headers, NULL, 'A1');
        $sheet->getStyle('A1:G1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
        $sheet->freezePane('A2');

        $sheet->getColumnDimension('A')->setWidth(10);
        $sheet->getColumnDimension('B')->setWidth(8.71);
        $sheet->getColumnDimension('C')->setWidth(11.5);
        $sheet->getColumnDimension('D')->setWidth(56.43);
        $sheet->getColumnDimension('E')->setWidth(12.29);
        $sheet->getColumnDimension('F')->setWidth(16.57);
        $sheet->getColumnDimension('G')->setWidth(8.57);

        $sheet->getStyle('A1:G1')->getFont()->setBold(true)->setSize(8)->setName('Open Sans');
        $sheet->setAutoFilter('B1:G1');
        $formulations = json_decode($bom['formulations'], true);
        $row = 2;
        foreach ($formulations as $formulation) {
            $formulationData = Formulation::find($formulation);
            $fg = FinishedGood::find($formulationData['fg_id']);

            $sheet->setCellValue("A$row", $formulationData['formula_code']);
            $sheet->getStyle("A$row")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("A$row")->getFont()->setBold(true);

            $sheet->getStyle("A$row:F$row")->getFill()->setFillType(Fill::FILL_SOLID);
            $sheet->getStyle("A$row:F$row")->getFill()->getStartColor()->setRGB('DAEEF3');
            $sheet->getStyle("A$row:G$row")->getFont()->setSize(8)->setName('Open Sans');

            $sheet->setCellValue("C$row", $fg['fg_code']);
            $sheet->setCellValue("D$row", $fg['fg_desc']);
            $sheet->setCellValue("E$row", $fg['formulation_no']);
            $sheet->setCellValue("F$row", $fg['total_batch_qty']);
            $sheet->getStyle("F$row")->getNumberFormat()->setFormatCode('0.00');
            $sheet->setCellValue("G$row", $fg['unit']);
            $row++;

            $emulsion = json_decode($formulationData->emulsion);
            if (!empty(get_object_vars($emulsion))) {
                $sheet->setCellValue("B$row", $emulsion->level);
                $sheet->setCellValue("D$row", "EMULSION");
                $sheet->setCellValue("F$row", $emulsion->batch_qty);
                $sheet->getStyle("F$row")->getNumberFormat()->setFormatCode('0.00');
                $sheet->setCellValue("G$row", $emulsion->unit);
                $sheet->getStyle("B$row:G$row")->getFont()->setSize(8)->setName('Open Sans');
                $row++;
            }

            $materialQtyList = json_decode($formulationData['material_qty_list'], true);
            foreach ($materialQtyList as $materialEntry) {
                foreach ($materialEntry as $materialId => $data) {
                    $level = $data['level'];
                    $qty = $data['qty'];

                    $material = Material::find($materialId);

                    if ($material) {
                        $sheet->setCellValue("B$row", $level);
                        $sheet->setCellValue("C$row", $material->material_code);
                        $sheet->setCellValue("D$row", $material->material_desc);
                        $sheet->setCellValue("F$row", $qty);
                        $sheet->getStyle("F$row")->getNumberFormat()->setFormatCode('0.00');
                        $sheet->setCellValue("G$row", $material->unit);
                        $sheet->getStyle("B$row:G$row")->getFont()->setSize(8)->setName('Open Sans');
                        $row++;
                    }
                }
            }

            $row++;
        }
    }

    public function uploadTrainingData(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'file_type' => 'required|string',
                    'settings' => 'required|file|mimes:csv,txt|max:2048',
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['error'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $validatedData = $validator->validated();

            if ($request->hasFile('settings')) {
                $file = $request->file('settings');

                $fileName = time() . '_' . $file->getClientOriginalName();
                $csvData = $this->processCsvData($file);

                $fileData = [
                    'file_type' => $validatedData['file_type'],
                    'settings' => json_encode($csvData),
                ];

                $fileRecord = File::on(connection: 'archive_mysql')->create($fileData);
                $this->status = 200;
                $this->response['data'] = [
                    'file_record' => $fileRecord,
                    'csv_data' => $csvData,
                ];
                return $this->getResponse("File Successfully Uploaded");
            }

            $this->status = 400;
            $this->response['message'] = "No file uploaded.";
            return $this->getResponse("File upload failed.");
        } catch (\Throwable $th) {
            $this->status = $th->getCode() ?: 500;
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }

    private function processCsvData($file)
    {
        $parsedCostData = [];
        $currentMonthYear = '';

        if (($handle = fopen($file->getRealPath(), 'r')) !== false) {
            fgetcsv($handle);
            while (($data = fgetcsv($handle)) !== false) {
                if (empty($data) || $data[0] === "Item Code") {
                    continue;
                }

                if (!empty($data[0]) && empty($data[2])) {
                    $currentMonthYear = $data[0];
                } elseif (!empty($data[0]) && !empty($data[2])) {
                    $productName = $data[1];
                    $productCost = floatval($data[2]);

                    $monthYearIndex = null;
                    foreach ($parsedCostData as $index => $entry) {
                        if ($entry['monthYear'] === $currentMonthYear) {
                            $monthYearIndex = $index;
                            break;
                        }
                    }

                    if ($monthYearIndex === null) {
                        $parsedCostData[] = [
                            'monthYear' => $currentMonthYear,
                            'products' => [
                                [
                                    'productName' => $productName,
                                    'cost' => $productCost,
                                ]
                            ],
                        ];
                    } else {
                        $parsedCostData[$monthYearIndex]['products'][] = [
                            'productName' => $productName,
                            'cost' => $productCost,
                        ];
                    }
                }
            }
            fclose($handle);
        }

        return $parsedCostData;
    }

    public function updateTrainingData(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'settings' => 'required',
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['error'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $file = File::on(connection: 'archive_mysql')->where('file_type', 'training_file')->first();
            if (!$file) {
                $this->status = 404;
                return $this->getResponse("Training file not found.");
            }

            if (!is_string($request->settings)) {
                $file->settings = json_encode($request->settings);
            } else {
                $file->settings = $request->settings;
            }

            $file->save();

            $this->status = 201;
            $this->response['data'] = $file;
            return $this->getResponse("Training file updated successfully.");
        } catch (\Throwable $th) {
            $this->status = $th->getCode();
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }



    public function getData()
    {
        try {
            $file = File::on(connection: 'archive_mysql')->where('file_type', 'training_file')->get();

            if (!$file) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Model not found.'
                ], 404);
            }

            $this->status = 201;
            $this->response['data'] = $file;
            return $this->getResponse("File retrieved successfully.");
        } catch (\Throwable $th) {
            $this->status = $th->getCode();
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }
}
