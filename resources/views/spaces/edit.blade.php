@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-8">
    <h1 class="text-3xl font-bold mb-6">Edit Space</h1>

    <form action="{{ route('spaces.update', $space->id) }}" method="POST" class="bg-white shadow-md rounded-lg p-6" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="mb-4">
            <label for="name" class="block text-gray-700 font-bold mb-2">Space Name</label>
            <input type="text" name="name" id="name" value="{{ $space->name }}" class="border border-gray-300 rounded-lg w-full p-2" required>
            @error('name')
                <p class="text-red-500 text-xs mt-2">{{ $message }}</p>
            @enderror
        </div>

        <div class="mb-4">
            <label for="description" class="block text-gray-700 font-bold mb-2">Description</label>
            <textarea name="description" id="description" class="border border-gray-300 rounded-lg w-full p-2">{{ $space->description }}</textarea>
            @error('description')
                <p class="text-red-500 text-xs mt-2">{{ $message }}</p>
            @enderror
        </div>

        <div class="mb-4">
            <label for="image" class="block text-gray-700 font-bold mb-2">Upload Image</label>
            <input type="file" name="cover_picture" id="image" class="border border-gray-300 rounded-lg w-full p-2" accept="image/*" onchange="previewImage(event)">
            @error('cover_picture')
                <p class="text-red-500 text-xs mt-2">{{ $message }}</p>
            @enderror
        </div>

        <div class="mb-4">
            @if($space->cover_picture)
                <img id="imagePreview" src="{{ $space->cover_picture }}" alt="Image Preview" style="max-width: 200px;">
            @else
                <img id="imagePreview" alt="Image Preview" style="max-width: 200px; display: none;">
            @endif
        </div>

        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update Space</button>
    </form>
</div>

<script>
    function previewImage(event) {
        var image = document.getElementById('imagePreview');
        var reader = new FileReader();
        reader.onload = function() {
            image.src = reader.result;
            image.style.display = 'block';
        }
        reader.readAsDataURL(event.target.files[0]);
    }
</script>
@endsection
