<?php

namespace App\Http\Controllers;

use App\Helpers\DateHelper;
use App\Helpers\ControllerHelper;
use App\Models\Bom;
use App\Models\Fodl;
use App\Models\Formulation;
use DateTime;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\File;
use App\Models\FinishedGood;
use App\Models\Material;

class FileController extends ApiController
{
    protected $fileModel;
    protected $monthYear;
    private $fgId;
    private $fgCode;
    private $emulsion;

    // Handle Errors Gracefully MAyolskie!
    public function upload(Request $request)
    {
        $file = $request->file('file');
        $uploadType = $request->input('type');
        $extension = $file->getClientOriginalExtension();
        $fileNameWithExtension = $file->getClientOriginalName();
        $fileNameWithoutExtension = pathinfo($fileNameWithExtension, PATHINFO_FILENAME);

        $settings = [
            'file_name' => $fileNameWithoutExtension,
            'file_name_with_extension' => $fileNameWithExtension,
        ];

        if ($extension == 'xlsx') {
            $this->fileModel = [
                'file_type' => $uploadType == 'master' ? 'master_file' : 'transactional_file',
                'settings' => json_encode($settings),
            ];

            $this->processExcel($file->getRealPath(), $uploadType);

            File::create($this->fileModel);

            $this->status = 200;
            return $this->getResponse();
        }

        return response()->json(['error' => 'Unsupported file type'], 400);
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
                'fg_id' => $fodl->fodl_id,
                'fg_code' => $fgCode,
            ];
        }

        if ($this->fileModel) {
            $settings = json_decode($this->fileModel['settings'], true) ?? [];
            $existingFODLs = $settings['fodls'] ?? [];
            $existingFODLIds = array_column($existingFODLs, 'fodl_id');

            foreach ($fodls as $newFodl) {
                if (!in_array($newFodl['fg_id'], $existingFODLIds)) {
                    $existingFGs[] = $newFodl;
                }
            }

            $settings['fodls'] = $existingFGs;
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

            $itemCode = $rowData['ITEMCODE'] ?? null;
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
        unset($data[0]);

        foreach ($data as $key => $row) {
            if (empty(array_filter($row))) {
                if (isset($data[$key + 1]) && !empty(array_filter($data[$key + 1]))) {
                    if (!empty($currentFormulation)) {
                        $formulation = Formulation::create([
                            'fg_id' => $this->fgId,
                            'formula_code' => $this->fgCode,
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

            $formulationCode = $row[0];
            $level = $row[1];
            $code = $row[2];
            $description = $row[3];
            $batchQty = floatval(str_replace(',', '', trim($row[5])));
            $unit = $row[6];

            if (!is_null($formulationCode) && !is_null($code) && !is_null($description) && !is_null($row[4])) {
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
                        ],
                    ];
                }
            }
        }

        if (!empty($currentFormulation)) {
            $formulation = Formulation::create([
                'fg_id' => $this->fgId,
                'formula_code' => $this->fgCode,
                'emulsion' => json_encode($this->emulsion ?? (object) []),
                'material_qty_list' => json_encode($currentFormulation),
            ]);
            $formulations[] = $formulation->formulation_id;
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
}