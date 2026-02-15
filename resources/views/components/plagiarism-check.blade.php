
@auth
       
        

<script>
    // JavaScript code for real-time plagiarism detection

    document.getElementById('content').addEventListener('input', async function() {
        const content = this.value;

        if (content.length >= 50) { // Perform the check only after a minimum character count
            try {
                const response = await fetch('/check-plagiarism', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')
                            .getAttribute('content')
                    },
                    body: JSON.stringify({
                        content: content
                    })
                });

                const result = await response.json();

                if (response.status === 200) {
                    document.getElementById('plagiarism-warning').classList.add('hidden');
                    document.getElementById('publish-btn').disabled = false;
                } else {
                    document.getElementById('plagiarism-warning').classList.remove('hidden');
                    document.getElementById('plagiarism-warning').innerText = result.message;
                    document.getElementById('publish-btn').disabled = true;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
</script>
@endauth
