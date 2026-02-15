<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Notification;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function like(Blog $blog)
    {
        $like = $blog->likes()->where('user_id', auth()->id())->first();

        if ($like) {
            $like->delete(); // Unlike if already liked
        } else {
            // Like the post
            $blog->likes()->create(['user_id' => auth()->id()]);

            // Send a notification to the post owner
            if (auth()->id() !== $blog->user_id) { // Avoid notifying the user if they like their own post
                Notification::create([
                    'user_id' => $blog->user_id, // The owner of the post
                    'type' => 'like',
                    'data' => [
                        'sender_id' => auth()->user()->id,
                        'sender_profile_pic' => auth()->user()->profile_picture,
                        'message' => auth()->user()->name . ' liked your blog: ',
                        'blog_id' => $blog->id,
                        'blog_title'=>$blog->title,

                    ],
                ]);
            }
        }

        return back();
    }
}
