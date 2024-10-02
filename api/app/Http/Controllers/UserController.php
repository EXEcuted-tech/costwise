<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends ApiController
{
    public function getCurrentUser()
    {
        $user = Auth::user();
        return response()->json($user);
    }

    public function getAllUsers()
    {
        $users = User::all();
        return response()->json($users);
    }
}
