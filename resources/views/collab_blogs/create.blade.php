@extends('layouts.app')

@section('content')
    <div class="container mx-auto mt-8">
        <h1 class="mb-6 text-3xl font-bold">Create Collaborative Blog</h1>

        <form action="{{ route('collab_blogs.store', $space->id) }}" method="POST" class="rounded-lg bg-white p-6 shadow-md"
            enctype="multipart/form-data">
            @csrf
            <div class="mb-4">
                <label for="title" class="mb-2 block font-bold text-gray-700">Blog Title</label>
                <input type="text" name="title" id="title" class="w-full rounded-lg border border-gray-300 p-2"
                    required>
            </div>

            <!-- Trumbowyg CSS -->
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.27.3/ui/trumbowyg.min.css">

            <div class="mb-4">
                <label for="content" class="mb-2 block font-bold text-gray-700">Content</label>
                <textarea name="content" id="content" class="w-full rounded-lg border border-gray-300 p-2" required></textarea>
            </div>

            <!-- Upload Image -->
            <div class="mb-4">
                <label for="image" class="mb-2 block font-bold text-gray-700">Upload Image</label>
                <input type="file" name="image" id="image" class="w-full rounded-lg border border-gray-300 p-2"
                    accept="image/*">
            </div>

            <button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Create Blog</button>
        </form>
    </div>

    <!-- jQuery and Trumbowyg JS -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.27.3/trumbowyg.min.js"></script>
    
    <script>
        $(document).ready(function() {
            // Initialize Trumbowyg with heading buttons
            $('#content').trumbowyg({
                btns: [
                    ['viewHTML'],
                    ['formatting'],  // This includes headings like H1, H2, H3
                    ['strong', 'em', 'del'], // Text styling buttons
                    ['link', 'insertImage'], // Link and image insertion buttons
                    ['unorderedList', 'orderedList'], // Lists
                    ['table'], // Table insertion
                    ['preformatted'], // Preformatted text
                    ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'], // Justification
                    ['horizontalRule'], // Horizontal line
                    ['removeformat'], // Remove formatting
                    ['fullscreen'], // Fullscreen mode
                    ['preview'], // Preview mode
                    ['template'], // Custom template
                ]
            });
        });
    </script>
@endsection
