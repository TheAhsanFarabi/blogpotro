@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-10 text-center">
    <h1 class="text-3xl font-bold mb-6">Your Complete the Sentence Game Result</h1>
    
    @if($isCorrect)
        <p class="text-lg text-green-500">Correct! You completed the sentence correctly.</p>
    @else
        <p class="text-lg text-red-500">Incorrect! Try again.</p>
    @endif
    
    <h2 class="text-2xl font-semibold mt-6">Leaderboard</h2>
    <table class="min-w-full mt-4 bg-white border border-gray-300">
        <thead>
            <tr>
                <th class="py-2 border-b">User</th>
                <th class="py-2 border-b">Score</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($leaderboard as $entry)
                <tr class="hover:bg-gray-100">
                    <td class="py-2 border-b">{{ $entry->user->name }}</td>
                    <td class="py-2 border-b">{{ $entry->vocabulary_score }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <a href="{{ url('/games/complete-sentence') }}" class="mt-4 inline-block text-blue-500 underline">Play Again</a>
</div>
@endsection
