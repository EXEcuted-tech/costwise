<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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


    public function updateBatch(Request $request)
    {
        $rules = [
            'materials' => 'required|array|min:1',
            'materials.*.material_id' => 'sometimes|integer',
            'materials.*.material_code' => 'required|string|max:255',
            'materials.*.material_desc' => 'required|string|max:1000',
            'materials.*.unit' => 'required|string|max:50',
            'materials.*.material_cost' => 'required|numeric|min:0',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            $this->status = 422;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Incorrect/Lacking input details!");
        }

        $materialsData = $request->input('materials');
        $file_id = $request->input('file_id');

        \DB::beginTransaction();

        // try {
        foreach ($materialsData as $materialData) {
            if (isset($materialData['material_id'])) {
                $material = Material::find($materialData['material_id']);

                if ($material) {
                    $material->update([
                        'material_code' => $materialData['material_code'],
                        'material_desc' => $materialData['material_desc'],
                        'material_cost' => $materialData['material_cost'],
                        'unit' => $materialData['unit'],
                        'date' => $materialData['date'],
                    ]);
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

                        $files = File::where('file_id', $file_id)->get();

                        foreach ($files as $file) {
                            $settings = json_decode($file->settings, true);
                        
                            if (!isset($settings['material_ids']) || !is_array($settings['material_ids'])) {
                                $settings['material_ids'] = [];
                            }
                        
                            $settings['material_ids'][] = $materialData['material_id'];
                            $settings['material_ids'] = array_values($settings['material_ids']);
                            $file->settings = json_encode($settings);
                            $file->save();
                        }
                    }
                }
            }
        }

        \DB::commit();

        $this->status = 200;
        return $this->getResponse('Materials have been successfully saved.');
        // } catch (\Exception $e) {
        //     \DB::rollBack();
        //     $this->status = 500;
        //     $this->response['message'] = "An error occurred while updating records.";
        //     return $this->getResponse("An error occurred while updating records.");
        // }
    }

    public function deleteBulk(Request $request)
    {
        // Validation rules for materials
        $rules = [
            'material_ids' => 'required|array|min:1',
            'material_ids.*' => 'required|integer|exists:materials,material_id',
        ];

        $validator = Validator::make($request->all(), $rules);

        // Check for validation failures
        if ($validator->fails()) {
            $this->status = 422;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Validation failed.");
        }

        $materialIds = $request->input('material_ids');
        $file_id = $request->input('file_id');

        \DB::beginTransaction();

        try {
            // Get the materials to be deleted
            $materials = Material::whereIn('material_id', $materialIds)->get();

            if ($materials->isEmpty()) {
                \DB::rollBack();
                $this->status = 404;
                return $this->getResponse('No materials found to delete.');
            }

            // Archive the materials to another database
            foreach ($materials as $material) {
                $archivedMaterialData = $material->toArray();
                Material::on('archive_mysql')->create($archivedMaterialData);
            }

            // Retrieve the files associated with the given file_id
            $files = File::where('file_id', $file_id)->get();

            foreach ($files as $file) {
                $settings = json_decode($file->settings, true);

                if (isset($settings['material_ids']) && is_array($settings['material_ids'])) {
                    $originalCount = count($settings['material_ids']);

                    // Remove the deleted materials from the settings
                    $settings['material_ids'] = array_filter($settings['material_ids'], function ($materialId) use ($materialIds) {
                        return !in_array($materialId, $materialIds);
                    });

                    $newCount = count($settings['material_ids']);

                    // If there was a change in the count, update the file's settings
                    if ($newCount < $originalCount) {
                        $settings['material_ids'] = array_values($settings['material_ids']); // Reindex the array
                        $file->settings = json_encode($settings);
                        $file->save();
                    }
                }
            }

            // Finally, delete the materials from the original database
            Material::whereIn('material_id', $materialIds)->delete();

            \DB::commit();

            $this->status = 200;
            return $this->getResponse('Materials have been successfully deleted and archived.');
        } catch (\Exception $e) {
            \DB::rollBack();
            $this->status = 500;
            return $this->getResponse("An error occurred while deleting records.");
        }
    }
}