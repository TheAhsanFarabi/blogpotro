@extends('layouts.app')
@section('title')
    {{ $blog->title }}
@endsection

@section('meta')
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="{{ $blog->title }}" />
    <meta property="og:description" content="{{ \Illuminate\Support\Str::limit(strip_tags($blog->content), 160) }}" />
    <meta property="og:image" content="{{ asset('storage/' . $blog->image) }}" />
    <meta property="og:url" content="{{ url()->current() }}" />
    <meta property="og:type" content="article" />

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $blog->title }}">
    <meta name="twitter:description" content="{{ \Illuminate\Support\Str::limit(strip_tags($blog->content), 160) }}">
    <meta name="twitter:image" content="{{ asset('storage/' . $blog->image) }}">
@endsection

@section('content')
    <div class="container mx-auto p-4">
        <div class="{{ $blog->theme['background_color'] ?? 'bg-white' }} shadow-lg rounded-lg p-6 mb-6">

            <!-- Blog Image (if available) -->
            @if ($blog->image)
                <div class="mb-6 overflow-hidden rounded-lg">
                    <img src="{{ asset('storage/' . $blog->image) }}" alt="{{ $blog->title }}"
                        class="w-full h-80 object-cover transform transition duration-300 hover:scale-105 rounded-lg cursor-pointer"
                        onclick="openModalImage()">
                </div>
            @endif

            <!-- Modal -->
            <div id="imageModal" class="fixed inset-0 flex items-center justify-center z-50 hidden bg-black bg-opacity-75">
                <div class="relative">
                    <!-- Close Button -->
                    <button class="absolute top-2 right-2 text-white text-2xl" onclick="closeModalImage()">&times;</button>
                    <!-- Full-Size Image -->
                    <img src="{{ asset('storage/' . $blog->image) }}" alt="{{ $blog->title }}"
                        class="max-w-full max-h-screen rounded-lg">
                </div>
            </div>

            <!-- Overlay for closing modal -->
            <div id="modalOverlay" class="fixed inset-0 bg-black bg-opacity-75 hidden" onclick="closeModal()"></div>

            <h2 class="text-2xl lg:text-4xl sm:text-xl font-extrabold text-gray-800 mb-6">{{ $blog->title }}</h2>
            <div class="flex flex-col lg:flex-row justify-between">
                <div class="flex items-center mb-4 space-x-4 bg-gray-100 p-3 rounded-2xl">
                    <!-- Author Photo -->
                    @if ($blog->user->profile_picture)
                    <a href="{{ route('profile.show', $blog->user->id) }}"><img src="{{ asset('storage/images/' . $blog->user->profile_picture) }}" alt="Author Photo"
                            class="w-12 h-12 rounded-full mr-4"></a>
                    @else
                        <img src="{{ asset('images/avator.jpg') }}" alt="Default Avatar"
                            class="w-12 h-12 rounded-full mr-4">
                    @endif
                    <div>
                        <!-- Author Info -->
                        <a href="{{ route('profile.show', $blog->user->id) }}"><p class="text-lg font-semibold">{{ $blog->user->name }}</p></a>
                        <p class="text-sm text-gray-400">{{ $blog->created_at->format('F j, Y') }}</p>
                    </div>
                </div>
                <div class="flex space-x-4 items-center">
                    @auth
                        @if ($blog->user_id === Auth::id())
                            <a href="{{ route('blogs.edit', $blog->id) }}"
                                class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow-md transform transition duration-300 hover:scale-105">
                                <i class="fa-solid fa-pen-to-square mr-2"></i>Edit
                            </a>
                            <button type="button"
                                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md transform transition duration-300 hover:scale-105"
                                onclick="openModal()">
                                <i class="fa-solid fa-trash mr-2"></i>Delete
                            </button>
                        @endif
                    @endauth
                </div>
            </div>
