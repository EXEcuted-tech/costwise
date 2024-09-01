<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        // Fetch users using Eloquent
        $users = User::all();
        return response()->json($users);
    }
}
