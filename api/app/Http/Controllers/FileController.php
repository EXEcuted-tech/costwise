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
                    'file_type' => 'required',
                    'settings' => 'required',
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['error'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $validatedData = $validator->validated();

            $file = File::create($validatedData);
            $this->status = 200;
            $this->response['data'] = $file;
            return $this->getResponse("File Successfully Uploaded");
        } catch (\Throwable $th) {
            $this->status = $th->getCode();
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }

    public function getData()
    {
        try {
            $file = File::find(1);

            if (!$file) {
                $this->status = 404;
                return $this->getResponse("Model not found.");
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
