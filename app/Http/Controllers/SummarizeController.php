<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GeminiAPI\Laravel\Facades\Gemini;

class SummarizeController extends Controller
{
    /**
     * Handle the summarization request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function summarize(Request $request)
    {
        $content = strip_tags($request->input('content'));

        // Call Gemini API to summarize the content
        $summary = Gemini::generateText($content . " Note: Summarize the content in 5 sentence");

        return response()->json(['summary' => $summary]);
    }
}
