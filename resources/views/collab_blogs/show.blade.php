@extends('layouts.app')

@section('content')




<div class="container mx-auto mt-8">
    <div class="bg-white shadow-md rounded-lg p-6">
    @if($collabBlog->image)
        <img src="{{ asset('storage/' . $collabBlog->image) }}" alt="{{ $space->name }} Image" class="w-full h-48 object-cover">
        @endif
        <!-- Blog Title and Content -->
        <h1 class="text-3xl font-bold my-4">{{ $collabBlog->title }}</h1>
        <p class="text-gray-700 mb-4">{!! $collabBlog->content !!}</p>


        @if($space->users->contains(auth()->user()))
        <!-- Edit Blog Button -->
        <a href="{{ route('collab_blogs.edit', [$space->id, $collabBlog->id]) }}" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-4 inline-block">Contribute</a>
        @endif
        @if($collabBlog->author_id == auth()->id())
        <!-- Delete Blog Form -->
        <form action="{{ route('collab_blogs.destroy', [$space->id, $collabBlog->id]) }}" method="POST" class="inline-block">
            @csrf
            @method('DELETE')
            <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onclick="return confirm('Are you sure you want to delete this blog?')">Delete Blog</button>
        </form>
        @endif

        <h2 class="text-xl font-semibold mt-6 mb-4">Contributors</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @foreach($contributors as $contributor)
            <div class="bg-gray-100 p-4 rounded-lg flex items-center">
                @if($contributor->profile_picture)
                <img src="{{ asset('storage/images/' . $contributor->profile_picture) }}" alt="{{ $contributor->name }}" class="w-12 h-12 rounded-full mr-4">
                @else
                <div class="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                @endif
                <span>{{ $contributor->name }}</span>
            </div>
            @endforeach
        </div>

        @if($space->users->contains(auth()->user()))
        <!-- Edit History Section -->
        <h2 class="text-xl font-semibold mt-6 mb-4">Edit History</h2>
        @if($collabBlog->histories->isEmpty())
            <p class="text-gray-500">No edit history available for this blog.</p>
        @else
            @foreach($collabBlog->histories as $history)
                <div class="bg-gray-100 p-4 mb-4 rounded-lg">
                    <h3 class="text-lg font-semibold">Edited on {{ $history->created_at->format('M d, Y H:i') }} by {{ $history->updatedBy->name }}</h3>
                    <p>Title: {{ $history->title }}</p>
                    <p>Content: {{ Str::limit($history->content, 150) }}</p>
                    <form action="{{ route('collab_blogs.rollback', [$space->id, $collabBlog->id, $history->id]) }}" method="POST" class="inline-block">
                        @csrf
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Rollback to this version</button>
                    </form>
                </div>
            @endforeach
        @endif

        @endif
    </div>
</div>
@endsection
