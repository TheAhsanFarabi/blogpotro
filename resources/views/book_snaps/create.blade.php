@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-4">
    <h1 class="text-2xl font-bold mb-4">Create Book Snap</h1>

    <form action="{{ route('book_snaps.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        <div class="mb-4">
            <label for="title" class="block">Title:</label>
            <input type="text" name="title" id="title" class="w-full border rounded px-4 py-2">
        </div>

        <div class="mb-4">
            <label for="summary" class="block">Summary:</label>
            <textarea name="summary" id="summary" class="w-full border rounded px-4 py-2"></textarea>
        </div>

        <div class="mb-4">
            <label for="cover_photo" class="block">Cover Photo:</label>
            <input type="file" name="cover_photo" id="cover_photo" class="w-full">
        </div>

        <div class="mb-4">
            <label for="affiliate_link" class="block">Affiliate Link:</label>
            <input type="url" name="affiliate_link" id="affiliate_link" class="w-full border rounded px-4 py-2">
        </div>

        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
    </form>
</div>
@endsection
