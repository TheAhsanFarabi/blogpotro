<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyEmail;
use App\Models\User;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        // Validate input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');
        $remember = $request->has('remember'); // Check if 'remember' checkbox is selected

        // Attempt to log in
        if (Auth::attempt($credentials, $remember)) {
            // Check if the user's email is verified
            if (is_null(Auth::user()->email_verified_at)) {
                // Log the user out immediately
                Auth::logout();

                return redirect()->route('login')->withErrors([
                    'email' => 'Your email address is not verified. Please <b><a href="' . route('verify.old.email.form') . '">verify here</a></b> to log in.',
                ])->withInput();
                
            }

            // Regenerate session to avoid session fixation attack
            $request->session()->regenerate();

            // Redirect to intended route or default route after successful login
            return redirect()->intended('/')->with('success', 'Login successful!');
        }

        // If authentication fails, redirect back with errors
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->withInput();
    }

    public function logout(Request $request)
    {
        // Manually remove the remember token from the authenticated user
        $user = Auth::user();
        if ($user) {
            $user->setRememberToken(null);
            $user->save();
        }

        // Perform logout
        Auth::logout();

        // Invalidate session and regenerate CSRF token
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('login');
    }

    public function showVerifyOldEmailForm()
    {
        return view('auth.verify-old-email');
    }
    

    public function sendVerificationCode(Request $request)
    {
        // Validate email
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // Find the user by email
        $user = User::where('email', $request->email)->first();

        if ($user && !$user->email_verified_at) {
            // Generate a 6-digit verification code
            $verificationCode = mt_rand(100000, 999999);

            // Update the user with the verification code
            $user->verification_code = $verificationCode;
            $user->save();

            // Send the verification email
            Mail::to($user->email)->send(new VerifyEmail($verificationCode));

            return redirect()->back()->with('success', 'Verification code sent to your email.');
        }

        return back()->withErrors(['email' => 'The email is already verified or not found.']);
    }

    public function verifyOldEmail(Request $request)
    {
        // Validate the input
        $request->validate([
            'verification_code' => 'required|string|size:6',
        ]);

        // Find the user by the verification code
        $user = User::where('verification_code', $request->verification_code)->first();

        if ($user) {
            // Mark email as verified and reset verification code
            $user->email_verified_at = now();
            $user->verification_code = null;
            $user->save();

            return redirect('login')->with('success', 'Email verified successfully!');
        }

        return back()->withErrors(['verification_code' => 'Invalid verification code.']);
    }
}
