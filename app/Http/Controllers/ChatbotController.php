<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GeminiAPI\Laravel\Facades\Gemini;
use Illuminate\Support\Facades\Auth;

class ChatbotController extends Controller
{
    /**
     * Handle the incoming chat request and get a response from Gemini API.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getResponse(Request $request)

    {


        $history = [
            [
                'message' => 'Your primary task is to assist in generating blog ideas in 100 words. Always response with plain text without any format like bold,italic,heading. Do not use ** in the response. My name is ' . Auth::user()->name . '. Your name is Potrobot and you work for blogpotro social media.',
                'role' => 'user',
            ],
            [
                'message' => 'Hello ' . Auth::user()->name . '! Yes, I am here to help you generate blog ideas. What would you like to focus on?',
                'role' => 'model',
            ],
        ];

        $chat = Gemini::startChat($history);


        $userMessage = $request->input('message');

        $botResponse = $chat->sendMessage($userMessage);

        return response()->json(['response' => $botResponse]);
    }
}
