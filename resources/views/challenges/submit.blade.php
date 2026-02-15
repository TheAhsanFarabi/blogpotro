@extends('layouts.app')

@section('content')
<div class="container mx-auto py-10 max-w-lg">
    <h1 class="text-2xl font-bold text-center mb-6">Submit Your Entry</h1>

    <form action="{{ route('challenges.submit', $challenge->id) }}" method="POST" class="bg-white p-6 rounded-lg shadow-lg">
        @csrf
        <div class="mb-4">
            <label for="content" class="block text-gray-700 font-semibold mb-2">Your Writing</label>
            <textarea name="content" id="content" rows="10" class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
        </div>

        <div class="text-center">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit</button>
        </div>
    </form>
</div>
@endsection
