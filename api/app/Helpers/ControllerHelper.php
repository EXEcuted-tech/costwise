<?php

namespace App\Helpers;

use App\Models\Fodl;

class ControllerHelper 
{
    public static function findOrCreateFODL($monthYearInt, $factoryOverhead, $directLabor, $fgCode)
    {
        $fodl = Fodl::where('monthYear', $monthYearInt)
            ->where('factory_overhead', $factoryOverhead)
            ->where('direct_labor', $directLabor)
            ->first();
    
        if (!$fodl) {
            $fodl = Fodl::create([
                'fg_code' => $fgCode,
                'monthYear' => $monthYearInt,
                'factory_overhead' => $factoryOverhead,
                'direct_labor' => $directLabor,
            ]);
        }
    
        return $fodl;
    }
    
}

