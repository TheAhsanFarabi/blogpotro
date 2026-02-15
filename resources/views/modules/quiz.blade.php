@extends('layouts.app')

@section('content')
<div class="container mx-auto py-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-6">Quiz for {{ $module->title }}</h1>

    <form method="POST" action="{{ route('modules.storeQuiz', [$course, $module]) }}">
        @csrf
        @foreach ($module->quizzes as $quiz) {{-- Assuming you have a relationship set up --}}
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-700">{{ $quiz->question }}</h3>
                <div class="flex flex-col">
                    <label class="flex items-center mb-2">
                        <input type="radio" name="quiz[{{ $quiz->id }}]" value="{{ $quiz->option_1 }}" class="mr-2">
                        {{ $quiz->option_1 }}
                    </label>
                    <label class="flex items-center mb-2">
                        <input type="radio" name="quiz[{{ $quiz->id }}]" value="{{ $quiz->option_2 }}" class="mr-2">
                        {{ $quiz->option_2 }}
                    </label>
                    <label class="flex items-center mb-2">
                        <input type="radio" name="quiz[{{ $quiz->id }}]" value="{{ $quiz->option_3 }}" class="mr-2">
                        {{ $quiz->option_3 }}
                    </label>
                    <label class="flex items-center mb-2">
                        <input type="radio" name="quiz[{{ $quiz->id }}]" value="{{ $quiz->option_4 }}" class="mr-2">
                        {{ $quiz->option_4 }}
                    </label>
                </div>
            </div>
        @endforeach

        <button type="submit" class="inline-block px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition duration-300">
            Submit Quiz
        </button>
    </form>
</div>
@endsection
