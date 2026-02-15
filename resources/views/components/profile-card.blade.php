<style>
    .default-theme {
        background-color: #f8fafc;
    }

    .theme-blue {
        background-color: #e0f2ff;
    }

    .theme-green {
        background-color: #e7f9e7;
    }

    .theme-red {
        background-color: #ffe7e7;
    }

    .theme-gif-1 {
        background-image: url('https://i.pinimg.com/originals/6a/cd/07/6acd0780a4c693b2cf8da52b5c44b18e.gif');
        background-size: cover;
    }

    .theme-gif-2 {
        background-image: url('https://64.media.tumblr.com/2891ae1ed8e9e75e1b71863218833a06/7ab0732983858d05-6d/s1280x1920/8159a8856ac92dc13d57d4730df3a55822f94406.gif');
        background-size: cover;
    }

    .theme-img-1 {
        background-image: url('https://studioghiblimovies.com/wp-content/uploads/2020/03/dims1.jpg');
        background-size: cover;
    }

    .theme-img-2 {
        background-image: url('https://wallpapers.com/images/hd/aesthetic-ghibli-rlzu1ukskd7q8df4.jpg');
        background-size: cover;
    }


    .theme-preview {
        width: 100px;
        height: 100px;
        border: 2px solid #ddd;
        border-radius: 5px;
        margin-top: 10px;
    }
</style>
<div class="{{ $user->banner_theme }} shadow-md rounded-lg p-6 mb-4">
    <div class="flex flex-col md:flex-row items-center justify-start mb-4 gap-4">
        <!-- Profile Picture (Thumbnail) -->
        <div class="relative">
            <!-- Avatar Effect -->
            @if ($user->avatar_effect === 'fire')
            <span class="absolute w-80 h-80 bottom-32 right-16"
                style="background-image: url('https://community.wacom.com/en-de/wp-content/uploads/sites/20/2023/10/Flame_GIF_2.gif'); background-size: cover; transform: translate(50%, 50%);"></span>
            @elseif ($user->avatar_effect === 'wind')
            <span class="absolute w-80 h-80 bottom-24 right-16"
                style="background-image: url('https://opengameart.org/sites/default/files/ezgif.com-gif-maker%20%283%29.gif'); background-size: cover; transform: translate(50%, 50%);"></span>
            @elseif ($user->avatar_effect === 'sound')
            <span class="absolute w-80 h-80 bottom-24 right-16"
                style="background-image: url('https://opengameart.org/sites/default/files/ezgif.com-gif-maker_0.gif'); background-size: cover; transform: translate(50%, 50%);"></span>
            @endif
    
            <!-- Profile Picture -->
            <img src="{{ $user->profile_picture ? asset('storage/images/' . $user->profile_picture) : asset('images/avator.jpg') }}"
                alt="Profile Picture" class="w-32 h-32 rounded-full object-cover cursor-pointer relative z-10"
                id="profilePicThumbnail">
    
            <!-- Status Icon -->
            @if ($user->isStatusActive())
            <div class="absolute bottom-4 right-3 transform translate-x-1/4 translate-y-1/4 z-20">
                @if ($user->status === 'active')
                <i class="fas fa-circle text-green-400 text-2xl" title="Active"></i>
                @elseif ($user->status === 'do_not_disturb')
                <i class="fas fa-minus-circle text-yellow-400 text-2xl" title="Do Not Disturb"></i>
                @elseif ($user->status === 'invisible')
                <i class="fas fa-eye-slash text-gray-400 text-2xl" title="Invisible"></i>
                @endif
            </div>
            @endif
        </div>
    
        <!-- Full Image Modal (Hidden initially) -->
        <div id="fullImageModal" class="fixed inset-0 flex items-center justify-center z-50 hidden bg-black bg-opacity-75">
            <div class="relative">
                <button id="closeImageModal" class="absolute top-0 right-0 text-white text-3xl font-bold">&times;</button>
                <img id="fullImage"
                    src="{{ $user->profile_picture ? asset('storage/images/' . $user->profile_picture) : asset('images/avator.jpg') }}"
                    alt="Full Profile Picture" class="max-w-full max-h-screen rounded-lg">
            </div>
        </div>
    
        <script>
            // Handle thumbnail click to show the full image modal
            document.getElementById('profilePicThumbnail').addEventListener('click', function() {
                document.getElementById('fullImageModal').classList.remove('hidden');
            });
    
            // Handle close button click to hide the full image modal
            document.getElementById('closeImageModal').addEventListener('click', function() {
                document.getElementById('fullImageModal').classList.add('hidden');
            });
    
            // Optional: Close the modal if user clicks outside the image
            document.getElementById('fullImageModal').addEventListener('click', function(event) {
                if (event.target === this) {
                    this.classList.add('hidden');
                }
            });
        </script>
    
        <!-- User Info and Actions -->
        <div class="mx-3 bg-white rounded-lg p-4 opacity-75 hover:opacity-100">
            <h1 class="text-3xl font-bold">{{ $user->name }}</h1>
            <p class="text-gray-600 mb-2">Joined {{ \Carbon\Carbon::parse($user->created_at)->format('j F, Y') }}</p>
            <hr>
    
            <!-- Followers and Following -->
            <div class="flex items-center mt-2">
                <a href="{{ route('users.followers', $user->id) }}"><p class="text-gray-700 mr-4">{{ $user->followers->count() }} Followers</p></a>
                <a href="{{ route('users.followings', $user->id) }}"><p class="text-gray-700 mr-4">{{ $user->following->count() }} Following</p></a>
                <p class="text-gray-700">{{ $user->blogs->count() }} blogs</p>
            </div>
    
            <!-- Follow/Unfollow Button -->
            @auth
            @if (Auth::id() !== $user->id)
            <form
                action="{{ $user->isFollowedBy(Auth::user()) ? route('profile.unfollow', $user->id) : route('profile.follow', $user->id) }}"
                method="POST">
                @csrf
                <button type="submit" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    {{ $user->isFollowedBy(Auth::user()) ? 'Unfollow' : 'Follow' }}
                </button>
            </form>
            @endif
            @endauth
        </div>
    </div>
    








    
    @auth
        @if ($user->id === Auth::id())
            <div class="mt-12">
                <button id="editProfileBtn" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 z-50">Edit
                    Profile</button>
                <a href="/analytics" class="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 z-50">View Analytics</a>
            </div>
        @endif
    @endauth


