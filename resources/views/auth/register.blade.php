@extends('layouts.app')

@section('content')
<div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-5">
    <img class="mx-auto h-16 w-auto" src="{{ asset('images/logo-lg.png')}}" alt="Blogpotro">
    <h2 class="text-2xl font-bold mb-4">Register</h2>
        <!-- Display Validation Errors -->
        @if ($errors->any())
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
    <form method="POST" action="{{ route('register') }}">
        @csrf
        <div class="mb-4">
            <label for="name" class="block text-gray-700">Name</label>
            <input type="text" name="name" id="name" class="w-full border border-gray-300 p-2 rounded" required>
        </div>
        <div class="mb-4">
            <label for="email" class="block text-gray-700">Email</label>
            <input type="email" name="email" id="email" class="w-full border border-gray-300 p-2 rounded" required>
        </div>

        <!-- Password with eye icon -->
        <div class="mb-4">
            <label for="password" class="block text-gray-700">Password</label>
            <div class="relative">
                <input type="password" name="password" id="password" class="w-full border border-gray-300 p-2 rounded" required>
                <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <i class="far fa-eye cursor-pointer" id="togglePassword"></i>
                </span>
            </div>
        </div>

        <!-- Confirm Password with eye icon -->
        <div class="mb-4">
            <label for="password_confirmation" class="block text-gray-700">Confirm Password</label>
            <div class="relative">
                <input type="password" name="password_confirmation" id="password_confirmation" class="w-full border border-gray-300 p-2 rounded" required>
                <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <i class="far fa-eye cursor-pointer" id="togglePasswordConfirm"></i>
                </span>
            </div>
        </div>

        <!-- Terms of Service and Privacy Policy Agreement -->
        <div class="mb-4">
            <label class="inline-flex items-center">
                <input type="checkbox" id="termsCheckbox" class="form-checkbox">
                <span class="ml-2 text-gray-700">
                    I agree to the 
                    <a href="/terms" target="_blank" class="text-blue-500">Terms of Service</a> and
                    <a href="/privacy" target="_blank" class="text-blue-500">Privacy Policy</a>.
                </span>
            </label>
        </div>

        <!-- Register Button -->
        <button type="submit" id="registerButton" class="w-full p-2 rounded bg-gray-400 text-white cursor-not-allowed" disabled>
            Register
        </button>
    </form>
</div>

<!-- JavaScript for Show Password and enabling/disabling Register button -->
<script>
    document.getElementById('termsCheckbox').addEventListener('change', function() {
        const registerButton = document.getElementById('registerButton');
        if (this.checked) {
            registerButton.disabled = false;
            registerButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
            registerButton.classList.add('bg-blue-500', 'cursor-pointer');
        } else {
            registerButton.disabled = true;
            registerButton.classList.remove('bg-blue-500', 'cursor-pointer');
            registerButton.classList.add('bg-gray-400', 'cursor-not-allowed');
        }
    });

    // Toggle password visibility for password field
    document.getElementById('togglePassword').addEventListener('click', function () {
        const passwordField = document.getElementById('password');
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });

    // Toggle password visibility for confirm password field
    document.getElementById('togglePasswordConfirm').addEventListener('click', function () {
        const passwordField = document.getElementById('password_confirmation');
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });
</script>
@endsection
