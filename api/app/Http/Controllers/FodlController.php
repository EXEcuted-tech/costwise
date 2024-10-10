<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\FinishedGood;
use App\Models\Fodl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FodlController extends ApiController
{
    public function retrieveAll()
    {
        try {
            $allRecords = Fodl::all();
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
            'fodl_id',
            'fg_code',
            'factory_overhead',
            'direct_labor',
            'monthYear',
        ];

        $col = $request->query('col');
        $value = $request->query('value');

        if (!in_array($col, $allowedColumns)) {
            $this->status = 400;
            return $this->getResponse("Invalid column specified.");
        }

        try {
            $records = Fodl::where($col, $value)->get();

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

    public function retrieveBatch(Request $request)
    {
        $allowedColumns = [
            'fodl_id',
            'fg_code',
            'factory_overhead',
            'direct_labor',
            'monthYear',
        ];

        $col = $request->query('col');
        $values = $request->query('values');

        if (!in_array($col, $allowedColumns)) {
            $this->status = 400;
            return $this->getResponse("Invalid column specified.");
        }

        if (empty($values) || !is_array($values)) {
            $this->status = 400;
            return $this->getResponse("Values should be a non-empty array.");
        }

        try {
            $records = Fodl::whereIn($col, $values)->get();

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

    public function deleteFodl(Request $request)
    {
        $fodl_id = $request->query('fodl_id');
        $file_id = $request->query('file_id');

        $validator = Validator::make(['fodl_id' => $fodl_id], [
            'fodl_id' => 'required|integer|exists:fodl,fodl_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors(),
                'message' => 'Validation failed.'
            ], 422);
        }

        \DB::beginTransaction();

        try {
            $fodl = Fodl::findOrFail($fodl_id);
            $archivedFodlData = $fodl->toArray();

            Fodl::on('archive_mysql')->create($archivedFodlData);

            // $files = File::whereJsonContains('settings->fodls', ['fodl_id' => $fodl_id])->get();
            $files = File::where('file_id', $file_id)->get();

            foreach ($files as $file) {
                $settings = json_decode($file->settings, true);
                if (isset($settings['fodls']) && is_array($settings['fodls'])) {
                    $originalCount = count($settings['fodls']);
                    $settings['fodls'] = array_filter($settings['fodls'], function ($fodlEntry) use ($fodl_id) {
                        return $fodlEntry['fodl_id'] !== $fodl_id;
                    });
                    $newCount = count($settings['fodls']);

                    if ($newCount < $originalCount) {
                        $settings['fodls'] = array_values($settings['fodls']);
                        $file->settings = $settings;
                        $file->save();
                    }
                }
            }

            $fodl->delete();
            \DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'FODL record deleted and archived successfully.'
            ], 200);
        } catch (\Exception $e) {
            \DB::rollBack();

            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while deleting the FODL record.'
            ], 500);
        }
    }

    public function updateBatchCombined(Request $request)
    {
        $file_id = $request->input('file_id');

        $rules = [
            'fodls' => 'required|array|min:1',
            'fodls.*.fodl_id' => 'sometimes|integer',
            'fodls.*.factory_overhead' => 'required|numeric|min:0',
            'fodls.*.direct_labor' => 'required|numeric|min:0',
            'fodls.*.monthYear' => 'required|integer|min:0',

            'finished_goods' => 'required|array|min:1',
            'finished_goods.*.fg_code' => 'required|string',
            'finished_goods.*.fg_desc' => 'required|string',
            'finished_goods.*.unit' => 'required|string',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            $this->status = 422;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Incorrect/Lacking input details!");
        }

        $fodls = $request->input('fodls');
        $finishedGoods = $request->input('finished_goods');

        if (count($fodls) !== count($finishedGoods)) {
            $this->status = 422;
            return $this->getResponse("The number of fodls must match the number of finished_goods.");
        }

        \DB::beginTransaction();

        try {
            $fgCodes = [];

            foreach ($finishedGoods as $index => $fgData) {
                $fodlData = $fodls[$index];
                $fodl_id = $fodlData['fodl_id'] ?? null;

                $fgExists = FinishedGood::where('fg_code', $fgData['fg_code'])->exists();
                if (!$fgExists) {
                    \DB::rollBack();
                    $this->status = 404;
                    return $this->getResponse("The Finished Good record does not exist.");
                }

                FinishedGood::where('fg_code', $fgData['fg_code'])
                    ->update([
                        'fg_desc' => $fgData['fg_desc'],
                        'unit' => $fgData['unit'],
                    ]);

                $fgCodes[] = $fgData['fg_code'];
            }

            foreach ($fodls as $index => $fodlData) {
                $assignedFgCode = $fgCodes[$index];
                $existingFodl = isset($fodlData['fodl_id']) ? Fodl::find($fodlData['fodl_id']) : null;

                if ($existingFodl) {
                    $existingFodl->factory_overhead = $fodlData['factory_overhead'];
                    $existingFodl->direct_labor = $fodlData['direct_labor'];
                    $existingFodl->fg_code = $assignedFgCode;
                    $existingFodl->monthYear = $fodlData['monthYear'];
                    $existingFodl->save();

                    $files = File::where('file_id', $file_id)->get();
                    foreach ($files as $file) {
                        $settings = json_decode($file->settings, true);

                        if (isset($settings['fodls']) && is_array($settings['fodls'])) {
                            foreach ($settings['fodls'] as &$existingFodlEntry) {
                                if ($existingFodlEntry['fodl_id'] === $existingFodl->fodl_id) {
                                    $existingFodlEntry['fg_code'] = $assignedFgCode;
                                }
                            }
                            $file->settings = json_encode($settings);
                            $file->save();
                        }
                    }
                } else {
                    $fgExists = Fodl::where('fg_code', $assignedFgCode)->exists();
                    if ($fgExists) {
                        $this->status = 401;
                        return $this->getResponse("Only one finished good in a FODL Sheet.");
                    }

                    $newFodl = new Fodl();
                    $newFodl->factory_overhead = $fodlData['factory_overhead'];
                    $newFodl->direct_labor = $fodlData['direct_labor'];
                    $newFodl->fg_code = $assignedFgCode;
                    $newFodl->monthYear = $fodlData['monthYear'];
                    $newFodl->save();

                    if ($newFodl->exists) {
                        FinishedGood::where('fg_code', $assignedFgCode)
                            ->update(['fodl_id' => $newFodl->fodl_id]);
                    }

                    $files = File::where('file_id', $file_id)->get();
                    foreach ($files as $file) {
                        $settings = json_decode($file->settings, true);

                        if (!isset($settings['fodls']) || !is_array($settings['fodls'])) {
                            $settings['fodls'] = [];
                        }

                        $exists = false;
                        foreach ($settings['fodls'] as $existingFodlEntry) {
                            if ($existingFodlEntry['fodl_id'] === $newFodl->fodl_id) {
                                $exists = true;
                                break;
                            }
                        }

                        if (!$exists) {
                            $settings['fodls'][] = [
                                'fodl_id' => $newFodl->fodl_id,
                                'fg_code' => $assignedFgCode,
                            ];
                            $file->settings = json_encode($settings);
                            $file->save();
                        }
                    }
                }
            }

            FinishedGood::whereNotIn('fg_code', $fgCodes)
                ->update(['fodl_id' => null]);

            \DB::commit();

            $this->status = 200;
            $this->response['message'] = "FODL and Finished Goods records updated successfully.";
            return $this->getResponse();
        } catch (\Exception $e) {
            \DB::rollBack();
            $this->status = 500;
            return $this->getResponse("An error occurred while updating records.");
        }
    }

    public function deleteBulkFodl(Request $request)
    {
        $file_id = $request->input('file_id');
        $validator = Validator::make($request->all(), [
            'fodl_ids' => 'required|array|min:1',
            'fodl_ids.*' => 'integer|exists:fodl,fodl_id',
        ]);

        if ($validator->fails()) {
            $this->status = 422;
            $this->response['errors'] = $validator->errors();
            return $this->getResponse("Validation failed.");
        }

        $fodlIds = $request->input('fodl_ids');

        \DB::beginTransaction();

        try {
            $fodls = Fodl::whereIn('fodl_id', $fodlIds)->get();

            foreach ($fodls as $fodl) {
                $archivedFodlData = $fodl->toArray();
                Fodl::on('archive_mysql')->create($archivedFodlData);

                // $files = File::whereJsonContains('settings->fodls', ['fodl_id' => $fodl_id])->get();
                $files = File::where('file_id', $file_id)->get();

                foreach ($files as $file) {
                    $settings = json_decode($file->settings, true);

                    if (isset($settings['fodls']) && is_array($settings['fodls'])) {
                        $originalCount = count($settings['fodls']);

                        $settings['fodls'] = array_filter($settings['fodls'], function ($fodlEntry) use ($fodl) {
                            return $fodlEntry['fodl_id'] !== $fodl->fodl_id;
                        });

                        $newCount = count($settings['fodls']);

                        if ($newCount < $originalCount) {

                            $settings['fodls'] = array_values($settings['fodls']);
                            $file->settings = $settings;
                            $file->save();
                        }
                    }
                }
            }

            \DB::table('finished_goods')
                ->whereIn('fodl_id', $fodlIds)
                ->update(['fodl_id' => null]);

            Fodl::whereIn('fodl_id', $fodlIds)->delete();

            \DB::commit();

            $this->status = 200;
            return $this->getResponse('FODL records deleted and archived successfully.');
        } catch (\Exception $e) {
            \DB::rollBack();
            $this->status = 500;
            return $this->getResponse("An error occurred while deleting records.");
        }
    }

    public static function deleteBulkFodlInFile($fodlIds, $file_id)
    {
        \DB::beginTransaction();

        try {
            $fodls = Fodl::whereIn('fodl_id', $fodlIds)->get();
            dump("IN FODLS: {$fodls}");
            foreach ($fodls as $fodl) {
                $archivedFodlData = $fodl->toArray();
                Fodl::on('archive_mysql')->create($archivedFodlData);

                $files = File::where('file_id', $file_id)->get();

                foreach ($files as $file) {
                    $settings = json_decode($file->settings, true);

                    if (isset($settings['fodls']) && is_array($settings['fodls'])) {
                        $originalCount = count($settings['fodls']);

                        $settings['fodls'] = array_filter($settings['fodls'], function ($fodlEntry) use ($fodl) {
                            return $fodlEntry['fodl_id'] !== $fodl->fodl_id;
                        });

                        $newCount = count($settings['fodls']);

                        if ($newCount < $originalCount) {
                            $settings['fodls'] = array_values($settings['fodls']);
                            $file->settings = json_encode($settings);
                            $file->save();
                        }
                    }
                }
            }

            \DB::table('finished_goods')
                ->whereIn('fodl_id', $fodlIds)
                ->update(['fodl_id' => null]);

            $debug = Fodl::whereIn('fodl_id', $fodlIds)->delete();
            dump($debug);
            \DB::commit();

            return [
                'status' => 200,
                'message' => 'FODL records deleted and archived successfully.'
            ];
        } catch (\Exception $e) {
            \DB::rollBack();

            return [
                'status' => 500,
                'message' => 'An error occurred while deleting records.'
            ];
        }
    }
}