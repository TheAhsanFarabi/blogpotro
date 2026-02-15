@extends('layouts.app')
@section('title')
    {{ 'Create Blog' }}
@endsection

@section('content')
    <div class="container mx-auto p-4">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div class="rounded-xl lg:col-span-2">
                @if ($errors->any())
                    <div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
                        <ul>
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif



                <form action="{{ isset($blog) ? route('blogs.update', $blog->id) : route('blogs.store') }}" method="POST"
                    enctype="multipart/form-data" class="mb-2 rounded-lg bg-white p-6 shadow-md" id="theme-container">
                    @csrf
                    @if (isset($blog))
                        @method('PUT')
                    @endif

                    <!-- Image preview -->
                    <img id="image-preview" src="{{ isset($blog) && $blog->image ? asset('storage/' . $blog->image) : '' }}"
                        alt="Image Preview"
                        class="{{ isset($blog) && $blog->image ? '' : 'hidden' }} my-4 h-64 w-full rounded-lg object-cover lg:w-1/2">

                    <!-- Title Input -->
                    <div class="relative mb-4">
                        <input type="text" name="title" id="title" placeholder="Title"
                            value="{{ old('title', $blog->title ?? '') }}"
                            class="w-full border-b-2 border-gray-300 bg-transparent text-3xl font-semibold text-gray-800 placeholder-gray-400 outline-none transition duration-300 focus:border-blue-500">
                        <p id="title-warning" class="hidden text-red-600">Cyberbully word detected in the title!</p>
                    </div>

                    <!-- Content Input -->
                    <div class="relative mb-4">
                        <textarea name="content" id="content" rows="10" placeholder="Tell your story..."
                            class="mb-4 w-full resize-none border-none bg-transparent text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0">{{ old('content', $blog->content ?? '') }}</textarea>
                        <p id="content-warning" class="hidden text-red-600">Cyberbully word detected in the content!</p>

                        <!-- Canvas for circular progress -->
                        <div class="mb-4 flex items-center justify-start">
                            <canvas id="progress-circle" width="100" height="100" class="rounded-full border"></canvas>
                        </div>

                        <!-- Swipe Toggle for Activate/Deactivate Pro -->
                        <div id="activate-pro-btn-container" class="mb-4 flex hidden items-center justify-start">
                            <div class="relative h-10 w-20 cursor-pointer rounded-full bg-gray-300" id="pro-mode-toggle">
                                <div class="absolute left-0 top-0 h-10 w-10 rounded-full bg-white shadow-md transition">
                                </div>
                            </div>
                            <span id="pro-mode-label" class="ml-4 text-gray-700">Activate Pro</span>
                        </div>

                        <!-- Pro Mode Confirmation Modal -->
                        <div id="pro-mode-modal"
                            class="fixed inset-0 hidden items-center justify-center bg-gray-800 bg-opacity-75 pt-10">
                            <div class="rounded-lg bg-white p-6 pt-24 text-center">
                                <h2 class="text-lg font-bold" id="modal-title">Activate Pro Mode</h2>
                                <p class="mt-2 text-gray-600" id="modal-text">Pro Mode will prevent non-premium users from
                                    reading your blog. Are you sure you want to activate it?</p>
                                <div class="mt-4 flex justify-center space-x-4">
                                    <button id="confirm-pro-btn" type="button"
                                        class="rounded-lg bg-green-500 px-4 py-2 text-white">Confirm</button>
                                    <button id="cancel-pro-btn" type="button"
                                        class="rounded-lg bg-gray-500 px-4 py-2 text-white">Cancel</button>
                                </div>
                            </div>
                        </div>

                        <!-- Add a hidden input for is_pro -->
                        <input type="hidden" name="is_pro" id="is_pro" value="0">



                    </div>


                    <!-- Category Selection & Privacy -->
                    <div class="mb-4 flex flex-row items-center justify-start space-x-3">
                        <div class="mb-4">

                            <select name="category_id" id="category"
                                class="w-full rounded-lg border border-gray-300 bg-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required>
                                @foreach ($categories as $category)
                                    <option value="{{ $category->id }}"
                                        {{ isset($blog) && $blog->category_id == $category->id ? 'selected' : '' }}>
                                        {{ $category->name }}
                                    </option>
                                @endforeach
                            </select>

                        </div>

                        <div class="mb-4">

                            <div class="flex items-center space-x-2">
                                <button id="privacy-toggle" type="button"
                                    class="flex items-center space-x-2 rounded-lg bg-gray-300 px-4 py-2 text-gray-700">
                                    <i id="privacy-icon" class="fas fa-globe"></i>
                                    <span id="privacy-label">Public</span>
                                </button>
                            </div>
                            <!-- Hidden input to store the selected privacy value -->
                            <input type="hidden" name="privacy" id="privacy" value="public">
                        </div>

                        <script>
                            document.getElementById('privacy-toggle').addEventListener('click', function() {
                                const privacyInput = document.getElementById('privacy');
                                const privacyIcon = document.getElementById('privacy-icon');
                                const privacyLabel = document.getElementById('privacy-label');

                                // Toggle between 'public' and 'private'
                                if (privacyInput.value === 'public') {
                                    privacyInput.value = 'private';
                                    privacyIcon.className = 'fas fa-lock'; // Change icon to lock
                                    privacyLabel.textContent = 'Private'; // Change label to Private
                                    this.classList.remove('bg-gray-300');
                                    this.classList.add('bg-red-500', 'text-white'); // Update button style for Private
                                } else {
                                    privacyInput.value = 'public';
                                    privacyIcon.className = 'fas fa-globe'; // Change icon to globe
                                    privacyLabel.textContent = 'Public'; // Change label to Public
                                    this.classList.remove('bg-red-500', 'text-white');
                                    this.classList.add('bg-gray-300', 'text-gray-700'); // Update button style for Public
                                }
                            });
                        </script>

                        <div class="mb-4">
                            <label for="image"
                                class="inline-flex cursor-pointer items-center rounded-lg bg-gray-300 px-4 py-2 text-black hover:bg-gray-400">
                                <i class="fas fa-upload mr-2"></i> Upload
                            </label>
                            <input type="file" name="image" id="image" accept="image/*" class="hidden">
                        </div>


                    </div>




                    <x-blog-theme-input />







                    <!-- Submit Button -->
                    <button type="submit" id="publish-btn"
                        class="cursor-not-allowed rounded-lg bg-gray-300 px-4 py-2 text-white" disabled>
                        {{ isset($blog) ? 'Update Blog' : 'Create Blog' }}
                    </button>
                </form>
            </div>
            <div class="flex flex-col lg:col-span-1">
                @if(Auth::user()->subscription)
                <x-grammar-check />
                <x-paraphrase />
                <x-tone-check />
                @endif
                <x-plagiarism-check />


                <div class="mt-4">
                    <div id="tips-container" class="overflow-hidden rounded-xl bg-white text-center">
                        <div class="tip m-5 min-w-full p-5" data-tip="0">
                            <i class="fas fa-pencil-alt text-3xl text-blue-500"></i>
                            <h2 class="mt-2 text-xl font-bold">Start with an Outline</h2>
                            <p class="text-gray-700">Creating an outline helps organize your thoughts and ensures a logical
                                flow in your writing.</p>
                        </div>
                        <div class="tip m-5 hidden min-w-full p-5" data-tip="1">
                            <i class="fas fa-book-open text-3xl text-blue-500"></i>
                            <h2 class="mt-2 text-xl font-bold">Write Engaging Introductions</h2>
                            <p class="text-gray-700">Grab your readers’ attention with a compelling opening that makes them
                                want to read more.</p>
                        </div>
                        <div class="tip m-5 hidden min-w-full p-5" data-tip="2">
                            <i class="fas fa-comments text-3xl text-blue-500"></i>
                            <h2 class="mt-2 text-xl font-bold">Use Clear and Concise Language</h2>
                            <p class="text-gray-700">Avoid jargon and overly complex sentences to make your content
                                accessible to a wider audience.</p>
                        </div>
                        <div class="tip m-5 hidden min-w-full p-5" data-tip="3">
                            <i class="fas fa-thumbs-up text-3xl text-blue-500"></i>
                            <h2 class="mt-2 text-xl font-bold">Incorporate Examples</h2>
                            <p class="text-gray-700">Use real-world examples to illustrate your points and make your
                                writing
                                more relatable.</p>
                        </div>
                        <div class="tip m-5 hidden min-w-full p-5" data-tip="4">
                            <i class="fas fa-edit text-3xl text-blue-500"></i>
                            <h2 class="mt-2 text-xl font-bold">Edit and Revise</h2>
                            <p class="text-gray-700">Always take time to review and revise your work for clarity and
                                coherence before publishing.</p>
                        </div>
                    </div>
                    <div class="mt-4 flex justify-center space-x-2">
                        <span class="dot h-3 w-3 cursor-pointer rounded-full bg-gray-300" data-tip="0"></span>
                        <span class="dot h-3 w-3 cursor-pointer rounded-full bg-gray-300" data-tip="1"></span>
                        <span class="dot h-3 w-3 cursor-pointer rounded-full bg-gray-300" data-tip="2"></span>
                        <span class="dot h-3 w-3 cursor-pointer rounded-full bg-gray-300" data-tip="3"></span>
                        <span class="dot h-3 w-3 cursor-pointer rounded-full bg-gray-300" data-tip="4"></span>
                    </div>
                </div>

                <script>
                    const tips = document.querySelectorAll('.tip');
                    const dots = document.querySelectorAll('.dot');

                    function showTip(index) {
                        tips.forEach((tip, i) => {
                            tip.classList.toggle('hidden', i !== index);
                        });
                        dots.forEach((dot, i) => {
                            dot.classList.toggle('bg-blue-500', i === index);
                            dot.classList.toggle('bg-gray-300', i !== index);
                        });
                    }

                    dots.forEach(dot => {
                        dot.addEventListener('click', function() {
                            const index = parseInt(dot.getAttribute('data-tip'));
                            showTip(index);
                        });
                    });

                    // Initialize the first tip
                    showTip(0);
                </script>

                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        const cyberBullyWords = @json($cyberbullyWords);
                        const titleInput = document.getElementById('title');
                        const contentInput = document.getElementById('content');
                        const publishButton = document.getElementById('publish-btn');
                        const titleWarning = document.getElementById('title-warning');
                        const contentWarning = document.getElementById('content-warning');
                        const progressCircle = document.getElementById('progress-circle');
                        const proToggleButtonContainer = document.getElementById('activate-pro-btn-container');
                        const proModeToggle = document.getElementById('pro-mode-toggle');
                        const proModeLabel = document.getElementById('pro-mode-label');
                        const proModeModal = document.getElementById('pro-mode-modal');
                        const modalTitle = document.getElementById('modal-title');
                        const modalText = document.getElementById('modal-text');
                        const confirmProBtn = document.getElementById('confirm-pro-btn');
                        const cancelProBtn = document.getElementById('cancel-pro-btn');
                        const isProInput = document.getElementById('is_pro');
                        const ctx = progressCircle.getContext('2d');

                        let isProMode = false; // Track whether Pro Mode is active or not

                        // Function to draw the circular progress with dynamic color and character count
                        function drawCircleProgress(charCount) {
                            const radius = 40; // Radius of the circle
                            const centerX = progressCircle.width / 2;
                            const centerY = progressCircle.height / 2;
                            const lineWidth = 8; // Width of the circle line

                            // Determine color based on character count
                            let progressColor = '#3b82f6'; // Default blue (<= 100 characters)
                            if (charCount > 100 && charCount <= 200) {
                                progressColor = '#f59e0b'; // Yellow for 101-200 characters
                            } else if (charCount > 200) {
                                progressColor = '#10b981'; // Green for 201+ characters
                            }

                            const maxCount = 300; // Maximum count for circular progress
                            const progressValue = Math.min((charCount / maxCount) * 100,
                            100); // Ensure the value doesn't exceed 100%

                            // Clear the canvas
                            ctx.clearRect(0, 0, progressCircle.width, progressCircle.height);

                            // Draw background circle (light gray)
                            ctx.beginPath();
                            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                            ctx.fillStyle = '#f3f4f6'; // Light gray background
                            ctx.fill();

                            // Draw progress arc
                            const startAngle = -0.5 * Math.PI; // Start at the top of the circle
                            const endAngle = (progressValue / 100) * 2 * Math.PI + startAngle; // End angle based on progress
                            ctx.beginPath();
                            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
                            ctx.lineWidth = lineWidth;
                            ctx.strokeStyle = progressColor; // Change color dynamically
                            ctx.stroke();

                            // Draw character count in the center
                            ctx.fillStyle = progressColor; // Text color matches progress color
                            ctx.font = 'bold 16px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(`${charCount}`, centerX, centerY); // Display character count
                        }

                        function checkForCyberBullyWords(input, warningElement) {
                            const words = input.value.toLowerCase().split(/\s+/);
                            const foundWords = words.filter(word => cyberBullyWords.includes(word));
                            if (foundWords.length > 0) {
                                warningElement.classList.remove('hidden');
                                return true;
                            } else {
                                warningElement.classList.add('hidden');
                                return false;
                            }
                        }

                        function validateForm() {
                            const contentText = contentInput.value.replace(/\s+/g,
                            ''); // Remove spaces to calculate character count
                            const charCount = contentText.length; // Count characters excluding spaces

                            // Update the circular progress
                            drawCircleProgress(charCount);

                            const isTitleValid = !checkForCyberBullyWords(titleInput, titleWarning);
                            const isContentValid = !checkForCyberBullyWords(contentInput, contentWarning);

                            // Show or hide the "Activate Pro" swipe toggle based on character count
                            if (charCount >= 300) {
                                proToggleButtonContainer.classList.remove('hidden'); // Show "Activate Pro" toggle
                            } else {
                                proToggleButtonContainer.classList.add('hidden'); // Hide "Activate Pro" toggle
                            }

                            // Enable the publish button if conditions are met
                            if (charCount >= 100 && isTitleValid && isContentValid) {
                                publishButton.disabled = false;
                                publishButton.classList.remove('bg-gray-300', 'cursor-not-allowed');
                                publishButton.classList.add('bg-blue-500', 'text-white', 'cursor-pointer');
                            } else {
                                publishButton.disabled = true;
                                publishButton.classList.add('bg-gray-300', 'cursor-not-allowed');
                                publishButton.classList.remove('bg-blue-500', 'text-white', 'cursor-pointer');
                            }
                        }

                        // Add event listeners for real-time validation
                        titleInput.addEventListener('input', validateForm);
                        contentInput.addEventListener('input', validateForm);

                        // Image preview functionality
                        document.getElementById('image').addEventListener('change', function(event) {
                            const [file] = event.target.files;
                            if (file) {
                                const preview = document.getElementById('image-preview');
                                preview.src = URL.createObjectURL(file);
                                preview.classList.remove('hidden');
                            }
                        });

                        // Swipe toggle functionality for Pro Mode
                        proModeToggle.addEventListener('click', function() {
                            // Update modal text based on current Pro Mode state
                            if (isProMode) {
                                modalTitle.textContent = 'Deactivate Pro Mode';
                                modalText.textContent =
                                    'Deactivating Pro Mode will allow all users to read your blog again. Are you sure you want to deactivate it?';
                            } else {
                                modalTitle.textContent = 'Activate Pro Mode';
                                modalText.textContent =
                                    'Pro Mode will prevent non-premium users from reading your blog. Are you sure you want to activate it?';
                            }

                            // Trigger the modal
                            proModeModal.classList.remove('hidden');
                        });

                        // Handle confirmation in the modal
                        confirmProBtn.addEventListener('click', function() {
                            // Close the modal
                            proModeModal.classList.add('hidden');

                            // Toggle Pro Mode state
                            if (isProMode) {
                                // Deactivate Pro Mode
                                isProMode = false;
                                isProInput.value = 0; // Set is_pro to false
                                proModeLabel.textContent = 'Activate Pro';
                                proModeToggle.querySelector('div').classList.remove('translate-x-10'); // Reset swipe
                                proModeToggle.classList.remove('bg-green-500');
                                proModeToggle.classList.add('bg-gray-300');
                            } else {
                                // Activate Pro Mode
                                isProMode = true;
                                isProInput.value = 1; // Set is_pro to true
                                proModeLabel.textContent = 'Pro Mode Activated';
                                proModeToggle.querySelector('div').classList.add('translate-x-10'); // Simulate swipe
                                proModeToggle.classList.remove('bg-gray-300');
                                proModeToggle.classList.add('bg-green-500');
                            }
                        });

                        // Handle cancel in the modal
                        cancelProBtn.addEventListener('click', function() {
                            proModeModal.classList.add('hidden'); // Close modal
                        });

                        // Initial form validation to ensure correct state on page load
                        validateForm();
                    });
                </script>




            </div>


        </div>









    @endsection
