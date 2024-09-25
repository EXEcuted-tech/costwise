<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PersonalAccessToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

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
            // $accessToken = $user->createToken('authToken')->plainTextToken;

            $this->status = 200;
            // $this->response['token'] = $accessToken;
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

            $accessToken = $user->createToken('accessToken', ['*'], now()->addMinutes(15));
            $refreshToken = $user->createToken('refreshToken', ['*'], now()->addDays(30));

            $this->status = 200;
            $this->response['access_token'] = $accessToken->plainTextToken;
            $this->response['refresh_token'] = $refreshToken->plainTextToken;
            $this->response['access_token_expiration'] = $accessToken->accessToken->expires_at;
            return $this->getResponse("Logged in successfully!");
        } catch (\Throwable $th) {
            $this->status = 500;
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->bearerToken();

        if (!$refreshToken) {
            $this->status = 401;
            return $this->getResponse("Refresh token not provided");
        }

        $token = PersonalAccessToken::findToken($refreshToken);

        if (!$token || $token->name !== 'refreshToken' || $token->expires_at->isPast()) {
            $this->status = 401;
            return $this->getResponse("Invalid or expired refresh token");
        }

        $user = $token->tokenable;

        $accessToken = $user->tokens()->where('name', 'accessToken')->first();
        if (!$accessToken) {
            $accessToken = $user->createToken('accessToken', ['*'], now()->addMinutes(15));
        } else {
            $accessToken->token = hash('sha256', $plainTextAccessToken = Str::random(48));
            $accessToken->expires_at = now()->addMinutes(15);
            $accessToken->save();
        }
        
        $token->token = hash('sha256', $plainTextRefreshToken = Str::random(48));
        $token->expires_at = now()->addDays(30);
        $token->save();

        $this->response['access_token'] = $accessToken->id . '|' . ($plainTextAccessToken ?? $accessToken->plainTextToken);
        $this->response['refresh_token'] = "{$token->id}|{$plainTextRefreshToken}";
        $this->response['access_token_expiration'] = $accessToken->expires_at;
        $this->status = 200;
        return $this->getResponse("Tokens refreshed successfully!");
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