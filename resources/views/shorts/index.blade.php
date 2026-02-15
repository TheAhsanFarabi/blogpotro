@extends('layouts.app')

@section('content')
<div class="container mx-auto p-5">

    <h1 class="text-2xl font-bold mb-4 mt-6">Shorts</h1>

    <!-- Horizontal scrolling container for the shorts -->
    <div class="flex space-x-4 overflow-x-auto py-4 h-[220px]" style="scrollbar-width: thin;">
        @foreach ($shorts as $short)
            <div class="relative border p-2 min-w-[120px] max-w-[120px] h-full cursor-pointer short-item shadow-lg rounded-xl" data-id="{{ $short->id }}" data-text="{{ $short->text }}" data-image="{{ asset('storage/' . $short->image) }}" data-user-image="{{ asset('storage/images/' . $short->user->profile_picture) }}">
                <!-- Short image as background -->
                <div class="absolute inset-0 bg-cover bg-center rounded-xl" style="background-image: url('{{ asset('storage/' . $short->image) }}'); opacity: 0.7;"></div>
                
                <!-- User image -->
                <img src="{{ asset('storage/images/' . $short->user->profile_picture) }}" alt="User image" class="w-8 h-8 rounded-full mb-2 z-10 relative">
                
                <!-- Text overlay -->
                <!-- <p class="relative z-10">{{ $short->text }}</p> -->
            </div>
        @endforeach
    </div>

</div>

<!-- Modal Structure -->
<div id="shortModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 hidden z-50">
    <div class="bg-white p-4 rounded-lg max-w-lg w-full shadow-lg">
        <img id="modalUserImage" src="" alt="User image" class="w-12 h-12 rounded-full mb-2">
        <img id="modalShortImage" src="" alt="Short image" class="w-full h-48 object-cover mb-2">
        <p id="modalText"></p>
        <div class="mt-4">
            @auth
                <a id="editLink" href="" class="text-blue-500">Edit</a>
                <form id="deleteForm" action="" method="POST" class="inline-block">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="text-red-500">Delete</button>
                </form>
            @endauth
            <button class="mt-4 text-gray-500" onclick="closeModal()">Close</button>
        </div>
    </div>
</div>

<!-- Custom CSS for small scrollbar -->
<style>
    .container::-webkit-scrollbar {
        height: 6px;
    }
    .container::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 4px;
    }
    .container::-webkit-scrollbar-thumb:hover {
        background-color: #555;
    }
</style>

<!-- JavaScript to handle modal display -->
<script>
    document.querySelectorAll('.short-item').forEach(item => {
        item.addEventListener('click', () => {
            const text = item.getAttribute('data-text');
            const image = item.getAttribute('data-image');
            const userImage = item.getAttribute('data-user-image');
            const shortId = item.getAttribute('data-id');

            document.getElementById('modalText').textContent = text;
            document.getElementById('modalShortImage').src = image;
            document.getElementById('modalUserImage').src = userImage;
            document.getElementById('editLink').href = `/shorts/${shortId}/edit`;
            document.getElementById('deleteForm').action = `/shorts/${shortId}`;

            document.getElementById('shortModal').classList.remove('hidden');
        });
    });

    function closeModal() {
        document.getElementById('shortModal').classList.add('hidden');
    }
</script>
@endsection
