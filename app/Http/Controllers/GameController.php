<?php

namespace App\Http\Controllers;

use App\Models\Leaderboard; // Import the Leaderboard model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GameController extends Controller
{
    // Show the index page with the list of games
    public function index()
    {
        return view('games.index');
    }

    // Show TypeWizard game
    public function typeWizard()
    {
        // Placeholder sentence for typing game
        $sentences = [
            'The quick brown fox jumps over the lazy dog.',
            'Pack my box with five dozen liquor jugs.',
            'How razorback-jumping frogs can level six piqued gymnasts!',
            // Add more sentences as needed
        ];

        $sentence = $sentences[array_rand($sentences)]; // Randomly select a sentence
        return view('games.typeWizard', ['sentence' => $sentence]);
    }

    public function typeWizardResult(Request $request)
    {
        $typedText = $request->input('typed_text');
        $originalText = $request->input('original_text');
        $timeTaken = $request->input('time_taken');
        $typingData = json_decode($request->input('typing_data'), true);

        // Clean and split text into words
        $typedWords = preg_split('/\s+/', trim($typedText));
        $originalWords = preg_split('/\s+/', trim($originalText));

        // Calculate word count and WPM
        $wordCount = count($typedWords);
        $wpm = ($wordCount / $timeTaken) * 60;

        // Calculate spelling accuracy
        $errors = 0;
        foreach ($originalWords as $index => $word) {
            if (!isset($typedWords[$index]) || strtolower($typedWords[$index]) !== strtolower($word)) {
                $errors++;
            }
        }
        $accuracy = 100 - (($errors / count($originalWords)) * 100);

        $userId = Auth::id(); // Get the currently authenticated user ID
        Leaderboard::updateOrCreate(
            ['user_id' => $userId],
            ['wpm' => round($wpm, 2), 'synonymScore' => 0, 'vocabularyScore' => 0] // Adjust based on your game logic
        );
    
        // Fetch leaderboard data
        $leaderboard = Leaderboard::with('user') // Assuming you have a 'user' relationship defined
            ->orderBy('wpm', 'desc')
            ->get();
    
        return view('games.typeWizardResult', [
            'wpm' => round($wpm, 2),
            'accuracy' => round($accuracy, 2),
            'typingData' => $typingData,
            'leaderboard' => $leaderboard // Pass the leaderboard data to the view
        ]);
    }

    // Show Synonym Game
    public function synonymGame()
    {
        // Randomized questions and options
        $questions = [
            ['word' => 'happy', 'choices' => ['joyful', 'sad', 'angry'], 'correct' => 'joyful'],
            ['word' => 'fast', 'choices' => ['slow', 'quick', 'lazy'], 'correct' => 'quick'],
            ['word' => 'large', 'choices' => ['big', 'tiny', 'small'], 'correct' => 'big']
        ];
        $question = $questions[array_rand($questions)];
        return view('games.synonymGame', ['question' => $question]);
    }

    // Handle Synonym Game results
public function synonymGameResult(Request $request)
{
    $selectedAnswer = $request->input('answer');
    $correctAnswer = $request->input('correct_answer');

    $isCorrect = $selectedAnswer === $correctAnswer;

    // Calculate the score (1 point for correct answer)
    $score = $isCorrect ? 1 : 0;

    // Save or update the leaderboard entry for synonym score
    $userId = auth()->id(); // Get the currently authenticated user's ID
    Leaderboard::updateOrCreate(
        ['user_id' => $userId],
        ['synonym_score' => \DB::raw('synonym_score + ' . $score)] // Increment synonym score
    );

    // Retrieve the leaderboard for display, including user names
    $leaderboard = Leaderboard::with('user') // Join with users table
        ->orderBy('synonym_score', 'desc')
        ->get();

    return view('games.synonymGameResult', [
        'isCorrect' => $isCorrect,
        'selectedAnswer' => $selectedAnswer,
        'correctAnswer' => $correctAnswer,
        'leaderboard' => $leaderboard, // Pass the leaderboard data
    ]);
}

public function completeSentenceGame()
{
    // Array of sentences with their correct words and hints
    $sentences = [
        [
            'sentence' => "The cat is sitting on the _____",
            'correctWord' => "mat",
            'hint' => "It's something soft that animals often like to sit on."
        ],
        [
            'sentence' => "The dog is barking at the _____",
            'correctWord' => "mailman",
            'hint' => "He delivers letters and packages."
        ],
        [
            'sentence' => "The bird is flying in the _____",
            'correctWord' => "sky",
            'hint' => "It's above us and often blue."
        ],
        [
            'sentence' => "The fish swims in the _____",
            'correctWord' => "water",
            'hint' => "It's essential for life and covers most of the Earth."
        ],
        [
            'sentence' => "The sun sets in the _____",
            'correctWord' => "west",
            'hint' => "It's the opposite of east."
        ],
    ];

    // Randomly select one sentence for the game
    $selectedSentence = $sentences[array_rand($sentences)];

    return view('games.completeSentence', [
        'sentence' => $selectedSentence['sentence'],
        'correctWord' => $selectedSentence['correctWord'],
        'hint' => $selectedSentence['hint']
    ]);
}



    // Handle Complete a Sentence Game results
    public function completeSentenceResult(Request $request)
    {
        $completedWord = strtolower($request->input('completed_word'));
        $correctWord = strtolower($request->input('correct_word'));

        $isCorrect = $completedWord === $correctWord;

        // Calculate the score (1 point for correct answer)
        $score = $isCorrect ? 1 : 0;

        // Save or update the leaderboard entry for vocabulary score
        $userId = auth()->id(); // Get the currently authenticated user's ID
        Leaderboard::updateOrCreate(
            ['user_id' => $userId],
            ['vocabulary_score' => \DB::raw('vocabulary_score + ' . $score)] // Increment vocabulary score
        );

        // Retrieve the leaderboard for display
        $leaderboard = Leaderboard::orderBy('vocabulary_score', 'desc')->get();

        return view('games.completeSentenceResult', [
            'isCorrect' => $isCorrect,
            'leaderboard' => $leaderboard, // Pass the leaderboard data
        ]);
    }
}