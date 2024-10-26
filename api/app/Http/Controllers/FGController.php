<?php

namespace App\Http\Controllers;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\FinishedGoods;

class FGController extends ApiController
{
    public function upLoadFG(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'fodl_id' => 'required',
                    'fg_code' => 'required',
                    'fg_desc' => 'required',
                    'cost' => 'required|numeric',
                    'monthYear' => 'required',
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['error'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $validatedData = $validator->validated();

            $fg = FinishedGoods::create($validatedData);
            if (!$fg) {
                $this->status = 500;
                $this->response['message'] = "Failed to upload finished goods.";
                return $this->getResponse();
            }
            $this->status = 200;
            $this->response['data'] = $fg;
            return $this->getResponse("Finished Goods Successfully Uploaded");
        } catch (\Throwable $th) {
            $this->status = ($th->getCode() > 0) ? $th->getCode() : 500;
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }
    public function getFGData(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'monthYear' => 'required'
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['error'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $fg = FinishedGoods::where('monthYear', $request->monthYear)->get();

            $this->status = 201;
            $this->response['data'] = $fg;
            return $this->getResponse("Final Goods retrieved successfully.");
        } catch (\Throwable $th) {
            $this->status = $th->getCode();
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }
}
