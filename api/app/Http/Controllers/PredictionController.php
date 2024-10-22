<?php

namespace App\Http\Controllers;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Prediction;

class PredictionController extends ApiController
{

    public function uploadPrediction(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'product_num' => 'required',
                    'product_name' => 'required',
                    'cost' => 'required',
                    'monthYear' => 'required'
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['error'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $validatedData = $validator->validated();
            $prediction = Prediction::create($validatedData);

            $this->status = 200;
            $this->response['data'] = $prediction;
            $this->response['message'] = "Prediction records updated successfully.";
        } catch (\Throwable $th) {
            $this->status = 500;
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }

    public function getPrediction(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'numberOfProducts' => 'required|integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                    'message' => 'Incorrect input details.'
                ], 400);
            }

            $numberOfPredictions = $request->numberOfProducts * 3;

            $predictions = Prediction::orderBy('prediction_id', 'desc')->take($numberOfPredictions)->get();

            if ($predictions->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No predictions found.'
                ], 404);
            }
            $predictions = $predictions->sortBy('prediction_id')->values()->all();

            return response()->json([
                'status' => 'success',
                'data' => $predictions,
                'message' => 'Predictions retrieved successfully.'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function getCurrentPrediction(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'monthYear' => 'required|string'
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['error'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $validatedData = $validator->validated();
            $monthYear = $validatedData['monthYear'];

            $prediction = Prediction::where('monthYear', $monthYear)->get();

            if ($prediction) {
                // If a prediction is found, return it
                $this->status = 200;
                $this->response['data'] = $prediction;
                $this->response['message'] = "Prediction retrieved successfully.";
            } else {
                $this->status = 404;
                $this->response['message'] = "No prediction records found for the given monthYear.";
            }

            return $this->getResponse();
        } catch (\Throwable $th) {
            $this->status = 500;
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }


    public function getAllData() {}
}
