<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, Blog $blog)
    {
        $request->validate([
            'content' => 'required',
            'parent_id' => 'nullable|exists:comments,id'
        ]);

        $comment = $blog->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
            'parent_id' => $request->parent_id,
        ]);


        // Send a notification to the blog owner
        if (auth()->id() !== $blog->user_id) { // Avoid notifying the user if they like their own post
            Notification::create([
                'user_id' => $blog->user_id, // The owner of the post
                'type' => 'comment',
                'data' => [
                    'sender_id' => auth()->user()->id,
                    'sender_profile_pic' => auth()->user()->profile_picture,
                    'message' => auth()->user()->name . ' commented on your blog: ',
                    'blog_id' => $blog->id,
                    'blog_title' => $blog->title,

                ],
            ]);
        }

        return redirect()->back()->with('success', 'Comment added successfully!');
    }

    // Remove the specified comment from storage
    public function destroy(Blog $blog, Comment $comment)
    {

        // Ensure the logged-in user is the owner of the comment
        if ($comment->user_id !== Auth::id()) {
            return redirect()->back()->withErrors('You do not have permission to delete this comment.');
        }

        $comment->delete();

        return redirect()->back()->with('success', 'Comment deleted successfully!');
    }
}
