@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-4">
    <h1 class="text-xl font-bold">Create Challenge</h1>

    @if(session('success'))
        <div class="bg-green-500 text-white p-2 rounded mt-2">{{ session('success') }}</div>
    @endif

    <form action="{{ route('challenges.store') }}" method="POST" class="mt-4">
        @csrf
        <div class="mb-4">
            <label for="title" class="block">Title</label>
            <input type="text" name="title" id="title" class="border rounded p-2 w-full" required>
        </div>

        <div class="mb-4">
            <label for="description" class="block">Description</label>
            <textarea name="description" id="description" class="border rounded p-2 w-full" rows="4" required></textarea>
        </div>

        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Create Challenge</button>
    </form>
</div>
@endsection
