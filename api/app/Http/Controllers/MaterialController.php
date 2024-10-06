<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;

class MaterialController extends ApiController
{
    public function retrieveAll()
    {
        try {
            $allRecords = Material::all();
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
        // To be removed pa ang mga unnecessary fields
        $allowedColumns = [
            'material_id',
            'material_code',
            'material_desc',
            'material_cost',
            'unit',
            'date',
        ];

        $col = $request->query('col');
        $value = $request->query('value');

        if (!in_array($col, $allowedColumns)) {
            $this->status = 400;
            return $this->getResponse("Invalid column specified.");
        }

        try {
            $records = Material::where($col, $value)->get();

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
            'material_id',
            'material_code',
            'material_desc',
            'material_cost',
            'unit',
            'date',
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
            $records = Material::whereIn($col, $values)->get();

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


    public function onSaveMaterialSheet(Request $request)
    {
        // Define validation rules
        $rules = [
            'materials' => 'required|array|min:1',
            'materials.*.material_id' => 'sometimes|integer|exists:materials,material_id',
            'materials.*.material_code' => 'required|string|max:255',
            'materials.*.material_desc' => 'required|string|max:1000',
            'materials.*.unit' => 'required|string|max:50',
            // Add other fields and their validation rules as necessary
        ];

        // Validate the request
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors(),
                'message' => 'Validation failed.',
            ], 422);
        }

        $materialsData = $request->input('materials');

        DB::beginTransaction();

        try {
            foreach ($materialsData as $materialData) {
                // Check if material_id is present to determine update or create
                if (isset($materialData['material_id'])) {
                    // Update existing material
                    $material = Material::find($materialData['material_id']);
                    if ($material) {
                        $material->update([
                            'material_code' => $materialData['material_code'],
                            'material_desc' => $materialData['material_desc'],
                            'unit' => $materialData['unit'],
                            // Update other fields as necessary
                        ]);
                    } else {
                        // This case should not occur due to validation, but added for safety
                        DB::rollBack();
                        return response()->json([
                            'status' => 404,
                            'message' => "Material with ID {$materialData['material_id']} not found.",
                        ], 404);
                    }
                } else {
                    // Create new material
                    Material::create([
                        'material_code' => $materialData['material_code'],
                        'material_desc' => $materialData['material_desc'],
                        'unit' => $materialData['unit'],
                        // Add other fields as necessary
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'Materials have been successfully saved.',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            // Log the exception if necessary
            // Log::error($e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while saving materials.',
                'error' => $e->getMessage(), // Optional: Remove in production for security
            ], 500);
        }
    }
}