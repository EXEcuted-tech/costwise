<?php

namespace App\Http\Controllers;

use App\Models\Bom;
use App\Models\FinishedGood;
use App\Models\Formulation;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BomController extends ApiController
{
    public function retrieveAll()
    {
        try {
            $allRecords = Bom::all()->map(function ($bom) {
                $formulationIds = json_decode($bom->formulations);
                if (!empty($formulationIds)) {
                    $firstFormulationId = $formulationIds[0];
                    $formulation = Formulation::find($firstFormulationId);
                    if ($formulation) {
                        $finishedGood = FinishedGood::find($formulation->fg_id);
                        if ($finishedGood) {
                            $bom->fg_name = $finishedGood->fg_desc;
                        }
                    }
                }

                return $bom;
            });
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
        $allowedColumns = [
            'bom_id',
            'bom_name',
            'formulations',
        ];

        $col = $request->query('col');
        $value = $request->query('value');

        if (!in_array($col, $allowedColumns)) {
            $this->status = 400;
            return $this->getResponse("Invalid column specified.");
        }

        try {
            $records = Bom::where($col, $value)->get();

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

    public function retrieveFirst(Request $request)
    {
        $allowedColumns = [
            'bom_id',
            'bom_name',
            'formulations',
        ];

        $col = $request->query('col');
        $value = $request->query('value');

        if (!in_array($col, $allowedColumns)) {
            $this->status = 400;
            return $this->getResponse("Invalid column specified.");
        }

        try {
            $record = Bom::where($col, $value)->first();

            if (!$record) {
                $this->status = 404;
                return $this->getResponse("No record found.");
            }

            $formulationIds = json_decode($record->formulations);
            $formulations = Formulation::whereIn('formulation_id', $formulationIds)->get();
            $record->formulations = $formulations;

            $this->status = 200;
            $this->response['data'] = $record;
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
            'bom_id',
            'bom_name',
            'formulations',
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
            $records = Bom::whereIn($col, $values)->get();

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
    public function updateBatch(Request $request)
    {
        $rules = [
            'materials' => 'required|array|min:1',
            'materials.*.material_id' => 'sometimes',
            'materials.*.unit' => 'required|string|max:50',
            'formulation_id' => 'required|integer|exists:formulations,formulation_id',
            'formula_code' => 'required|string',
        ];

        $messages = [
            'materials.required' => 'Materials are required.',
            'materials.array' => 'Materials must be an array.',
            'materials.min' => 'At least one material is required.',
            'materials.*.material_id.required' => 'Material ID is required.',
            'materials.*.material_code.required' => 'Material code is required.',
            'materials.*.unit.required' => 'Material unit is required.',
            'formulation_id.required' => 'Formulation ID is required.',
            'formulation_id.integer' => 'Formulation ID must be an integer.',
            'formulation_id.exists' => 'Formulation does not exist.',
            'formula_code.required' => 'Formula code is required.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            $this->status = 422;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Incorrect/Lacking input details. Please follow the format!");
        }
        $emulsionData = $request->input('emulsion');
        $materialsData = $request->input('materials');
        $formulationId = $request->input('formulation_id');
        $formulaCode = $request->input('formula_code');

        \DB::beginTransaction();

        try {
            $formulation = Formulation::find($formulationId);
            if (!$formulation) {
                $this->status = 404;
                return $this->getResponse("Formulation not found.");
            }

            $formulation->formula_code = $formulaCode;
            $formulation->save();

            $emulsion = json_decode($formulation->emulsion, true);
            if (empty($emulsionData)) {
                $emulsion = new \stdClass();
            } else {
                $emulsion = [
                    'level' => $emulsionData['level'],
                    'batch_qty' => number_format(floatval($emulsionData['batch_qty']), 2, '.', ''),
                    'unit' => $emulsionData['unit'],
                ];
            }

            $updatedEmulsionJson = json_encode($emulsion);
            $formulation->emulsion = $updatedEmulsionJson;
            $formulation->save();

            $materialQtyList = json_decode($formulation->material_qty_list, true);
            $materialQtyMap = [];

            foreach ($materialQtyList as $item) {
                foreach ($item as $material_id => $details) {
                    $materialQtyMap[$material_id] = [
                        'level' => $details['level'],
                        'qty' => $details['qty'],
                    ];
                }
            }

            foreach ($materialsData as $materialData) {

                $material = Material::find($materialData['material_id']);
                if ($material) {
                    $material->material_code = $materialData['material_code'];
                    $material->material_desc = $materialData['material_desc'];
                    $material->unit = $materialData['unit'];
                    $material->save();
                } else {
                    $existingCode = Material::where('material_code', $materialData['material_code'])->first();

                    if ($existingCode) {
                        $materialData['material_id'] = $existingCode->material_id;
                    } else {
                        if ($materialData['material_desc'] == 'EMULSION') {
                            continue;
                        } else {
                            $this->status = 404;
                            return $this->getResponse("Material code does not exist.");
                        }
                    }
                }

                $materialID = $materialData['material_id'];
                if (isset($materialQtyMap[$materialID])) {
                    $materialQtyMap[$materialID]['level'] = (int) $materialData['level'];
                    $materialQtyMap[$materialID]['qty'] = $materialData['batchQty'];
                } else {
                    $materialQtyMap[$materialID] = [
                        'level' => $materialData['level'],
                        'qty' => $materialData['batchQty'],
                    ];
                }
                ;
            }

            $updatedMaterialQtyList = [];

            foreach ($materialQtyMap as $material_id => $details) {
                $updatedMaterialQtyList[] = [
                    $material_id => [
                        'level' => $details['level'],
                        'qty' => $details['qty'],
                    ],
                ];
            }

            $updatedMaterialQtyJson = json_encode($updatedMaterialQtyList);
            $formulation->material_qty_list = $updatedMaterialQtyJson;

            $formulation->save();

            \DB::commit();

            $this->status = 200;
            $this->response['message'] = "BOM batch updated successfully.";
            return $this->getResponse();

        } catch (\Exception $e) {
            \DB::rollBack();

            $this->status = 500;
            $this->response['message'] = "An error occurred while updating the BOM batch.";
            $this->response['error'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    public function updateOrCreateBatch(Request $request)
    {
        $rules = [
            'materials' => 'required|array|min:1',
            'materials.*.material_id' => 'sometimes',
            'materials.*.unit' => 'required|string|max:10',
            'formulation_id' => 'sometimes|integer',
            'formula_code' => 'required|string|max:50',
            'bom' => 'required|integer',
        ];

        $messages = [
            'materials.required' => 'Materials are required.',
            'materials.array' => 'Materials must be an array.',
            'materials.min' => 'At least one material is required.',
            'materials.*.material_id.required' => 'Material ID is required.',
            'materials.*.material_code.required' => 'Material code is required.',
            'materials.*.unit.required' => 'Material unit is required.',
            'formulation_id.integer' => 'Formulation ID must be an integer.',
            'formula_code.required' => 'Formula code is required.',
            'bom.required' => 'BOM ID is required.',
            'bom.integer' => 'BOM ID must be an integer.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            $this->status = 422;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Incorrect/Lacking input details. Please follow the format!");
        }

        $emulsionData = $request->input('emulsion');
        $materialsData = $request->input('materials');
        $formulationId = $request->input('formulation_id');
        $formulaCode = $request->input('formula_code');
        $bomId = $request->input('bom');
        $fgId = $request->input('fg_id');

        \DB::beginTransaction();

        try {
            $isNewFormulation = false;

            $formulation = Formulation::find($formulationId);

            if (!$formulation) {
                $formulation = new Formulation();
                $isNewFormulation = true;
            }

            $formulation->fg_id = $fgId;
            $formulation->formula_code = $formulaCode;

            if (empty($emulsionData)) {
                $emulsion = new \stdClass();
            } else {
                $emulsion = [
                    'level' => $emulsionData['level'],
                    'batch_qty' => number_format(floatval($emulsionData['batch_qty']), 2, '.', ''),
                    'unit' => $emulsionData['unit'],
                ];
            }

            $updatedEmulsionJson = json_encode($emulsion);
            $formulation->emulsion = $updatedEmulsionJson;

            $materialQtyMap = [];
            foreach ($materialsData as $materialData) {
                if (strtoupper($materialData['material_desc']) == 'EMULSION') {
                    continue;
                }

                $finishedGood = FinishedGood::findOrFail($fgId);

                $date = date('Y-m-d', strtotime(substr($finishedGood->monthYear, 0, 4) . '-' . substr($finishedGood->monthYear, 4, 2) . '-01'));
                $material = Material::updateOrCreate(
                    [
                        'material_code' => $materialData['material_code'],
                        'material_desc' => $materialData['material_desc']
                    ],
                    [
                        'material_code' => $materialData['material_code'],
                        'material_desc' => $materialData['material_desc'],
                        'material_cost' => $materialData['material_cost'] ?? 0,
                        'unit' => $materialData['unit'],
                        'date' => $date,
                    ]
                );

                $materialQtyMap[$material->material_id] = [
                    'level' => (int) $materialData['level'],
                    'qty' => $materialData['batchQty'],
                ];
            }

            $updatedMaterialQtyList = [];
            foreach ($materialQtyMap as $material_id => $details) {
                $updatedMaterialQtyList[] = [
                    $material_id => [
                        'level' => $details['level'],
                        'qty' => $details['qty'],
                    ],
                ];
            }

            $updatedMaterialQtyJson = json_encode($updatedMaterialQtyList);
            $formulation->material_qty_list = $updatedMaterialQtyJson;

            $formulation->save();

            if ($isNewFormulation) {
                $bom = Bom::findOrFail($bomId);
                $formulations = json_decode($bom->formulations, true) ?? [];
                $formulations[] = $formulation->formulation_id;
                $bom->formulations = json_encode($formulations);
                $bom->save();
            }

            \DB::commit();

            $this->status = 200;
            $this->response['message'] = $formulationId ? "BOM batch updated successfully." : "BOM batch created successfully.";
            return $this->getResponse();

        } catch (\Exception $e) {
            \DB::rollBack();
            $this->status = 500;
            $this->response['message'] = "An error occurred while updating/creating the BOM batch.";
            $this->response['error'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    public function delete(Request $request)
    {
        try {
            \DB::beginTransaction();

            $bomId = $request->input('bom_id');
            $bom = Bom::findOrFail($bomId);

            Bom::on('archive_mysql')->create($bom->toArray());
            $bom->delete();

            \DB::commit();

            $this->status = 200;
            $this->response['message'] = "BOM deleted and archived successfully.";
            return $this->getResponse();
        } catch (\Exception $e) {
            \DB::rollBack();
            $this->status = 500;
            $this->response['message'] = "An error occurred while deleting the BOM.";
            $this->response['error'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    public function create(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'formulation_ids' => 'required|array',
                'bom_name' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                $this->status = 400;
                $this->response['errors'] = $validator->errors();
                return $this->getResponse();
            }

            $formulationIds = $request->input('formulation_ids');
            $bomName = $request->input('bom_name');

            $bom = new Bom();
            $bom->bom_name = $bomName;

            $newFormulationIds = [];
            $fgIds = [];
            $monthYear = null;

            foreach ($formulationIds as $formulationId) {
                $existingBom = Bom::whereJsonContains('formulations', $formulationId)->first();

                if ($existingBom) {
                    $existingFormulation = Formulation::findOrFail($formulationId);

                    $existingFg = FinishedGood::findOrFail($existingFormulation->fg_id);
                    $newFg = $existingFg->replicate();
                    $newFg->save();

                    $newFormulation = $existingFormulation->replicate();
                    $newFormulation->fg_id = $newFg->fg_id;
                    $newFormulation->save();

                    $newFormulationIds[] = $newFormulation->formulation_id;
                    $fgIds[] = $newFg->fg_id;
                } else {
                    $formulation = Formulation::findOrFail($formulationId);
                    $newFormulationIds[] = $formulationId;
                    $fgIds[] = $formulation->fg_id;
                }

                $fg = FinishedGood::findOrFail(end($fgIds));

                if ($monthYear === null) {
                    $monthYear = $fg->monthYear;
                } elseif ($fg->monthYear !== $monthYear) {
                    $this->status = 400;
                    $this->response['message'] = "All FinishedGoods must have the same monthYear.";
                    return $this->getResponse();
                }
            }

            $bom->formulations = json_encode($newFormulationIds);

            $leastCostFgId = FinishedGood::whereIn('fg_id', $fgIds)
                ->orderBy('rm_cost', 'asc')
                ->first()
                ->fg_id;

            FinishedGood::whereIn('fg_id', $fgIds)
                ->update(['is_least_cost' => 0]);

            FinishedGood::where('fg_id', $leastCostFgId)
                ->update(['is_least_cost' => 1]);

            $bom->save();

            $this->status = 201;
            $this->response['message'] = "BOM created successfully.";
            $this->response['data'] = $bom;
            return $this->getResponse();

        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = "An error occurred while creating the BOM.";
            $this->response['error'] = $e->getMessage();
            return $this->getResponse();
        }
    }
}