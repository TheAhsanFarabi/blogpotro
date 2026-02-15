@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-10">
    <div class="flex flex-col items-center">
        <h1 class="text-4xl font-bold mb-4 text-center text-gray-800">TypeWizard Game</h1>
        <p class="text-lg mb-2 text-center text-gray-600">Type the following text as fast as you can:</p>
        
        <div class="relative bg-gray-100 p-4 rounded-md mb-6 text-center text-2xl font-medium text-gray-700 shadow-lg pointer-events-none" style="user-select: none;">
            <span>{{ $sentence }}</span>
            <div class="absolute inset-0 bg-white opacity-50 pointer-events-none"></div>
        </div>

        <form action="{{ url('/games/typewizard/result') }}" method="POST" id="typewizard-form" class="w-full max-w-lg space-y-4">
            @csrf
            <textarea name="typed_text" class="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="5" placeholder="Start typing..." id="typing-area"></textarea>
            <input type="hidden" name="original_text" value="{{ $sentence }}">
            <input type="hidden" name="time_taken" id="time_taken" value="0">
            <input type="hidden" name="typing_data" id="typing_data">
            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">Submit</button>
        </form>

        <div class="text-center mt-6">
            <h2 class="text-3xl font-semibold text-gray-800">Timer: <span id="timer">0</span> seconds</h2>
            <h3 class="text-xl font-medium text-gray-600">WPM: <span id="wpm">0</span></h3>
        </div>
    </div>
</div>

<script>
    let startTime = null;
    let interval = null;
    let wordCount = 0;
    let typingData = [];

    document.getElementById('typing-area').addEventListener('input', function() {
        if (!startTime) {
            startTime = Date.now();
            interval = setInterval(updateTimer, 1000); // Update every second
        }

        const text = this.value;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0).length; // Only count non-empty words
        const currentTime = Math.floor((Date.now() - startTime) / 1000); // Time in seconds

        if (words > wordCount) {
            wordCount = words;
            typingData.push({ time: currentTime, wpm: calculateWPM(words, currentTime) });
            document.getElementById('wpm').innerText = Math.round(calculateWPM(words, currentTime)); // Update WPM display
        }
    });

    document.getElementById('typewizard-form').addEventListener('submit', function() {
        clearInterval(interval);
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('time_taken').value = timeTaken;
        document.getElementById('typing_data').value = JSON.stringify(typingData); // Send typing data to server
    });

    function updateTimer() {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('timer').innerText = currentTime;
    }

    function calculateWPM(words, timeInSeconds) {
        return (words / timeInSeconds) * 60; // WPM formula
    }
</script>
@endsection
