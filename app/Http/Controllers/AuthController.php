<?php

namespace App\Http\Controllers;

use App\Models\Referral;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function showReferralPage(Request $request)
    {
        // Get the current user's referral token, if it exists
        $user = $request->user();
        $referral = $user->referral; // Assuming a one-to-one relationship in User model

        // Check if the referral link is expired
        $expiredReferralMessage = null;
        if ($referral && $referral->expires_at < now()) {
            $expiredReferralMessage = 'Your referral link has expired. You can regenerate it.';
            $referral = null; // Set referral to null since it has expired
        }

        // Pass the referral link and expired message to the view
        $referralLink = $referral ? url("register?ref={$referral->token}") : null;

        return view('user.referral', compact('referralLink', 'expiredReferralMessage'));
    }

    public function generateReferralLink(Request $request)
    {
        $user = $request->user();
        
        // Check if a referral token already exists
        $existingReferral = $user->referral; // Assuming a one-to-one relationship

        // Check if the existing referral token has expired
        if ($existingReferral && $existingReferral->expires_at > now()) {
            // Referral link already generated
            return redirect()->route('referral.page')->with('message', 'Referral link already generated.');
        }

        // Generate a new referral token since the existing one has expired or doesn't exist
        $token = Str::random(10);
        $expiresAt = now()->addDay();

        // Save token to the database
        Referral::updateOrCreate(
            ['user_id' => $user->id],
            ['token' => $token, 'expires_at' => $expiresAt]
        );

        return redirect()->route('referral.page')->with('message', 'Referral link generated successfully.');
    }
}
