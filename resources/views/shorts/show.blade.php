@extends('layouts.app')

@section('content')
<div class="container">
    <h1>View Short</h1>

    <!-- Short Content -->
    <div class="short-details">
        <!-- Image -->
        <div class="short-image">
            <img src="{{ asset('storage/' . $short->image) }}" alt="Short Image" class="img-fluid">
        </div>

        <!-- Optional Text -->
        @if($short->text)
        <div class="short-text mt-3">
            <p>{{ $short->text }}</p>
        </div>
        @endif
    </div>

    <!-- Edit and Delete Options (if user owns the short) -->
    <!-- @if(Auth::id() == $short->user_id)
    <div class="actions mt-4">
        <a href="{{ route('shorts.edit', $short->id) }}" class="btn btn-warning">Edit</a>
        <form action="{{ route('shorts.destroy', $short->id) }}" method="POST" style="display:inline-block;">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn btn-danger">Delete</button>
        </form>
    </div>
    @endif -->
</div>
@endsection
