<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Mail\PasswordResetMail;
use App\Models\User;
use App\Models\PersonalAccessToken;


// Password Reset Controller

class PasswordResetController extends Controller
{
    //Sending Password Email
    public function sendResetLinkEmail(Request $request)
    {
        $user = User::where('email_address', $request->email)
                    ->where('employee_number', $request->employeeNum)
                    ->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $token = $user->createToken('passwordResetToken', ['*'], now()->addMinutes(30));
        $plainTextToken = explode('|', $token->plainTextToken)[1];
        \Log::info('Received Token: ' . $plainTextToken);

        $resetUrl = config('app.forgot_password_url') . '/pass-reset/' . $plainTextToken . '?email=' . urlencode($request->email);
        Mail::to($user->email_address)->send(new PasswordResetMail($resetUrl));

        return response()->json(['message' => 'Password reset link sent!']);
    }

    //Verifying Password Reset Token
    public function verifyToken(Request $request, $token)
    {

        $tokens = PersonalAccessToken::where('token', hash('sha256', $token))
                                ->first();

        if (!$tokens || Carbon::parse($tokens->created_at)->addMinutes(30)->isPast()) {
            return response()->json(['message' => 'Invalid or expired token'], 400);
        }

        return response()->json(['message' => 'Token is valid']);
    }

    //Resetting Password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:users,email_address',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        $receivedToken = $request->input('token');

        $token = PersonalAccessToken::where('token', hash('sha256', $receivedToken))
                                ->first();
        
        if (!$token) {
            return response()->json(['message' => 'Invalid or expired token'], 400);
        }

        $tokenExpiration = 60;
        if ($token->created_at->addMinutes($tokenExpiration)->isPast()) {
            return response()->json(['message' => 'Token has expired'], 400);
        }

        $user = $token->tokenable;

        if ($user->email_address !== $request->email) {
            return response()->json(['message' => 'Email does not match the token'], 400);
        }

        $request->validate([
            'password' => 'required|confirmed',
        ]);

        $user->password = bcrypt($request->password);
        $user->save();

        $token->delete();

        return response()->json(['message' => 'Password has been reset successfully.']);
    }
    public function changePassword(Request $request)
    {
        $request->validate([
            'currentPassword' => 'required|string|min:8',
            'newPassword' => 'required|string|min:8|different:currentPassword',
            'confirmPassword' => 'required|string|same:newPassword',
        ]);

        try {
            $user = auth()->user();

            if (!Hash::check($request->currentPassword, $user->password)) {
                return response()->json(['message' => 'Invalid current password.'], 401);
            }

            $user->password = Hash::make($request->newPassword);
            $user->save();

            return response()->json(['message' => 'Password changed successfully.'], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Failed to change password.'], 500);
        }
    }
}