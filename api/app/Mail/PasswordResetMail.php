<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class PasswordResetMail extends Mailable
{
    public $token;
    public $email;
    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function build()
    {
        $resetUrl = config('app.url') . '/pass-reset/' . $this->token . '?email=' . urlencode($this->email);

        return $this->subject('Password Reset Request')
            ->view('emails.passwordReset')
            ->with([
                'resetLink' => $resetUrl,
            ]);
    }
}