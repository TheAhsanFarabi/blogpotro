<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyEmail;
use App\Models\Referral;

class RegisterController extends Controller
{
    public function showRegistrationForm()
    {
        return view('auth.register');
    }

    public function showVerifyEmailForm()
    {
        // Retrieve email from session
        $email = session('email');
    
        // Check if the email is available, otherwise redirect
        if (!$email) {
            return redirect('register')->withErrors('No email found, please register again.');
        }
    
        return view('auth.verify-email', compact('email'));
    }
    

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Check for referral token
        $referralToken = $request->query('ref');
        $referrer = null;

        if ($referralToken) {
            $referrer = Referral::where('token', $referralToken)->first();

            if ($referrer) {
                // Increment the referrer's credits
                $referrerUser = User::find($referrer->user_id);
                $referrerUser->credits += 1;
                $referrerUser->save();
            }
        }
    
        // Generate a 6-digit verification code
        $verificationCode = mt_rand(100000, 999999);
    
        // Create the user with verification code
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'verification_code' => $verificationCode,
        ]);
    
        // Send verification email
        Mail::to($request->email)->send(new VerifyEmail($verificationCode));
    
        // Store email in session
        session(['email' => $request->email]);
    
        return redirect('verify-email')->with('success', 'Registration successful! Please check your email for verification.');
    }
    
    public function verifyEmail(Request $request)
    {
        // Validate the verification code only
        $request->validate([
            'verification_code' => 'required|string|size:6',
        ]);
    
        // Retrieve the email from the session
        $email = $request->session()->get('email');
    
        // Find the user by email
        $user = User::where('email', $email)->first();
    
        if ($user && $user->verification_code === $request->verification_code) {
            // Mark email as verified and remove the verification code
            $user->verification_code = null;
            $user->email_verified_at = now();
            $user->save();
    
            // Clear the email from the session
            $request->session()->forget('email');
    
            return redirect('login')->with('success', 'Email verified successfully!');
        }
    
        return back()->withErrors(['verification_code' => 'Invalid verification code.']);
    }
    
}
