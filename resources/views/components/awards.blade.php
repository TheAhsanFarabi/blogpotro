<ul class="space-y-4 bg-white p-5 rounded-lg shadow-lg">
    <h2 class="text-xl font-bold mb-4">Awards</h2>
    <div class="flex flex-wrap justify-center gap-4">
        {{-- First Blog Award --}}
        @if ($user->blogs->count() >= 1)
            <div class="relative group">
                <img src="{{ asset('images/awards/first_blog.webp') }}" alt="First Blog Award" class="w-20 hover:opacity-25" />
                <span
                    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-lg px-6 py-2 w-64 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                    <b>First Blog Award</b>
                </span>
            </div>
        @endif

        {{-- Featured Blog (30+ views) --}}
        @if ($user->blogs->where('views', '>=', 30)->count() > 0)
            <div class="relative group">
                <img src="{{ asset('images/awards/trending.webp') }}" alt="Any Blog got 30+ views" class="w-20 hover:opacity-25" />
                <span
                    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-lg px-6 py-2 w-64 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                    <b>First Featured Blog Award</b>
                </span>
            </div>
        @endif

        {{-- First Comment Award --}}
        @if ($user->comments->count() >= 1)
            <div class="relative group">
                <img src="{{ asset('images/awards/get_comment.webp') }}" alt="First Comment Award" class="w-20 hover:opacity-25" />
                <span
                    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-lg px-6 py-2 w-64 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                    <b>First Comment Award</b>
                </span>
            </div>
        @endif
        {{-- Blog Bookmarked by Someone --}}
        @if ($user->blogs()->whereHas('bookmarkedBy')->count() > 0)
            <div class="relative group">
                <img src="{{ asset('images/awards/bookmarks_1.webp') }}" alt="Someone Bookmarked your blog"
                    class="w-20 hover:opacity-25" />
                <span
                    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-lg px-6 py-2 w-64 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                    <b>Bookmarked By Award</b>
                </span>
            </div>
        @endif

        {{-- User got 5 likes total --}}
        @if ($user->blogs()->whereHas('likes')->count() >= 5)
            <div class="relative group">
                <img src="{{ asset('images/awards/someone_bookmark.webp') }}" alt="You bookmarked 3 blogs"
                    class="w-20 hover:opacity-25" />
                <span
                    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-lg px-6 py-2 w-64 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                    <b>5 Likes Award</b>
                </span>
            </div>
        @endif


        {{-- 5 Blogs Published Award --}}
        @if ($user->blogs->count() >= 5)
            <div class="relative group">
                <img src="{{ asset('images/awards/5_blogs.webp') }}" alt="5 Blogs Award" class="w-20 hover:opacity-25" />
                <span
                    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-lg px-6 py-2 w-64 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                    <b>5 blogs Award</b>
                </span>
            </div>
        @endif

        {{-- 10 Followers Award --}}
        @if ($user->followers->count() >= 10)
            <div class="relative group">
                <img src="{{ asset('images/awards/followers_10.webp') }}" alt="You got 10 Followers" class="w-20 hover:opacity-25" />
                <span
                    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-lg px-6 py-2 w-64 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                    <b>10 followers Award</b>
                </span>
            </div>
        @endif

        {{-- 10 Blogs Published Award --}}
        @if ($user->blogs->count() >= 10)
            <div class="relative group">
                <img src="{{ asset('images/awards/large_blog.webp') }}" alt="500+ length blog award" class="w-20 hover:opacity-25" />
                <span
                    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-lg px-6 py-2 w-64 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                    <b>10 Blogs Award</b>
                </span>
            </div>
        @endif

        {{-- 30 Blogs in a Year Award --}}
        @if ($user->blogs->where('created_at', '>=', now()->subYear())->count() >= 30)
            <div class="relative group">
                <img src="{{ asset('images/awards/30_blogs_year.webp') }}" alt="30 Blogs Award" class="w-20 hover:opacity-25" />
                <span
                    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-lg px-6 py-2 w-64 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                    <b>Man of the year Award</b>
                </span>
            </div>
        @endif
    </div>
</ul>
