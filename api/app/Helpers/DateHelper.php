<?php

function convertMonthYearStrToInt($monthYearStr) {
    $pattern = '/the month of\s+([A-Za-z]+)\s+(\d{4})/i';

    if (preg_match($pattern, $monthYearStr, $matches)) {
        $monthName = $matches[1];
        $year = $matches[2];
        $monthNum = date('m', strtotime($monthName));
        $result = $year . $monthNum;
        return (int)$result;
    } else {
        throw new InvalidArgumentException("Invalid month-year string format.");
    }
}
