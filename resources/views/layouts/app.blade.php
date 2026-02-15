<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description"
        content="Write yourself, express yourself, and be yourself. It's time to stop procrastinating and start being productive. Every day, Blogpotro will encourage you in learning new things." />
    <meta name="keywords" content="Blog site, Social Media, Writing site">
    <meta name="author" content="Blogpotro Community">

    <link rel="icon" type="image/png" href="{{ asset('images/logo-sm.png') }}" />

    <title>@yield('title')</title>



    <!-- Open Graph Meta Tags -->
    @yield('meta')



    <!-- Add Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Add Font Awesome CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

</head>

<body class="bg-gray-100">

    <nav class="sticky top-0 z-50 bg-gray-100 p-4 shadow-lg">
        <div class="container mx-auto flex items-center justify-between">


            <div class="flex items-center">
                <a id="back-button" onclick="goBack()"
                    class="flex hidden h-10 w-10 items-center justify-center rounded-full hover:text-yellow-500">
                    <i class="fa-solid fa-arrow-left"></i>
                </a>
                <a href="{{ url('/') }}">
                    <img src="{{ asset('images/logo-sm.png') }}" class="mr-2 h-12 w-auto" />
                </a>

                <div class="relative flex items-center">
                    <!-- Full search bar for larger screens -->
                    <form action="{{ route('search.index') }}" method="GET" class="hidden md:flex">
                        <input type="text" name="search" placeholder="Search..."
                            class="h-10 w-60 rounded-full bg-gray-200 px-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                        <button type="submit"
                            class="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-yellow-500 text-white hover:bg-yellow-600">
                            <i class="fa-solid fa-search"></i>
                        </button>
                    </form>

                    <!-- Icon only for smaller screens -->
                    <a href="{{ route('search.index') }}" class="md:hidden">
                        <i class="fa-solid fa-search text-xl text-gray-500 hover:text-yellow-500"></i>
                    </a>
                </div>
            </div>

            @auth
                <!-- Hamburger Icon for Mobile -->
                <button id="mobile-menu-toggle"
                    class="flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-300 focus:outline-none md:hidden">
                    <i class="fa-solid fa-bars text-xl"></i>
                </button>

                <!-- Menu for Desktop and Hidden for Mobile -->
                <div class="hidden space-x-8 md:flex">
                    <!-- Home Icon -->
                    <a href="{{ url('/') }}"
                        class="{{ request()->is('/') ? 'bg-yellow-500' : 'text-black hover:bg-yellow-500' }} relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xl">
                        <i class="fa-solid fa-home"></i>
                    </a>

                    <!-- Friends Icon -->
                    <a href="{{ url('/people') }}"
                        class="{{ request()->is('people') ? 'bg-yellow-500' : 'text-black hover:bg-yellow-500' }} relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xl">
                        <i class="fa-solid fa-user-friends"></i>
                    </a>

                    <!-- Learning Icon -->
                    <a href="{{ url('/learning') }}"
                        class="{{ request()->is('learning') ? 'bg-yellow-500' : 'text-black hover:bg-yellow-500' }} relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xl">
                        <i class="fa-solid fa-graduation-cap"></i>
                    </a>

                    <!-- Shop Icon -->
                    <a href="{{ url('/store') }}"
                        class="{{ request()->is('store') ? 'bg-yellow-500' : 'text-black hover:bg-yellow-500' }} relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xl">
                        <i class="fa-solid fa-store"></i>
                    </a>

                    <!-- Gaming Icon -->
                    <a href="{{ url('/games') }}"
                        class="{{ request()->is('games') ? 'bg-yellow-500' : 'text-black hover:bg-yellow-500' }} relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xl">
                        <i class="fa-solid fa-gamepad"></i>
                    </a>
                </div>

                <!-- Mobile Menu (Initially Hidden) -->
                <div id="mobile-menu" class="hidden flex-col space-y-4 p-4 md:hidden">
                    <!-- Home Icon -->
                    <a href="{{ url('/') }}"
                        class="{{ request()->is('/') ? 'bg-yellow-500' : 'text-black hover:bg-yellow-500' }} flex items-center space-x-2 rounded-md bg-gray-200 p-2">
                        <i class="fa-solid fa-home text-xl"></i> <span>Home</span>
                    </a>

                    <!-- Friends Icon -->
                    <a href="{{ url('/people') }}"
                        class="{{ request()->is('people') ? 'bg-yellow-500' : 'text-black hover:bg-yellow-500' }} flex items-center space-x-2 rounded-md bg-gray-200 p-2">
                        <i class="fa-solid fa-user-friends text-xl"></i> <span>Friends</span>
                    </a>

                    <!-- Learning Icon -->
                    <a href="{{ url('/learning') }}"
                        class="{{ request()->is('learning') ? 'bg-yellow-500' : 'text-black hover:bg-yellow-500' }} flex items-center space-x-2 rounded-md bg-gray-200 p-2">
                        <i class="fa-solid fa-graduation-cap text-xl"></i> <span>Learning</span>
                    </a>

                    <!-- Shop Icon -->
                    <a href="{{ url('/store') }}"
                        class="{{ request()->is('store') ? 'bg-yellow-500' : 'text-black hover:bg-yellow-500' }} flex items-center space-x-2 rounded-md bg-gray-200 p-2">
                        <i class="fa-solid fa-store text-xl"></i> <span>Shop</span>
                    </a>

                    <!-- Gaming Icon -->
                    <a href="{{ url('/games') }}"
                        class="{{ request()->is('games') ? 'bg-yellow-500' : 'text-black hover:bg-yellow-500' }} flex items-center space-x-2 rounded-md bg-gray-200 p-2">
                        <i class="fa-solid fa-gamepad text-xl"></i> <span>Gaming</span>
                    </a>
                </div>

                <script>
                    // Toggle mobile menu visibility
                    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
                    const mobileMenu = document.getElementById('mobile-menu');

                    mobileMenuToggle.addEventListener('click', () => {
                        mobileMenu.classList.toggle('hidden');
                    });
                </script>
            @endauth



            <div class="relative flex flex-row items-center space-x-2">

                @auth
                    <div class="relative"> <!-- Added relative class for proper positioning -->
                        <a href="#" id="createBlogButton"
                            class="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 hover:bg-yellow-500">
                            <i class="fa-solid fa-plus cursor-pointer text-xl text-black"></i>
                        </a>

                        <!-- Dropdown for options -->
                        <div id="createOptions"
                            class="absolute left-1/2 top-full mt-2 hidden w-64 -translate-x-1/2 transform rounded-lg bg-white p-4 text-gray-800 shadow-lg transition-opacity duration-200 ease-in-out">
                            <div class="flex flex-col">
                                <a href="{{ url('/create') }}"
                                    class="flex items-center justify-around space-x-2 rounded border-b border-gray-300 px-3 py-2 transition duration-200 ease-in-out last:border-b-0 hover:bg-gray-100">
                                    <i class="fa-solid fa-pencil-alt text-2xl text-yellow-400"></i>
                                    <div class="flex flex-col">
                                        <span class="font-semibold">Create Blog</span>
                                        <span class="mt-1 rounded bg-gray-200 px-1 text-sm text-gray-500">Ctrl + Up</span>
                                    </div>
                                </a>
                                <a href="{{ url('/spaces') }}"
                                    class="flex items-center justify-around space-x-2 rounded border-b border-gray-300 px-3 py-2 transition duration-200 ease-in-out last:border-b-0 hover:bg-gray-100">
                                    <i class="fa-solid fa-users text-2xl text-blue-400"></i>
                                    <div class="flex flex-col">
                                        <span class="font-semibold">Create Space</span>
                                        <span class="mt-1 rounded bg-gray-200 px-1 text-sm text-gray-500">Ctrl + Down</span>
                                    </div>
                                </a>
                                <a href="{{ url('/create-shorts') }}"
                                    class="flex items-center justify-around space-x-2 rounded border-b border-gray-300 px-3 py-2 transition duration-200 ease-in-out last:border-b-0 hover:bg-gray-100">
                                    <i class="fa-solid fa-video text-2xl text-green-400"></i>
                                    <div class="flex flex-col">
                                        <span class="font-semibold">Create Shorts</span>
                                        <span class="mt-1 rounded bg-gray-200 px-1 text-sm text-gray-500">Ctrl +
                                            Left</span>
                                    </div>
                                </a>
                                <a href="{{ url('/book-snaps') }}"
                                    class="flex items-center justify-around space-x-2 rounded px-3 py-2 transition duration-200 ease-in-out last:border-b-0 hover:bg-gray-100">
                                    <i class="fa-solid fa-book text-2xl text-red-400"></i>
                                    <div class="flex flex-col">
                                        <span class="font-semibold">Create Snap</span>
                                        <span class="mt-1 rounded bg-gray-200 px-1 text-sm text-gray-500">Ctrl +
                                            Right</span>
                                    </div>
                                </a>
                            </div>
                        </div>



                        <script>
                            document.addEventListener('keydown', function(event) {
                                // Check for Ctrl + Up key for Create Blog
                                if (event.ctrlKey && event.key === 'ArrowUp') {
                                    event.preventDefault();
                                    window.location.href = '{{ url('/create') }}';
                                }
                                // Check for Ctrl + Down key for Create Space
                                else if (event.ctrlKey && event.key === 'ArrowDown') {
                                    event.preventDefault();
                                    window.location.href = '{{ url('/spaces') }}';
                                }
                                // Check for Ctrl + Left key for Create Shorts
                                else if (event.ctrlKey && event.key === 'ArrowLeft') {
                                    event.preventDefault();
                                    window.location.href = '{{ url('/create-shorts') }}';
                                }
                                // Check for Ctrl + Right key for Create Snap
                                else if (event.ctrlKey && event.key === 'ArrowRight') {
                                    event.preventDefault();
                                    window.location.href = '{{ url('/book-snaps') }}';
                                }
                            });
                        </script>



                        <script>
                            const createBlogButton = document.getElementById('createBlogButton');
                            const createOptions = document.getElementById('createOptions');

                            // Toggle dropdown on button click
                            createBlogButton.addEventListener('click', (event) => {
                                event.preventDefault(); // Prevent default action if it’s a link
                                createOptions.classList.toggle('hidden');
                            });

                            // Close dropdown if clicking outside
                            document.addEventListener('click', (event) => {
                                if (!createBlogButton.contains(event.target) && !createOptions.contains(event.target)) {
                                    createOptions.classList.add('hidden');
                                }
                            });
                        </script>

                        <!-- Tooltip -->
                        <div id="tooltip"
                            class="tooltip pointer-events-none absolute left-1/2 top-full mt-2 hidden w-72 -translate-x-1/2 transform rounded-lg bg-gray-900 p-4 text-center text-white opacity-0 shadow-lg transition-opacity duration-200">

                            <div
                                class="border-l-6 border-r-6 border-b-6 absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 transform border-b-gray-900 border-l-transparent border-r-transparent">
                            </div>

                            <!-- Icon with text -->
                            <div class="mb-3 flex items-center justify-center">
                                <i class="fa-solid fa-edit mr-2 text-2xl text-green-400"></i>
                                <span class="font-semibold">Get started by creating your first blog, space, shorts, or
                                    snaps!</span>
                            </div>

                            <div class="mb-2 flex items-center justify-center">
                                <i class="fa-solid fa-lightbulb mr-2 text-2xl text-yellow-400"></i>
                                <span>Unleash your creativity and share your ideas with the world.</span>
                            </div>

                            <div class="mb-2 flex items-center justify-center">
                                <i class="fa-solid fa-heart mr-2 text-2xl text-red-500"></i>
                                <span>Collaborate with others and grow your space together.</span>
                            </div>

                            <button id="okTooltip"
                                class="mt-3 rounded bg-green-500 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-green-400">Let's
                                Go!</button>
                        </div>

                    </div>

                    <div class="relative"> <!-- Added relative class for proper positioning -->
                        <a href="{{ url('/streaks') }}"
                            class="relative flex h-10 w-20 items-center justify-center rounded-full bg-gray-200">
                            {{ Auth::user()->streak_count }} <i class="fas fa-fire ml-1 text-red-500"></i>
                        </a>

                        <!-- Tooltip (positioned directly below the Streaks button) -->
                        <div id="secondTooltip"
                            class="tooltip pointer-events-none absolute left-1/2 top-full mt-2 hidden w-72 -translate-x-1/2 transform rounded-lg bg-red-800 p-4 text-center text-white opacity-0 shadow-lg transition-opacity duration-200">

                            <div
                                class="border-l-6 border-r-6 border-b-6 absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 transform border-b-red-800 border-l-transparent border-r-transparent">
                            </div>

                            <div class="mb-3 flex items-center justify-center">
                                <i class="fa-solid fa-fire mr-2 text-6xl text-yellow-400"></i>
                                <span class="font-medium">Keep your streak alive!</span>
                            </div>

                            <div class="mb-2 flex items-center justify-center">

                                <span>Complete 7 days of streaks to earn special credits!</span>
                            </div>

                            <button id="okSecondTooltip"
                                class="mt-3 rounded bg-yellow-500 px-4 py-2 text-sm text-black transition-colors duration-200 hover:bg-yellow-400">Got
                                it!</button>
                        </div>

                    </div>

                    <div class="relative"> <!-- Added relative class for proper positioning -->
                        <a href="{{ url('/credits') }}"
                            class="relative flex h-10 w-20 items-center justify-center rounded-full bg-gray-200">
                            {{ Auth::user()->credits }} <i class="fas fa-bolt ml-1 text-blue-500"></i>
                        </a>

                        <!-- Tooltip positioned directly below the Credits button -->
                        <div id="thirdTooltip"
                            class="tooltip pointer-events-none absolute left-1/2 top-full mt-2 hidden w-72 -translate-x-1/2 transform rounded-lg bg-blue-800 p-4 text-center text-white opacity-0 shadow-lg transition-opacity duration-200">

                            <div
                                class="border-l-6 border-r-6 border-b-6 absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 transform border-b-blue-800 border-l-transparent border-r-transparent">
                            </div>

                            <div class="mb-3 flex items-center justify-center">
                                <i class="fa-solid fa-bolt mr-2 text-2xl text-yellow-400"></i>
                                <span class="font-medium">Explore your credits!</span>
                            </div>

                            <div class="mb-2 flex items-center justify-center">
                                <i class="fa-solid fa-coins mr-2 text-2xl text-yellow-400"></i>
                                <span>Credits are the currency system for Blogpotro, which can be earned and used for
                                    various purposes.</span>
                            </div>

                            <button id="okTooltip3"
                                class="mt-3 rounded bg-yellow-500 px-4 py-2 text-sm text-black transition-colors duration-200 hover:bg-yellow-400">Understood!</button>
                        </div>

                    </div>

                    <style>
                        /* Modern Tooltip Arrow */
                        .tooltip::before {
                            content: '';
                            position: absolute;
                            bottom: 100%;
                            left: 50%;
                            transform: translateX(-50%);
                            border-width: 6px;
                            border-style: solid;
                            border-color: transparent transparent #4b5563 transparent;
                            /* Arrow color */
                        }

                        /* Tooltip Transition */
                        .tooltip {
                            transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
                        }

                        /* Icon Styles */
                        .tooltip i {
                            margin-right: 0.5rem;
                            /* Space between icon and text */
                        }
                    </style>

                    <!-- Chat Icon -->
                    <a href="{{ url('/chats') }}"
                        class="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                        <i class="fas fa-message cursor-pointer text-xl text-black"></i>
                    </a>

                    <!-- Notifications Icon -->
                    <a href="{{ url('/notifications') }}"
                        class="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                        <i class="fas fa-bell cursor-pointer text-xl text-black"></i>

                        <!-- Red dot for unread notifications with count -->
                        @if (Auth::user()->notifications()->where('is_read', 0)->count() > 0)
                            <span
                                class="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">{{ Auth::user()->notifications()->where('is_read', 0)->count() }}</span>
                        @endif
                    </a>

                    <!-- Off-Canvas Toggle Button -->
                    <button id="offcanvas-toggle"
                        class="relative flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500">
                        <i class="fa-solid fa-lightbulb text-xl text-white"></i>
                    </button>

                    <div class="flex items-center">
                        <button id="profile-menu-button" class="flex items-center">
                            @if (Auth::user()->profile_picture)
                                <img src="{{ asset('storage/images/' . Auth::user()->profile_picture) }}"
                                    alt="Profile Picture" class="h-10 w-10 rounded-full">
                            @else
                                <img src="{{ asset('images/avator.jpg') }}" alt="Default Avatar"
                                    class="h-10 w-10 rounded-full">
                            @endif
                        </button>

                        <div id="profile-menu"
                            class="absolute right-0 top-11 z-50 hidden w-48 rounded-lg border border-gray-300 bg-white shadow-lg">
                            <a href="{{ route('profile.show', Auth::user()->id) }}"
                                class="flex flex-row items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
                                @if (Auth::user()->profile_picture)
                                    <img src="{{ asset('storage/images/' . Auth::user()->profile_picture) }}"
                                        alt="Profile Picture" class="h-10 w-10 rounded-full">
                                @else
                                    <img src="{{ asset('images/avator.jpg') }}" alt="Default Avatar"
                                        class="h-10 w-10 rounded-full">
                                @endif
                                <h4>{{ Auth::user()->name }}</h4>
                            </a>
                            <hr>
                            @if (auth()->user()->is_admin)
                                <a href="{{ url('/admin/dashboard') }}"
                                    class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <i class="fa-solid fa-shield mr-2"></i>Admin View</a>
                            @endif
                            
                            <a href="{{ url('/bookmarks') }}" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                <i class="fas fa-bookmark mr-2"></i> Bookmarks
                            </a>
                            <a href="{{ url('/referral') }}" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                <i class="fa-solid fa-share-nodes mr-2"></i> Referral Program
                            </a>

                            <a href="{{ url('/subscribe') }}" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                <i class="fa-solid fa-dollar-sign mr-2"></i></i> Subscriptions
                            </a>

                            <a href="{{ url('/settings') }}" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                <i class="fa-solid fa-gear mr-2"></i></i> Settings
                            </a>

                            <a href="{{ url('/feedback') }}" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                <i class="fa-solid fa-comment-dots mr-2"></i> Feedback
                            </a>

                            <a href="{{ url('/support') }}" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                <i class="fa-solid fa-circle-info mr-2"></i></i> Help and Support
                            </a>
                            <hr>
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit"
                                    class="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                                    <i class="fas fa-sign-out-alt mr-2"></i> Logout
                                </button>
                            </form>
                        </div>
                    </div>
                @else
                    <a href="{{ url('/login') }}"
                        class="flex h-10 items-center justify-center rounded-full bg-gray-200 px-4">
                        <i class="fas fa-sign-in-alt me-3 text-xl text-black"></i> Login
                    </a>
                    <a href="{{ url('/register') }}"
                        class="flex h-10 items-center justify-center rounded-full bg-gray-200 px-4">
                        <i class="fas fa-user-plus me-3 text-xl text-black"></i> Register
                    </a>
                @endauth
            </div>

        </div>
    </nav>
    <x-toast />
    <x-theme-colors />
    <main>
        @yield('content')
    </main>

    <x-bot />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>

    <!-- Modal for First Login -->
    <div id="firstLoginModal" class="fixed inset-0 flex hidden items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="w-11/12 rounded-lg bg-white p-6 shadow-lg md:w-1/3">

            <!-- First Segment: Welcome Message and Image -->
            <div id="welcomeSegment" class="flex flex-col items-center justify-center">
                <h2 class="mb-4 text-xl font-semibold">Welcome to Blogpotro!</h2>
                <p class="mb-4 text-center">We're excited to have you here! Start your journey with us and let's create
                    something amazing together.</p>
                <img src="{{ asset('images/welcome.png') }}" alt="Welcome Image"
                    class="mb-4 h-1/2 w-full rounded-lg">
                <button id="nextToCategories"
                    class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Next</button>
            </div>

            <!-- Second Segment: Categories Selection (Initially hidden) -->
            <div id="categoriesSegment" class="hidden">
                <h2 class="mb-4 text-xl font-semibold">Personalize Your Experience</h2>
                <p class="mb-4">Select your interests to tailor your experience on Blogpotro.</p>

                <!-- Example category selection -->
                <div>
                    <label class="mb-2 block">Select your interests (max 3):</label>
                    <select id="categorySelect" multiple class="choices w-full rounded border border-gray-300 p-2">
                        <option value="Personal">Personal</option>
                        <option value="Philosophy">Philosophy</option>
                        <option value="Health">Health</option>
                        <option value="Business">Business</option>
                        <option value="Books">Books</option>
                        <option value="History">History</option>
                        <option value="Travel">Travel</option>
                        <option value="Food">Food</option>
                        <option value="Technology">Technology</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Education">Education</option>
                        <option value="Science">Science</option>
                    </select>
                    <p class="mt-1 text-sm text-gray-500">You can select up to 3 categories.</p>
                </div>

                <div class="mt-4 flex justify-between">
                    <button id="submitCategories"
                        class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Submit</button>
                    <button id="closeModal"
                        class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">Close</button>
                </div>
            </div>
        </div>
    </div>

    <style>
        #firstLoginModal {
            z-index: 9999;
            /* Highest z-index value to ensure it stays on top */
            backdrop-filter: blur(10px);
            /* Apply background blur */
            -webkit-backdrop-filter: blur(10px);
            /* For Safari compatibility */
        }
    </style>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Segment elements
            const welcomeSegment = document.getElementById('welcomeSegment');
            const categoriesSegment = document.getElementById('categoriesSegment');
            const nextToCategories = document.getElementById('nextToCategories');

            // Button to go from welcome to categories segment
            nextToCategories.addEventListener('click', function() {
                welcomeSegment.classList.add('hidden');
                categoriesSegment.classList.remove('hidden');
            });

            // Close modal button
            document.getElementById('closeModal').addEventListener('click', function() {
                document.getElementById('firstLoginModal').classList.add('hidden');
            });

            // Submit categories button (logic for storing categories)
            document.getElementById('submitCategories').addEventListener('click', function() {
                const selectedCategories = Array.from(document.getElementById('categorySelect')
                    .selectedOptions).map(option => option.value);
                onCategoriesSelected(selectedCategories);
                document.getElementById('firstLoginModal').classList.add('hidden');
            });
        });
    </script>

    <script>
        // Initialize Choices.js
        const categorySelect = document.getElementById('categorySelect');
        const choices = new Choices(categorySelect, {
            removeItemButton: true,
            maxItemCount: 3,
            searchEnabled: false,
        });

        // Limit selection functionality (optional)
        categorySelect.addEventListener('change', function() {
            if (this.selectedOptions.length > 3) {
                alert('You can only select up to 3 categories.');
                this.options[this.options.length - 1].selected = false; // Deselect the last selected option
            }
        });
    </script>






    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const button = document.getElementById('profile-menu-button');
            const menu = document.getElementById('profile-menu');
            const offcanvasToggle = document.getElementById('offcanvas-toggle');
            const offcanvasChatbot = document.getElementById('offcanvas-chatbot');
            const closeOffcanvas = document.getElementById('close-offcanvas');

            const backButton = document.getElementById('back-button');

            // Function to go back to the previous page
            window.goBack = function() {
                window.history.back();
            };

            // Show the back button if the user is not on the home page
            if (window.location.pathname !== '/') {
                backButton.classList.remove('hidden');
            }

            // Toggle the profile menu visibility
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevents the click event from bubbling up
                menu.classList.toggle('hidden');
            });

            // Close the profile menu when clicking outside of it
            document.addEventListener('click', (event) => {
                if (!menu.contains(event.target) && event.target !== button) {
                    menu.classList.add('hidden');
                }
            });

            // Toggle the off-canvas chatbot
            offcanvasToggle.addEventListener('click', () => {
                offcanvasChatbot.classList.toggle('translate-x-full');
            });

            // Close the off-canvas chatbot
            closeOffcanvas.addEventListener('click', () => {
                offcanvasChatbot.classList.add('translate-x-full');
            });

            @auth
            // Check if it's the first login
            const isFirstLogin = {{ Auth::user()->is_first_login ? 'true' : 'false' }};
        @endauth
        if (isFirstLogin) {
            document.getElementById('firstLoginModal').classList.remove('hidden');
        }

        // Close modal
        document.getElementById('closeModal').addEventListener('click', function() {
            document.getElementById('firstLoginModal').classList.add('hidden');
        });

        // Submit categories
        document.getElementById('submitCategories').addEventListener('click', function() {
            const selectedCategories = Array.from(document.getElementById('categorySelect')
                .selectedOptions).map(option => option.value);
            onCategoriesSelected(selectedCategories);
            document.getElementById('firstLoginModal').classList.add('hidden');
        });

        });
    </script>
    <script>
        // Assuming categories are selected, this function is called
        function onCategoriesSelected(selectedCategories) {
            // Store categories in user table (send AJAX request)
            storeUserCategories(selectedCategories);

            // Show tooltip after categories are successfully selected
            showTooltip();
        }

        // Function to handle storing user categories
        function storeUserCategories(categories) {
            fetch('/store-categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}', // CSRF token for Laravel
                    },
                    body: JSON.stringify({
                        categories
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    // Handle success (e.g., show a success message)
                    console.log('Categories stored:', data);
                })
                .catch(error => {
                    console.error('Error storing categories:', error);
                });
        }

        // Function to show tooltip
        function showTooltip() {
            const tooltip = document.getElementById('tooltip');

            // Remove the 'hidden' class and set opacity to 100 to display the tooltip
            tooltip.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            tooltip.classList.add('opacity-100');

            // Optionally, you could auto-hide the tooltip after a few seconds:
            setTimeout(() => {
                tooltip.classList.add('hidden', 'opacity-0', 'pointer-events-none');
            }, 5000); // Tooltip will hide after 5 seconds (5000ms)
        }

        // Function to handle tooltip acknowledgment and hiding
        document.getElementById('okTooltip').addEventListener('click', function() {
            // Hide tooltip
            const tooltip = document.getElementById('tooltip');
            tooltip.classList.add('hidden', 'opacity-0', 'pointer-events-none');

            // Update user's is_first_login status
            updateFirstLoginStatus();
        });

        // Function to update user's is_first_login
        function updateFirstLoginStatus() {
            fetch('/update-first-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}', // CSRF token for Laravel
                    },
                    body: JSON.stringify({
                        is_first_login: false
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    // Handle success
                    console.log('First login status updated:', data);
                })
                .catch(error => {
                    console.error('Error updating first login status:', error);
                });
        }


        // Function to show the second tooltip
        function showSecondTooltip() {
            const secondTooltip = document.getElementById('secondTooltip');

            // Remove the 'hidden' class and set opacity to 100 to display the second tooltip
            secondTooltip.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            secondTooltip.classList.add('opacity-100');

            // Optionally, auto-hide the second tooltip after a few seconds
            setTimeout(() => {
                secondTooltip.classList.add('hidden', 'opacity-0', 'pointer-events-none');
            }, 5000); // Hide after 5 seconds
        }

        // Function to handle first tooltip acknowledgment and trigger the second tooltip
        document.getElementById('okTooltip').addEventListener('click', function() {
            const tooltip = document.getElementById('tooltip');

            // Hide first tooltip
            tooltip.classList.add('hidden', 'opacity-0', 'pointer-events-none');

            // Trigger the second tooltip
            showSecondTooltip();

            // Optionally, update user's is_first_login status
            // updateFirstLoginStatus();
        });

        // Function to handle second tooltip acknowledgment and trigger the third tooltip
        document.getElementById('okSecondTooltip').addEventListener('click', function() {
            const secondTooltip = document.getElementById('secondTooltip');

            // Hide second tooltip
            secondTooltip.classList.add('hidden', 'opacity-0', 'pointer-events-none');

            // Trigger the third tooltip
            showThirdTooltip();
        });

        // Function to show the third tooltip
        function showThirdTooltip() {
            const thirdTooltip = document.getElementById('thirdTooltip');

            // Remove the 'hidden' class and set opacity to 100 to display the third tooltip
            thirdTooltip.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            thirdTooltip.classList.add('opacity-100');

            // Optionally, auto-hide the third tooltip after a few seconds
            setTimeout(() => {
                thirdTooltip.classList.add('hidden', 'opacity-0', 'pointer-events-none');
            }, 5000); // Hide after 5 seconds
        }

        // Function to handle third tooltip acknowledgment
        document.getElementById('okTooltip3').addEventListener('click', function() {
            const thirdTooltip = document.getElementById('thirdTooltip');

            // Hide third tooltip
            thirdTooltip.classList.add('hidden', 'opacity-0', 'pointer-events-none');
        });
    </script>




</body>

</html>
