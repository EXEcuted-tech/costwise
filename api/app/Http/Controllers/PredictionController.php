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
            dump($validatedData);
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
                'monthYear' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                    'message' => 'Incorrect input details.'
                ], 400);
            }

            $prediction = Prediction::where('monthYear', $request->monthYear)->get();

            if (!$prediction) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Model not found.'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $prediction,
                'message' => 'Model retrieved successfully.'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function getAllData() {}
}
