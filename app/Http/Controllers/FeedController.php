<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;

class FeedController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Get the list of user IDs the authenticated user is following
        $followingIds = $user->following->pluck('id');

        // Start the query for blogs of followings
        $query = Blog::whereIn('user_id', $followingIds);


        // Fetch featured blogs
        $featuredBlogs = Blog::withCount(['likes', 'comments'])
            ->having('likes_count', '>=', 2)
            ->having('comments_count', '>=', 1)
            ->where('views', '>=', 10)
            ->orderByDesc('views')
            ->take(3)
            ->get();


        // Fetch top users
        $topUsers = User::whereHas('blogs', function ($query) {
            $query->havingRaw('COUNT(*) >= 2') // At least 2 blogs
                ->havingRaw('SUM(views) >= 20') // At least 20 total views
                ->havingRaw('SUM((SELECT COUNT(*) FROM likes WHERE blogs.id = likes.blog_id)) >= 2'); // At least 2 total likes from all blogs
        })
            ->whereNotNull('profile_picture') // Only users with profile pictures
            ->withCount('blogs')
            ->orderByDesc('blogs_count')
            ->take(3)
            ->get();

        // Apply category filter if selected
        if ($request->has('category') && $request->category) {
            $query->where('category_id', $request->category);
        }

        // Apply search filter if search query is provided
        if ($request->has('search') && $request->search) {
            $query->where(function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('content', 'like', '%' . $request->search . '%');
            });
        }

        // Get the filtered blogs and paginate
        $blogs = $query->latest()->paginate(10);

        // Get all categories for the filter dropdown
        $categories = Category::all();

        return view('user.feed', compact('featuredBlogs', 'topUsers', 'blogs', 'categories'));
    }
}
