<?php

namespace App\Http\Controllers;
use App\Models\Report;
use App\Models\User;
use App\Models\Blog;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    // Report a user
    public function reportUser(Request $request, User $user)
    {
        Report::create([
            'user_id' => auth()->id(),
            'reported_user_id' => $user->id,
            'reason' => $request->input('reason'),
            'details' => $request->input('details'),
        ]);

        $user->update(['is_reported' => true]); 

        return redirect()->back()->with('success', 'User has been reported.');
    }

    // Report a blog
    public function reportBlog(Request $request, Blog $blog)
    {
        Report::create([
            'user_id' => auth()->id(),
            'reported_blog_id' => $blog->id,
            'reason' => $request->input('reason'),
            'details' => $request->input('details'),
        ]);

        $blog->update(['is_reported' => true]);

        return redirect()->back()->with('success', 'Blog has been reported.');
    }
}

