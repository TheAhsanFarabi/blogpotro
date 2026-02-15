@extends('layouts.app')

@section('content')
<div class="container mx-auto max-w-lg p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-3xl font-bold mb-6">Create a Short</h1>
    
    <form action="{{ route('shorts.store') }}" method="POST" enctype="multipart/form-data" class="bg-white shadow-md rounded-lg p-6">
        @csrf

        <!-- Image (required) -->
        <div class="mb-4">
            <label for="image" class="block text-sm font-medium text-gray-700">Image (Required)</label>
            <input type="file" name="image" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300" required>
            @error('image')
                <small class="text-red-500 text-sm">{{ $message }}</small>
            @enderror
        </div>

        <!-- Optional Text (Max 100 words) -->
        <div class="mb-4">
            <label for="text" class="block text-sm font-medium text-gray-700">Text (Optional, Max 100 words)</label>
            <textarea name="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300" rows="3" maxlength="500">{{ old('text') }}</textarea>
            @error('text')
                <small class="text-red-500 text-sm">{{ $message }}</small>
            @enderror
        </div>

        <!-- Submit Button -->
        <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">Create Short</button>
    </form>
</div>
@endsection
