<!-- resources/views/ads/create.blade.php -->
@extends('layouts.app')

@section('content')
<div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Upload New Ad</h1>

    <form action="{{ route('ads.store') }}" method="POST" enctype="multipart/form-data" class="space-y-6">
        @csrf
        <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700">Ad Title</label>
            <input type="text" name="title" id="title" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
        </div>

        <div class="mb-4">
            <label for="video" class="block text-sm font-medium text-gray-700">Ad Video (MP4)</label>
            <input type="file" name="video" id="video" class="mt-1 block w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
        </div>

        <div>
            <button type="submit" class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Upload Ad
            </button>
        </div>
    </form>
</div>
@endsection
