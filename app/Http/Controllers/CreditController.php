<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CreditController extends Controller
{
    // Display the credits page
    public function index()
    {
        $user = Auth::user(); // Get the logged-in user
        $credits = $user->credits; // Fetch the user's current credits

        return view('user.credits', compact('credits')); // Pass credits to the view
    }

    // Handle coupon redemption
    public function redeemCoupon(Request $request)
    {
        $request->validate([
            'coupon_code' => 'required|string'
        ]);

        $user = Auth::user();
        $coupon = $request->input('coupon_code');

        if ($coupon === '2022') {
            // Add 10 credits to the user's account
            $user->credits += 10;
            $user->save();

            return redirect()->route('credits.index')->with('success', 'Coupon redeemed successfully! 10 credits have been added to your account.');
        } else {
            return redirect()->route('credits.index')->withErrors('Invalid coupon code.');
        }
    }
}