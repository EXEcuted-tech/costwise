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
            $monthMapping = [
                'January' => '01', 'February' => '02', 'March' => '03',
                'April' => '04', 'May' => '05', 'June' => '06',
                'July' => '07', 'August' => '08', 'September' => '09',
                'October' => '10', 'November' => '11', 'December' => '12'
            ];
            $monthNum = $monthMapping[$monthName] ?? null;
            if ($monthNum === null) {
                throw new InvalidArgumentException("Invalid month name: $monthName");
            }
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

        $monthMapping = [
            1 => 'January', 2 => 'February', 3 => 'March',
            4 => 'April', 5 => 'May', 6 => 'June',
            7 => 'July', 8 => 'August', 9 => 'September',
            10 => 'October', 11 => 'November', 12 => 'December'
        ];

        $monthName = $monthMapping[$month] ?? null;
        if ($monthName === null) {
            return 'Invalid Date';
        }

        return $monthName . ' ' . $year;
    }

    public static function formatMonth($yyyymm)
    {
        if (is_null($yyyymm) || !is_int($yyyymm)) {
            return 'Invalid Date';
        }
    
        $month = $yyyymm % 100;
    
        if ($month < 1 || $month > 12) {
            return 'Invalid Date';
        }
    
        $monthMapping = [
            1 => 'January', 2 => 'February', 3 => 'March',
            4 => 'April', 5 => 'May', 6 => 'June',
            7 => 'July', 8 => 'August', 9 => 'September',
            10 => 'October', 11 => 'November', 12 => 'December'
        ];

        return $monthMapping[$month] ?? 'Invalid Date';
    }
}