</div>

<h2 class="text-sm text-gray-500 font-semibold mt-8 mb-4">Blogs by {{ $user->name }}</h2>



{{-- Edit Profile Modal --}}
<div id="editProfileModal" class="fixed inset-0 flex items-center justify-center z-50 hidden">
    <div class="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg overflow-y-auto h-2/3">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Edit Profile</h2>
            <button id="closeModalBtn" class="text-red-800 hover:text-gray-700 text-2xl font-black">&times;</button>
        </div>
        <form action="{{ route('profile.update', $user->id) }}" method="POST" enctype="multipart/form-data">
            @csrf
            @method('PUT')
        {{-- STATUS --}}
<div class="mb-4">
    <label for="status" class="block text-gray-700 font-bold mb-2">Status (Lasts 24 hours):</label>
    <select name="status" id="status" 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <option value="active" {{ old('status', $user->status) == 'active' ? 'selected' : '' }}>
            Active
        </option>
        <option value="do_not_disturb" {{ old('status', $user->status) == 'do_not_disturb' ? 'selected' : '' }}>
            Do Not Disturb
        </option>
        <option value="invisible" {{ old('status', $user->status) == 'invisible' ? 'selected' : '' }}>
            Invisible
        </option>
    </select>
</div>


        {{-- Avatar effect --}}
        <div class="mb-4">
            <label for="avatar_effect" class="block text-gray-700 font-bold mb-2">Avatar Effect:</label>
            <select name="avatar_effect" id="avatar_effect" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="fire" {{ old('status', $user->avatar_effect) == 'fire' ? 'selected' : '' }}>
                    Flame Breathing
                </option>
                <option value="wind" {{ old('status', $user->avatar_effect) == 'water' ? 'selected' : '' }}>
                    Wind Breathing
                </option>
                <option value="sound" {{ old('status', $user->avatar_effect) == 'air' ? 'selected' : '' }}>
                    Sound Breathing
                </option>
            </select>
        </div>

            <!-- Bio -->
            <div class="mb-4">
                <label for="bio" class="block text-gray-700 font-bold mb-2">Bio:</label>
                <textarea name="bio" id="bio" rows="3"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">{{ $user->bio }}</textarea>
            </div>

            <!-- Institute -->
            <div class="mb-4">
                <label for="institute" class="block text-gray-700 font-bold mb-2">Institute:</label>
                <input type="text" name="institute" id="institute"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value="{{ $user->institute }}">
            </div>

            <!-- Date of Birth -->
            <div class="mb-4">
                <label for="dob" class="block text-gray-700 font-bold mb-2">Date of Birth:</label>
                <input type="date" name="dob" id="dob"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value="{{ $user->dob ? \Carbon\Carbon::parse($user->dob)->format('Y-m-d') : '' }}">
            </div>

            <!-- Work Experience -->
            <div class="mb-4">
                <label for="work_experience" class="block text-gray-700 font-bold mb-2">Work Experience:</label>
                <textarea name="work_experience" id="work_experience" rows="3"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">{{ $user->work_experience }}</textarea>
            </div>

            {{-- Profile Theme --}}
            <div class="mb-4">
                <label for="profile_theme" class="block text-gray-700 font-bold mb-2">Profile Theme:</label>
                <select name="profile_theme"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="default-theme" {{ $user->profile_theme == 'default-theme' ? 'selected' : '' }}>
                        Default
                    </option>
                    <option value="theme-blue" {{ $user->profile_theme == 'theme-blue' ? 'selected' : '' }}>Blue
                    </option>
                    <option value="theme-green" {{ $user->profile_theme == 'theme-green' ? 'selected' : '' }}>Green
                    </option>
                    <option value="theme-red" {{ $user->profile_theme == 'theme-red' ? 'selected' : '' }}>Red
                    </option>
                   
                </select>

            </div>


            {{-- Banner Theme --}}

            <div class="mb-4">
                <label for="banner_theme" class="block text-gray-700 font-bold mb-2">Banner Theme:</label>
                <select name="banner_theme" id="banner_theme"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="default-theme" {{ $user->banner_theme == 'default-theme' ? 'selected' : '' }}>
                        Default
                    </option>
                    <option value="theme-img-1" {{ $user->banner_theme == 'theme-img-1' ? 'selected' : '' }}>Ghibli
                        Theme 1
                    </option>

                    <option value="theme-img-2" {{ $user->banner_theme == 'theme-img-2' ? 'selected' : '' }}>Ghibli
                        Theme 2
                    </option>
                    <option value="theme-gif-1" {{ $user->banner_theme == 'theme-gif-1' ? 'selected' : '' }}>GIF Theme
                        1
                    </option>
                    <option value="theme-gif-2" {{ $user->banner_theme == 'theme-gif-2' ? 'selected' : '' }}>GIF Theme
                        2
                    </option>
                </select>

                <!-- Preview of Selected Theme -->
                <div id="themePreview" class="theme-preview {{ $user->banner_theme }} shadow-md rounded-lg p-6 mb-4">
                </div>
            </div>

            <!-- Profile Picture with Preview -->
            <div class="mb-4">
                <label for="profile_picture" class="block text-gray-700 font-bold mb-2">Profile Picture:</label>
                <input type="file" name="profile_picture" id="profile_picture" accept="image/*"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <!-- Preview -->
                <div class="mt-4">
                    <img id="profile_picture_preview"
                        src="{{ $user->profile_picture ? asset('storage/images/' . $user->profile_picture) : asset('images/avator.jpg') }}"
                        class="w-32 h-32 object-cover rounded-full" alt="Profile Picture Preview">
                </div>
            </div>

            <div>
                <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Save
                    Changes</button>
            </div>
        </form>
    </div>
