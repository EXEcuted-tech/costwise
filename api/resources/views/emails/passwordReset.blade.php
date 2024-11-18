<!-- Password Reset Email Contents -->
<!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #B22222;
            color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #dee2e6;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #6c757d;
        }
        .reset-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #B22222;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 15px 0;
        }
        .reset-button:hover {
            background-color: #8B0000;
            color: #ffffff !important;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Password Reset Request</h1>
    </div>
    
    <div class="content">
        <p>We received a request to reset your password. Please click the button below to reset it:</p>
        
        <a href="{{ $resetLink }}" class="reset-button" style="color: #ffffff !important;">Reset Password</a>
        
        <p>This link will expire in 30 minutes.</p>
        
        <p>If you did not request a password reset, please ignore this email.</p>
        
        <div class="footer">
            <p>Best regards,<br>CostWise Team</p>
            <p>Note: This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>