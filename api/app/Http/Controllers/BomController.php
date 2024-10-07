<?php

namespace App\Http\Controllers;

use App\Models\Bom;
use App\Models\Formulation;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BomController extends ApiController
{
    public function retrieveAll()
    {
        try {
            $allRecords = Bom::all();
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
            'materials.*.material_id' => 'required|integer|exists:materials,material_id',
            'materials.*.material_code' => 'required|string|max:50',
            'materials.*.unit' => 'required|string|max:10',
            'formulation_id' => 'required|integer|exists:formulations,formulation_id',
            'formula_code' => 'required|string|max:50',
        ];

        $messages = [
            'materials.required' => 'Materials are required.',
            'materials.array' => 'Materials must be an array.',
            'materials.min' => 'At least one material is required.',
            'materials.*.material_id.required' => 'Material ID is required.',
            'materials.*.material_id.integer' => 'Material ID must be an integer.',
            'materials.*.material_id.exists' => 'Material ID does not exist.',
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


        // try {
        // Retrieve the Formulation
        $formulation = Formulation::find($formulationId);
        if (!$formulation) {
            $this->status = 404; // Not Found
            return $this->getResponse("Formulation not found.");
        }

        $formulation->formula_code = $formulaCode;
        $formulation->save();

        // Update or Create Emulsion
        $emulsion = json_decode($formulation->emulsion, true); // Decode as associative array
        if ($emulsion) {
            if ($emulsion['level'] && $emulsion['batch_qty'] && $emulsion['unit']) {
                $emulsion['level'] = $emulsionData['level'];
                $emulsion['batch_qty'] = $emulsionData['batch_qty'];
                $emulsion['unit'] = $emulsionData['unit'];
            } else {
                $emulsion = [
                    'level' => $emulsionData['level'],
                    'batch_qty' => $emulsionData['batch_qty'],
                    'unit' => $emulsionData['unit'],
                ];
            }
        } else if (empty(get_object_vars($emulsion))) {
            $emulsion = new \stdClass();
        }

        $updatedEmulsionJson = json_encode($emulsion);
        $formulation->emulsion = $updatedEmulsionJson;
        $formulation->save();

        $materialQtyList = json_decode($formulation->material_qty_list, true);
        $materialQtyMap = [];

        // Iterate through each entry in material_qty_list
        foreach ($materialQtyList as $item) {
            foreach ($item as $material_id => $details) {
                $materialQtyMap[$material_id] = [
                    'level' => $details['level'],
                    'qty' => $details['qty'],
                ];
            }
        }

        // Update Materials
        foreach ($materialsData as $materialData) {
            // Retrieve the Material
            $material = Material::find($materialData['material_id']);
            if ($material) {
                $material->material_code = $materialData['material_code'];
                $material->material_desc = $materialData['material_desc'];
                $material->unit = $materialData['unit'];
                $material->save();
            } else {
                $existingCode = Material::where('material_code', $materialData['material_code'])->first();

                if ($existingCode) {
                    $this->status = 401;
                    return $this->getResponse("Material code already exists.");
                } else {
                    Material::create([
                        'material_code' => $materialData['material_code'],
                        'material_desc' => $materialData['material_desc'],
                        'material_cost' => $materialData['material_cost'],
                        'unit' => $materialData['unit'],
                        'date' => $materialData['date'],
                    ]);
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

        $this->status = 200; // OK
        $this->response['message'] = "BOM batch updated successfully.";
        return $this->getResponse();

        // } catch (\Exception $e) {
        //     // Rollback the transaction on error
        //     DB::rollBack();

        //     // Set error response
        //     $this->status = 500; // Internal Server Error
        //     $this->response['message'] = "An error occurred while updating the BOM batch.";
        //     $this->response['error'] = $e->getMessage(); // Optionally include the error message
        //     return $this->getResponse();
        // }
    }
}