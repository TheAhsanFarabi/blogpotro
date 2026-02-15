<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Subscription;

class SubscriptionController extends Controller
{
    public function purchase(Request $request)
    {
        $user = Auth::user();
        $pack = $request->input('pack'); // 'student', 'standard', 'premium'
        $creditsRequired = [
            'student' => 10,
            'standard' => 20,
            'premium' => 30,
        ];

        if (!array_key_exists($pack, $creditsRequired)) {
            return back()->withErrors(['pack' => 'Invalid subscription pack.']);
        }

        $creditsNeeded = $creditsRequired[$pack];
        if ($user->credits < $creditsNeeded) {
            return back()->withErrors(['credits' => 'Not enough credits.']);
        }

        $user->credits -= $creditsNeeded;
        $user->save();

        // Create or update the user's subscription
        Subscription::updateOrCreate(
            ['user_id' => $user->id],
            [
                'pack_type' => $pack,
                'expires_at' => now()->addMonth(),
            ]
        );

        return redirect()->back()->with('success', 'Subscription purchased successfully!');
    }
}
