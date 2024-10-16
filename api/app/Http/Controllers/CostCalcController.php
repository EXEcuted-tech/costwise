<?php

namespace App\Http\Controllers;

use App\Helpers\DateHelper;
use App\Models\FinishedGood;
use App\Models\Fodl;
use App\Models\Formulation;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Illuminate\Support\Facades\Log;

class CostCalcController extends ApiController
{

    //Retrieve available monthYear options
    public function retrieveMonthYearOptions()
    {
        try {
            $monthYearOptions = FinishedGood::select('monthYear')
                ->distinct()
                ->orderBy('monthYear', 'desc')
                ->pluck('monthYear')
                ->toArray();

            $formattedOptions = array_map(function($monthYear) {
                return [
                    'value' => $monthYear,
                    'label' => DateHelper::formatMonthYear($monthYear)
                ];
            }, $monthYearOptions);

            $this->status = 200;
            $this->response['data'] = $formattedOptions;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse("An error occurred while retrieving the month and year options.");
        }
    }

    //Retrieve FG options
    public function retrieveFGOptions(Request $request)
    {
        $monthYear = $request->query('monthYear');

        try {
            $fgOptions = FinishedGood::where('is_least_cost', 1)
                ->where('monthYear', $monthYear)
                ->get();

            $this->status = 200;
            $this->response['data'] = $fgOptions;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse("An error occurred while retrieving the FG options.");
        }
    }

    public function retrieveFGDetails(Request $request)
    {
        $fg_id = $request->query('fg_id');

        try {

            $fgRecord = FinishedGood::where('fg_id', $fg_id)->first();

            //Retrieve formulation
            $formulation = Formulation::where('formulation_id', $fgRecord->formulation_no)->first();
            $materialQtyList = json_decode($formulation->material_qty_list);

            //Store fg data
            $fgData = [
                'formulation_no' => $fgRecord->formulation_no,
                'code' => $fgRecord->fg_code,
                'desc' => $fgRecord->fg_desc,
                'batch_qty' => $fgRecord->total_batch_qty,
                'unit' => $fgRecord->unit,
                'rm_cost' => $fgRecord->rm_cost,
                'total_cost' => $fgRecord->total_cost,
                'components' => []
            ];

            //Retrieve emulsion data
            $emulsion = json_decode($formulation->emulsion);
            if ($emulsion) {
                $fgData['components'][] = [
                    'level' => $emulsion->level,
                    'qty' => $emulsion->batch_qty,
                    'unit' => $emulsion->unit,
                ];
            } else {
                Log::info("No emulsion found");
                $fgData['components'][] = []; //empty
            }

            //Retrieve list of materials
            foreach ($materialQtyList as $index => $materialItem) {
                $materialId = key($materialItem);
                $details = current($materialItem);

                try {
                    $materialRecord = Material::find($materialId);
                    if ($materialRecord) {
                        $fgData['components'][] = [
                            'level' => $details->level,
                            'item_code' => $materialRecord->material_code,
                            'description' => $materialRecord->material_desc,
                            'batch_quantity' => $details->qty,
                            'unit' => $materialRecord->unit,
                            'cost' => $materialRecord->material_cost,
                            'total_cost' => $details->total_cost
                        ];
                    } else {
                        throw new \Exception("Material Record not found for ID: $materialId");
                    }
                } catch (\Exception $e) {
                    throw new \Exception("Error processing material item: " . $e->getMessage());
                }
            }

            Log::info("FINAL FG DATA: " . json_encode($fgData));

            $this->status = 200;
            $this->response['data'] = $fgData;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse("An error occurred while retrieving the FG details.");
        }
    }

}
