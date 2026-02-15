@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-4">
    <h1 class="text-2xl font-bold mb-4">Active Challenges</h1>

    @if(session('success'))
        <div class="bg-green-500 text-white p-2 rounded mt-2">{{ session('success') }}</div>
    @endif

    <!-- Show Create Challenge button only for admin -->
    @if(auth()->user() && auth()->user()->is_admin)
        <div class="mb-4">
            <a href="{{ route('challenges.create') }}" class="bg-blue-500 text-white px-4 py-2 rounded">Create Challenge</a>
        </div>
    @endif

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @foreach($challenges as $challenge)
        <div class="bg-white shadow-md rounded-lg p-4 border border-gray-200">
            <h2 class="text-lg font-semibold">{{ $challenge->title }}</h2>
            <p class="text-gray-600">{{ $challenge->description }}</p>
            <p class="text-gray-500">Expires At: {{ \Carbon\Carbon::parse($challenge->expires_at)->setTimezone('Asia/Dhaka')->format('F j, Y, g:i a') }}</p>
            
            <!-- Display status -->
            <p class="text-gray-500">
                Status: 
                @if(now()->lt($challenge->expires_at) && !$challenge->winner)
                    <span class="text-green-500">Active</span>
                @else
                    <span class="text-red-500">Expired</span>
                @endif
            </p>

            <!-- Display winner name if a winner exists -->
            @if($challenge->winner)
                <p class="text-gray-500">Winner: {{ $challenge->winner->user->name }}</p>
            @endif

            <p class="text-gray-500">Total Submissions: {{ $challenge->submissions_count }}</p>

            <div class="mt-4">
                @if(auth()->user() && auth()->user()->is_admin && !$challenge->winner)
                    <a href="{{ route('challenges.review', $challenge->id) }}" class="text-blue-500 hover:underline">Review Submissions</a>
                @endif
                <a href="{{ route('challenges.show', $challenge->id) }}" class="text-blue-500 hover:underline">View Challenge</a>
            </div>
        </div>
        @endforeach
    </div>
</div>
@endsection
