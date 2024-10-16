<?php

namespace App\Http\Controllers;

use App\Helpers\DateHelper;
use App\Models\FinishedGood;
use App\Models\Fodl;
use App\Models\Formulation;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Illuminate\Support\Facades\Log;

class CostCalcController extends ApiController
{
    public function retrieveAll()
    {
        try {
            $allRecords = Formulation::all();

            $this->status = 200;
            $this->response['data'] = $allRecords;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse("An error occurred while retrieving the records.");
        }
    }



    public function retrieveMonthYearOptions()
    {
       try {
            $monthYearOptions = FinishedGood::select('monthYear')
                ->distinct()
                ->orderBy('monthYear', 'desc')
                ->pluck('monthYear')
                ->toArray();

            Log::info($monthYearOptions);

            $formattedOptions = array_map(function($monthYear) {
                return [
                    'value' => $monthYear,
                    'label' => DateHelper::formatMonthYear($monthYear)
                ];
            }, $monthYearOptions);

            Log::info($formattedOptions);

            $this->status = 200;
            $this->response['data'] = $formattedOptions;
            return $this->getResponse();
       } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse("An error occurred while retrieving the month and year options.");
       }
    }
}
