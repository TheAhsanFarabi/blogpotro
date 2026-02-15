@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-4">
    <h1 class="text-xl font-bold">Review Submissions for "{{ $challenge->title }}"</h1>
    <p class="mt-2">{{ $challenge->description }}</p>

    @if($submissions->isEmpty())
        <div class="bg-gray-200 p-4 rounded mt-4">No submissions yet.</div>
    @else
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            @foreach($submissions as $submission)
                <div class="bg-white shadow-md rounded-lg p-4 border border-gray-300">
                    <!-- User Profile and Name -->
                    <div class="flex items-center mb-4">
                        @if($submission->user && $submission->user->profile_picture)
                            <img src="{{ asset('storage/images/' . $submission->user->profile_picture) }}" alt="{{ $submission->user->name }}" class="w-12 h-12 rounded-full mr-3">
                        @else
                            <div class="w-12 h-12 rounded-full bg-gray-300 mr-3"></div>
                        @endif
                        <span class="text-lg font-semibold">{{ optional($submission->user)->name ?? 'Unknown User' }}</span>
                    </div>

                    <!-- Submission Text -->
                    <p class="text-gray-700 mb-4">{{ $submission->submission_text}}</p>

                    <!-- Declare Winner Button -->
                    <form action="{{ route('challenges.declareWinner', $challenge->id) }}" method="POST">
                        @csrf
                        <input type="hidden" name="winner_id" value="{{ $submission->user_id }}">
                        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded w-full">Declare Winner</button>
                    </form>
                </div>
            @endforeach
        </div>
    @endif
</div>
@endsection
