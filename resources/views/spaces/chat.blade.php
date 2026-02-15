@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-6">Group Chat for {{ $space->name }}</h1>

    <!-- Chat Messages Section -->
    <div class="bg-white shadow-md rounded-lg p-6 mb-6 h-96 overflow-y-auto">
        @foreach($messages as $message)
        <div class="flex items-start mb-4">
            <!-- Profile Picture -->
            @if($message->user->profile_picture)
            <img src="{{ asset('storage/images/' . $message->user->profile_picture) }}" alt="{{ $message->user->name }}" class="w-10 h-10 rounded-full mr-4">
            @else
            <div class="w-10 h-10 rounded-full bg-gray-300 mr-4 flex items-center justify-center">
                <span class="text-gray-500 font-bold">{{ strtoupper(substr($message->user->name, 0, 1)) }}</span>
            </div>
            @endif

            <div class="flex-1">
                <div class="flex justify-between">
                    <h4 class="text-lg font-semibold">{{ $message->user->name }}</h4>
                    <span class="text-gray-400 text-sm">{{ $message->created_at->format('H:i') }}</span>
                </div>
                <p class="text-gray-700">{{ $message->message }}</p>
            </div>
        </div>
        @endforeach
    </div>

    <!-- Send Message Form -->
    <form action="{{ route('spaces.chat.store', $space->id) }}" method="POST" class="flex items-center space-x-4">
        @csrf
        <textarea name="message" class="border border-gray-300 p-2 w-full rounded-lg" placeholder="Type your message..." required></textarea>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Send</button>
    </form>
</div>
@endsection
