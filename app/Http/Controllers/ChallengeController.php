<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Challenge;
use App\Models\Submission;
use App\Models\Notification; // Make sure to include Notification model
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ChallengeController extends Controller
{
    // Show list of active challenges
    public function index()
    {
        $challenges = Challenge::withCount('submissions') // Eager load the count of submissions
            ->where('expires_at', '>', now())
            ->get();

        return view('challenges.index', compact('challenges'));
    }

    // Show form to create a new challenge (Admin only)
    public function create()
    {
        if (!Auth::user()->is_admin) {
            return redirect()->route('challenges.index')->with('error', 'Unauthorized access.');
        }

        return view('challenges.create');
    }

    // Store a new challenge
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $challenge = new Challenge();
        $challenge->title = $request->title;
        $challenge->description = $request->description;
        $challenge->expires_at = Carbon::now()->addHours(6); // Expires in 6 hours
        $challenge->created_by = auth()->id(); // Set created_by to the ID of the authenticated user (admin)
        $challenge->save();

        return redirect()->route('challenges.index')->with('success', 'Challenge created successfully.');
    }

    public function show($id)
    {
        $challenge = Challenge::with('submissions.user')->findOrFail($id);

        // Check if challenge is still active or expired
        if (now()->gt($challenge->expires_at)) {
            return view('challenges.show', compact('challenge'));
        }

        return view('challenges.show', compact('challenge'));
    }


    public function submit(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $challenge = Challenge::findOrFail($id);

        // Check if challenge is still active
        if (now()->gt($challenge->expires_at)) {
            return redirect()->route('challenges.index')->with('error', 'This challenge has expired.');
        }

        // Check if the user has already submitted an entry for this challenge
        $existingSubmission = Submission::where('user_id', auth()->id())
            ->where('challenge_id', $challenge->id)
            ->first();

        if ($existingSubmission) {
            return redirect()->route('challenges.index')->with('error', 'You have already submitted an entry for this challenge.');
        }

        // Store the submission if the user hasn't submitted yet
        Submission::create([
            'user_id' => auth()->id(),
            'challenge_id' => $challenge->id,
            'submission_text' => $request->content,
        ]);

        return redirect()->route('challenges.index')->with('success', 'Submission received successfully.');
    }


    // Review submissions for a challenge (Admin only)
    public function review($id)
    {
        if (!Auth::user()->is_admin) {
            return redirect()->route('challenges.index')->with('error', 'Unauthorized access.');
        }

        $challenge = Challenge::findOrFail($id);

        // Eager load the user relationship with submissions
        $submissions = Submission::with('user')->where('challenge_id', $id)->get();

        return view('challenges.review', compact('challenge', 'submissions'));
    }

    // Declare winner and give credits (Admin only)
    public function declareWinner(Request $request, $id)
    {
        if (!Auth::user()->is_admin) {
            return redirect()->route('challenges.index')->with('error', 'Unauthorized access.');
        }

        $request->validate([
            'winner_id' => 'required|exists:submissions,user_id',
        ]);

        $challenge = Challenge::findOrFail($id);

        // Find the winning submission
        $winnerSubmission = Submission::where('challenge_id', $challenge->id)
            ->where('user_id', $request->winner_id)
            ->firstOrFail();

        // Mark the submission as the winner
        $winnerSubmission->is_winner = true;
        $winnerSubmission->save();

        // Award credits to the winner
        $user = $winnerSubmission->user;
        $user->credits += 10; // Award 10 credits
        $user->save();

        $challenge->status = 'expired';
        $challenge->save();

        // Notify the winner
        Notification::create([
            'user_id' => $user->id, // The owner of the winning submission
            'type' => 'challenge_winner',
            'data' => [
                'message' => 'Congratulations! You have won the challenge and received 10 credits.',
            ],
        ]);

        return redirect()->route('challenges.index')->with('success', 'Winner declared and 10 credits awarded.');
    }
}
