<!DOCTYPE html>
<html>
    <head>
        <title>Password Reset</title>
    </head>
    <body>
        <h1>Password Reset Request</h1>
        <p>
            We received a request to reset your password. Please click the link below to reset it:
        </p>
        <a href="{{ $resetLink }}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
    </body>
</html>