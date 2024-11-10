<?php

namespace App\Http\Controllers;

use App\Models\Bom;
use App\Models\File;
use App\Models\FinishedGood;
use App\Models\Fodl;
use App\Models\Formulation;
use App\Models\Inventory;
use App\Models\Material;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;

class TransactionController extends ApiController
{
    public function retrieveBatch(Request $request)
    {
        $allowedColumns = [
            'transaction_id',
            'material_id',
            'fg_id',
            'journal',
            'entry_num',
            'trans_desc',
            'project',
            'gl_account',
            'gl_desc',
            'warehouse',
            'date',
            'month',
            'year',
            'settings',
        ];

        $col = $request->input('col');
        $values = $request->input('values');

        $validator = Validator::make($request->all(), [
            'col' => 'required|string|in:' . implode(',', $allowedColumns),
            'values' => 'required|array|min:1',
        ]);

        if ($validator->fails()) {

            $this->status = 400;
            return $this->getResponse($validator->errors()->first());
        }

        try {
            $transactions = Transaction::whereIn($col, $values)->get();

            if ($transactions->isEmpty()) {
                $this->status = 404;
                return $this->getResponse("No records found.");
            }

            $result = $transactions->map(function ($transaction) {
                $relatedData = [];
                $decodedSettings = json_decode($transaction->settings);

                if (!is_null($transaction->material_id)) {
                    $material = Material::find($transaction->material_id);
                    $relatedData['material'] = $material?->toArray();
                    $relatedData['material']['material_cost'] = $material->material_cost * $decodedSettings->qty;
                }

                if (!is_null($transaction->fg_id)) {
                    $finishedGood = FinishedGood::find($transaction->fg_id);
                    $relatedData['finished_good'] = $finishedGood?->toArray();
                    $relatedData['finished_good']['rm_cost'] = $finishedGood->rm_cost * $finishedGood->total_batch_qty;
                }

                if (is_null($transaction->material_id) && is_null($transaction->fg_id)) {
                    $newAmount = ($decodedSettings->amount ?? 0) * ($decodedSettings->qty ?? 1);

                    $updatedSettings = $decodedSettings;
                    $updatedSettings->amount = $newAmount;

                    $transaction->settings = json_encode($updatedSettings);
                }

                return array_merge($transaction->toArray(), $relatedData);
            });

            $this->status = 200;
            $this->response['data'] = $result;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    public function updateBatch(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'transactions' => 'required|array',
            'transactions.*.transaction_id' => 'required|integer',
            'transactions.*.journal' => 'required|string',
            'transactions.*.entry_num' => 'required|string',
            'transactions.*.trans_desc' => 'required|string',
            'transactions.*.project' => 'required|string',
            'transactions.*.gl_account' => 'required|string',
            'transactions.*.gl_desc' => 'required|string',
            'transactions.*.warehouse' => 'required|string',
            'transactions.*.date' => 'required|date',
            'transactions.*.month' => 'required',
            'transactions.*.year' => 'required',
            'transactions.*.amount' => 'required|numeric',
            'transactions.*.qty' => 'required|numeric',
        ]);


        if ($validator->fails()) {
            $this->status = 422;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Incorrect/Lacking input details. Please follow the format!");
        }

        $transactions = $request->input('transactions');
        $fileId = $request->input('file_id');

        foreach ($transactions as $transactionData) {
            $settings = [];
            $transaction = Transaction::find($transactionData['transaction_id']);
            if ($transaction) {
                if ($transaction->material_id != null) {
                    $material = Material::find($transaction->material_id);
                    if ($material) {
                        $material->update([
                            'material_code' => $transactionData['item_code'] ?? $material->material_code,
                            'material_desc' => $transactionData['item_desc'] ?? $material->material_desc,
                            'material_cost' => $transactionData['amount'] / $transactionData['qty'] ?? $material->material_cost,
                            'unit' => $transactionData['unit_code'] ?? $material->unit,
                        ]);
                    }
                    $settings = ['qty' => $transactionData['qty'] ?? 0];
                }

                if ($transaction->fg_id != null) {
                    $fg = FinishedGood::find($transaction->fg_id);
                    if ($fg) {
                        $fg->update([
                            'fg_code' => $transactionData['item_code'] ?? $fg->fg_code,
                            'fg_desc' => $transactionData['item_desc'] ?? $fg->fg_desc,
                            'rm_cost' => $transactionData['amount'] / $transactionData['qty'] ?? $fg->rm_cost,
                            'unit' => $transactionData['unit_code'] ?? $fg->unit,
                        ]);
                    }
                    $settings = [];
                }

                if (!$transaction->material_id && !$transaction->fg_id) {
                    $itemCode = $transactionData['item_code'] ?? '';
                    $settings = [
                        'item_code' => $itemCode,
                        'item_desc' => $transactionData['item_desc'] ?? '',
                        'qty' => $transactionData['qty'] ?? 0,
                        'amount' => $transactionData['amount'] / $transactionData['qty'] ?? 0,
                        'unit' => $transactionData['unit_code'] ?? ''
                    ];
                }

                if (empty($settings)) {
                    $settings = new \stdClass();
                }

                $entryNum = $transactionData['entry_num'] ?? $transaction->entry_num;
                if (is_numeric($entryNum)) {
                    $entryNum = rtrim(rtrim($entryNum, '0'), '.');
                }

                $transaction->update([
                    'material_id' => $transactionData['material_id'] ?? $transaction->material_id,
                    'fg_id' => $transactionData['fg_id'] ?? $transaction->fg_id,
                    'journal' => $transactionData['journal'] ?? $transaction->journal,
                    'entry_num' => $entryNum,
                    'trans_desc' => $transactionData['trans_desc'] ?? $transaction->trans_desc,
                    'project' => $transactionData['project'] ?? $transaction->project,
                    'gl_account' => $transactionData['gl_account'] ?? $transaction->gl_account,
                    'gl_desc' => $transactionData['gl_desc'] ?? $transaction->gl_desc,
                    'warehouse' => $transactionData['warehouse'] ?? $transaction->warehouse,
                    'date' => $transactionData['date'] ?? $transaction->date,
                    'month' => $transactionData['month'] ?? $transaction->month,
                    'year' => $transactionData['year'] ?? $transaction->year,
                    'settings' => json_encode($settings) ?? $transaction->settings,
                ]);
            } else {
                if (!isset($transactionData['material_id']) && !isset($transactionData['fg_id'])) {
                    $itemCode = $transactionData['item_code'] ?? '';
                    if (str_starts_with($itemCode, 'RM') || str_starts_with($itemCode, 'SA')) {
                        $existingMaterial = Material::where('material_code', $itemCode)
                            ->where('inventory_record', 0)
                            ->first();
                        if ($existingMaterial) {
                            $transactionData['material_id'] = $existingMaterial->material_id;
                        } else {
                            $newMaterial = Material::create([
                                'material_code' => $itemCode,
                                'material_desc' => $transactionData['item_desc'] ?? '',
                                'material_cost' => $transactionData['amount']/$transactionData['qty'] ?? 0,
                                'unit' => $transactionData['unit_code'] ?? '',
                                'date' => $transactionData['date'] ? Carbon::parse($transactionData['date'])->format('Y-m-d') : now()->format('Y-m-d'),
                            ]);
                            $transactionData['material_id'] = $newMaterial->material_id;
                        }
                        $settings = ['qty' => $transactionData['qty'] ?? 0];
                    } elseif (str_starts_with($itemCode, 'EMULSION') || str_starts_with($itemCode, 'REWORK')) {
                        $settings = [
                            'item_code' => $itemCode,
                            'item_desc' => $transactionData['item_desc'] ?? '',
                            'qty' => $transactionData['qty'] ?? 0,
                            'amount' => $transactionData['amount']/$transactionData['qty'] ?? 0,
                            'unit' => $transactionData['unit_code'] ?? ''
                        ];
                    } else {
                        $existingFinishedGood = FinishedGood::where('fg_code', $itemCode)->first();
                        if ($existingFinishedGood) {
                            $transactionData['fg_id'] = $existingFinishedGood->fg_id;
                        } else {
                            $newFinishedGood = FinishedGood::create([
                                'fodl_id' => null,
                                'fg_code' => $itemCode,
                                'fg_desc' => $transactionData['item_desc'] ?? '',
                                'total_batch_qty' => $transactionData['qty'] ?? 0,
                                'rm_cost' => $transactionData['amount']/$transactionData['qty'] ?? 0,
                                'unit' => $transactionData['unit_code'] ?? '',
                                'monthYear' => Carbon::parse($transactionData['date'] ?? now())->format('Ym')
                            ]);
                            $transactionData['fg_id'] = $newFinishedGood->fg_id;
                        }
                        $settings = [];
                    }
                }

                if (empty($settings)) {
                    $settings = new \stdClass();
                }

                $entryNum = $transactionData['entry_num'] ?? null;
                if (is_numeric($entryNum)) {
                    $entryNum = rtrim(rtrim($entryNum, '0'), '.');
                }

                $transaction = Transaction::create([
                    'material_id' => $transactionData['material_id'] ?? null,
                    'fg_id' => $transactionData['fg_id'] ?? null,
                    'journal' => $transactionData['journal'] ?? null,
                    'entry_num' => $entryNum,
                    'trans_desc' => $transactionData['trans_desc'] ?? null,
                    'project' => $transactionData['project'] ?? null,
                    'gl_account' => $transactionData['gl_account'] ?? null,
                    'gl_desc' => $transactionData['gl_desc'] ?? null,
                    'warehouse' => $transactionData['warehouse'] ?? null,
                    'date' => $transactionData['date'] ?? null,
                    'month' => $transactionData['month'] ?? null,
                    'year' => $transactionData['year'] ?? null,
                    'settings' => json_encode($settings ?? new \stdClass()),
                ]);

                $file = File::find($fileId);
                if ($file) {
                    $fileSettings = json_decode($file->settings, true);
                    if (isset($fileSettings['transaction_ids'])) {
                        $fileSettings['transaction_ids'][] = $transaction->transaction_id;
                        $file->settings = json_encode($fileSettings);
                        $file->save();
                    }
                }
            }
        }

        $this->status = 200;
        return $this->getResponse('Transactions updated successfully!');
    }

