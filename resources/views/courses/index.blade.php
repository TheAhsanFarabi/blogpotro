@extends('layouts.app')

@section('content')
<x-heading bgColor="bg-blue-400">
    Blogpotro Learning
</x-heading>
<div class="container mx-auto py-8">
    <h1 class="text-4xl font-bold text-center mb-12 text-gray-800">Courses</h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        @foreach ($courses as $course)
            <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                    <i class="fas fa-book mr-2 text-blue-500"></i> <!-- Icon added here -->
                    {{ $course->title }}
                </h2>
                <p class="text-gray-600 mb-6">{{ $course->description }}</p>
                <a href="{{ route('courses.show', $course) }}" class="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
                    View Course
                </a>
            </div>
        @endforeach
    </div>
</div>
@endsection
