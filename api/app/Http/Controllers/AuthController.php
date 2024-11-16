<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PersonalAccessToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Mail\NewUserCredentials;

class AuthController extends ApiController
{
    public function register(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'employee_number' => 'required|unique:users',
                    'user_type' => 'required',
                    'first_name' => 'required',
                    'last_name' => 'required',
                    'email_address' => 'required|email|unique:users',
                    //'password' => 'required|min:8|max:16|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/',
                    'department' => 'required',
                    'phone_number' => 'required|regex:/^\+63\s?9\d{9}$/',
                    'position' => 'required',
                    'sys_role' => 'required',
                    'display_picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['errors'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $validatedData = $validator->validated();

            $randomPassword = Str::random(12);
            $validatedData['password'] = Hash::make($randomPassword);
            
            $details = [
                'name' => $validatedData['first_name'] . ' ' . $validatedData['last_name'],
                'email' => $validatedData['email_address'],
                'password' => $randomPassword
            ];
            
            Mail::to($validatedData['email_address'])->send(new NewUserCredentials($details));
            
            //$validatedData['password'] = Hash::make($request->password);
            $validatedData['sys_role'] = json_decode($request->sys_role);


            $user = User::create($validatedData);

            if ($request->hasFile('display_picture')) {
                try {
                    $path = $request->file('display_picture')->store('profile_pictures', 'public');
                    $user->display_picture = $path;
                    $user->save();
                } catch (\Throwable $th) {
                    throw $th;
                }
            }

            $this->status = 200;
            return $this->getResponse("User created successfully!");
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            $this->status = $th->getCode() ?: 500;
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
                return $this->getResponse("Incorrect credentials! Please try again.");
            }

            $user = User::where('email_address', $request->email_address)->first();

            $accessToken = $user->createToken('accessToken', ['*'], now()->addWeeks(2));
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
            $accessToken = $user->createToken('accessToken', ['*'], now()->addWeeks(2));
        } else {
            $accessToken->token = hash('sha256', $plainTextAccessToken = Str::random(48));
            $accessToken->expires_at = now()->addWeeks(2);
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
            auth()->user()->tokens()->where('name', 'accessToken')
                                    ->orwhere('name', 'refreshToken')
                                    ->delete();
            $this->status = 200;
            return $this->getResponse("Logged out successfully!");
        } catch (\Throwable $th) {
            $this->error = $th->getMessage();
            $this->status = 500;
            return $this->getResponse();
        }
    }
}
