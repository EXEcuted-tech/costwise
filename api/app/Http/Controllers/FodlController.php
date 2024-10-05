<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\FinishedGood;
use App\Models\Fodl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FodlController extends ApiController
{
    public function retrieveAll()
    {
        try {
            $allRecords = Fodl::all();
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
            'fodl_id',
            'fg_code',
            'factory_overhead',
            'direct_labor',
            'monthYear',
        ];

        $col = $request->query('col');
        $value = $request->query('value');

        if (!in_array($col, $allowedColumns)) {
            $this->status = 400;
            return $this->getResponse("Invalid column specified.");
        }

        try {
            $records = Fodl::where($col, $value)->get();

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
            'fodl_id',
            'fg_code',
            'factory_overhead',
            'direct_labor',
            'monthYear',
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
            $records = Fodl::whereIn($col, $values)->get();

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

    public function updateBatchCombined(Request $request)
    {
        $rules = [
            'fodls' => 'required|array|min:1',
            'fodls.*.fodl_id' => 'sometimes|integer|exists:fodl,fodl_id',
            'fodls.*.factory_overhead' => 'required|numeric|min:0',
            'fodls.*.direct_labor' => 'required|numeric|min:0',
            'fodls.*.monthYear' => 'required|integer|min:0',
    
            'finished_goods' => 'required|array|min:1',
            'finished_goods.*.fg_code' => 'required|string|exists:finished_goods,fg_code',
            'finished_goods.*.fg_desc' => 'required|string',
            'finished_goods.*.unit' => 'required|string',
        ];
    
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            $this->status = 422;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Validation failed.");
        }
    
        $fodls = $request->input('fodls');
        $finishedGoods = $request->input('finished_goods');
    
        if (count($fodls) !== count($finishedGoods)) {
            $this->status = 422;
            return $this->getResponse("'The number of fodls must match the number of finished_goods.");
        }
    
        \DB::beginTransaction();
    
        try {
            $fgCodes = [];
            foreach ($finishedGoods as $fgData) {
                $fg = FinishedGood::where('fg_code', $fgData['fg_code'])->first();
    
                if (!$fg) {
                    $this->status = 401;
                    return $this->getResponse("Changed fg_code does not exist!");
                }
    
                $fg->update([
                    'fg_desc' => $fgData['fg_desc'],
                    'unit' => $fgData['unit'],
                ]);
    
                $fgCodes[] = $fg->fg_code;
            }

            foreach ($fodls as $index => $fodlData) {
                $assignedFgCode = $fgCodes[$index];
    
                Fodl::updateOrCreate(
                    ['fodl_id' => $fodlData['fodl_id'] ?? null],
                    [
                        'factory_overhead' => $fodlData['factory_overhead'],
                        'direct_labor' => $fodlData['direct_labor'],
                        'fg_code' => $assignedFgCode,
                        'monthYear' => $fodlData['monthYear'],
                    ]
                );
            }
    
            \DB::commit();
    
            $this->status = 200;
            $this->response['message'] = "FODL and Finished Goods records updated successfully.";
            return $this->getResponse();
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Error updating batch combined: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            $this->status = 500;
            $this->response['message'] = "An error occurred while updating records.";
            return $this->getResponse("An error occurred while updating records.");
        }
    }

    public function deleteFodl(Request $request)
    {
        // Retrieve 'fodl_id' from query parameters
        $fodl_id = $request->query('fodl_id');

        // Validate the fodl_id
        $validator = Validator::make(['fodl_id' => $fodl_id], [
            'fodl_id' => 'required|integer|exists:fodl,fodl_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors(),
                'message' => 'Validation failed.'
            ], 422);
        }

        // Start a database transaction
        \DB::beginTransaction();

        try {
            // Fetch the Fodl record
            $fodl = Fodl::findOrFail($fodl_id);

            // Archive the Fodl record
            $archivedFodlData = $fodl->toArray();
            // Ensure that the 'archive_mysql' connection is properly configured
            // It's recommended to use a separate model for archiving for clarity
            Fodl::on('archive_mysql')->create($archivedFodlData);

            // Find all File records that include this fodl_id in their settings.fodls array
            $files = File::whereJsonContains('settings->fodls', ['fodl_id' => $fodl_id])->get();

            foreach ($files as $file) {
                // Decode the settings JSON into a PHP array (handled by Eloquent casting)
                $settings = $file->settings;

                // Check if 'fodls' key exists and is an array
                if (isset($settings['fodls']) && is_array($settings['fodls'])) {
                    // Remove the fodl entry with the given fodl_id
                    $originalCount = count($settings['fodls']);
                    $settings['fodls'] = array_filter($settings['fodls'], function ($fodlEntry) use ($fodl_id) {
                        return $fodlEntry['fodl_id'] !== $fodl_id;
                    });
                    $newCount = count($settings['fodls']);

                    // If any entries were removed, update the settings field
                    if ($newCount < $originalCount) {
                        // Reindex the array to maintain proper JSON structure
                        $settings['fodls'] = array_values($settings['fodls']);
                        $file->settings = $settings;
                        $file->save();
                    }
                }
            }

            // Delete the Fodl record from the fodl table
            $fodl->delete();

            // Commit the transaction
            \DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'FODL record deleted and archived successfully.'
            ], 200);
        } catch (\Exception $e) {
            // Rollback the transaction in case of any errors
            \DB::rollBack();

            // Log the error details for debugging
            // Log::error('Error deleting FODL record: ' . $e->getMessage(), [
            //     'trace' => $e->getTraceAsString(),
            //     'fodl_id' => $fodl_id
            // ]);

            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while deleting the FODL record.'
            ], 500);
        }
    }

    public function deleteBulkFodl(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'fodl_ids' => 'required|array|min:1',
            'fodl_ids.*' => 'integer|exists:fodl,fodl_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors(),
                'message' => 'Validation failed.'
            ], 422);
        }

        $fodlIds = $request->input('fodl_ids');

        // Start a database transaction
        \DB::beginTransaction();

        try {
            // Fetch the Fodl records to be deleted
            $fodls = Fodl::whereIn('fodl_id', $fodlIds)->get();

            foreach ($fodls as $fodl) {
                // Archive the Fodl record by inserting into 'archive_mysql' connection
                $archivedFodlData = $fodl->toArray();
                Fodl::on('archive_mysql')->create($archivedFodlData);

                // Find all File records that include this fodl_id in their settings.fodls array
                $files = File::whereJsonContains('settings->fodls', ['fodl_id' => $fodl->fodl_id])->get();

                foreach ($files as $file) {
                    $settings = $file->settings;

                    if (isset($settings['fodls']) && is_array($settings['fodls'])) {
                        // Remove the fodl entry with the given fodl_id
                        $originalCount = count($settings['fodls']);
                        $settings['fodls'] = array_filter($settings['fodls'], function ($fodlEntry) use ($fodl) {
                            return $fodlEntry['fodl_id'] !== $fodl->fodl_id;
                        });
                        $newCount = count($settings['fodls']);

                        // If any entries were removed, update the settings field
                        if ($newCount < $originalCount) {
                            // Reindex the array to maintain proper JSON structure
                            $settings['fodls'] = array_values($settings['fodls']);
                            $file->settings = $settings;
                            $file->save();
                        }
                    }
                }

                // Delete the Fodl record from the fodl table
                $fodl->delete();
            }

            // Commit the transaction
            \DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'FODL records deleted and archived successfully.'
            ], 200);
        } catch (\Exception $e) {
            // Rollback the transaction in case of any errors
            \DB::rollBack();

            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while deleting the FODL records.'
            ], 500);
        }
    }
}