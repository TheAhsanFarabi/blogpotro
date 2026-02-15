@extends('layouts.app')

@section('content')
<x-heading bgColor="bg-violet-400">
    Blogpotro Gaming
</x-heading>
<div class="container mx-auto mt-10 text-center">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl">
            <img src="https://static-00.iconduck.com/assets.00/mouse-keyboard-icon-2048x1998-j24ydeow.png" alt="TypeWizard Game" class="w-full h-48 object-cover">
            <div class="p-6">
                <h2 class="text-2xl font-semibold mb-2 text-gray-800">TypeWizard Game</h2>
                <p class="text-gray-600 mb-4">Test your typing speed and spelling with this fun game!</p>
                <a href="{{ url('/games/typewizard') }}" class="text-blue-500 underline hover:text-blue-700">Play Now</a>
            </div>
        </div>

        <div class="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQdTzrUrEYjFkczmU4NN6a4PdlynIFkwtdiQ&s" alt="Synonym Game" class="w-full h-48 object-cover">
            <div class="p-6">
                <h2 class="text-2xl font-semibold mb-2 text-gray-800">Synonym Game</h2>
                <p class="text-gray-600 mb-4">Enhance your vocabulary with our multiple-choice synonym game!</p>
                <a href="{{ url('/games/synonym') }}" class="text-blue-500 underline hover:text-blue-700">Play Now</a>
            </div>
        </div>

        <div class="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl">
            <img src="https://cdn-icons-png.flaticon.com/512/7468/7468192.png" alt="Complete the Sentence Game" class="w-full h-48 object-cover">
            <div class="p-6">
                <h2 class="text-2xl font-semibold mb-2 text-gray-800">Complete the Sentence Game</h2>
                <p class="text-gray-600 mb-4">Challenge yourself to complete the sentences correctly!</p>
                <a href="{{ url('/games/complete-sentence') }}" class="text-blue-500 underline hover:text-blue-700">Play Now</a>
            </div>
        </div>
    </div>
</div>
@endsection
