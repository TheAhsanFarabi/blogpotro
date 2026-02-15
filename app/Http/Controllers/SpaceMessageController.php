<?php

namespace App\Http\Controllers;

use App\Models\SpaceMessage;
use App\Models\Space;
use Illuminate\Http\Request;

class SpaceMessageController extends Controller
{
    public function index(Space $space)
    {
        $messages = SpaceMessage::where('space_id', $space->id)->with('user')->get();
        return view('spaces.chat', compact('space', 'messages'));
    }

    public function store(Request $request, Space $space)
    {
        $request->validate(['message' => 'required|string']);
        
        SpaceMessage::create([
            'space_id' => $space->id,
            'user_id' => auth()->id(),
            'message' => $request->message,
        ]);

        return back();
    }
}