    public static function deleteTransaction($transactionId)
    {
        $transaction = Transaction::find($transactionId);
        if (!$transaction) {
            return false;
        }

        if ($transaction->fg_id != null) {
            $fg = FinishedGood::find($transaction->fg_id);
            if ($fg) {
                $otherReferences = Transaction::where('fg_id', $fg->fg_id)
                    ->where('transaction_id', '!=', $transactionId)
                    ->exists();

                $formulationReferences = Formulation::where('fg_id', $fg->fg_id)->exists();

                if (!$otherReferences && !$formulationReferences) {
                    if (isset($fg['fodl_id']) && !Fodl::on('archive_mysql')->find($fg['fodl_id'])) {
                        unset($fg['fodl_id']);
                    }
                    $fgData = $fg->toArray();
                    unset($fgData['fg_id']);
                    $newFg = FinishedGood::on('archive_mysql')->create($fgData);
                    $transaction->fg_id = $newFg->fg_id;
                    $fg->delete();
                } else {
                    $transaction->fg_id = null;
                    $transaction->save();
                }
            }
        } else if ($transaction->material_id != null) {
            $material = Material::find($transaction->material_id);
            if ($material) {
                $otherReferences = Transaction::where('material_id', $material->material_id)
                    ->where('transaction_id', '!=', $transactionId)
                    ->exists();

                $masterFileReferences = Formulation::whereRaw("JSON_CONTAINS(material_qty_list, '{\"" . $material->material_id . "\":{}}', '$')")
                    ->exists();
                
                
                $settings = json_decode($transaction->settings, true);
                if ($transaction->settings && isset($settings['qty']) && $settings['qty'] < 0) {
                    $negativeQty = abs($settings['qty']);
                    $monthYear = Carbon::parse($transaction->date)->format('Y-m');

                    $inventoryFile = File::where('file_type', 'inventory_file')
                        ->whereRaw("JSON_EXTRACT(settings, '$.monthYear') = ?", [$monthYear])
                        ->first();

                    if ($inventoryFile) {
                        $fileSettings = json_decode($inventoryFile->settings, true);
                        $inventoryIds = $fileSettings['inventory_ids'] ?? [];
                        $inventory = Inventory::whereIn('inventory_id', $inventoryIds)
                            ->whereHas('material', function($query) use ($material) {
                                $query->where('material_code', $material->material_code);
                            })
                            ->first();

                        if ($inventory) {
                            $inventory->usage_qty -= $negativeQty;
                            if($inventory->usage_qty < 0) {
                                $inventory->usage_qty = 0;
                            }
                            $inventory->save();

                            $boms = Bom::where('created_at', '>=', Carbon::parse($transaction->date)->format('Y-m-01'))->get();
                            self::calculateLeastCost($boms);
                        }
                    }
                }

                if (!$otherReferences && !$masterFileReferences) {
                    $newMaterial = Material::on('archive_mysql')->create($material->toArray());
                    $transaction->material_id = $newMaterial->material_id;
                    $material->delete();
                } else {
                    $transaction->material_id = null;
                    $transaction->save();
                }
            }
        }

        Transaction::on('archive_mysql')->create($transaction->toArray());
        $transaction->delete();

        return true;
    }

