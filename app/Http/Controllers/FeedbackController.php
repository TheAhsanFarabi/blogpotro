<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    // Show the feedback form
    public function create()
    {
        return view('feedback.create');
    }

    // Store feedback in the database
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'topic' => 'required|string|max:255',
            'details' => 'required|string',
            'email' => 'required|email',
        ]);

        // Store the feedback
        Feedback::create($request->all());

        return redirect()->back()->with('success', 'Your feedback has been submitted successfully!');
    }
}
