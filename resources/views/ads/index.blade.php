<!-- resources/views/ads/index.blade.php -->
@extends('layouts.app')

@section('content')
<div class="max-w-6xl mx-auto py-10">
    <h1 class="text-3xl font-bold text-gray-800 mb-10 text-center">Available Ads</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @foreach($ads as $ad)
            <div class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                
                <!-- Video Thumbnail (Non-playable) -->
                <div class="relative w-full h-48">
                    <video class="w-full h-full object-cover rounded-t-lg pointer-events-none" muted>
                        <source src="{{ asset('storage/' . $ad->video) }}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div class="p-4">
                    <h3 class="text-xl font-bold text-gray-700">{{ $ad->title }}</h3>
                    
                    <!-- Button to Watch Ad -->
                    <div class="mt-3 text-center">
                        <a href="{{ route('ads.show', $ad->id) }}" class="block text-center bg-blue-500 text-black px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                            Watch Ad
                        </a>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>
@endsection
