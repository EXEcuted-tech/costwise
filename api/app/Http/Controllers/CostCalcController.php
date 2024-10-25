<?php

namespace App\Http\Controllers;

use App\Helpers\DateHelper;
use App\Models\File;
use App\Models\FinishedGood;
use App\Models\Fodl;
use App\Models\Formulation;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Illuminate\Support\Facades\Log;

class CostCalcController extends ApiController
{

    //Retrieve available monthYear options
    public function retrieveMonthYearOptions()
    {
        try {
            $monthYearOptions = FinishedGood::select('monthYear')
                ->distinct()
                ->orderBy('monthYear', 'desc')
                ->pluck('monthYear')
                ->toArray();

            $formattedOptions = array_map(function ($monthYear) {
                return [
                    'value' => $monthYear,
                    'label' => DateHelper::formatMonthYear($monthYear)
                ];
            }, $monthYearOptions);

            $this->status = 200;
            $this->response['data'] = $formattedOptions;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse("An error occurred while retrieving the month and year options.");
        }
    }

    //Retrieve FG options
    public function retrieveFGOptions(Request $request)
    {
        $monthYear = $request->query('monthYear');

        try {
            $fgOptions = FinishedGood::where('is_least_cost', 1)
                ->where('monthYear', $monthYear)
                ->get();

            $this->status = 200;
            $this->response['data'] = $fgOptions;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse("An error occurred while retrieving the FG options.");
        }
    }

    public function retrieveFGDetails(Request $request)
    {
        $fg_id = $request->query('fg_id');

        try {

            $fgRecord = FinishedGood::where('fg_id', $fg_id)->first();

            //Retrieve formulation
            $formulation = Formulation::where('formulation_id', $fgRecord->formulation_no)->first();
            $materialQtyList = json_decode($formulation->material_qty_list);

            //Store fg data
            $fgData = [
                'formulation_no' => $fgRecord->formulation_no,
                'code' => $fgRecord->fg_code,
                'desc' => $fgRecord->fg_desc,
                'batch_qty' => $fgRecord->total_batch_qty,
                'unit' => $fgRecord->unit,
                'rm_cost' => $fgRecord->rm_cost,
                'total_cost' => $fgRecord->total_cost,
                'components' => []
            ];

            //Retrieve emulsion data
            $emulsion = json_decode($formulation->emulsion);
            if ($emulsion) {
                $fgData['components'][] = [
                    'level' => $emulsion->level,
                    'qty' => $emulsion->batch_qty,
                    'unit' => $emulsion->unit,
                ];
            } else {
                $fgData['components'][] = []; //empty
            }

            //Retrieve list of materials
            foreach ($materialQtyList as $index => $materialItem) {
                $materialId = key($materialItem);
                $details = current($materialItem);

                try {
                    $materialRecord = Material::find($materialId);
                    if ($materialRecord) {
                        $fgData['components'][] = [
                            'level' => $details->level,
                            'item_code' => $materialRecord->material_code,
                            'description' => $materialRecord->material_desc,
                            'batch_quantity' => $details->qty,
                            'unit' => $materialRecord->unit,
                            'cost' => $materialRecord->material_cost,
                            'total_cost' => $details->total_cost
                        ];
                    } else {
                        throw new \Exception("Material Record not found for ID: $materialId");
                    }
                } catch (\Exception $e) {
                    throw new \Exception("Error processing material item: " . $e->getMessage());
                }
            }

            $this->status = 200;
            $this->response['data'] = $fgData;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse("An error occurred while retrieving the FG details.");
        }
    }


