<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GeminiAPI\Laravel\Facades\Gemini;

class ParaphraseController extends Controller
{
    /**
     * Handle the grammar correction request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function paraphrase(Request $request)
    {
        // Validate input to ensure 'content' field is present
        $validatedData = $request->validate([
            'content' => 'required|string|min:10',
        ]);

        // Strip HTML tags from content to clean the input
        $content = strip_tags($validatedData['content']);

        try {
            // Call Gemini API to paraphrase
            $result = Gemini::generateText(" Note: Paraphrase the content =>" . $content);

            // Return the result as a JSON response
            return response()->json(['summary' => $result]);
        } catch (\Exception $e) {
            // Handle any errors from the API or other sources
            return response()->json(['error' => 'Failed to fix the grammar. Please try again later.'], 500);
        }
    }
}


