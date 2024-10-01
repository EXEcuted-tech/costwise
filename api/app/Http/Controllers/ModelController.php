<?php

namespace App\Http\Controllers;

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
            $validator = Validator::make(
                $request->all(),
                [
                    'model_id' => 'required', // Ensure model_id exists
                ]
            );

            // Handle validation failure
            if ($validator->fails()) {
                $this->status = 400;  // 400 for bad request
                $this->response['errors'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $model = MLModel::find($request->model_id);

            if (!$model) {
                $this->status = 404;
                return $this->getResponse("Model not found.");
            }

            $this->status = 200;
            $this->response['data'] = $model;
            return $this->getResponse("Model retrieved successfully.");
        } catch (\Throwable $th) {
            $this->status = $th->getCode() ?: 500;
            $this->response['message'] = $th->getMessage();
            return $this->getResponse("An error occurred while retrieving the model.");
        }
    }
}
