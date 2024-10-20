<?php

namespace App\Http\Controllers;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\MLModel;

class ModelController extends ApiController
{
    public function uploadModel(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'model_name' => 'required',
                    'model_data' => 'required'
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['error'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $validatedData = $validator->validated();

            $model = MLModel::create($validatedData);
            $this->status = 200;
            $this->response['data'] = $model;
            return $this->getResponse("Model Successfully Uploaded");
        } catch (\Throwable $th) {
            $this->status = $th->getCode();
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }

    public function getModel(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'model_id' => 'required|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                    'message' => 'Incorrect input details.'
                ], 400);
            }

            $model = MLModel::find($request->model_id);

            if (!$model) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Model not found.'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $model,
                'message' => 'Model retrieved successfully.'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage()
            ], 500);
        }
    }
}
