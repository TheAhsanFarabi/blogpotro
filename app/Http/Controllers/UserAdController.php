<?php

namespace App\Http\Controllers;

use App\Models\Ad;
use App\Models\UserAd;
use Illuminate\Http\Request;

class UserAdController extends Controller
{
    public function watch($adId)
    {
        $ad = Ad::findOrFail($adId);

        $userAd = UserAd::firstOrCreate(
            ['user_id' => auth()->id(), 'ad_id' => $adId],
            ['watched' => false, 'reward_claimed' => false]
        );

        return view('ads.watch', compact('ad', 'userAd'));
    }

    public function claimReward($userAdId)
    {
        $userAd = UserAd::findOrFail($userAdId);

        if ($userAd->watched && !$userAd->reward_claimed) {
            $userAd->update(['reward_claimed' => true]);

            // Reward the user with 1 credit (assuming there's a credit system in place)
            $user = auth()->user();
            $user->increment('credits', 1);

            return redirect()->back()->with('success', 'Reward claimed successfully');
        }

        return redirect()->back()->with('error', 'You cannot claim the reward yet');
    }
}
