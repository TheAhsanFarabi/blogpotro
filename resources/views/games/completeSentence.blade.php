@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-10 text-center">
    <h1 class="text-3xl font-bold mb-6">Complete the Sentence Game</h1>
    
    <form action="{{ url('/games/complete-sentence/result') }}" method="POST" class="space-y-4">
        @csrf
        
        <p class="text-lg mb-4">
            {{ str_replace('_____', '', $sentence) }} 
            <input type="text" name="completed_word" class="inline-block w-32 p-1 border rounded text-center" required>
        </p>

        <input type="hidden" name="correct_word" value="{{ $correctWord }}">
        
        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">Submit</button>
    </form>

    <button id="hintButton" class="mt-4 bg-green-500 text-white py-2 px-4 rounded">Get a Hint</button>
    <p id="hint" class="mt-2 text-lg text-gray-600 hidden">{{ $hint }}</p>
</div>

<script>
    document.getElementById('hintButton').addEventListener('click', function() {
        const hint = document.getElementById('hint');
        hint.classList.toggle('hidden');
    });
</script>
@endsection
