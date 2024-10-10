<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Mail\PasswordResetMail;
use App\Models\User;

class PasswordResetController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email_address']);

        $token = Str::random(64);

        DB::table('password_resets_token')->insert([
            'email' => $request->email,
            'token' => $token,
            'created_at' => Carbon::now(),
        ]);

        Mail::to($request->email)->send(new PasswordResetMail($token, $request->email));

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
            'password' => 'required|string|confirmed',
        ]);
        
        $resetRequest = DB::table('password_resets_token')
            ->where('token', $request->token)
            ->where('email', $request->email)
            ->first();

        if (!$resetRequest) {
            return response()->json(['message' => 'Invalid token or email'], 400);
        }

        $user = User::where('email_address', $request->email)->first();
        $user->password = bcrypt($request->password);
        $user->save();

        DB::table('password_resets_token')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password successfully reset']);
    }
}