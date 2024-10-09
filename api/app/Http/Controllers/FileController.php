<?php

namespace App\Http\Controllers;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use League\Csv\Reader;
use App\Models\ProductCosting;
use App\Models\FodlCost;
use Illuminate\Support\Facades\Validator;
use App\Models\File;
use App\Models\MaterialCosts;

class FileController extends ApiController
{
    public function upload(Request $request)
    {
        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();

        if ($extension == 'xlsx') {
            return $this->processExcel($file);
        }

        return response()->json(['error' => 'Unsupported file type'], 400);
    }

    private function processExcel($file)
    {
        $spreadsheet = IOFactory::load($file);

        foreach ($spreadsheet->getWorksheetIterator() as $worksheet) {
            $sheetName = $worksheet->getTitle();

            switch ($sheetName) {
                case 'SUMMARY OF PRODUCT COSTING':
                    $this->processSummarySheet($worksheet);
                    break;
                default:
                    break;
                    // Add cases for other sheets
            }
        }

        return response()->json(['message' => 'File processed successfully']);
    }

    private function processSummarySheet($worksheet)
    {
        $data = $worksheet->toArray();
        // Process and store data in the ProductCosting model
        // Example:
        // ProductCosting::create([
        //     'product_name' => $data[1][0],
        //     'total_cost' => $data[1][1],
        //     // ... other fields
        // ]);
        File::create([]);
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
