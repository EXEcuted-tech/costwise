<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use League\Csv\Reader;
use App\Models\ProductCosting;
use App\Models\FodlCost;

class FileController extends Controller
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
        File::create([

        ]);
    }
}