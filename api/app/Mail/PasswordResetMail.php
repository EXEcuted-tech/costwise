<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class PasswordResetMail extends Mailable
{
    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function build()
    {
        $resetUrl = config('app.url') . '/profile/' . $this->token;

        return $this->subject('Password Reset Request')
            ->view('emails.passwordReset')
            ->with([
                'resetUrl' => $resetUrl,
            ]);
    }
}