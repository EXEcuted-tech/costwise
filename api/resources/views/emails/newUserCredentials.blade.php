<!DOCTYPE html>
<html>
<head>
    <title>Your Account Credentials</title>
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
        .credentials {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to CostWise!</h1>
    </div>
    
    <div class="content">
        <p>Dear {{ $details['name'] }},</p>
        
        <p>Your account has been successfully created. Below are your login credentials:</p>
        
        <div class="credentials">
            <p><strong>Email:</strong> {{ $details['email'] }}</p>
            <p><strong>Password:</strong> {{ $details['password'] }}</p>
        </div>
        
        <p>For security reasons, we recommend changing your password after your first login.</p>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <div class="footer">
            <p>Best regards,<br>CostWise Team</p>
            <p>Note: This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>
