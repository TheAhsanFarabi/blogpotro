<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    // Show the chat interface with a list of users to chat with
    public function index()
    {
        $user = Auth::user();
        $users = User::where('id', '!=', $user->id)
            ->where(function ($query) use ($user) {
                $query->whereExists(function ($query) use ($user) {
                    $query->select('*')
                          ->from('followers')
                          ->whereColumn('user_id', 'users.id')
                          ->where('follower_id', $user->id);
                })
                ->whereExists(function ($query) use ($user) {
                    $query->select('*')
                          ->from('followers')
                          ->whereColumn('follower_id', 'users.id')
                          ->where('user_id', $user->id);
                });
            })
            ->get();

        // Get messages for the current chat user if available
        $currentChatUser = session('currentChatUser');
        $messages = [];
        if ($currentChatUser) {
            $messages = Message::where(function ($query) use ($user, $currentChatUser) {
                $query->where('sender_id', $user->id)
                      ->where('receiver_id', $currentChatUser->id);
            })->orWhere(function ($query) use ($user, $currentChatUser) {
                $query->where('sender_id', $currentChatUser->id)
                      ->where('receiver_id', $user->id);
            })->get();
        }

        return view('chat.index', compact('users', 'messages'));
    }

    // Show the chat conversation with a specific user
    public function show(User $user)
    {
        $authUser = Auth::user();
        $messages = Message::where(function ($query) use ($authUser, $user) {
            $query->where('sender_id', $authUser->id)
                  ->where('receiver_id', $user->id);
        })->orWhere(function ($query) use ($authUser, $user) {
            $query->where('sender_id', $user->id)
                  ->where('receiver_id', $authUser->id);
        })->get();

        // Store the current chat user in the session
        session(['currentChatUser' => $user]);

        return redirect()->route('chat.index'); // Redirect to index to show the chat
    }

    public function fetchMessages(User $user)
{
    $authUser = Auth::user();
    $messages = Message::where(function ($query) use ($authUser, $user) {
        $query->where('sender_id', $authUser->id)
              ->where('receiver_id', $user->id);
    })->orWhere(function ($query) use ($authUser, $user) {
        $query->where('sender_id', $user->id)
              ->where('receiver_id', $authUser->id);
    })->get();

    return response()->json(['messages' => $messages]);
}

public function store(Request $request, User $user)
{
    $request->validate([
        'message' => 'required|string',
    ]);

    // Check for duplicate message based on recent messages (optional)
    $recentMessage = Message::where('sender_id', Auth::id())
        ->where('receiver_id', $user->id)
        ->where('message', $request->message)
        ->where('created_at', '>=', now()->subSeconds(5)) // Change the time as needed
        ->first();

    if ($recentMessage) {
        return response()->json(['message' => 'Duplicate message'], 409);
    }

    Message::create([
        'sender_id' => Auth::id(),
        'receiver_id' => $user->id,
        'message' => $request->message,
    ]);

    return response()->json(['message' => $request->message]);
}

}
