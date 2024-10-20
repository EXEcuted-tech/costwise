<?php

namespace App\Helpers;

use DateTime;
use InvalidArgumentException;
use Illuminate\Support\Facades\Log;

class DateHelper
{
    public static function convertMonthYearStrToInt($monthYearStr)
    {
        $pattern = '/for the month of\s+([A-Za-z]+)\s+(\d{4})/i';
        if (preg_match($pattern, $monthYearStr, $matches)) {
            $monthName = $matches[1];
            $year = $matches[2];
            $monthNum = date('m', strtotime($monthName));
            $result = $year . $monthNum;
            return (int) $result;
        } else {
            throw new InvalidArgumentException("Invalid month-year string format.");
        }
    }

    public static function formatMonthYear($yyyymm)
    {
        if (is_null($yyyymm) || !is_int($yyyymm)) {
            return 'Invalid Date';
        }

        $year = floor($yyyymm / 100);
        $month = $yyyymm % 100;

        if ($month < 1 || $month > 12) {
            return 'Invalid Date';
        }

        $date = DateTime::createFromFormat('Y-m', "$year-$month");

        if ($date) {
            return $date->format('F Y');
        }

        return 'Invalid Date'; // Change this to getResponse soon
    }

    public static function formatMonth($yyyymm)
    {
        if (is_null($yyyymm) || !is_int($yyyymm)) {
            return 'Invalid Date';
        }
    
        $year = floor($yyyymm / 100);
        $month = $yyyymm % 100;
    
        if ($month < 1 || $month > 12) {
            return 'Invalid Date';
        }
    
        // Create a DateTime object using the year and month
        $date = DateTime::createFromFormat('Y-m', "$year-$month");
    
        if ($date) {
            // Return only the month name (e.g., "January")
            return $date->format('F');
        }
    
        return 'Invalid Date'; // Change this to getResponse soon
    }
}

