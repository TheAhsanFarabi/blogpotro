<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Streak;

class StreakController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $streaks = Streak::where('user_id', $user->id)->orderBy('date')->get();

        return view('user.streaks', compact('streaks'));
    }
}