<!-- Popup Modal for is_pro check -->
<div id="subscription-popup" class="fixed inset-0 z-50 flex items-center justify-center hidden backdrop-blur-sm bg-black bg-opacity-30">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">Subscription Required</h2>
            
        </div>
        <p class="mt-4 text-gray-600">Subscribe to Blogpotro or use 1 credit to read this blog.</p>
        <div class="mt-6 flex justify-end space-x-2">
            <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition" onclick="subscribe()">Subscribe</button>
            
            <!-- Use Credit Button Form -->
            <form method="POST" action="{{ route('blogs.useCredit', ['id' => $blog->id]) }}">
                @csrf
                <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                    Use 1 Credit
                </button>
            </form>
        </div>
    </div>
</div>
@if(session('success')==false && $blog->user_id != Auth::id())
<script>
    let hasScrolled = false;

    window.addEventListener('scroll', function() {
        if (!hasScrolled && {{ $blog->is_pro ? 'true' : 'false' }} && {{ $isSubscribed ? 'false' : 'true' }}) {
            hasScrolled = true; // Prevent multiple popups
            document.getElementById('subscription-popup').classList.remove('hidden');
        }
    });

    function closePopup() {
        document.getElementById('subscription-popup').classList.add('hidden');
    }

    function subscribe() {
        window.location.href = '/subscribe';
    }
