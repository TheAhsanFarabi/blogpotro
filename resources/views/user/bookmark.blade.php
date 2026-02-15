@extends('layouts.app')

@section('content')
<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Bookmarked Blogs  <i class="fas fa-bookmark ml-2"></i></h1>

    @if($blogs->isEmpty())
        <p>You have no bookmarked blogs.</p>
    @else
       <x-blog-card :$blogs />
    @endif
</div>
@endsection
