<?php

namespace App\Http\Controllers;

use App\Models\FinishedGood;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FinishedGoodController extends ApiController
{
    public function retrieveAll()
    {
        try {
            $allRecords = FinishedGood::all();
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
            'fg_id',
            'fodl_id',
            'fg_code',
            'fg_desc',
            'total_cost',
            'total_batch_qty',
            'rm_cost',
            'fg_price',
            'unit',
            'monthYear',
            'formulation_no',
            'is_least_cost',
        ];

        $col = $request->query('col');
        $value = $request->query('value');

        if (!in_array($col, $allowedColumns)) {
            $this->status = 400;
            return $this->getResponse("Invalid column specified.");
        }

        try {
            $records = FinishedGood::where($col, $value)->get();

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
        // Allowed columns for filtering
        $allowedColumns = [
            'fg_id',
            'fodl_id',
            'fg_code',
            'fg_desc',
            'total_cost',
            'total_batch_qty',
            'rm_cost',
            'fg_price',
            'unit',
            'monthYear',
            'formulation_no',
            'is_least_cost',
        ];

        $col = $request->query('col');
        $value = $request->query('value');

        // Validate column
        if (!in_array($col, $allowedColumns)) {
            $this->status = 400;
            return $this->getResponse("Invalid column specified.");
        }

        try {
            $record = FinishedGood::where($col, $value)->first();

            if (!$record) {
                $this->status = 404;
                return $this->getResponse("No record found.");
            }

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
            'fg_id',
            'fodl_id',
            'fg_code',
            'fg_desc',
            'total_cost',
            'total_batch_qty',
            'rm_cost',
            'fg_price',
            'unit',
            'monthYear',
            'formulation_no',
            'is_least_cost',
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
            $records = FinishedGood::whereIn($col, $values)->get();
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

    // public function updateBatch(Request $request)
    // {
    //     $rules = [
    //         'data' => 'required|array|min:1',
    //         'data.*.fg_code' => 'required|string|exists:finished_goods,fg_code',
    //         'data.*.fg_desc' => 'required|string',
    //         'data.*.unit' => 'required|string',
    //     ];

    //     $validator = Validator::make($request->all(), $rules);

    //     if ($validator->fails()) {
    //         $this->status = 422;
    //         $this->response['errors'] = $validator->errors();
    //         return $this->getResponse("Validation failed.");
    //     }

    //     $updatedRecords = [];
    //     $failedRecords = [];

    //     \DB::beginTransaction();

    //     try {
    //         foreach ($request->input('data') as $record) {
    //             $fg = FinishedGood::where('fg_code', $record['fg_code'])->first();

    //             if ($fg) {
    //                 $fg->fg_desc = $record['fg_desc'];
    //                 $fg->unit = $record['unit'];
    //                 $fg->save();

    //                 $updatedRecords[] = $fg;
    //             } else {
    //                 $failedRecords[] = [
    //                     'fg_code' => $record['fg_code'],
    //                     'message' => 'Finished Good record not found.',
    //                 ];
    //             }
    //         }

    //         if (count($failedRecords) > 0) {
    //             \DB::rollBack();
    //             $this->status = 400;
    //             $this->response['failed_records'] = $failedRecords;
    //             return $this->getResponse("Some records failed to update.");
    //         }

    //         // Commit the transaction
    //         \DB::commit();

    //         $this->status = 200;
    //         $this->response['data'] = $updatedRecords;
    //         return $this->getResponse("Finished Goods records updated successfully.");
    //     } catch (\Exception $e) {
    //         // Rollback the transaction on error
    //         \DB::rollBack();
    //         $this->status = 500;
    //         $this->response['message'] = $e->getMessage();
    //         return $this->getResponse("An error occurred while updating records.");
    //     }
    // }
}