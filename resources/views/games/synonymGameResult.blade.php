@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-10 text-center">
    <h1 class="text-3xl font-bold mb-6">Your Synonym Game Result</h1>
    @if($isCorrect)
        <p class="text-lg text-green-500">Correct! You chose: <span class="font-semibold">{{ $selectedAnswer }}</span></p>
    @else
        <p class="text-lg text-red-500">Incorrect. The correct answer was: <span class="font-semibold">{{ $correctAnswer }}</span></p>
    @endif

    <div class="mt-10">
        <h2 class="text-2xl font-bold mb-4">Leaderboard</h2>
        @if($leaderboard->isEmpty())
            <p class="text-lg">No scores recorded yet.</p>
        @else
            <table class="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <th class="py-3 px-6 text-left">Name</th>
                        <th class="py-3 px-6 text-left">Synonym Score</th>
                    </tr>
                </thead>
                <tbody class="text-gray-600 text-sm font-light">
                    @foreach($leaderboard as $entry)
                        <tr class="border-b border-gray-200 hover:bg-gray-100">
                            <td class="py-3 px-6">{{ $entry->user->name }}</td> <!-- Use user name -->
                            <td class="py-3 px-6">{{ $entry->synonym_score }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>
    <a href="{{ url('/games/synonym') }}" class="mt-4 inline-block text-blue-500 underline">Play Again</a>
</div>
@endsection
