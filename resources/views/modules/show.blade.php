@extends('layouts.app')

@section('content')
<div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="container mx-auto max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h1 class="text-5xl font-bold text-center text-gray-800 mb-10">{{ $module->title }}</h1>

        {{-- Video Section --}}
        <button id="toggleVideo" class="flex items-center justify-between inline-block mb-4 px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition duration-300 w-full">
            <span class="flex items-center">
                <i class="fas fa-video mr-2"></i>
                Show Video
            </span>
            <span class="ml-2 transform transition-transform duration-300" id="videoArrow">&#9660;</span>
        </button>
        <div id="videoSection" class="hidden mb-8">
            @if ($module->video_url)
                @php
                    // Convert YouTube URL to embeddable format
                    $embedUrl = str_replace('watch?v=', 'embed/', $module->video_url);
                @endphp
                <div class="relative h-64">
                    <iframe class="absolute top-0 left-0 w-full h-full rounded-xl" src="{{ $embedUrl }}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            @else
                <p class="text-gray-600">No video available for this module.</p>
            @endif
        </div>

        {{-- Notes Section --}}
        <button id="toggleNotes" class="flex items-center justify-between inline-block mb-4 px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition duration-300 w-full">
            <span class="flex items-center">
                <i class="fas fa-file-alt mr-2"></i>
                Show Notes
            </span>
            <span class="ml-2 transform transition-transform duration-300" id="notesArrow">&#9660;</span>
        </button>
        <div id="notesSection" class="hidden mb-8">
            @if ($module->notes)
                <p class="text-gray-600 text-center mb-8">{{ $module->notes }}</p>
            @else
                <p class="text-gray-600 text-center mb-8">No notes available for this module.</p>
            @endif
        </div>

        {{-- Quiz Section --}}
        <button id="toggleQuiz" class="flex items-center justify-between inline-block mb-4 px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition duration-300 w-full">
            <span class="flex items-center">
                <i class="fas fa-question-circle mr-2"></i>
                Show Quiz
            </span>
            <span class="ml-2 transform transition-transform duration-300" id="quizArrow">&#9660;</span>
        </button>
        <div id="quizSection" class="hidden mb-8">
            <div class="text-center">
                <a href="{{ route('modules.quiz', [$course, $module]) }}" class="inline-block px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition duration-300 shadow-lg">
                    Take Quiz
                </a>
            </div>
        </div>
    </div>
</div>

<script>
    // Show/Hide video section
    document.getElementById('toggleVideo').addEventListener('click', function () {
        const videoSection = document.getElementById('videoSection');
        const arrow = document.getElementById('videoArrow');
        videoSection.classList.toggle('hidden');
        arrow.innerHTML = videoSection.classList.contains('hidden') ? '&#9660;' : '&#9650;';
        this.querySelector('span').textContent = videoSection.classList.contains('hidden') ? 'Show Video' : 'Hide Video';
    });

    // Show/Hide notes section
    document.getElementById('toggleNotes').addEventListener('click', function () {
        const notesSection = document.getElementById('notesSection');
        const arrow = document.getElementById('notesArrow');
        notesSection.classList.toggle('hidden');
        arrow.innerHTML = notesSection.classList.contains('hidden') ? '&#9660;' : '&#9650;';
        this.querySelector('span').textContent = notesSection.classList.contains('hidden') ? 'Show Notes' : 'Hide Notes';
    });

    // Show/Hide quiz section
    document.getElementById('toggleQuiz').addEventListener('click', function () {
        const quizSection = document.getElementById('quizSection');
        const arrow = document.getElementById('quizArrow');
        quizSection.classList.toggle('hidden');
        arrow.innerHTML = quizSection.classList.contains('hidden') ? '&#9660;' : '&#9650;';
        this.querySelector('span').textContent = quizSection.classList.contains('hidden') ? 'Show Quiz' : 'Hide Quiz';
    });
</script>
@endsection