</div>


<script>
    document.getElementById('profile_picture').addEventListener('change', function(event) {
        const reader = new FileReader();
        reader.onload = function() {
            const img = document.getElementById('profile_picture_preview');
            img.src = reader.result;
        }
        reader.readAsDataURL(event.target.files[0]);
    });
</script>


{{-- Modal Background --}}
<div id="modalBackground" class="fixed inset-0 bg-black opacity-50 z-40 hidden"></div>

<script>
    document.getElementById('editProfileBtn').addEventListener('click', function() {
        document.getElementById('editProfileModal').classList.remove('hidden');
        document.getElementById('modalBackground').classList.remove('hidden');
    });

    document.getElementById('closeModalBtn').addEventListener('click', function() {
        document.getElementById('editProfileModal').classList.add('hidden');
        document.getElementById('modalBackground').classList.add('hidden');
    });

    document.getElementById('modalBackground').addEventListener('click', function() {
        document.getElementById('editProfileModal').classList.add('hidden');
        document.getElementById('modalBackground').classList.add('hidden');
    });
</script>


<script>
    // Preview Theme Changes
    document.getElementById('banner_theme').addEventListener('change', function() {
        const selectedTheme = this.value;
        const themePreview = document.getElementById('themePreview');

        // Remove all current theme classes
        themePreview.className = 'theme-preview';

        // Add the selected theme as a class
        themePreview.classList.add(selectedTheme);

    });
</script>
