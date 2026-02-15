@extends('layouts.app')

@section('content')
    <div class="container mx-auto py-8">
        @if(session('success'))
            <div class="bg-green-500 text-white p-4 rounded-md mb-6">
                {{ session('success') }}
            </div>
        @endif

        @if ($errors->any())
            <div class="bg-red-500 text-white p-4 rounded-md mb-6">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h1 class="text-2xl font-semibold mb-6">Create a Product</h1>

            <form action="{{ route('store.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                
                <!-- Name -->
                <div class="mb-4">
                    <label for="name" class="block text-gray-700 font-medium mb-2">Product Name</label>
                    <input type="text" id="name" name="name" class="w-full border border-gray-300 rounded-lg p-2" value="{{ old('name') }}" required>
                </div>

                <!-- Description -->
                <div class="mb-4">
                    <label for="description" class="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea id="description" name="description" class="w-full border border-gray-300 rounded-lg p-2" required>{{ old('description') }}</textarea>
                </div>

                <!-- Price -->
                <div class="mb-4">
                    <label for="price" class="block text-gray-700 font-medium mb-2">Price (Credits)</label>
                    <input type="number" id="price" name="price" class="w-full border border-gray-300 rounded-lg p-2" value="{{ old('price') }}" required>
                </div>

                <!-- Type -->
                <div class="mb-4">
                    <label for="type" class="block text-gray-700 font-medium mb-2">Type</label>
                    <select id="type" name="type" class="w-full border border-gray-300 rounded-lg p-2" required>
                        <option value="tshirt">T-shirt</option>
                        <option value="book">Book PDF</option>
                        <option value="notebook">Notebook</option>
                    </select>
                </div>

                <!-- Product Image -->
                <div class="mb-4">
                    <label for="image_path" class="block text-gray-700 font-medium mb-2">Product Image</label>
                    <input type="file" id="image_path" name="image_path" class="w-full border border-gray-300 rounded-lg p-2" required>
                </div>

                <!-- File Upload (for Book PDFs only) -->
                <div class="mb-4" id="file_upload_container" style="display: none;">
                    <label for="file_path" class="block text-gray-700 font-medium mb-2">Upload Book PDF</label>
                    <input type="file" id="file_path" name="file_path" class="w-full border border-gray-300 rounded-lg p-2">
                </div>

                <button type="submit" class="w-full bg-blue-500 text-white p-3 rounded-lg shadow-lg hover:bg-blue-600">
                    Create Product
                </button>
            </form>
        </div>
    </div>

    <script>
        // Show file upload only for book type
        document.getElementById('type').addEventListener('change', function() {
            const fileUploadContainer = document.getElementById('file_upload_container');
            if (this.value === 'book') {
                fileUploadContainer.style.display = 'block';
            } else {
                fileUploadContainer.style.display = 'none';
            }
        });
    </script>
@endsection
