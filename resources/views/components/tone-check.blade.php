<!-- Fix Grammar Button -->
@auth

<div id="alert-t" class="bg-violet-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 hidden" role="alert">
        <!-- Loading Spinner -->
        <div id="loading-spinner-t" class="hidden text-center mt-4">
            <svg class="animate-spin h-6 w-6 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 12a8 8 0 0116 0 8 8 0 01-16 0zm16 0A8 8 0 004 12a8 8 0 0016 0z" />
            </svg>
            <p class="text-gray-500">Processing...</p>
        </div>

    <pre id="analyzed-tone" class="whitespace-pre-line font-sans">
    <!-- Result will show here -->
</pre>
</div>



    <button id="analyzeTone" class="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-700 my-2">
        <i class="fas fa-comment-dots mr-2"></i>
        Check Tone
    </button>

    <script>
        document.getElementById('analyzeTone').addEventListener('click', async () => {
            // Show loading spinner
            document.getElementById('loading-spinner-t').classList.remove('hidden');
            document.getElementById('alert-t').classList.remove('hidden');


            try {
                const response = await fetch('/tone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute(
                            'content')
                    },
                    body: JSON.stringify({
                        content: document.getElementById('content').value
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                document.getElementById('analyzed-tone').innerText = data.summary;
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('analyzed-tone').innerText =
                    'An error occurred. Please try again.';
            } finally {
                // Hide loading spinner
                document.getElementById('loading-spinner-t').classList.add('hidden');
            }
        });
    </script>
@endauth
