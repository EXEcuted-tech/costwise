<?php
namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;

class AuditLogController extends Controller
{
    public function logAudit($userId, $action, $description) {
        try {
            
            DB::table('audit_logs')->insert([
                'user_id' => $userId,
                'action' => $action,
                'description' => $description,
                'timestamp' => now()->setTimezone('Asia/Manila'),
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
            $user = User::find($userId);
            $action = $request->input('action', 'general');
            $act = $request->input('act');
            $fileName = $request->input('fileName');

            $firstName = $user->first_name;
            $middleInitial = $user->middle_name ? substr($user->middle_name, 0, 1) . '.' : '';
            $lastName = $user->last_name;

            if($action == 'general'){
                switch($act){
                    case "create":
                        $description = "$firstName $middleInitial $lastName created a new user.";
                        break;
                    case "edit":
                        $description = "$firstName $middleInitial $lastName edited their user information.";
                        break;
                    case "edit_user":
                        $description = "$firstName $middleInitial $lastName edited $fileName's information.";
                        break;
                    case "archive":
                        $description = "$firstName $middleInitial $lastName archived user $fileName.";
                        break;
                    default:
                        $description = "";
                        break;
                }
            }

            if($action == 'crud'){
                switch($act){
                    case "view":
                        $description = "$firstName $middleInitial $lastName viewed $fileName.xlsx.";
                        break;
                    case "edit":
                        $description = "$firstName $middleInitial $lastName edited $fileName.xlsx.";
                        break;
                    case "edit_formulation":
                        $description = "$firstName $middleInitial $lastName edited $fileName.";
                        break;
                    case "archive":
                        $description = "$firstName $middleInitial $lastName archived $fileName.xlsx.";
                        break;
                    case "archive_formulation":
                        $description = "$firstName $middleInitial $lastName archived $fileName.";
                        break;
                    case "archive_inventory":
                        $description = "$firstName $middleInitial $lastName archived the entire inventory list.";
                        break;     
                    default:
                        $description = "";
                        break;
                }
            }
            
            if($action == 'import'){
                $description = "$firstName $middleInitial $lastName imported $fileName.";
            }

            if($action == 'export'){
                switch($act){
                    case "all files":
                        $description = "$firstName $middleInitial $lastName exported all files in File Manager.";
                        break;
                    case "file":
                        $description = "$firstName $middleInitial $lastName exported $fileName.xlsx.";
                    case "formulation_file":
                        $description = "$firstName $middleInitial $lastName exported $fileName.";
                        break;
                    default:
                        $description = "";
                        break;
                }
            }

            $this->logAudit($userId, $action, $description);
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
