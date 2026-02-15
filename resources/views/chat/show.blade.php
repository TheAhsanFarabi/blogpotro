@extends('layouts.app')

@section('content')
    <div class="flex flex-col h-screen mx-auto">
        <!-- Header -->
        <header class="bg-blue-600 text-white py-4 px-6 shadow-md flex items-center">
            <a href="{{ route('chat.index') }}" class="text-white hover:text-gray-200">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </a>
            <div class="ml-4 flex flex-row justify-center space-x-2">
                @if ($user->profile_picture)
                    <img src="{{ asset('storage/images/' . $user->profile_picture) }}" alt="Profile Picture"
                        class="w-10 h-10 rounded-full">
                @else
                    <img src="https://via.placeholder.com/50" alt="Default Avatar" class="w-10 h-10 rounded-full">
                @endif
                <h2 class="text-lg font-semibold">{{ $user->name }}</h2>
            </div>
        </header>

        <!-- Messages -->
        <main class="flex-1 overflow-auto p-6 bg-gray-100">
            <div class="space-y-4">
                @foreach ($messages as $message)
                    <div class="flex {{ $message->sender_id === Auth::id() ? 'justify-end' : 'justify-start' }}">
                        <div class="max-w-xs p-4 rounded-lg shadow-sm {{ $message->sender_id === Auth::id() ? 'bg-blue-500 text-white' : 'bg-white text-gray-800' }}">
                            <p>{{ $message->message }}</p>
                            <p class="text-xs text-black mt-1">{{ $message->created_at->diffForHumans() }}</p>
                        </div>
                    </div>
                @endforeach
            </div>
        </main>

        <!-- Message Input -->
        <footer class="bg-white border-t border-gray-300 py-4 px-6">
            <form action="{{ route('chat.store', $user->id) }}" method="POST" class="flex">
                @csrf
                <input type="text" name="message"
                    class="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Type a message...">
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2">Send</button>
            </form>
        </footer>
    </div>
@endsection
