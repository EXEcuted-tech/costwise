<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use League\Csv\Reader;
use App\Models\File;
use App\Models\FinishedGood;
use App\Models\Fodl;


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
            $fileModel = File::create([
                'file_type' => $uploadType == 'master' ? 'master_file' : 'transactional_file',
                'settings' => json_encode($settings),
            ]);

            $this->fileModel = $fileModel;

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
                switch ($sheetName) {
                    case 'SUMMARY':
                        $this->processSummarySheet($worksheet);
                        break;
                    default:
                        break;
                    // Add cases for other sheets
                }
            }
        }

        $this->status = 200;
        return $this->getResponse("File processed successfully!");
    }

    private function processSummarySheet($worksheet)
    {
        $data = $worksheet->toArray();
        if (empty($data)) {
            $this->status = 400;
            return $this->getResponse("No data found in the SUMMARY sheet.");
        }

        $monthYearStr = $data[2];
        $monthYearInt = convertMonthYearStrToInt($monthYearStr);
        $headers = $data[4];
        unset($data[1], $data[2], $data[3], $data[4]);

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

            // if (is_null($itemCode) || is_null($itemDescription) || is_null($rmCost)) {
            //     continue;
            // }

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

            $fgIds[] = $finishedGood->id;
            $fodlIds[] = $fodlId;
        }

        $fodlIds = array_values(array_unique($fodlIds));

        if ($this->fileModel) {
            $settings = json_decode($this->fileModel->settings, true);
            $settings['fg_ids'] = $fgIds;
            $settings['fodl_ids'] = $fodlIds;
            $this->fileModel->settings = json_encode($settings);
            $this->fileModel->save();
        }

        $this->status = 200;
        return $this->getResponse("SUMMARY sheet processed successfully!");
    }
}