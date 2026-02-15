@if ($featuredBlogs->isNotEmpty())
    <div class="mb-8">
        
        <ul class="space-y-4 bg-white p-5 rounded-2xl shadow-2xl">
            <h2 class="text-xl font-bold mb-4">Featured Blogs</h2>
            {{ $i = null }}
            @foreach ($featuredBlogs as $blog)
                <li class="bg-white border-2 shadow-sm rounded-lg p-4 flex flex-row items-center space-x-2">
                    <h1 class="text-5xl text-red-800 font-black me-3 opacity-25">#{{ ++$i }}</h1>
                    <div class="flex flex-col">
                        <div class="flex items-center mb-1">
                            <!-- Author Photo -->
                            @if ($blog->user->profile_picture)
                            <a href="{{ route('profile.show', $blog->user->id) }}"><img src="{{ asset('storage/images/' . $blog->user->profile_picture) }}"
                                    alt="Author Photo" class="w-6 h-6 rounded-full mr-4"></a>
                            @else
                            <a href="{{ route('profile.show', $blog->user->id) }}"><img src="{{ asset('images/avator.jpg') }}" alt="Default Avatar"
                                    class="w-12 h-12 rounded-full mr-4"></a>
                            @endif

                                <p class="text-sm font-semibold">{{ $blog->user->name }}</p>

                        </div>


                        <div>
                            @auth
                                <a href="{{ route('blogs.show', $blog->id) }}" class="text-blue-500 hover:underline">{{ $blog->title }}</a>
                            @else
                                <a href="{{ route('login') }}" class="text-blue-500 hover:underline">{{ $blog->title }}</a>
                            @endauth
                        </div>
                    </div>
                </li>
            @endforeach
        </ul>
    </div>
@endif
