<!-- resources/views/ads/show.blade.php -->
@extends('layouts.app')

@section('content')
<div class="max-w-4xl mx-auto py-10">
    <div class="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">{{ $ad->title }}</h1>

        <!-- Video Section -->
        <div class="relative">
            <video id="adVideo" class="w-full h-auto rounded-lg" controls>
                <source src="{{ asset('storage/' . $ad->video) }}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>

        <!-- Claim Button -->
        <div class="mt-6">
            <button id="claimButton" class="hidden w-full px-6 py-3 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 transition-colors duration-300">
                Claim Reward
            </button>
        </div>
    </div>
</div>

<script>
    const video = document.getElementById('adVideo');
    const claimButton = document.getElementById('claimButton');

    // Show the claim button when the video ends
    video.addEventListener('ended', function() {
        claimButton.style.display = 'block';
    });

    // Claim reward logic
    claimButton.addEventListener('click', function() {
        window.location.href = "{{ route('ads.claim', $ad->id) }}";
    });
</script>
@endsection
