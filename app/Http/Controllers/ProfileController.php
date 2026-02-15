<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show($id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Fetch the blogs associated with this user
        $blogs = $user->blogs()->withCount(['likes', 'comments'])->get();

        return view('user.profile', compact('user', 'blogs'));
    }
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        // Validate the request
        $request->validate([
            'bio' => 'nullable|string|max:500',
            'institute' => 'nullable|string|max:255',
            'dob' => 'nullable|date',
            'work_experience' => 'nullable|string|max:1000',
            'profile_theme' => 'nullable|string|max:20',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:10240',
            'status' => 'nullable|string|max:255',
            'avatar_effect' => 'nullable|string|max:255',
            'banner_theme' => 'nullable|string|max:255',
        ]);
    
        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture if it exists
            if ($user->profile_picture && Storage::exists('public/images/' . $user->profile_picture)) {
                Storage::delete('public/images/' . $user->profile_picture);
            }
    
            // Store new profile picture and update the user model
            $profilePicturePath = $request->file('profile_picture')->store('images', 'public');
            $user->profile_picture = basename($profilePicturePath);
        }
    
        // Update the user fields only if they are filled
        $user->bio = $request->filled('bio') ? $request->input('bio') : $user->bio;
        $user->institute = $request->filled('institute') ? $request->input('institute') : $user->institute;
        $user->dob = $request->filled('dob') ? $request->input('dob') : $user->dob;
        $user->work_experience = $request->filled('work_experience') ? $request->input('work_experience') : $user->work_experience;
        $user->profile_theme = $request->filled('profile_theme') ? $request->input('profile_theme') : $user->profile_theme;
        $user->status = $request->filled('status') ? $request->input('status') : $user->status;
        $user->avatar_effect = $request->filled('avatar_effect') ? $request->input('avatar_effect') : $user->avatar_effect;
        $user->banner_theme = $request->filled('banner_theme') ? $request->input('banner_theme') : $user->banner_theme;
    
        // Update the status_created_at timestamp if the status has been updated
        if ($request->filled('status')) {
            $user->status_created_at = now();
        }
    
        // Save the updated user model
        $user->save();
    
        // Redirect back with a success message
        return redirect()->route('profile.show', $user->id)->with('success', 'Profile updated successfully!');
    }
    


    // public function customize(Request $request, $id)
    // {

    //     $user = User::findOrFail($id);
    //     $request->validate(['profile_theme' => 'nullable|string|max:20',]);
    //     $user->update(['profile_theme' => $request->input('profile_theme'),]);
    //     return redirect()->back()->with('success', 'Theme updated successfully!');
    // }

    public function follow($id)
    {
        $user = User::findOrFail($id);

        if (!Auth::user()->isFollowing($user)) {
            Auth::user()->following()->attach($user->id);
        }

        Notification::create([
            'user_id' => $user->id, // The owner of the post
            'type' => 'follow',
            'data' => [
                'sender_id' => auth()->user()->id,
                'sender_profile_pic' => auth()->user()->profile_picture,
                'message' => auth()->user()->name . ' started following you ',
                'blog_id' => NULL,
                'blog_title' => NULL,

            ],
        ]);

        return redirect()->back();
    }

    public function unfollow($id)
    {
        $user = User::findOrFail($id);

        if (Auth::user()->isFollowing($user)) {
            Auth::user()->following()->detach($user->id);
        }

        return redirect()->back();
    }
}
