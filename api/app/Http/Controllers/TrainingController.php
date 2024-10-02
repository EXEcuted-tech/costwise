<?php

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Training;

class TrainingController extends ApiController
{
    public function uploadTrainingData(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'material_code' => 'required',
                    'material_desc' => 'required',
                    'unit' => 'required',
                    'date' => 'required'
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['error'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $validatedData = $validator->validated();
            $model = Training::create($validatedData);
            $this->response['data'] = $model;
            return $this->getResponse("Data Successfully Uploaded");
        } catch (\Throwable $th) {
            $this->status = $th->getCode();
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }
}
