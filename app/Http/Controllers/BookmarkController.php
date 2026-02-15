<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    public function toggle(Blog $blog)
    {
        $user = auth()->user();

        if ($blog->isBookmarkedBy($user)) {
            $user->bookmarks()->detach($blog->id); // Remove bookmark
        } else {
            $user->bookmarks()->attach($blog->id); // Add bookmark
        }

        return redirect()->back()->with('success', 'Bookmark updated successfully!');
    }

    public function index()
    {
        $blogs = auth()->user()->bookmarks()->latest()->get();

        return view('user.bookmark', compact('blogs'));
    }
}
