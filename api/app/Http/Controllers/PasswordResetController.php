<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Mail\PasswordResetMail;
use App\Models\User;
use App\Models\PersonalAccessToken;

class PasswordResetController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $user = User::where('email_address', $request->email)
                    ->where('employee_number', $request->employeeNum)
                    ->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $token = $user->createToken('passwordResetToken', ['*'], now()->addMinutes(60));
        $plainTextToken = explode('|', $token->plainTextToken)[1];
        \Log::info('Received Toasdfasdfasdfsdaen: ' . $plainTextToken);

        $resetUrl = config('app.url') . '/pass-reset/' . $plainTextToken . '?email=' . urlencode($request->email);
        Mail::to($user->email_address)->send(new PasswordResetMail($resetUrl));

        return response()->json(['message' => 'Password reset link sent!']);
    }

    public function verifyToken($token)
    {
        $resetRequest = DB::table('password_resets')->where('token', $token)->first();

        if (!$resetRequest || Carbon::parse($resetRequest->created_at)->addMinutes(60)->isPast()) {
            return response()->json(['message' => 'Invalid or expired token'], 404);
        }

        return response()->json(['message' => 'Token is valid']);
    }

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
}