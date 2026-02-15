<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use App\Mail\ResetPasswordEmail;

class PasswordController extends Controller
{
    // Show the form to request a password reset link
    public function showResetRequestForm()
    {
        return view('auth.passwords.email');
    }

    // Send the password reset link to the provided email
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // Send password reset link
        $status = Password::sendResetLink(
            $request->only('email'),
            function ($user, $token) use ($request) {
                // Send email with reset link
                \Mail::to($request->email)->send(new ResetPasswordEmail($token));
            }
        );

        return $status === Password::RESET_LINK_SENT
            ? back()->with('status', __($status))
            : back()->withErrors(['email' => __($status)]);
    }

    // Show the form to reset the password
    public function showResetForm($token)
    {
        return view('auth.passwords.reset')->with('token', $token);
    }

    // Handle the password reset
    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
            'token' => 'required',
        ]);

        // Reset the password
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->setRememberToken(\Str::random(60));
                $user->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('login')->with('status', __('Your password has been reset successfully.'))
            : back()->withErrors(['email' => [__($status)]]);
    }
}
