<!-- resources/views/emails/reset_password.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
    </style>
</head>
<body class="bg-gray-100 text-gray-900 font-sans">
    <div class="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-8">
        <div class="p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Password Reset Request</h1>
            <p class="text-gray-600 mb-4">We received a request to reset your password. Click the link below to reset it:</p>
            <a href="{{ url('password/reset', $token) }}" class="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Reset Password</a>
            <p class="text-gray-600 mt-4">If you did not request this, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
