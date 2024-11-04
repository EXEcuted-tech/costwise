<?php

namespace App\Http\Controllers;

use App\Models\FinishedGood;
use App\Models\Fodl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Helpers\DateHelper;
use Illuminate\Support\Facades\Log;

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
        $allowedColumns = [
            'fg_id',
            'fodl_id',
            'fg_code',
            'fg_desc',
            'total_cost',
            'total_batch_qty',
            'rm_cost',
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
        $allowedColumns = [
            'fg_id',
            'fodl_id',
            'fg_code',
            'fg_desc',
            'total_cost',
            'total_batch_qty',
            'rm_cost',
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

    public function update(Request $request)
    {
        $rules = [
            'fg_code' => 'required|string|exists:finished_goods,fg_code',
            'fg_desc' => 'required|string|max:255',
            'total_batch_qty' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'formulation_no' => 'required|integer|min:1',
        ];

        $messages = [
            'fg_code.required' => 'The finished good code is required.',
            'fg_code.exists' => 'The specified finished good code does not exist.',
            'fg_desc.required' => 'The finished good description is required.',
            'total_batch_qty.required' => 'The total batch quantity is required.',
            'total_batch_qty.numeric' => 'The total batch quantity must be a number.',
            'unit.required' => 'The unit is required.',
            'formulation_no.required' => 'The formulation number is required.',
            'formulation_no.integer' => 'The formulation number must be an integer.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            $this->status = 422;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Incorrect/Lacking input details!");
        }

        $fg_id = $request->input('fg_id');
        $fg_code = $request->input('fg_code');
        $fg_desc = $request->input('fg_desc');
        $total_batch_qty = $request->input('total_batch_qty');
        $unit = $request->input('unit');
        $formulation_no = $request->input('formulation_no');

        try {
            $finishedGood = FinishedGood::where('fg_id', $fg_id)->first();

            if (!$finishedGood) {
                $this->status = 404;
                return $this->getResponse("Finished Good not found.");
            }

            $finishedGood->fg_code = $fg_code;
            $finishedGood->fg_desc = $fg_desc;
            $finishedGood->total_batch_qty = $total_batch_qty;
            $finishedGood->unit = $unit;
            $finishedGood->formulation_no = $formulation_no;
            $finishedGood->save();

            $this->status = 200;
            $this->response['data'] = $finishedGood;
            return $this->getResponse("Finished Good updated successfully.");
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse("An error occurred while updating the Finished Good.");
        }
    }

    public function updateOrCreate(Request $request)
    {
        $rules = [
            'fg_code' => 'required|string|exists:finished_goods,fg_code',
            'fg_desc' => 'required|string|max:255',
            'total_batch_qty' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'formulation_no' => 'required|integer|min:1',
        ];

        $messages = [
            'fg_code.required' => 'The finished good code is required.',
            'fg_code.exists' => 'The specified finished good code does not exist.',
            'fg_desc.required' => 'The finished good description is required.',
            'total_batch_qty.required' => 'The total batch quantity is required.',
            'total_batch_qty.numeric' => 'The total batch quantity must be a number.',
            'unit.required' => 'The unit is required.',
            'formulation_no.required' => 'The formulation number is required.',
            'formulation_no.integer' => 'The formulation number must be an integer.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            $this->status = 422;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Incorrect/Lacking input details!");
        }

        $fg_id = $request->input('fg_id');
        $fg_code = $request->input('fg_code');
        $fg_desc = $request->input('fg_desc');
        $total_batch_qty = $request->input('total_batch_qty');
        $unit = $request->input('unit');
        $formulation_no = $request->input('formulation_no');

        try {
            $finishedGood = FinishedGood::where('fg_id', $fg_id)->first();
            if (!$finishedGood) {
                $existingFinishedGood = FinishedGood::where('fg_code', $fg_code)
                    ->where('fg_desc', $fg_desc)
                    ->first();

                $finishedGood = FinishedGood::create([
                    'fodl_id' => $existingFinishedGood ? $existingFinishedGood->fodl_id : null,
                    'fg_code' => $fg_code,
                    'fg_desc' => $fg_desc,
                    'total_batch_qty' => $total_batch_qty,
                    'unit' => $unit,
                    'formulation_no' => $formulation_no,
                    'monthYear' => $existingFinishedGood ? $existingFinishedGood->monthYear : date('Ym'),
                ]);

                $this->status = 201;
                $this->response['data'] = $finishedGood;
                return $this->getResponse("Finished Good created successfully.");
            }

            $finishedGood->fg_code = $fg_code;
            $finishedGood->fg_desc = $fg_desc;
            $finishedGood->total_batch_qty = $total_batch_qty;
            $finishedGood->unit = $unit;
            $finishedGood->formulation_no = $formulation_no;
            $finishedGood->save();

            $this->status = 200;
            $this->response['data'] = $finishedGood;
            return $this->getResponse("Finished Good updated successfully.");
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse("An error occurred while updating the Finished Good.");
        }
    }

    public function create(Request $request)
    {
        $rules = [
            'fg_code' => 'required|string|exists:finished_goods,fg_code',
            'fg_desc' => 'required|string|max:255',
            'total_batch_qty' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'formulation_no' => 'required|integer|min:1',
        ];

        $messages = [
            'fg_code.required' => 'The finished good code is required.',
            'fg_code.exists' => 'The specified finished good code does not exist.',
            'fg_desc.required' => 'The finished good description is required.',
            'total_batch_qty.required' => 'The total batch quantity is required.',
            'total_batch_qty.numeric' => 'The total batch quantity must be a number.',
            'unit.required' => 'The unit is required.',
            'formulation_no.required' => 'The formulation number is required.',
            'formulation_no.integer' => 'The formulation number must be an integer.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            $this->status = 422;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Incorrect/Lacking input details!");
        }

        $fg_code = $request->input('fg_code');
        $fg_desc = $request->input('fg_desc');
        $total_batch_qty = $request->input('total_batch_qty');
        $unit = $request->input('unit');
        $formulation_no = $request->input('formulation_no');

        try {
            $finishedGood = new FinishedGood();
            $finishedGood->fg_code = $fg_code;
            $finishedGood->fg_desc = $fg_desc;
            $finishedGood->total_batch_qty = $total_batch_qty;
            $finishedGood->unit = $unit;
            $finishedGood->formulation_no = $formulation_no;
            $finishedGood->monthYear = date('Ym');
            $matchingFodl = Fodl::where('fg_code', $fg_code)
                ->where('monthYear', $finishedGood->monthYear)
                ->first();

            $finishedGood->fodl_id = $matchingFodl?->fodl_id;

            $finishedGood->save();

            $this->status = 201;
            $this->response['fg_id'] = $finishedGood->fg_id;
            return $this->getResponse("Finished Good created successfully.");
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse("An error occurred while updating the Finished Good.");
        }
    }

    public function getAverageCost()
    {
        try {
            $currentMonthYear = now()->format('Ym');
            $previousMonthYear = now()->subMonth()->format('Ym');

            $currentAverage = FinishedGood::where('is_least_cost', 1)
                ->where('monthYear', $currentMonthYear)
                ->avg('total_cost');

            $previousAverage = FinishedGood::where('is_least_cost', 1)
                ->where('monthYear', $previousMonthYear)
                ->avg('total_cost');

            $percentageChange = 0;
            $trend = 'unchanged';

            if ($previousAverage > 0) {
                $percentageChange = (($currentAverage - $previousAverage) / $previousAverage) * 100;
                $trend = $percentageChange > 0 ? 'increased' : ($percentageChange < 0 ? 'decreased' : 'unchanged');
            }

            $this->status = 200;
            $this->response['average_cost'] = $currentAverage;
            $this->response['percentage_change'] = round($percentageChange, 2);
            $this->response['trend'] = $trend;

            return $this->getResponse("Average costs for least cost products retrieved successfully.");
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse("An error occurred while retrieving average costs.");
        }
    }

    public function retrieveAllFGData(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'monthYear' => 'required',
        ]);

        if ($validator->fails()) {
            $this->status = 400;
            return $this->getResponse($validator->errors()->first());
        }

        try {
            $monthYear = $request->input('monthYear');

            $fgData = FinishedGood::where('is_least_cost', 1)
                ->where('monthYear', $monthYear)
                ->get();

            if ($fgData->isEmpty()) {
                $this->status = 404;
                $this->response['message'] = 'No finished goods found for the specified criteria.';
                return $this->getResponse();
            }

            $fodlIds = $fgData->pluck('fodl_id');

            $fodlData = Fodl::whereIn('fodl_id', $fodlIds)->get();

            $fullfgData = $fgData->map(function ($finishedGood) use ($fodlData) {

                $fodl = $fodlData->firstWhere('fodl_id', $finishedGood->fodl_id);
                return [
                    'fg_id' => $finishedGood->fg_id,
                    'fodl_id' => $finishedGood->fodl_id,
                    'fg_code' => $finishedGood->fg_code,
                    'fg_desc' => $finishedGood->fg_desc,
                    'rm_cost' => $finishedGood->rm_cost,
                    'formulation_no' => $finishedGood->formulation_no,
                    'monthYear' => $finishedGood->monthYear,
                    'factory_overhead' => $fodl->factory_overhead,
                    'direct_labor' => $fodl->direct_labor,
                    'total_cost' => $finishedGood->total_cost,
                ];
            });

            $this->status = 200;
            $this->response['data'] = $fullfgData;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse();
        }
    }
}
