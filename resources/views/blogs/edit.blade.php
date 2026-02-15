@extends('layouts.app')

@section('content')
    <div class="container mx-auto p-4">
        @if ($errors->any())
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif


        
        <form action="{{ isset($blog) ? route('blogs.update', $blog->id) : route('blogs.store') }}" method="POST"
            enctype="multipart/form-data" class="p-6 rounded-lg shadow-md mb-2 {{ $blog->theme['background_color'] ?? 'bg-white' }} " id="theme-container" >
            @csrf
            @if (isset($blog))
                @method('PUT')
            @endif

            <!-- Image preview -->
            <img id="image-preview" src="{{ isset($blog) && $blog->image ? asset('storage/' . $blog->image) : '' }}"
                alt="Image Preview"
                class="my-4 w-full lg:w-1/2 h-64 rounded-lg object-cover {{ isset($blog) && $blog->image ? '' : 'hidden' }}">

            <!-- Title Input -->
            <div class="mb-4 relative">
                <input type="text" name="title" id="title" placeholder="Title"
                    value="{{ old('title', $blog->title ?? '') }}"
                    class="w-full text-3xl font-semibold text-gray-800 placeholder-gray-400 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 transition duration-300 outline-none">
                <p id="title-warning" class="text-red-600 hidden">Cyberbully word detected in the title!</p>
            </div>

            <!-- Content Input -->
            <div class="mb-4 relative">
                <textarea name="content" id="content" rows="10" placeholder="Tell your story..."
                    class="w-full text-lg text-gray-800 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 resize-none mb-4">{{ old('content', $blog->content ?? '') }}</textarea>
                <p id="content-warning" class="text-red-600 hidden">Cyberbully word detected in the content!</p>
                <p id="char-count" class="absolute bottom-2 right-2 text-sm text-gray-500">0/100 characters</p>
                <div id="plagiarism-warning"
                    class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 hidden" role="alert">
                </div>
            </div>


            <!-- Category Selection & Privacy -->
            <div class="flex flex-row justify-start items-center space-x-3 mb-4">
                <div>
                    <label for="category" class="block text-gray-700 font-semibold">Category</label>
                    <select name="category_id" id="category"
                        class="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required>
                        @foreach ($categories as $category)
                            <option value="{{ $category->id }}"
                                {{ isset($blog) && $blog->category_id == $category->id ? 'selected' : '' }}>
                                {{ $category->name }}
                            </option>
                        @endforeach
                    </select>

                </div>

                <div>
                    <label for="privacy" class="block text-gray-700 font-semibold">Privacy</label>
                    <select name="privacy" id="privacy" class="w-full border border-gray-300 p-2 rounded">
                        <option value="public" {{ isset($blog) && $blog->privacy == 'public' ? 'selected' : '' }}>Public
                        </option>
                        <option value="private" {{ isset($blog) && $blog->privacy == 'private' ? 'selected' : '' }}>Private
                        </option>
                    </select>
                </div>
               
            </div>

            <div>
                <label for="image" class="block text-gray-700 font-semibold">Upload Image</label>
                <input type="file" name="image" id="image" accept="image/*"
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>
           

            <x-blog-theme-input/>



            



            <!-- Submit Button -->
            <button type="submit" id="publish-btn"
                class="bg-gray-300 text-white px-4 py-2 rounded-lg cursor-not-allowed">
                {{ isset($blog) ? 'Update Blog' : 'Create Blog' }}
            </button>
        </form>

        <x-grammar-check />
        <x-paraphrase />
        <x-tone-check />
        <x-plagiarism-check />
        <x-cybersafe-shield :$cyberbullyWords />


    </div>









@endsection