    //Exporting
    public function export(Request $request)
    {
        $fileName = $request->input('file_name');
        $data = $request->input('data');
        $exportType = $request->input('export_type');
        $selectedFG = $request->input('selected_fg');

        $spreadsheet = new Spreadsheet();

        $spreadsheet->removeSheetByIndex(0);

        if ($exportType === 'xlsx') {
            if ($selectedFG === 'Specific-FG') {
                foreach ($data as $fg) {
                    $this->addSpecifiedFGSheet($spreadsheet, $fg);
                }
            } else {
                $this->addAllFGSheet($spreadsheet, $data);
            }

            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $tempFile = tempnam(sys_get_temp_dir(), $fileName);
            $writer->save($tempFile);

            return response()->download($tempFile, $fileName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition' => 'attachment; filename="' . $fileName . '.xlsx"',
            ])->deleteFileAfterSend(true);
        } else if ($exportType === 'csv') {
            if ($selectedFG === 'Specific-FG') {
                $headers = array(
                    'Content-Type' => 'text/csv',
                    'Content-Disposition' => 'attachment; filename="' . $fileName . '.csv"',
                );

                $callback = function () use ($data) {
                    $handle = fopen('php://output', 'w');

                    fputcsv($handle, ["Formula", "Level", "Item Code", "Description", "Batch Qty", "Unit", "Cost", "Total Cost"]);

                    foreach ($data as $fg) {
                        // Write FG row
                        fputcsv($handle, [
                            $fg['formulation_no'],
                            1,
                            $fg['code'],
                            $fg['desc'],
                            $fg['batch_qty'],
                            $fg['unit'],
                            $fg['rm_cost'],
                            $fg['total_cost']
                        ]);

                        // Write component rows
                        foreach ($fg['components'] as $component) {
                            fputcsv($handle, [
                                '',
                                $component['level'] ?? '',
                                $component['item_code'] ?? '',
                                $component['description'] ?? 'EMULSION',
                                $component['batch_quantity'] ?? $component['qty'] ?? '',
                                $component['unit'] ?? '',
                                $component['cost'] ?? '',
                                $component['total_cost'] ?? ''
                            ]);
                        }
                    }
                    fclose($handle);
                };

                return response()->stream($callback, 200, $headers);
            } else {
                $headers = array(
                    'Content-Type' => 'text/csv',
                    'Content-Disposition' => 'attachment; filename="' . $fileName . '.csv"',
                );

                $callback = function () use ($data) {
                    $handle = fopen('php://output', 'w');

                    $monthYear = DateHelper::formatMonthYear($data[0]['monthYear']);
                    fputcsv($handle, ['Cost Calculation for the month of ' . $monthYear]);

                    fputcsv($handle, []);

                    $headersRow = ['Item Code', 'Item Description', 'RM Cost', 'Factory Overhead', 'Direct Labor', 'TOTAL'];
                    fputcsv($handle, $headersRow);

                    foreach ($data as $fg) {
                        fputcsv($handle, [
                            $fg['fg_code'],
                            $fg['fg_desc'],
                            $fg['rm_cost'],
                            $fg['factory_overhead'],
                            $fg['direct_labor'],
                            $fg['total_cost']
                        ]);
                    }

                    fclose($handle);
                };

                return response()->stream($callback, 200, $headers);
            }
        }
    }

    private function addSpecifiedFGSheet($spreadsheet, $data)
    {
        $sheet = $spreadsheet->createSheet();
        $fg = $data;

        $sheet->setTitle("{$fg['desc']}");

        $headers = ["Formula", "Level", "Item Code", "Description", "Batch Qty", "Unit", "Cost", "Total Cost"];

        $sheet->fromArray($headers, NULL, 'A1');
        $sheet->getStyle('A1:H1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
        $sheet->freezePane('A2');

        $sheet->getColumnDimension('A')->setWidth(10);
        $sheet->getColumnDimension('B')->setWidth(8.71);
        $sheet->getColumnDimension('C')->setWidth(11.5);
        $sheet->getColumnDimension('D')->setWidth(56.43);
        $sheet->getColumnDimension('E')->setWidth(12.29);
        $sheet->getColumnDimension('F')->setWidth(12.29);

        $sheet->getStyle('A1:H1')->getFont()->setBold(true)->setSize(8)->setName('Open Sans');
        $sheet->setAutoFilter('B1:H1');

        $row = 2;

        //Add FG Row
        $sheet->setCellValue("A$row", $fg['formulation_no']);
        $sheet->setCellValue("B$row", 1);
        $sheet->setCellValue("C$row", $fg['code']);
        $sheet->setCellValue("D$row", $fg['desc']);
        $sheet->setCellValue("E$row", $fg['batch_qty']);
        $sheet->setCellValue("F$row", $fg['unit']);
        $sheet->setCellValue("G$row", $fg['rm_cost']);
        $sheet->setCellValue("H$row", $fg['total_cost']);

        $sheet->getStyle("A$row:H$row")->getFill()->setFillType(Fill::FILL_SOLID);
        $sheet->getStyle("A$row:H$row")->getFill()->getStartColor()->setRGB('FFEBEB');
        $sheet->getStyle("A$row:H$row")->getFont()->setSize(8)->setName('Open Sans');
        $row++;

        // Add components
        foreach ($fg['components'] as $component) {
            $sheet->setCellValue("A$row", "");
            $sheet->setCellValue("B$row", $component['level']);
            $sheet->setCellValue("C$row", $component['item_code'] ?? "");

            if (!isset($component['description']) && isset($component['qty'])) {
                $sheet->setCellValue("D$row", "EMULSION");
                $sheet->setCellValue("E$row", $component['qty']);
            } else {
                $sheet->setCellValue("D$row", $component['description'] ?? "");
                $sheet->setCellValue("E$row", $component['batch_quantity'] ?? "");
            }

            $sheet->setCellValue("F$row", $component['unit']);
            $sheet->setCellValue("G$row", $component['cost'] ?? "");
            $sheet->setCellValue("H$row", $component['total_cost'] ?? "");
            $sheet->getStyle("A$row:H$row")->getFont()->setSize(8)->setName('Open Sans');
            $row++;
        }

        // Apply number formatting
        $sheet->getStyle('E2:E' . ($row - 1))->getNumberFormat()->setFormatCode('0.00');
        $sheet->getStyle('G2:H' . ($row - 1))->getNumberFormat()->setFormatCode('0.00');
    }

    private function addAllFGSheet($spreadsheet, $data)
    {
        $monthYear = DateHelper::formatMonthYear($data[0]['monthYear']);
        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle('Cost Calculation Summary');

        $sheet->setShowGridlines(false);

        $sheet->mergeCells('A1:F1');
        $sheet->setCellValue('A1', 'Summary of Product Costing');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(13)->setName('Arial')->getColor()->setRGB('B22222');

        $sheet->getRowDimension(1)->setRowHeight(16.5);
        $sheet->getRowDimension(4)->setRowHeight(39.5);

        $sheet->getColumnDimension('A')->setWidth(12.71);
        $sheet->getColumnDimension('B')->setWidth(19.43);
        $sheet->getColumnDimension('C')->setWidth(11.43);
        $sheet->getColumnDimension('D')->setWidth(19.29);
        $sheet->getColumnDimension('E')->setWidth(12.57);
        $sheet->getColumnDimension('F')->setWidth(11.43);
        
        $sheet->mergeCells('A2:F2');
        $sheet->setCellValue('A2', 'for the month of ' . $monthYear);
        $sheet->getStyle('A2')->getFont()->setSize(10)->setName('Arial')->setBold(true)->setItalic(true);

        $headers = ['Item Code', 'Item Description', 'RM Cost', 'Factory Overhead', 'Direct Labor', 'TOTAL'];
        $sheet->fromArray($headers, NULL, 'A4');

        $sheet->getStyle('A4:F4')->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_MEDIUM);
        $sheet->getStyle('A4:F4')->getFont()->setBold(true);
        $sheet->getStyle('A4:F4')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
        $sheet->freezePane('A5');

        $sheet->getColumnDimension('A')->setWidth(15);
        $sheet->getColumnDimension('B')->setWidth(25);
        $sheet->getColumnDimension('C')->setWidth(12);
        $sheet->getColumnDimension('D')->setWidth(15);
        $sheet->getColumnDimension('E')->setWidth(15);
        $sheet->getColumnDimension('F')->setWidth(12);

        $row = 5;
        foreach ($data as $fg) {
            $fgCode = $fg['fg_code'];
            $fgDesc = $fg['fg_desc'];
            $rmCost = $fg['rm_cost'];
            $factoryOverhead = $fg['factory_overhead'];
            $directLabor = $fg['direct_labor'];
            $totalCost = $fg['total_cost'];

            $sheet->setCellValue("A$row", $fgCode);
            $sheet->setCellValue("B$row", $fgDesc);
            $sheet->setCellValue("C$row", number_format($rmCost, 2));
            $sheet->setCellValue("D$row", number_format($factoryOverhead, 2));
            $sheet->setCellValue("E$row", number_format($directLabor, 2));
            $sheet->setCellValue("F$row", number_format($totalCost, 2));

            $sheet->getStyle("A$row:B$row")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $sheet->getStyle("C$row:F$row")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);

            // Add borders for each row
            $sheet->getStyle("A$row:F$row")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

            $row++;
        }

        // Auto-size columns A to F
        foreach (range('A', 'F') as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }
    }
}
