<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\Space;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    public function invite(Request $request, Space $space)
    {
        // Validate the email input
        $request->validate(['email' => 'required|email']);

        // Check if the user with the provided email exists
        $user = \App\Models\User::where('email', $request->email)->first();

        if (!$user) {
            return back()->with('error', 'The user with this email does not exist.');
        }

        // Check if the user is already a member of the space
        if ($space->users()->where('user_id', $user->id)->exists()) {
            return back()->with('error', 'User is already a member of this space.');
        }

        // Check if an invitation has already been sent to this user for the space
        $existingInvitation = Invitation::where('space_id', $space->id)
            ->where('email', $request->email)
            ->where('accepted', false) // Make sure the invitation hasn't already been accepted
            ->first();

        if ($existingInvitation) {
            return back()->with('error', 'An invitation has already been sent to this user.');
        }

        // Create a new invitation
        Invitation::create([
            'space_id' => $space->id,
            'sender_id' => auth()->id(),
            'email' => $request->email,
        ]);

        // $user = User::where('email', $request->email)->first();

        // Notification::create([
        //     'user_id' => $user->id,
        //     'type' => 'space',
        //     'data' => [
        //         'sender_id'=> auth()->id(),
        //         'message' => 'You are invited to join the Space',
        //         'space_name'=> $space->name,
        //         'space_id'=>$space->id,
        //     ],
        // ]);

        return back()->with('success', 'Invitation sent successfully.');
    }

    public function accept($invitationId)
    {
        $invitation = Invitation::findOrFail($invitationId);
        $invitation->accepted = true;
        $invitation->save();

        // Add user to the space
        $space = $invitation->space;
        $space->users()->attach(auth()->id()); # BUG HERE

        return redirect()->route('spaces.show', $space->id)->with('success', 'Invitation accepted. You can now interact in the space.');
    }
}
