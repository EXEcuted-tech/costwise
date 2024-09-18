<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends ApiController
{
    public function register(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'employee_number' => 'required',
                    'user_type' => 'required',
                    'first_name' => 'required',
                    'last_name' => 'required',
                    'email_address' => 'required|email|unique:users',
                    'password' => 'required|min:8|max:16|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/',
                    'department' => 'required',
                    'phone_number' => 'required|regex:/^(\+?[0-9]{1,4})?\s?-?[0-9]{10}$/',
                    'position' => 'required',
                    'sys_role' => 'required'
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['errors'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $validatedData = $validator->validated();
            $validatedData['password'] = Hash::make($request->password);

            $user = User::create($validatedData);
            $accessToken = $user->createToken('authToken')->plainTextToken;

            $this->status = 200;
            $this->response['token'] = $accessToken;
            return $this->getResponse("User created successfully!");
        } catch (\Throwable $th) {
            $this->status = $th->getCode();
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }

    public function login(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'email_address' => 'required|email',
                    'password' => 'required',
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['errors'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            if (!Auth::attempt($request->only(['email_address', 'password']))) {
                $this->status = 401;
                return $this->getResponse("Account does not exist. Re-check your credentials.");
            }

            $user = User::where('email_address', $request->email_address)->first();
            $accessToken = $user->createToken('authToken')->plainTextToken;

            $this->status = 200;
            $this->response['token'] = $accessToken;
            return $this->getResponse("Logged in successfully!");
        } catch (\Throwable $th) {
            $this->status = 500;
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }

    public function logout()
    {
        try {
            auth()->user()->tokens()->delete();
            $this->status = 200;
            return $this->getResponse("Logged out successfully!");
        } catch (\Throwable $th) {
            $this->error = $th->getMessage();
            $this->status = 500;
            return $this->getResponse();
        }
    }
}