    private static function calculateLeastCost($boms)
    {
        foreach ($boms as $bom) {
            $formulations = json_decode($bom->formulations, true);
            $leastCost = PHP_FLOAT_MAX;
            $leastCostFormulationId = null;

            foreach ($formulations as $formulationId) {
                $formulation = Formulation::findOrFail($formulationId);

                $materialQtyList = json_decode($formulation->material_qty_list, true);
                foreach ($materialQtyList as &$item) {
                    foreach ($item as &$data) {
                        if (isset($data['status'])) {
                            unset($data['status']);
                        }
                    }
                }
                $formulation->material_qty_list = json_encode($materialQtyList);
                $formulation->save();

                $finishedGood = FinishedGood::firstOrCreate(
                    ['fg_id' => $formulation->fg_id],
                );

                $totalMaterialCost = self::calculateFormulationCost($formulation) / $finishedGood->total_batch_qty;
                $finishedGood->update(['rm_cost' => $totalMaterialCost]);

                $fodl = Fodl::where('fodl_id', $finishedGood->fodl_id)->first();
                $totalCost = $totalMaterialCost + ($fodl->factory_overhead ?? 0) + ($fodl->direct_labor ?? 0);
                $finishedGood->update(['total_cost' => $totalCost]);
                $finishedGood->update(['is_least_cost' => false]);

                if ($totalMaterialCost < $leastCost) {
                    $leastCost = $totalMaterialCost;
                    $leastCostFormulationId = $formulationId;
                }
            }

            if ($leastCostFormulationId) {
                $leastCostFormulation = Formulation::findOrFail($leastCostFormulationId);
                $leastCostFinishedGood = FinishedGood::where('fg_id', $leastCostFormulation->fg_id)->first();

                if ($leastCostFinishedGood) {
                    $leastCostFinishedGood->update(['is_least_cost' => true]);
                }
            }
        }
    }

