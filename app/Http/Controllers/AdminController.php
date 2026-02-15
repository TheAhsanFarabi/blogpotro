<?php

namespace App\Http\Controllers;
use App\Models\Notification;
use App\Models\Report;
use App\Models\Blog;
use App\Models\Space;
use App\Models\Short;
use App\Models\BookSnap;
use App\Models\User;
use App\Models\Category;
use App\Models\Ad;
use App\Models\Subscription;
use App\Models\Feedback;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Count of users and blogs
        $userCount = User::count();
        $blogCount = Blog::count();
        $spaceCount = Space::count();
        $shortCount = Short::count();
        $snapCount = BookSnap::count();

        // Total credits system
        $totalCredits = 10000;
        $totalCreditsUsed = User::sum('credits');
        $remainingCredits = $totalCredits - $totalCreditsUsed;

        // Blogs count based on category
        $blogCategories = Category::withCount('blogs')->pluck('blogs_count', 'name');

        // Ads watched count per ad_id
        $adsWatchedPerAd = DB::table('ad_user')
            ->select('ad_id', DB::raw('count(distinct user_id) as user_count'))
            ->groupBy('ad_id')
            ->get();

        // Subscriptions purchased count (grouped by type)
        $subscriptionsPurchased = DB::table('subscriptions')
            ->select('pack_type', DB::raw('count(*) as count'))
            ->groupBy('pack_type')
            ->get();


        // Most liked blogs (5)
    $mostLikedBlogs = Blog::withCount('likes')
    ->orderBy('likes_count', 'desc')
    ->take(5)
    ->get();

// Most viewed blogs (5)
$mostViewedBlogs = Blog::orderBy('views', 'desc')
    ->take(5)
    ->get();



        return view('admin.dashboard', compact(
            'userCount',
            'blogCount',
            'spaceCount',
            'snapCount',
            'shortCount',
            'remainingCredits',
            'blogCategories',
            'adsWatchedPerAd',
            'subscriptionsPurchased',
            'mostLikedBlogs',
        'mostViewedBlogs'
        ));
    }

    public function showFeedbacks()
{
    // Fetch all feedbacks from the database
    $feedbacks = Feedback::all(); // Adjust this according to your Feedback model

    return view('admin.feedbacks', compact('feedbacks'));
}

    // View all reports
    public function reports()
    {
        $reports = Report::where('resolved', false)->get(); // Get unresolved reports
        return view('admin.reports', compact('reports'));
    }

    // Send warning notification to user
    public function sendWarning(User $user)
    {
        Notification::create([
            'user_id' => $user->id,
            'type' => 'warning',
            'data' => [
                'message' => 'Someone reported you! You will be banned if you break our rules again.',
            ],
        ]);
        
        return redirect()->back()->with('success', 'Warning sent to the user.');
    }

    // Delete a user
    public function deleteUser(User $user)
    {
        $user->delete(); // Delete the user
        return redirect()->back()->with('success', 'User has been deleted.');
    }

    // Delete a blog
    public function deleteBlog(Blog $blog)
    {
        $blog->delete(); // Delete the blog
        return redirect()->back()->with('success', 'Blog has been deleted.');
    }
}

