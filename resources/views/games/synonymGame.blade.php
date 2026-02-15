@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-10 text-center">
    <h1 class="text-4xl font-bold mb-8 text-blue-600">Synonym Game</h1>
    <p class="text-xl mb-6 text-gray-700">What is the synonym of <span class="font-semibold text-blue-500">{{ $question['word'] }}</span>?</p>
    
    <form action="{{ url('/games/synonym/result') }}" method="POST" class="bg-white shadow-lg rounded-lg p-6 space-y-6">
        @csrf
        <div class="space-y-4">
            @foreach($question['choices'] as $choice)
                <div class="flex items-center p-4 border rounded-lg transition-colors hover:bg-gray-100">
                    <input type="radio" id="{{ $choice }}" name="answer" value="{{ $choice }}" class="mr-4 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                    <label for="{{ $choice }}" class="text-lg text-gray-800">{{ $choice }}</label>
                </div>
            @endforeach
        </div>
        <input type="hidden" name="correct_answer" value="{{ $question['correct'] }}">
        <button type="submit" class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200">Submit</button>
    </form>
</div>
@endsection
