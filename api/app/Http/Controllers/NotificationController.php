<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\File;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationController extends ApiController
{
    public function retrieve(Request $request)
    {
        try {
            $column = $request->input('col');
            $value = $request->input('val');

            if (!$column || !$value) {
                throw new \Exception('Column and value are required');
            }

            $records = AuditLog::where($column, $value)->get();

            $this->status = 200;
            $this->response['data'] = $records;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    public function retrieveUnread(Request $request)
    {
        try {
            $colA = $request->input('col1');
            $valA = $request->input('val1');
            $colB = $request->input('col2');
            $valB = $request->input('val2');

            if (!$colA || !$valA || !$colB || !$valB) {
                throw new \Exception('Column and value are required');
            }

            $records = AuditLog::where($colA, $valA)->where($colB, $valB)->get();

            $this->status = 200;
            $this->response['data'] = $records;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    public function markAsRead(Request $request)
    {
        try {
            $logId = $request->input('log_id');

            if (!$logId) {
                throw new \Exception('Log ID is required');
            }

            $record = AuditLog::find($logId);

            if (!$record) {
                throw new \Exception('Notification not found');
            }

            $record->read = $record->read == 1 ? 0 : 1;
            $record->save();

            $this->status = 200;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse();
        }
    }

    public function getNewNotifications(Request $request)
    {
        try {
            $userId = $request->user()->user_id;
            $lastCheckedAt = $request->input('last_checked_at');

            $newNotifications = AuditLog::where('user_id', $userId)
                ->where('timestamp', '>', $lastCheckedAt)
                ->where('read', 0)
                ->get();

            $this->status = 200;
            $this->response['data'] = $newNotifications;
            return $this->getResponse();
        } catch (\Exception $e) {
            $this->status = 500;
            $this->response['message'] = $e->getMessage();
            return $this->getResponse();
        }
    }
}