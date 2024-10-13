<?php
namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function logAudit($userId, $action) {
        try {
            
            DB::table('audit_logs')->insert([
                'user_id' => $userId,
                'action' => $action,
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            
            throw new \Exception('Failed to create audit log: ' . $e->getMessage());
        }
    }

    public function updateAuditLogs(Request $request) {
        \Log::info('Request Data:', $request->all());
        try {
            $request->validate([
                'userId' => 'required|integer',
                'action' => 'required|string|max:255',
            ]);

            
            $userId = $request->input('userId'); 
            $action = $request->input('action', 'general');
            $this->logAudit($userId, $action);
            return response()->json(['message' => 'User details updated and audit log created successfully'], 200);
        } catch (\Exception $e) {
            \Log::error('Audit log error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getAuditLogs() {
        $logs = AuditLog::with('user')->get();
        return response()->json($logs);
    }
}
