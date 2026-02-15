
<div class="bg-white shadow-lg rounded-lg p-4">
    <h2 class="text-xl font-bold mb-4">Top Users</h2>
    <ul class="flex flex-row space-x-2 mb-5">
        @foreach ($topUsers as $user)
            
                <!-- Profile Picture -->
                <a href="{{ route('profile.show', $user->id) }}"><img src="{{ asset('storage/images/' . $user->profile_picture) }}" alt="Profile Picture"
                    class="w-20 h-20 rounded-full hover:opacity-50"></a>
                
            
        @endforeach
    </ul>
    <a href="/user" class="py-5 text-center text-md text-gray-500 font-bold hover:text-blue-400">View All Users</a>
</div>
