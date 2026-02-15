<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GeminiAPI\Laravel\Facades\Gemini;

class ToneController extends Controller
{
    /**
     * Analyze the tone of the given text.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function analyzeTone(Request $request)
    {
        // Validate input to ensure 'content' field is present
        $validatedData = $request->validate([
            'content' => 'required|string|min:10',
        ]);

        // Clean the input by removing HTML tags
        $content = strip_tags($validatedData['content']);

        try {
            // Call Gemini API to analyze the tone of the input text
            $result = Gemini::generateText("Analyze the tone of the following text and describe it =>" . $content);

            // Return the result as a JSON response
            return response()->json(['summary' => $result]);
        } catch (\Exception $e) {
            // Handle any errors from the API or other sources
            return response()->json(['error' => 'Failed to analyze the tone. Please try again later.'], 500);
        }
    }
}

