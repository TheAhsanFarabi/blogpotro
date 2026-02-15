<div class="container my-4">
    <!-- Horizontal scrolling container for the shorts -->
    <div class="flex space-x-4 overflow-x-auto py-4 h-[220px] scrollbar-thin">
        @auth
        <!-- Create Short button linking to /create-shorts -->
        <a href="/create-shorts" class="relative border p-2 min-w-[120px] max-w-[120px] h-full cursor-pointer shadow-lg rounded-xl">
            <div class="absolute inset-0 bg-cover bg-center rounded-xl" style="background-image: url('{{ asset('storage/images/' . Auth::user()->profile_picture) }}'); opacity: 0.7;"></div>
            <div class="w-full z-10 relative text-white font-semibold flex flex-col justify-center items-center">
                <i class="fas fa-plus text-3xl mb-2"></i>
                <span>Create Short</span>
            </div>
        </a>
        @endauth

        <!-- Iterate over shorts -->
        @foreach ($shorts as $short)
        <div class="relative border p-2 min-w-[120px] max-w-[120px] h-full cursor-pointer short-item shadow-lg rounded-xl" 
            data-id="{{ $short->id }}"
            data-text="{{ $short->text }}"
            data-image="{{ asset('storage/' . $short->image) }}"
            data-user-image="{{ asset('storage/images/' . $short->user->profile_picture) }}"
            onclick="openModal({{ $loop->index }})"> <!-- Call openModal with the index -->
            <div class="absolute inset-0 bg-cover bg-center rounded-xl" style="background-image: url('{{ asset('storage/' . $short->image) }}'); opacity: 0.7;"></div>
            <img src="{{ asset('storage/images/' . $short->user->profile_picture) }}" alt="User image" class="w-8 h-8 rounded-full mb-2 relative" loading="lazy">
        </div>
        @endforeach

        <!-- Show More Shorts button linking to /shorts -->
        <a href="/shorts" class="relative border p-2 min-w-[120px] max-w-[120px] h-full cursor-pointer shadow-lg rounded-xl flex items-center justify-center">
            <span class="w-full z-10 relative text-black font-semibold text-center">Show More Shorts</span>
        </a>
    </div>
</div>

<!-- Modal Structure -->
<div id="shortModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 hidden z-50">
    <div class="bg-white p-4 rounded-lg max-w-lg w-full shadow-lg relative">
        <!-- Short content with background image -->
        <div class="relative">
            <img id="modalShortImage" src="" alt="Short image" class="object-cover mb-2 w-full h-[750px]">
            <div class="absolute inset-0 flex flex-col justify-center items-center text-white">
                <img id="modalUserImage" src="" alt="User image" class="w-12 h-12 rounded-full mb-2">
                <p id="modalText" class="text-center"></p>
            </div>
        </div>

        
        <div class="mt-4 flex justify-between">
            
            @if(auth()->id() === $short->user_id)
            
                <a href="" class="text-blue-500 flex items-center">
                    <i class="fas fa-edit mr-1"></i> Edit
                </a>
                <form action="" method="POST" class="inline-block">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="text-red-500 flex items-center">
                        <i class="fas fa-trash mr-1"></i> Delete
                    </button>
                </form>
            
            @endif
            
            <button class="mt-4 text-gray-500" onclick="closeModal()">Close</button>
        </div>

        <!-- Navigation buttons -->
        <button id="prevBtn" class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button id="nextBtn" class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full">
            <i class="fas fa-chevron-right"></i>
        </button>
    </div>
</div>

<!-- JavaScript to handle modal display and navigation -->
<script>
    let currentIndex = 0;
    const shorts = document.querySelectorAll('.short-item');

    function openModal(index) {
        currentIndex = index;
        const item = shorts[currentIndex];
        const text = item.getAttribute('data-text');
        const image = item.getAttribute('data-image');
        const userImage = item.getAttribute('data-user-image');
        const shortId = item.getAttribute('data-id');

        document.getElementById('modalText').textContent = text;
        document.getElementById('modalShortImage').src = image;
        document.getElementById('modalUserImage').src = userImage;

        document.getElementById('shortModal').classList.remove('hidden');
        updateArrowVisibility();
    }

    function closeModal() {
        document.getElementById('shortModal').classList.add('hidden');
    }

    function showNextShort() {
        if (currentIndex < shorts.length - 1) {
            openModal(currentIndex + 1);
        }
    }

    function showPrevShort() {
        if (currentIndex > 0) {
            openModal(currentIndex - 1);
        }
    }

    function updateArrowVisibility() {
        document.getElementById('prevBtn').style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
        document.getElementById('nextBtn').style.visibility = currentIndex === shorts.length - 1 ? 'hidden' : 'visible';
    }

    // Add event listeners for each short to open the modal
    shorts.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });

    // Event listeners for navigation buttons
    document.getElementById('nextBtn').addEventListener('click', showNextShort);
    document.getElementById('prevBtn').addEventListener('click', showPrevShort);
</script>

<style>
    #modalShortImage {
        height: 750px;
        /* Fixed height */
        object-fit: cover;
        /* Crop the image to fit the dimensions */
    }

    /* Optional: Style for the text inside the modal */
    #modalText {
        position: relative;
        /* This ensures it stays in the stacking context */
        z-index: 10;
        /* Makes sure text is above the image */
        text-align: center;
        /* Center text */
    }

    /* Style for the user image */
    #modalUserImage {
        position: absolute;
        /* Change to absolute positioning */
        top: 10px;
        /* Adjust the top position */
        left: 10px;
        /* Adjust the left position */
        z-index: 10;
        /* Ensure it appears above the image */
        width: 50px;
        /* Set a specific width */
        height: 50px;
        /* Set a specific height */
        border-radius: 50%;
        /* Keep the circular shape */
    }
</style>
