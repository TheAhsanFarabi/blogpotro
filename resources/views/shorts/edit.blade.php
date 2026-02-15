@extends('layouts.app')

@section('content')
<div class="container mx-auto max-w-lg p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-3xl font-semibold mb-6">Edit Short</h1>
    
    <form action="{{ route('shorts.update', $short->id) }}" method="POST" enctype="multipart/form-data" class="space-y-6">
        @csrf
        @method('PUT')

        <!-- Current Image (preview) -->
        <div>
            <label for="current_image" class="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
            <div class="w-32 h-32">
                <img src="{{ asset('storage/' . $short->image) }}" alt="Current Image" class="w-full h-full object-cover rounded-md">
            </div>
        </div>

        <!-- Upload New Image (optional) -->
        <div>
            <label for="image" class="block text-sm font-medium text-gray-700 mb-2">Change Image (Optional)</label>
            <input type="file" name="image" class="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring focus:border-blue-300">
            @error('image')
                <small class="text-red-500">{{ $message }}</small>
            @enderror
        </div>

        <!-- Optional Text (Max 100 words) -->
        <div>
            <label for="text" class="block text-sm font-medium text-gray-700 mb-2">Text (Optional, Max 100 words)</label>
            <textarea name="text" class="block w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300" rows="3" maxlength="500">{{ old('text', $short->text) }}</textarea>
            @error('text')
                <small class="text-red-500">{{ $message }}</small>
            @enderror
        </div>

        <!-- Submit Button -->
        <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all">Update Short</button>
    </form>
</div>
@endsection
