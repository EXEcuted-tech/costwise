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

        $user = User::where('email_address', $request->email)->first();

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

        \Log::info('Received Token: ' . $receivedToken);

        // $token = PersonalAccessToken::findToken($receivedToken);
        $token = PersonalAccessToken::where('token', hash('sha256', $receivedToken))
                                ->first();
        if ($token) {
            \Log::info('Token from database (plain): ' . $token->token);
            \Log::info('Token details from database: ', $token->toArray());
        } else {
            \Log::info('No token found in database for the provided token.');
        }
        
        if (!$token) {
            return response()->json(['message' => 'Invalid or expired token'], 400);
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
        // $request->validate([
        //     'token' => 'required',
        //     'email' => 'required|email|exists:users,email_address',
        //     'password' => 'required|string|confirmed',
        // ]);
        
        // $resetRequest = DB::table('password_resets_token')
        //     ->where('token', $request->token)
        //     ->where('email', $request->email)
        //     ->first();

        // if (!$resetRequest) {
        //     return response()->json(['message' => 'Invalid token or email'], 400);
        // }

        // $user = User::where('email_address', $request->email)->first();
        // $user->password = bcrypt($request->password);
        // $user->save();

        // DB::table('password_resets_token')->where('email', $request->email)->delete();

        // return response()->json(['message' => 'Password successfully reset']);
    }
}