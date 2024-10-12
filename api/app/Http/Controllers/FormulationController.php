<?php

namespace App\Http\Controllers;

use App\Models\Bom;
use App\Models\FinishedGood;
use App\Models\Fodl;
use App\Models\Formulation;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FormulationController extends ApiController
{
    public function retrieveAll()
    {
        try {
            $allRecords = Formulation::all();
            $this->status = 200;
            $this->response['data'] = $allRecords;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    public function retrieveAllWithFG()
    {
        try {
            $formulations = Formulation::all();
            $fgIds = $formulations->pluck('fg_id')->unique();
            $finishedGoods = FinishedGood::whereIn('fg_id', $fgIds)->get()->keyBy('fg_id');
            $formulations->each(function ($formulation) use ($finishedGoods) {
                $formulation->finishedGood = $finishedGoods->get($formulation->fg_id);
            });

            $this->status = 200;
            $this->response['data'] = $formulations;

            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    public function retrieve(Request $request)
    {
        $allowedColumns = [
            'formulation_id',
            'fg_id',
            'formula_code',
            'emulsion',
            'material_qty_list',
        ];

        $col = $request->query('col');
        $value = $request->query('value');

        if (!in_array($col, $allowedColumns)) {
            $this->status = 400;
            return $this->getResponse("Invalid column specified.");
        }

        try {
            $records = Formulation::where($col, $value)->get();

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
            'formulation_id',
            'fg_id',
            'formula_code',
            'emulsion',
            'material_qty_list',
        ];

        $col = $request->query('col');
        $values = $request->query('values');

        if (!in_array($col, $allowedColumns)) {
            $this->status = 400;
            return $this->getResponse("Invalid column specified.");
        }

        if (empty($values) || !is_array($values)) {
            $this->status = 400;
            return $this->getResponse("Values should be a non-empty array.");
        }

        try {
            $records = Formulation::whereIn($col, $values)->get();

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

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fg_id' => 'required|integer|exists:finished_goods,fg_id',
            'formula_code' => 'required|string',
            'emulsion' => 'required',
            'materials' => 'required',
        ]);

        if ($validator->fails()) {
            $this->status = 400;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Incorrect/Lacking input details!");
        }

        try {
            $materialCodes = array_column($request->input('materials'), 'material_code');
            $materialDescs = array_column($request->input('materials'), 'material_desc');
            $materialUnits = array_column($request->input('materials'), 'unit');
            
            $currentDate = now();
            $existingMaterials = Material::whereIn('material_code', $materialCodes)
                ->whereIn('material_desc', $materialDescs)
                ->whereIn('unit', $materialUnits)
                ->whereYear('date', $currentDate->year)
                ->whereMonth('date', $currentDate->month)
                ->get(['material_code', 'material_desc', 'unit', 'date'])
                ->keyBy(function ($item) {
                    return "{$item->material_code}|{$item->material_desc}|{$item->unit}";
                })
                ->toArray();
            
            $nonExistingMaterials = array_filter($request->input('materials'), function($material) use ($existingMaterials, $currentDate) {
                $key = $material['material_code'] . '|' . $material['material_desc'] . '|' . $material['unit'];
                if (!isset($existingMaterials[$key])) {
                    return true;
                }
                $materialDate = new \DateTime($existingMaterials[$key]['date']);
                return $materialDate->format('Y-m') !== $currentDate->format('Y-m');
            });

            if (!empty($nonExistingMaterials)) {
                $this->status = 400;
                return $this->getResponse("The following materials inputted do not exist.");
            }

            $materialQtyList = [];
            foreach ($request->input('materials') as $material) {
                $matchingMaterial = Material::where('material_code', $material['material_code'])
                    ->whereYear('date', $currentDate->year)
                    ->whereMonth('date', $currentDate->month)
                    ->first();

                if ($matchingMaterial) {
                    $materialQtyList[$matchingMaterial->material_id] = [
                        'level' => $material['level'],
                        'batchQty' => $material['batchQty'],
                    ];
                }
            }
            
            $formulation = new Formulation();
            $formulation->fg_id = $request->input('fg_id');
            $formulation->formula_code = $request->input('formula_code');
            $formulation->emulsion = json_encode($request->input('emulsion'));
            $formulation->material_qty_list = json_encode($materialQtyList);
            $formulation->save();

            $this->status = 200;
            return $this->getResponse('Formulation created successfully!');
        } catch (\Exception $e) {
            $this->status = 500;
            return $this->getResponse("Error creating formulation. Please try again. " . $e->getMessage());
        }
    }

    public function updateEmulsion(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'formulation_id' => 'integer|exists:formulations,formulation_id',
        ]);

        if ($validator->fails()) {
            $this->status = 400;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Incorrect/Lacking input details!");
        }

        $formulation_id = $request->input('formulation_id');

        try {
            $formulation = Formulation::find($formulation_id);

            if (!$formulation) {
                $this->status = 404;
                return $this->getResponse("Formulation record not found!");
            }

            $formulation->emulsion = json_encode(new \stdClass());
            $formulation->save();

            $this->status = 200;
            return $this->getResponse('Updated record successfully!');
        } catch (\Exception $e) {
            $this->status = 500;
            return $this->getResponse("Error! Try again.");
        }
    }

    public function delete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'formulation_id' => 'required|integer|exists:formulations,formulation_id',
        ]);

        if ($validator->fails()) {
            $this->status = 400;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Incorrect/Lacking input details!");
        }

        $formulationId = $request->input('formulation_id');

        try {
            $formulation = Formulation::find($formulationId);
            $finishedGood = FinishedGood::find($formulation->fg_id);

            if (!$formulation) {
                $this->status = 404;
                return $this->getResponse("Finished Good or Formulation not found!");
            }

            $bom = Bom::whereRaw('JSON_CONTAINS(formulations, ?)', [$formulationId])->first();
            
            if ($bom) {
                $bomFormulations = json_decode($bom->formulations, true);
                $bomFormulations = array_diff($bomFormulations, [$formulationId]);
                $bom->formulations = json_encode(array_values($bomFormulations));
                $bom->save();
            }

            $archivedFormulation = $formulation->toArray();
            $archivedFormulation['created_at'] = $formulation->created_at->format('Y-m-d H:i:s');
            $archivedFormulation['updated_at'] = $formulation->updated_at->format('Y-m-d H:i:s');

            $formulation->delete();

            if ($finishedGood) {
                $finishedGood->fodl_id = null;
                $finishedGood->save();
                $archivedFinishedGood = $finishedGood->toArray();
                FinishedGood::on('archive_mysql')->insert($archivedFinishedGood);
                Formulation::on('archive_mysql')->insert($archivedFormulation);
                $finishedGood->delete();
            }

            $this->status = 200;
            return $this->getResponse("Finished Good and Formulation deleted successfully!");
        } catch (\Exception $e) {
            $this->status = 500;
            return $this->getResponse("Error! Try again. " . $e->getMessage());
        }
    }

    public function deleteBulkWithFG(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fg_ids' => 'required|array|min:1',
            'fg_ids.*' => 'integer|exists:formulations,fg_id',
            'bom_id' => 'integer|exists:bill_of_materials,bom_id',
        ]);

        if ($validator->fails()) {
            $this->status = 400;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Incorrect/Lacking input details!");
        }

        $fgIds = $request->input('fg_ids');
        $bomId = $request->input('bom_id');

        // try {
        $bom = Bom::find($bomId);

        if (!$bom) {
            $this->status = 400;
            return $this->getResponse("BOM Not Found");
        }

        $formulationIds = Formulation::whereIn('fg_id', $fgIds)
            ->pluck('formulation_id')
            ->toArray();

        $bomFormulations = json_decode($bom->formulations, true);
        $bomFormulations = array_diff($bomFormulations, $formulationIds);
        $bom->formulations = json_encode(array_values($bomFormulations));
        $bom->save();

        $formulationsToDelete = Formulation::whereIn('formulation_id', $formulationIds)->get();
        $finishedGoodsToDelete = FinishedGood::whereIn('fg_id', $fgIds)->get();

        $archivedFormulations = $formulationsToDelete->map(function ($item) {
            return [
                'formulation_id' => $item->formulation_id,
                'fg_id' => $item->fg_id,
                'formula_code' => $item->formula_code,
                'emulsion' => $item->emulsion,
                'material_qty_list' => $item->material_qty_list,
                'created_at' => $item->created_at?->format('Y-m-d H:i:s'),
                'updated_at' => $item->updated_at?->format('Y-m-d H:i:s'),
            ];
        })->toArray();

        $archivedFinishedGoods = $finishedGoodsToDelete->map(function ($item) {
            $fodlExists = Fodl::on('archive_mysql')->find($item->fodl_id);
            return [
                'fg_id' => $item->fg_id,
                'fodl_id' => $fodlExists ? $item->fodl_id : null,
                'fg_code' => $item->fg_code,
                'fg_desc' => $item->fg_desc,
                'total_cost' => $item->total_cost,
                'total_batch_qty' => $item->total_batch_qty,
                'rm_cost' => $item->rm_cost,
                'unit' => $item->unit,
                'formulation_no' => $item->formulation_no,
                'is_least_cost' => $item->is_least_cost,
                'monthYear' => $item->monthYear,
            ];
        })->toArray();

        if ($finishedGoodsToDelete->isNotEmpty()) {
            FinishedGood::on('archive_mysql')->insert($archivedFinishedGoods);
        }

        if ($formulationsToDelete->isNotEmpty()) {
            Formulation::on('archive_mysql')->insert($archivedFormulations);
        }

        Formulation::whereIn('formulation_id', $formulationIds)->delete();
        FinishedGood::whereIn('fg_id', $fgIds)->delete();

        $this->status = 200;
        return $this->getResponse('Deletion was done successfully!');
        // } catch (\Exception $e) {
        //     $this->status = 500;
        //     return $this->getResponse("Error! Try again.");
        // }
    }

    public function deleteBulkWithMaterial(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'formulation_id' => 'required|integer',
            'material_ids' => 'required|array|min:1',
            'material_ids.*' => 'integer|exists:materials,material_id',
        ]);

        if ($validator->fails()) {
            $this->status = 400;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Incorrect/Lacking input details!");
        }

        $formulationId = $request->input('formulation_id');
        $materialIds = $request->input('material_ids');

        $formulation = Formulation::find($formulationId);

        if (!$formulation) {
            $this->status = 404;
            return $this->getResponse("Formulation not found!");
        }

        $materialQtyList = json_decode($formulation->material_qty_list, true);

        if (!is_array($materialQtyList)) {
            $this->status = 400;
            return $this->getResponse("Invalid format!");
        }

        $updatedMaterialQtyList = array_filter($materialQtyList, function ($material) use ($materialIds) {
            $materialKey = key($material);
            return !in_array($materialKey, $materialIds);
        });

        $formulation->material_qty_list = json_encode(array_values($updatedMaterialQtyList));
        $formulation->save();

        $this->status = 200;
        return $this->getResponse("Formulation updated successfully!");
    }

    public static function deleteBulkWithFGInFile($fgIds, $bomId)
    {
        try {
            $bom = Bom::find($bomId);

            if (!$bom) {
                return [
                    'status' => 400,
                    'message' => 'BOM Not Found'
                ];
            }

            $formulationIds = Formulation::whereIn('fg_id', $fgIds)
                ->pluck('formulation_id')
                ->toArray();

            $bomFormulations = json_decode($bom->formulations, true) ?? [];
            $bomFormulations = array_diff($bomFormulations, $formulationIds);
            $bom->formulations = json_encode(array_values($bomFormulations));
            $bom->save();

            $formulationsToDelete = Formulation::whereIn('formulation_id', $formulationIds)->get();
            $finishedGoodsToDelete = FinishedGood::whereIn('fg_id', $fgIds)->get();

            $archivedFormulations = $formulationsToDelete->map(function ($item) {
                return [
                    'formulation_id' => $item->formulation_id,
                    'fg_id' => $item->fg_id,
                    'formula_code' => $item->formula_code,
                    'emulsion' => $item->emulsion,
                    'material_qty_list' => $item->material_qty_list,
                    'created_at' => optional($item->created_at)->format('Y-m-d H:i:s'),
                    'updated_at' => optional($item->updated_at)->format('Y-m-d H:i:s'),
                ];
            })->toArray();

            $archivedFinishedGoods = $finishedGoodsToDelete->map(function ($item) {
                $fodlExists = Fodl::on('archive_mysql')->find($item->fodl_id);
                return [
                    'fg_id' => $item->fg_id,
                    'fodl_id' => $fodlExists ? $item->fodl_id : null,
                    'fg_code' => $item->fg_code,
                    'fg_desc' => $item->fg_desc,
                    'total_cost' => $item->total_cost,
                    'total_batch_qty' => $item->total_batch_qty,
                    'rm_cost' => $item->rm_cost,
                    'unit' => $item->unit,
                    'formulation_no' => $item->formulation_no,
                    'is_least_cost' => $item->is_least_cost,
                    'monthYear' => $item->monthYear,
                ];
            })->toArray();

            if ($finishedGoodsToDelete->isNotEmpty()) {
                FinishedGood::on('archive_mysql')->insert($archivedFinishedGoods);
            }

            if ($formulationsToDelete->isNotEmpty()) {
                Formulation::on('archive_mysql')->insert($archivedFormulations);
            }

            Formulation::whereIn('formulation_id', $formulationIds)->delete();
            FinishedGood::whereIn('fg_id', $fgIds)->delete();

            return [
                'status' => 200,
                'message' => 'Deletion was done successfully!'
            ];
        } catch (\Exception $e) {
            return [
                'status' => 500,
                'message' => 'Error! Try again.',
                'error' => $e->getMessage() // Optionally include the error message
            ];
        }
    }
}