@extends('layouts.app')

@section('content')
    <div class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-5">
        <h2 class="text-2xl font-bold mb-4">Give Feedback</h2>

        <!-- Encouraging message -->
        <p class="text-gray-700 mb-4">
            At Blogpotro, we value your opinions and ideas! Your feedback plays a crucial role in helping us improve and
            create a platform that best suits your needs. Whether it’s a new feature you’d love to see or something that
            could be better, we’re eager to hear from you. Together, we can shape the future of Blogpotro and make it the
            ultimate blogging space for writers and readers alike.
        </p>

        <p class="text-gray-700 mb-4">
            Please take a moment to share your thoughts with us. Your voice matters, and we’re committed to ensuring
            Blogpotro evolves with your input.
        </p>



        <form method="POST" action="{{ route('feedback.store') }}">
            @csrf

            <div class="mb-4">
                <label for="topic" class="block text-gray-700">Topic</label>
                <input type="text" name="topic" id="topic"
                    class="w-full border border-gray-300 p-2 rounded @error('topic') border-red-500 @enderror"
                    value="{{ old('topic') }}" required>
            </div>

            <div class="mb-4">
                <label for="details" class="block text-gray-700">Details</label>
                <textarea name="details" id="details" rows="5"
                    class="w-full border border-gray-300 p-2 rounded @error('details') border-red-500 @enderror" required>{{ old('details') }}</textarea>
            </div>

            <div class="mb-4">
                <label for="email" class="block text-gray-700">Email</label>
                <input type="email" name="email" id="email"
                    class="w-full border border-gray-300 p-2 rounded @error('email') border-red-500 @enderror"
                    value="{{ old('email') }}" required>
            </div>

            <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Submit Feedback</button>
        </form>
    </div>
@endsection
