@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-10 max-w-lg bg-white shadow-md rounded-lg p-6">
    <h2 class="text-2xl font-semibold text-center text-gray-700">Email Verification Required</h2>

    @if (session('message'))
        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-4">
            <p>{{ session('message') }}</p>
        </div>
    @endif

    <form method="POST" action="{{ route('verify.email') }}" class="mt-6">
        @csrf

        <div class="mb-4">
            <label for="verification_code" class="block text-gray-700 font-medium">Verification Code:</label>
            <input type="text" id="verification_code" name="verification_code" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" required>
        </div>

        <div class="flex justify-center">
            <button type="submit" class="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Verify Email</button>
        </div>
    </form>
</div>
@endsection
