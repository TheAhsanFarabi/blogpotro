@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-4">
    <h1 class="text-xl font-bold">{{ $challenge->title }}</h1>
    <p class="mt-2">{{ $challenge->description }}</p>
    <p class="mt-2"><strong>Expires At:</strong> {{ \Carbon\Carbon::parse($challenge->expires_at)->setTimezone('Asia/Dhaka')->format('F j, Y, g:i a') }}</p>

    @if($challenge->status === 'expired')
        <!-- Display expired message -->
        <div class="bg-red-500 text-white p-2 rounded mt-4">This challenge has expired.</div>

        <!-- Display all submissions after expiration -->
        <h2 class="text-lg font-semibold mt-6">Submissions</h2>

        @if($challenge->submissions->count() > 0)
            <ul class="mt-4 space-y-4">
                @foreach($challenge->submissions as $submission)
                    <li class="bg-gray-100 p-4 rounded border">
                        <p><strong>Submitted by:</strong> {{ $submission->user->name }}</p>
                        <p class="mt-2">{{ $submission->submission_text }}</p>
                        <p class="text-sm text-gray-500 mt-2"><strong>Submitted At:</strong> {{ \Carbon\Carbon::parse($submission->created_at)->setTimezone('Asia/Dhaka')->format('F j, Y, g:i a') }}</p>
                    </li>
                @endforeach
            </ul>
        @else
            <p class="mt-4">No submissions for this challenge.</p>
        @endif
    @else
        <!-- Show submission form if challenge is still active -->
        <form action="{{ route('challenges.submit', $challenge->id) }}" method="POST" class="mt-4">
            @csrf
            <div class="mb-4">
                <label for="content" class="block">Your Submission</label>
                <textarea name="content" id="content" class="border rounded p-2 w-full" rows="4" required></textarea>
            </div>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
        </form>
    @endif
</div>
@endsection
