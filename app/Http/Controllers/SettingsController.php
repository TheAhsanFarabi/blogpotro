<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class SettingsController extends Controller
{
    // Show the settings form
    public function edit()
    {
        return view('settings.edit');
    }

    // Update user details
    public function update(Request $request)
    {
        $user = Auth::user();

        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'old_password' => 'required_with:password',
            'password' => 'nullable|confirmed|min:8',
        ]);

        // Check if the old password is correct
        if ($request->filled('password') && !Hash::check($request->input('old_password'), $user->password)) {
            return back()->withErrors(['old_password' => 'The old password is incorrect.']);
        }

        // Update user details
        $user->name = $request->input('name');
        $user->email = $request->input('email');

        if ($request->filled('password')) {
            $user->password = Hash::make($request->input('password'));
        }

        

        $user->save();

        return redirect()->route('settings.edit')->with('success', 'Profile updated successfully!');
    }

    // Delete user account
    public function destroy(Request $request)
    {
        $user = Auth::user();
        
        // Delete the profile picture if exists
        if ($user->profile_picture && Storage::exists('public/images/' . $user->profile_picture)) {
            Storage::delete('public/images/' . $user->profile_picture);
        }
        
        Auth::logout();
        $user->delete();

        return redirect('/')->with('success', 'Account deleted successfully!');
    }
}
