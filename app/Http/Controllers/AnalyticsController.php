<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Blog;

class AnalyticsController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Fetch blogs for the authenticated user
        $blogs = Blog::where('user_id', $user->id)->withCount(['likes', 'comments'])->get();

        // Prepare data for the chart
        $data = [
            'labels' => $blogs->pluck('title'),
            'views' => $blogs->pluck('views'),  // Assuming you have a views field
            'likes' => $blogs->pluck('likes_count'),
            'comments' => $blogs->pluck('comments_count'),
            'followers'=> $user->followers()->count(),
        ];

        // Calculate total views and likes
        $totalViews = $blogs->sum('views');
        $totalLikes = $blogs->sum('likes_count');
        $followerCount = $user->followers()->count(); // Count of followers
        $totalPremiumBlogs = Blog::where('is_pro', true)->count();
        // Check if the user has at least 3 followers
        $hasFollower = $followerCount >= 3; 

        // Check monetization requirements
        $requirements = [
            'views' => $totalViews >= 1000,
            'likes' => $totalLikes >= 5,
            'followers' => $hasFollower,
        ];

        // Calculate progress
        $progress = [
            'views' => min($totalViews / 1000 * 100, 100), // Progress in percentage
            'likes' => min($totalLikes / 5 * 100, 100),    // Progress in percentage
            'followers' => min($followerCount / 3 * 100, 100), // Progress based on the number of followers
        ];

        return view('analytics.index', compact('data', 'requirements', 'progress', 'hasFollower','totalPremiumBlogs'));
    }

    public function activateMonetization()
    {
        $user = Auth::user();

        // Check monetization requirements
        if ($user->is_monetized) {
            return redirect()->back()->with('success', 'You are already monetized.');
        }

        $totalViews = Blog::where('user_id', $user->id)->sum('views');
        $totalLikes = Blog::where('user_id', $user->id)->withCount('likes')->get()->sum('likes_count');
        $followerCount = $user->followers()->count(); // Count of followers
        $hasFollower = $followerCount >= 3; // Check if the user has at least 3 followers

        // Validate if all requirements are fulfilled
        if ($totalViews >= 1000 && $totalLikes >= 5 && $hasFollower) {
            // Activate monetization
            $user->is_monetized = true;
            $user->save();

            return redirect()->back()->with('success', 'Monetization activated successfully!');
        }

        return redirect()->back()->with('error', 'You do not meet all the requirements for monetization.');
    }
}