</script>
@endif



            <div class="flex flex-col lg:flex-row justify-between">
                @auth
                    <!-- Interaction Buttons: Like, Comment, View, Bookmark -->
                    <div class="flex items-center mt-6 space-x-4">
                        <form action="{{ route('blogs.like', $blog->id) }}" method="POST" id="like-form">
                            @csrf
                            <button type="submit"
                                class="flex items-center space-x-2 text-red-500 hover:text-red-600 focus:outline-none">
                                @if ($blog->isLikedBy(auth()->user()))
                                    <!-- Filled heart for liked state -->
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                                        class="w-6 h-6">
                                        <path
                                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                @else
                                    <!-- Empty heart for unliked state -->
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                @endif
                                <span class="ml-1">{{ $blog->likes->count() }}</span>
                            </button>
                        </form>
                        <!-- Comments -->
                        <div class="flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                class="w-6 h-6 text-blue-500">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 10h.01M12 10h.01M16 10h.01M21 10c0 6-9 9-9 9s-9-3-9-9a9 9 0 1118 0z" />
                            </svg>
                            <span>{{ $blog->comments->count() }}</span>
                        </div>

                        <!-- Views -->
                        <div class="flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                class="w-6 h-6 text-green-500">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4.5c-7.5 0-9 7.5-9 7.5s1.5 7.5 9 7.5 9-7.5 9-7.5-1.5-7.5-9-7.5zm0 13.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" />
                            </svg>
                            <span>{{ $blog->views }}</span>
                        </div>
                        <form action="{{ route('blogs.bookmark', $blog->id) }}" method="POST">
                            @csrf
                            <button type="submit"
                                class="flex items-center space-x-2 text-blue-500 hover:text-blue-600 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    fill="{{ $blog->isBookmarkedBy(auth()->user()) ? 'currentColor' : 'none' }}"
                                    viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 3v18l7-5.5L19 21V3H5z" />
                                </svg>
                                <span>{{ $blog->isBookmarkedBy(auth()->user()) ? 'Bookmarked' : 'Bookmark' }}</span>
                            </button>
                        </form>


                    </div>
                    <div class="flex flex-row mt-2 items-center">
                        <!-- Category -->
                        <p class="text-sm font-semibold text-indigo-600 bg-gray-200 py-1 px-3 rounded-lg me-2">
                            {{ $blog->category->name }}
                        </p>
                        <!-- Estimated Reading Time -->
                        <p class="text-sm text-indigo-600 bg-gray-200 py-1 px-3 rounded-lg">
                            {{ ceil(str_word_count($blog->content) / 200) }} min read</p>
                    </div>
                @endauth
            </div>

            <hr class="my-5">

            <pre id="summarized-content" class="text-lg text-gray-700 leading-relaxed mb-4 whitespace-pre-line font-sans">
                {{ $blog->content }}
            </pre>

            <!-- Loading Spinner -->
            <div id="loading-spinner" class="hidden text-center mt-4">
                <svg class="animate-spin h-6 w-6 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 12a8 8 0 0116 0 8 8 0 01-16 0zm16 0A8 8 0 004 12a8 8 0 0016 0z" />
                </svg>
                <p class="text-gray-500">Processing...</p>
            </div>

            <!-- Summarize Content Button -->
            @auth
                <button id="summarize-btn" class="bg-violet-500 text-white p-2 rounded-lg hover:bg-blue-600 mb-2">
                    Summarize
                </button>

                <script>
                    document.getElementById('summarize-btn').addEventListener('click', async () => {
                        // Show loading spinner
                        document.getElementById('loading-spinner').classList.remove('hidden');

                        try {
                            const response = await fetch('/summarize', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute(
                                        'content')
                                },
                                body: JSON.stringify({
                                    content: '{{ Str::limit($blog->content, 200) }}'
                                })
                            });

                            const data = await response.json();
                            document.getElementById('summarized-content').innerText = data.summary;
                        } catch (error) {
                            console.error('Error:', error);
                            document.getElementById('summarized-content').innerText =
                                'An error occurred. Please try again.';
                        } finally {
                            // Hide loading spinner
                            document.getElementById('loading-spinner').classList.add('hidden');
                        }
                    });
                </script>
            @endauth
            <!-- Share Buttons -->
            <div class="flex items-center space-x-2 my-3">
                <span class="text-gray-700">Share:</span>
                <a href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode(url()->current()) }}" target="_blank"
                    rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800">
                    <i class="fab fa-facebook fa-lg"></i>
                </a>
                <a href="https://twitter.com/intent/tweet?url={{ urlencode(url()->current()) }}&text={{ urlencode($blog->title) }}"
                    target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-600">
                    <i class="fab fa-twitter fa-lg"></i>
                </a>
                <a href="https://www.linkedin.com/shareArticle?url={{ urlencode(url()->current()) }}&title={{ urlencode($blog->title) }}"
                    target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:text-blue-900">
                    <i class="fab fa-linkedin fa-lg"></i>
                </a>
                <a href="https://api.whatsapp.com/send?text={{ urlencode($blog->title . ' ' . url()->current()) }}"
                    target="_blank" rel="noopener noreferrer" class="text-green-500 hover:text-green-700">
                    <i class="fab fa-whatsapp fa-lg"></i>
                </a>
                <a href="mailto:?subject={{ urlencode($blog->title) }}&body={{ urlencode(url()->current()) }}"
                    target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-800">
                    <i class="fas fa-envelope fa-lg"></i>
                </a>
            </div>

            <x-comment :$blog />

        </div>
    </div>

    <!-- Modal for Delete Confirmation -->
    <div id="deleteModal" class="flex fixed inset-0 bg-gray-800 bg-opacity-75 justify-center items-center hidden">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 class="text-2xl font-semibold mb-4">Are you sure?</h2>
            <p class="text-gray-600 mb-6">Do you really want to delete this blog post? This action cannot be undone.</p>
            <div class="flex justify-end space-x-4">
                <button class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                    onclick="closeModal()">Cancel</button>
                <form id="delete-form" action="{{ route('blogs.destroy', $blog->id) }}" method="POST">
                    @csrf
                    @method('DELETE')
                    <button type="submit"
                        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        function openModalImage() {
            document.getElementById('imageModal').classList.remove('hidden');
            document.getElementById('modalOverlay').classList.remove('hidden');
        }

        function closeModalImage() {
            document.getElementById('imageModal').classList.add('hidden');
            document.getElementById('modalOverlay').classList.add('hidden');
        }

        function openModal() {
            document.getElementById('deleteModal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('deleteModal').classList.add('hidden');
        }

        function showReplyForm(commentId) {
            document.getElementById(`reply-form-${commentId}`).classList.toggle('hidden');
        }




    </script>

    
@endsection
