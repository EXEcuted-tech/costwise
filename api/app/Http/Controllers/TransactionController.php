<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\FinishedGood;
use App\Models\Material;
use App\Models\Transaction;
use Illuminate\Http\Request;
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

            if (!is_null($transaction->material_id)) {
                $material = Material::find($transaction->material_id);
                $relatedData['material'] = $material?->toArray();
            }

            if (!is_null($transaction->fg_id)) {
                $finishedGood = FinishedGood::find($transaction->fg_id);
                $relatedData['finished_good'] = $finishedGood?->toArray();
            }

            return array_merge($transaction->toArray(), $relatedData);
        });

        $this->status = 200;
        $this->response['data'] = $result;
        return $this->getResponse();
        } catch (\Exception $e) {
            // Handle exceptions and return error message
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    public function updateBatch(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'transactions' => 'required|array',
            'transactions.*.transaction_id' => 'required|integer|exists:transactions,transaction_id',
            'transactions.*.journal' => 'required|string',
            'transactions.*.entry_num' => 'required|integer',
            'transactions.*.trans_desc' => 'required|string',
            'transactions.*.project' => 'required|string',
            'transactions.*.gl_account' => 'required|string',
            'transactions.*.gl_desc' => 'required|string',
            'transactions.*.warehouse' => 'required|string',
            'transactions.*.date' => 'required|date',
            'transactions.*.month' => 'required|integer|min:1|max:12',
            'transactions.*.year' => 'required|integer|min:1900|max:' . date('Y'),
            'transactions.*.settings' => 'required|string',
        ]);


        if ($validator->fails()) {
            $this->status = 422;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Incorrect/Lacking input details. Please follow the format!");
        }

        $transactions = $request->input('transactions');

        foreach ($transactions as $transactionData) {
            $transaction = Transaction::find($transactionData['transaction_id']);

            if ($transaction) {
                if($transaction->material_id != null){
                    $material = Material::find($transaction->material_id);
                    dd($material);
                }

                if($transaction->fg_id != null){

                }

                $transaction->update([
                    'material_id' => $transactionData['material_id'] ?? $transaction->material_id,
                    'fg_id' => $transactionData['fg_id'] ?? $transaction->fg_id,
                    'journal' => $transactionData['journal'] ?? $transaction->journal,
                    'entry_num' => $transactionData['entry_num'] ?? $transaction->entry_num,
                    'trans_desc' => $transactionData['trans_desc'] ?? $transaction->trans_desc,
                    'project' => $transactionData['project'] ?? $transaction->project,
                    'gl_account' => $transactionData['gl_account'] ?? $transaction->gl_account,
                    'gl_desc' => $transactionData['gl_desc'] ?? $transaction->gl_desc,
                    'warehouse' => $transactionData['warehouse'] ?? $transaction->warehouse,
                    'date' => $transactionData['date'] ?? $transaction->date,
                    'month' => $transactionData['month'] ?? $transaction->month,
                    'year' => $transactionData['year'] ?? $transaction->year,
                    'settings' => $transactionData['settings'] ?? $transaction->settings,
                ]);
            } else {
                // Create new record
            }
        }

        $this->status = 200;
        return $this->getResponse('Transactions updated successfully!');
    }
}