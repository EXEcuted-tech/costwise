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

    public function editUserInfo(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'fName' => 'string|max:255',
            'mName' => 'string|max:255|nullable',
            'lName' => 'string|max:255',
            'email' => 'email|max:255',
            'phoneNum' => 'string|max:255',
            'suffix' => 'string|max:5|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }
        $user->first_name = $request->get('fName', $user->first_name);
        $user->middle_name = $request->get('mName', $user->middle_name);
        $user->last_name = $request->get('lName', $user->last_name);
        $user->email_address = $request->get('email', $user->email_address);
        $user->phone_number = $request->get('phoneNum', $user->phone_number);
        $user->suffix = $request->get('suffix', $user->suffix);

        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'User information updated successfully',
            'user' => $user
        ]);
    }
}