@extends('layouts.app')

@section('content')
<div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-5">
    <img class="mx-auto h-16 w-auto" src="{{ asset('images/logo-lg.png') }}" alt="Blogpotro">
    <h2 class="text-2xl font-bold mb-4">Login</h2>

    <!-- Display Validation Errors -->
    @if ($errors->any())
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <ul>
            @foreach ($errors->all() as $error)
            <li>{!! $error !!}</li>
            @endforeach
        </ul>
    </div>
    @endif

    @if (session('status'))
    <div class="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded mb-4">
        {{ session('status') }}
    </div>
    @endif

    <form method="POST" action="{{ route('login') }}">
        @csrf
        <div class="mb-4">
            <label for="email" class="block text-gray-700">Email</label>
            <input type="email" name="email" id="email"
                class="w-full border border-gray-300 p-2 rounded @error('email') border-red-500 @enderror"
                value="{{ old('email') }}" required>
        </div>


        <div class="mb-4">
            <label for="password" class="block text-gray-700">Password</label>
            <div class="relative">
                <input type="password" name="password" id="password"
                    class="w-full border border-gray-300 p-2 rounded @error('password') border-red-500 @enderror" required>
                <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <i class="far fa-eye cursor-pointer" id="togglePassword"></i>
                </span>
            </div>
            @error('password')
            <span class="text-red-500 text-sm">{{ $message }}</span>
            @enderror
        </div>

        <script>
            const togglePassword = document.querySelector("#togglePassword");
            const password = document.querySelector("#password");

            togglePassword.addEventListener("click", function() {
                // Toggle the type attribute
                const type = password.getAttribute("type") === "password" ? "text" : "password";
                password.setAttribute("type", type);

                // Toggle the eye icon
                this.classList.toggle("fa-eye-slash");
            });
        </script>

        <div class="mb-4 flex items-center justify-between">
            <label for="remember" class="inline-flex items-center">
                <input type="checkbox" name="remember" id="remember" class="mr-2">
                <span class="text-gray-700">Remember Me</span>
            </label>
            <a href="{{ route('password.request') }}" class="text-blue-500 hover:text-blue-700">Forgot Your
                Password?</a>
        </div>
        <button type="submit"
            class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Login</button>

        <div class="mt-4 text-center">
            <p class="text-gray-600">Don't have an account?</p>
            <a href="{{ route('register') }}" class="text-blue-500 hover:text-blue-700">Create an Account</a>
        </div>
    </form>
</div>
@endsection