@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-8">
    <h1 class="text-3xl font-bold mb-6">Create a New Space</h1>

    <form action="{{ route('spaces.store') }}" method="POST" class="bg-white shadow-md rounded-lg p-6" enctype="multipart/form-data">
        @csrf
        <div class="mb-4">
            <label for="name" class="block text-gray-700 font-bold mb-2">Space Name</label>
            <input type="text" name="name" id="name" class="border border-gray-300 rounded-lg w-full p-2" required>
        </div>

        <div class="mb-4">
            <label for="description" class="block text-gray-700 font-bold mb-2">Description</label>
            <textarea name="description" id="description" class="border border-gray-300 rounded-lg w-full p-2"></textarea>
        </div>

        <div class="mb-4">
            <label for="image" class="block text-gray-700 font-bold mb-2">Upload Image</label>
            <input type="file" name="cover_picture" id="image" class="border border-gray-300 rounded-lg w-full p-2" accept="image/*" onchange="previewImage(event)">

        </div>

        <div class="mb-4">
            <img id="imagePreview" src="#" alt="Image Preview" style="display: none; max-width: 200px;">
        </div>

        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create Space</button>
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
