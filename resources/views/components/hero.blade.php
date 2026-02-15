{{-- Greeting View --}}
<div class="flex flex-col items-center lg:flex-row lg:justify-start lg:space-x-6 mb-8">
    {{-- Profile Picture --}}
    <div class="mb-4 lg:mb-0">
        <img src="{{ Auth::user()->profile_picture ? asset('storage/images/' . Auth::user()->profile_picture) : asset('images/avatar.jpg') }}"
            alt="Profile Picture" class="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-gray-200" />
    </div>

    {{-- Greeting and Buttons --}}
    <div class="text-center lg:text-left">
        <h1 class="text-xl font-bold text-gray-800 mb-2" id="greeting"></h1>
        
        {{-- Buttons --}}
        <div class="space-x-2 flex flex-wrap gap-2">
            <a href="/create" class="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg transition duration-300 ease-in-out">
            <i class="fa-solid fa-pen mr-2"></i>
                Create Blog
            </a>

            <a href="/book-snaps" class="inline-flex items-center bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg transition duration-300 ease-in-out">
            <i class="fa-solid fa-book-open-reader mr-2"></i>
                Create Snap
            </a>

            <a href="/spaces" class="inline-flex items-center bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg transition duration-300 ease-in-out">
            <i class="fa-solid fa-layer-group mr-2"></i>
                Create Space
            </a>

            <a href="/challenges" class="inline-flex items-center bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg transition duration-300 ease-in-out">
            <i class="fa-solid fa-trophy mr-2"></i>
                Try Challenges
            </a>
        </div>
    </div>
</div>

{{-- JavaScript for Dynamic Greeting --}}
<script>
    function updateGreeting() {
        const now = new Date();
        const hour = now.getHours();
        let greeting;

        if (hour < 12) {
            greeting = 'Good Morning';
        } else if (hour >= 12 && hour < 18) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }

        document.getElementById('greeting').textContent = `${greeting}, {{ Auth::user()->name }}!`;
    }

    // Call the function to set the greeting when the page loads
    updateGreeting();
</script>
