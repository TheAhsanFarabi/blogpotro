<?php


namespace App\Http\Controllers;

use App\Models\Ad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdController extends Controller
{
    // Show the ad upload form for admins
    public function create()
    {
        if (!Auth::user()->is_admin) {
            return redirect()->route('home')->with('error', 'Unauthorized access');
        }
        return view('ads.create');
    }

    // Store the ad in the database
    public function store(Request $request)
    {
        if (!Auth::user()->is_admin) {
            return redirect()->route('home')->with('error', 'Unauthorized access');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'video' => 'required|mimes:mp4|max:10240', // Ensure the video is an MP4 file and less than 10MB
        ]);

        // Store the uploaded video
        $path = $request->file('video')->store('ads', 'public');

        // Create the ad
        Ad::create([
            'title' => $request->title,
            'video' => $path,
        ]);

        return redirect()->route('ads.index')->with('success', 'Ad uploaded successfully');
    }

    // List all active ads for users to view
    public function index()
    {
        $ads = Ad::where('active', true)->get();
        return view('ads.index', compact('ads'));
    }

    // Show the ad for users to view and claim rewards
    public function show($id)
    {
        $ad = Ad::findOrFail($id);
        return view('ads.show', compact('ad'));
    }

    // Handle the reward claiming
    public function claim($id)
    {
        $ad = Ad::findOrFail($id);
        $user = Auth::user();

        // Check if the user has already claimed the reward for this ad
        if ($user->ads()->where('ad_id', $ad->id)->exists()) {
            return redirect()->route('ads.index')->with('error', 'You have already claimed the reward for this ad.');
        }

        // Attach the user to the ad, indicating they have watched it
        $user->ads()->attach($ad);

        // Increment the user's credits
        $user->increment('credits', 1);

        return redirect()->route('ads.index')->with('success', 'You have claimed 1 credit!');
    }
}
