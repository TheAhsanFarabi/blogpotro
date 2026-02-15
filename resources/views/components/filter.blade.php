<div class="flex space-x-1 items-center mb-4">
    @auth
        <!-- Home Button -->
        <a href="{{ url('/') }}" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Latest</a>

        <!-- Feed Button -->
        <a href="{{ url('/feed') }}" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Feed</a>

        <form method="GET" action="{{ route('blogs.index') }}" class="inline">
            <input type="hidden" name="categories" value="{{ json_encode(auth()->user()->categories) }}">
            <button type="submit" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                Custom Feed
            </button>
        </form>
        
    @endauth

    <!-- Category Filter Dropdown -->
    <form method="GET" action="{{ route('blogs.index') }}" class="flex items-center space-x-2">
        <select name="category"
            class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onchange="this.form.submit()">
            <option value="">All Categories</option>
            @foreach ($categories as $category)
                <option value="{{ $category->id }}" {{ request('category') == $category->id ? 'selected' : '' }}>
                    {{ $category->name }}
                </option>
            @endforeach
        </select>
    </form>
</div>
