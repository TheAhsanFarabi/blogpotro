@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-8">
    <h1 class="text-3xl font-bold mb-6">Edit Collaborative Blog</h1>

    <form action="{{ route('collab_blogs.update', [$space->id, $collabBlog->id]) }}" method="POST" class="bg-white shadow-md rounded-lg p-6" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="mb-4">
            <label for="title" class="block text-gray-700 font-bold mb-2">Blog Title</label>
            <input type="text" name="title" id="title" value="{{ $collabBlog->title }}" class="border border-gray-300 rounded-lg w-full p-2" required>
        </div>

        <div class="mb-4">
            <label for="content" class="block text-gray-700 font-bold mb-2">Content</label>
            <textarea name="content" id="content" class="border border-gray-300 rounded-lg w-full p-2" required>{{ $collabBlog->content }}</textarea>
        </div>

        <div class="mb-4">
            <label for="image" class="block text-gray-700 font-bold mb-2">Upload Image</label>
            <input type="file" name="image" id="image" class="border border-gray-300 rounded-lg w-full p-2" accept="image/*">
        </div>

        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update Blog</button>
    </form>
</div>
@endsection