    private static function calculateFormulationCost($formulation)
    {
        $materialQtyList = json_decode($formulation->material_qty_list, true);

        $totalCost = 0;

        foreach ($materialQtyList as $item) {
            foreach ($item as $materialId => $data) {
                $material = Material::findOrFail($materialId);
                $quantity = $data['qty'];
                $materialCost = $material->material_cost;
                $productCost = $materialCost * $quantity;

                $totalCost += $productCost;
            }
        }

        return $totalCost;
    }

    public function deleteBulk(Request $request)
    {
        $transaction_ids = $request->input('transaction_ids');
        $fileId = $request->input('file_id');

        $file = File::find($fileId);
        if ($file) {
            $fileSettings = json_decode($file->settings, true);
            if (isset($fileSettings['transaction_ids'])) {
                $fileSettings['transaction_ids'] = array_diff($fileSettings['transaction_ids'], $transaction_ids);
                $file->settings = json_encode($fileSettings);
                $file->save();
            }
        } else {
            $this->status = 404;
            $this->response['message'] = "File not found.";
            return $this->getResponse();
        }

        $deletedCount = 0;
        foreach ($transaction_ids as $transactionId) {
            if (self::deleteTransaction($transactionId)) {
                $deletedCount++;
            }
        }

        if ($deletedCount == count($transaction_ids)) {
            $this->status = 200;
            $this->response['message'] = "All transactions archived successfully.";
        } elseif ($deletedCount > 0) {
            $this->status = 206;
            $this->response['message'] = "$deletedCount out of " . count($transaction_ids) . " transactions archived successfully.";
        } else {
            $this->status = 404;
            $this->response['message'] = "No transactions were archived.";
        }

        return $this->getResponse();
    }

    public function getTotalProductionCost()
    {
        try {
            $currentDate = Carbon::now();
            $currentMonth = $currentDate->format('Y-m');
            $previousMonth = $currentDate->copy()->subMonth()->format('Y-m');

            $currentMonthCost = $this->calculateMonthCost($currentMonth);
            $previousMonthCost = $this->calculateMonthCost($previousMonth);

            $percentageChange = 0;
            $trend = 'unchanged';

            if ($previousMonthCost > 0) {
                $percentageChange = (($currentMonthCost - $previousMonthCost) / $previousMonthCost) * 100;
                $trend = $percentageChange > 0 ? 'increased' : ($percentageChange < 0 ? 'decreased' : 'unchanged');
            }

            $this->status = 200;
            $this->response['total_production_cost'] = $currentMonthCost;
            $this->response['percentage_change'] = abs(round($percentageChange, 2));
            $this->response['trend'] = $trend;
            return $this->getResponse("Total production cost calculated successfully.");
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse("An error occurred while calculating total production cost.");
        }
    }

    private function calculateMonthCost($month)
    {
        $transactions = Transaction::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$month])->get();
        $totalCost = 0;

        foreach ($transactions as $transaction) {
            $settings = json_decode($transaction->settings, true);
            $qty = $settings['qty'] ?? 0;

            if ($transaction->fg_id) {
                $finishedGood = FinishedGood::find($transaction->fg_id);
                if ($finishedGood) {
                    $totalCost += $finishedGood->rm_cost * $qty;
                }
            } elseif ($transaction->material_id && !$transaction->fg_id) {
                $material = Material::find($transaction->material_id);
                if ($material) {
                    $totalCost += $material->material_cost * $qty;
                }
            }
        }

        return $totalCost;
    }
}