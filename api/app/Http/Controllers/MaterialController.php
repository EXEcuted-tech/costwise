<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;

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
}