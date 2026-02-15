<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 


class UserController extends Controller
{
    public function index()
    {
        // Fetch all users from the database
        $users = User::all();

        // Pass users to the view
        return view('user.index', compact('users'));

        
    }


// Store user categories
public function storeCategories(Request $request)
{
    $request->validate([
        'categories' => 'required|array', // Validate that categories are an array
    ]);

    $user = Auth::user();

    // Convert the array to a comma-separated string without any quotes or braces
    $formattedCategories = implode(',', $request->categories);

    // Store the formatted categories as a string
    $user->categories = $formattedCategories;
    $user->save();

    // Update first login status
    $this->updateFirstLoginStatus($request);

    return response()->json(['message' => 'Categories stored and first login status updated successfully.']);
}



   // Update first login status
public function updateFirstLoginStatus()
{
    $user = Auth::user();
    $user->is_first_login = false; // Update the first login status
    $user->save();

    return response()->json(['message' => 'First login status updated successfully.']);
}


// Make user admin
public function makeAdmin($id)
{
    // Ensure the authenticated user is an admin
    if (!Auth::user()->is_admin) {
        return redirect()->back()->with('error', 'You are not authorized to perform this action.');
    }

    // Find the user by ID
    $user = User::findOrFail($id);

    // Update the user's admin status
    $user->is_admin = true; // Assuming there is an 'is_admin' column in your users table
    $user->save();

    return redirect()->back()->with('success', 'User has been promoted to admin successfully.');
}


public function followers(User $user)
    {
        $followers = $user->followers; // assuming you have a followers relationship defined
        return view('search.followers', compact('user', 'followers'));
    }

    public function followings(User $user)
    {
        
        $followings = $user->following; // assuming you have a followings relationship defined
        return view('search.followings', compact('user', 'followings'));
    }

}
