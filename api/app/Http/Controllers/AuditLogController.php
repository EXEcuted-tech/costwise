<?php
namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

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
            $material_code = $request->input('material_code');
            $material_desc = $request->input('material_desc');

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
                    case "photo":
                        $description = "$firstName $middleInitial $lastName uploaded their profile picture.";
                        break;
                    case "others_photo":
                        $description = "$firstName $middleInitial $lastName uploaded $fileName's profile picture.";
                        break;
                    default:
                        $description = "Unknown source or action.";
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
                        $description = "Unknown source or action.";
                        break;
                }
            }
            
            if($action == 'import'){
                switch($act){
                    case "inventory":
                        $description = "$firstName $middleInitial $lastName imported $fileName.xlsx.";
                        break;
                    default:
                    $description = "$firstName $middleInitial $lastName imported $fileName.";
                        break;
                }
                
            }

            if($action == 'export'){
                switch($act){
                    case "all files":
                        $description = "$firstName $middleInitial $lastName exported all files in File Manager.";
                        break;
                    case "file":
                        $description = "$firstName $middleInitial $lastName exported $fileName.xlsx.";
                        break;
                    case "formulation_file":
                        $description = "$firstName $middleInitial $lastName exported $fileName.";
                        break;
                    case "logs":
                        $description = "$firstName $middleInitial $lastName exported all existing audit logs.";
                        break;
                    default:
                        $description = "Unknown source or action.";
                        break;
                }
            }

            if($action == 'stock'){
                switch($act){
                    case "low stock":
                        $description = "Item $material_code $material_desc is low in stock.";
                        break;
                    default:
                        $description = "Unknown stock notification.";
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


    public function export(Request $request)
    {
        try {
            $logs = AuditLog::with('user')->get();
            $logsByMonth = $logs->groupBy(function($log) {
                return Carbon::parse($log->timestamp)->format('Y-m');
            });

            $spreadsheet = new Spreadsheet();
            $monthIndex = 0;

            foreach ($logsByMonth as $month => $monthLogs) {
                $sheet = $monthIndex === 0 ? $spreadsheet->getActiveSheet() : $spreadsheet->createSheet($monthIndex);
                $sheet->setTitle(Carbon::parse($month)->format('F Y'));
                $this->processSheet($sheet, $monthLogs);
                $monthIndex++;
            }

            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $fileName = 'AuditLogs_' . now()->format('Y-m-d') . '.xlsx';

            $tempFile = tempnam(sys_get_temp_dir(), $fileName);
            $writer->save($tempFile);

            ob_end_clean();

            return response()->download($tempFile, $fileName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            \Log::error('Export failed: ' . $e->getMessage());
            return response()->json(['error' => "Export failed: " . $e->getMessage()], 500);
        }
    }

    private function processSheet($sheet, $logs)
    {
        $headers = [
            'Log Id', 'Employee No', 'Name', 'Email', 'Department', 'User Type', 'Action/Event', 'Timestamp'
        ];

        $sheet->fromArray([$headers], NULL, 'A1');
        $sheet->getStyle('A1:H1')->getFont()->setBold(true);
        $sheet->getStyle('A1:H1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

        $sheet->freezePane('A2');

        $row = 2;
        foreach ($logs as $log) {
            $user = $log->user;
            $data = [
                $log->log_id,
                $user ? $user->employee_number : '',
                $user ? ($user->first_name . ' ' . $user->last_name) : '',
                $user ? $user->email_address : '',
                $user ? $user->department : '',
                $user ? $user->user_type : '',
                $log->action . ' | ' . $log->description,
                $log->timestamp
            ];
            $sheet->fromArray([$data], NULL, "A$row");
            $sheet->getStyle("A$row:H$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $row++;
        }

        foreach(range('A','H') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $sheet->setAutoFilter($sheet->calculateWorksheetDimension());
    }
}
