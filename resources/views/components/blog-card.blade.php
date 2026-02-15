
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    @forelse($blogs as $blog)
        <div class="{{ $blog->theme['background_color'] ?? 'bg-white' }} shadow-2xl rounded-2xl p-4">
            <div class="flex flex-row items-center justify-between mb-4">
                <div class="flex items-center">
                    <!-- Author Photo -->
                    @if ($blog->user->profile_picture)
                    <a href="{{ route('profile.show', $blog->user->id) }}"><img src="{{ asset('storage/images/' . $blog->user->profile_picture) }}" alt="Author Photo"
                            class="w-10 h-10 rounded-full mr-4" loading="lazy"></a>
                    @else
                    <a href="{{ route('profile.show', $blog->user->id) }}"><img src="{{ asset('images/avator.jpg') }}" alt="Default Avatar"
                            class="w-10 h-10 rounded-full mr-4"></a>
                    @endif
                    <div>
                        <!-- Author Info -->
                        <a href="{{ route('profile.show', $blog->user->id) }}"><p class="text-sm font-semibold">{{ $blog->user->name }}</p></a>
                        <p class="text-xs text-gray-500">{{ $blog->created_at->format('F j, Y') }}</p>
                    </div>
                </div>
                @auth
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
                    </button>
                </form>
                @endauth
            </div>

            <div>
                
                    <a href="{{ route('blogs.show', $blog->id) }}"
                        class="text-xl text-blue-500 hover:underline">{{ Str::limit($blog->title,24) }}</a>
                
            </div>
            <p class="text-gray-600 mb-4 break-words">{{ Str::limit($blog->content, 50) }}</p>
            @if ($blog->is_pro)
            <span class="inline-flex items-center px-2 py-1 text-xs font-bold text-white bg-yellow-500 rounded-full">
                <i class="fas fa-star mr-1"></i> Premium
            </span>
            @endif

            <div class="flex flex-row justify-between">
                <p class="text-gray-600 mb-4 font-semibold">
                    {{ $blog->category->name }}
                </p>
                <!-- Estimated Reading Time -->
                <p class="text-gray-600 mb-4">{{ ceil(str_word_count($blog->content) / 200) }} min read</p>
            </div>
            <!-- Blog Image (if available) -->
            @if ($blog->image)
            
                <div class="mb-4 overflow-hidden rounded-lg">
                    <a href="{{ route('blogs.show', $blog->id) }}">
                        <img src="{{ asset('storage/' . $blog->image) }}" alt="{{ $blog->title }}" loading="lazy"
                        class="w-full h-40 object-cover rounded-lg transform transition duration-300 hover:scale-105">
                    </a>
                </div>
            
            @endif

            <div class="flex justify-start space-x-4 mt-2 text-sm text-gray-500">
                <span>{{ $blog->likes_count }} Likes</span>
                <span>{{ $blog->comments_count }} Comments</span>
                <span>{{ $blog->views }} Views</span>
            </div>


        </div>
    @empty
        <p class="text-gray-500">No blogs available.</p>
    @endforelse
</div>
