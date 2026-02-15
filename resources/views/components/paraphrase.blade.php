
<!-- Paraphrase Button -->
@auth
    <div class="bg-green-100 border border-green-400 text-red-700 px-4 py-3 rounded mb-4 hidden" id="alert-p" role="alert">
        <!-- Paraphrased content -->
        <pre id="paraphrased-content" class="text-lg text-gray-700 leading-relaxed mb-4 whitespace-pre-line font-sans">
    <!-- Result will show here -->

</pre>
        <!-- Loading Spinner -->
        <div id="loading-spinner-p" class="hidden text-center mt-4">
            <svg class="animate-spin h-6 w-6 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 12a8 8 0 0116 0 8 8 0 01-16 0zm16 0A8 8 0 004 12a8 8 0 0016 0z" />
            </svg>
            <p class="text-gray-500">Processing...</p>
        </div>
        <!-- Copy button -->
        <button id="copy-btn" class="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 mb-2 hidden">
            Copy
        </button>


    </div>


    <script>
        document.getElementById('copy-btn').addEventListener('click', () => {
            const paraphrasedContent = document.getElementById('paraphrased-content').innerText;

            // Create a temporary text area element to copy the text
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = paraphrasedContent;
            document.body.appendChild(tempTextArea);

            // Select the text and copy it to the clipboard
            tempTextArea.select();
            document.execCommand('copy');

            // Remove the temporary element
            document.body.removeChild(tempTextArea);
        });
    </script>




    <button id="paraphrase" class="bg-green-500 text-white p-2 rounded-lg hover:bg-blue-600 my-2">
        <i class="fas fa-sync-alt mr-2"></i>
        Paraphrase
    </button>

    <script>
        document.getElementById('paraphrase').addEventListener('click', async () => {
            // Show loading spinner
            document.getElementById('loading-spinner-p').classList.remove('hidden');
            document.getElementById('alert-p').classList.remove('hidden');


            try {
                const response = await fetch('/paraphrase', {
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
                document.getElementById('paraphrased-content').innerText = data.summary;
                document.getElementById('copy-btn').classList.remove('hidden');
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('paraphrased-content').innerText =
                    'An error occurred. Please try again.';
            } finally {
                // Hide loading spinner
                document.getElementById('loading-spinner-p').classList.add('hidden');
                //document.getElementById('copy-btn').classList.add('hidden');
            }
        });
    </script>
@endauth
