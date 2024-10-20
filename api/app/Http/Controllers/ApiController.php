<?php

namespace App\Http\Controllers;

use App\Models\LoginAttempt;
use App\Models\ResponseModel;
use App\Models\User;
use App\Models\AccountType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Providers\RequestValidatorServiceProvider;
use Illuminate\Support\Facades\Schema;
use Laravel\Sanctum\Sanctum;

class ApiController extends Controller
{
    protected $model;

    protected $data;

    protected $error;

    protected $status;

    protected $response = [];

    public function getResponse($customMessage = null)
    {
        $status = is_numeric($this->status) ? (int)$this->status : 500;
        $this->response['status'] = $status;
        $this->response['message'] = $customMessage ?? $this->getMessage($status);

        // $finalResponse = array_merge($this->response, $additionalFields);
        return response()->json($this->response, $status);
    }

    private function getMessage($status)
    {
        $messages = [
            200 => 'OK',
            201 => 'Created',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            404 => 'Not Found',
            500 => 'Internal Server Error',
        ];

        return $messages[$status] ?? 'Unknown Status';
    }

    public function getCurrentUser()
    {
        $user = Auth::user();
        return response()->json($user);
    }
}
