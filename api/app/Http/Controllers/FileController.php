<?php

namespace App\Http\Controllers;

use App\Helpers\DateHelper;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\File;
use App\Models\FinishedGood;
use App\Models\Fodl;
use Illuminate\Support\Facades\Log;

class FileController extends ApiController
{
    protected $fileModel;

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

        foreach ($spreadsheet->getWorksheetIterator() as $worksheet) {
            $sheetName = $worksheet->getTitle();
            if ($uploadType == 'master') {
                $sheetProcessingOrder = [
                    'FODL Cost' => 'processFodlCostSheet',
                    'Material Cost' => 'processMaterialCostSheet',
                    '/^BOM - /' => 'processBomSheet',
                    'SUMMARY' => 'processSummarySheet',
                ];

                $worksheets = [];
                foreach ($spreadsheet->getWorksheetIterator() as $worksheet) {
                    $worksheets[$worksheet->getTitle()] = $worksheet;
                }

                foreach ($sheetProcessingOrder as $sheetPattern => $processingMethod) {
                    $isRegex = $sheetPattern[0] === '/';

                    if ($isRegex) {
                        foreach ($worksheets as $sheetName => $worksheet) {
                            if (preg_match($sheetPattern, $sheetName)) {
                                $this->$processingMethod($worksheet);
                            }
                        }
                    } else {
                        if (isset($worksheets[$sheetPattern])) {
                            $worksheet = $worksheets[$sheetPattern];
                            $data = $worksheet->toArray();

                            if (empty($data)) {
                                $this->status = 400;
                                return $this->getResponse("No data found in the SUMMARY sheet.");
                            } else {
                                $this->$processingMethod($data);
                            }
                        } else {
                            Log::warning("Sheet '{$sheetPattern}' not found.");
                        }
                    }
                }
            }
        }
    }


    private function processSummarySheet($data)
    {
        $monthYearStr = $data[1];
        $monthYearInt = DateHelper::convertMonthYearStrToInt($monthYearStr[0]);
        $headers = $data[3];

        unset($data[0], $data[1], $data[2], $data[3]);

        $fgIds = [];
        $fodlIds = [];


        foreach ($data as $row) {
            $rowData = [];
            foreach ($headers as $column => $header) {
                $rowData[$header] = $row[$column];
            }

            $itemCode = $rowData['Item Code'] ?? null;
            $itemDescription = $rowData['Item Description'] ?? null;
            $rmCost = $rowData['RM Cost'] ?? 0;
            $factoryOverhead = $rowData['Factory Overhead'] ?? 0;
            $directLabor = $rowData['Direct Labor'] ?? 0;
            $total = $rowData['TOTAL'] ?? 0;

            $fodl = Fodl::where('monthYear', $monthYearInt)
                ->where('factory_overhead', $factoryOverhead)
                ->where('direct_labor', $directLabor)
                ->first();

            if (!$fodl) {
                $fodl = Fodl::create([
                    'monthYear' => $monthYearInt,
                    'factory_overhead' => $factoryOverhead,
                    'direct_labor' => $directLabor,
                ]);
            }

            $fodlId = $fodl->fodl_id;

            $finishedGood = FinishedGood::create([
                'fg_code' => $itemCode,
                'fg_desc' => $itemDescription,
                'rm_cost' => $rmCost,
                'total_cost' => $total,
                'monthYear' => $monthYearInt,
                'fodl_id' => $fodlId,
            ]);

            $fgIds[] = $finishedGood->fg_id;
            $fodlIds[] = $fodlId;
        }

        $fodlIds = array_values(array_unique($fodlIds));
        if ($this->fileModel) {
            $settings = json_decode($this->fileModel['settings'], true);
            $settings['fg_ids'] = $fgIds;
            $settings['fodl_ids'] = $fodlIds;
            $this->fileModel['settings'] = json_encode($settings);
        }
    }

    private function processFODLCost($data)
    {
        $monthYearStr = $data[1];
        $monthYearInt = DateHelper::convertMonthYearStrToInt($monthYearStr[0]);
        $headers = $data[4];

        unset($data[0], $data[1], $data[2], $data[3], $data[4]);
    }
}