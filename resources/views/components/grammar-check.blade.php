<!-- Fix Grammar Button -->
@auth

<div id="alert-g" class="bg-violet-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 hidden" role="alert">
        <!-- Loading Spinner -->
        <div id="loading-spinner-g" class="hidden text-center mt-4">
            <svg class="animate-spin h-6 w-6 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 12a8 8 0 0116 0 8 8 0 01-16 0zm16 0A8 8 0 004 12a8 8 0 0016 0z" />
            </svg>
            <p class="text-gray-500">Processing...</p>
        </div>

    <pre id="fixed-grammer" >
    <!-- Result will show here -->
</pre>
</div>



    <button id="fix-btn" class="bg-violet-500 text-white p-2 rounded-lg hover:bg-blue-600 my-2">
        <i class="fas fa-spell-check mr-2"></i>
        Check Grammer
    </button>

    <script>
        document.getElementById('fix-btn').addEventListener('click', async () => {
            // Show loading spinner
            document.getElementById('loading-spinner-g').classList.remove('hidden');
            document.getElementById('alert-g').classList.remove('hidden');


            try {
                const response = await fetch('/fix', {
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
                document.getElementById('fixed-grammer').innerText = data.summary;
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('fixed-grammer').innerText =
                    'An error occurred. Please try again.';
            } finally {
                // Hide loading spinner
                document.getElementById('loading-spinner-g').classList.add('hidden');
            }
        });
    </script>
@endauth
