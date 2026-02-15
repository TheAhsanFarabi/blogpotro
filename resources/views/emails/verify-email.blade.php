<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-900 font-sans">
    <div class="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-8">
        <!-- Cover Image -->
        <img src="{{ asset('images/soc-card.jpg') }}" alt="Cover Image" class="w-full h-40 object-cover">

        <div class="p-6">
            <h1 class="text-2xl font-bold text-yellow-600 mb-4">Email Verification</h1>
            <p class="text-gray-600 mb-4">Thank you for registering! Please use the following 6-digit code to verify your email address:</p>
            
            <div class="bg-gray-100 border border-gray-300 rounded-md p-4 mb-4">
                <h2 class="text-xl font-semibold text-indigo-600">{{ $code }}</h2>
            </div>

            <p class="text-gray-600">If you did not register, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
