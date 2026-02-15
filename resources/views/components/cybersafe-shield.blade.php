<script>
    const cyberBullyWords = @json($cyberbullyWords);

    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const publishButton = document.getElementById('publish-btn');
    const titleWarning = document.getElementById('title-warning');
    const contentWarning = document.getElementById('content-warning');
    const progressCircle = document.getElementById('progress-circle');
    const ctx = progressCircle.getContext('2d');

    // Function to draw the circular progress
    function drawCircleProgress(value) {
        const radius = 40; // Radius of the circle
        const centerX = progressCircle.width / 2;
        const centerY = progressCircle.height / 2;
        const startAngle = -0.5 * Math.PI; // Start at the top of the circle
        const endAngle = (value / 100) * 2 * Math.PI + startAngle; // End angle based on progress
        const lineWidth = 8; // Width of the circle line

        // Clear the canvas
        ctx.clearRect(0, 0, progressCircle.width, progressCircle.height);
        
        // Draw background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#f3f4f6'; // Light gray background
        ctx.fill();

        // Draw progress circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#3b82f6'; // Blue progress color
        ctx.stroke();

        // Draw the text in the center
        ctx.fillStyle = '#3b82f6'; // Text color
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${value}/100`, centerX, centerY);
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
        const contentText = contentInput.value.replace(/\s+/g, ''); // Remove spaces
        const contentLength = contentText.length; // Count without spaces

        // Update the circular progress
        const progressValue = Math.min((contentLength / 100) * 100, 100); // Ensure max is 100
        drawCircleProgress(progressValue);

        const isTitleValid = !checkForCyberBullyWords(titleInput, titleWarning);
        const isContentValid = !checkForCyberBullyWords(contentInput, contentWarning);

        if (contentLength >= 100 && isTitleValid && isContentValid) {
            publishButton.disabled = false;
            publishButton.classList.remove('bg-gray-300', 'cursor-not-allowed');
            publishButton.classList.add('bg-blue-500', 'text-white', 'cursor-pointer');
        } else {
            publishButton.disabled = true;
            publishButton.classList.add('bg-gray-300', 'cursor-not-allowed');
            publishButton.classList.remove('bg-blue-500', 'text-white', 'cursor-pointer');
        }
    }

    titleInput.addEventListener('input', validateForm);
    contentInput.addEventListener('input', validateForm);
    
    document.getElementById('image').addEventListener('change', function(event) {
        const [file] = event.target.files;
        if (file) {
            const preview = document.getElementById('image-preview');
            preview.src = URL.createObjectURL(file);
            preview.classList.remove('hidden');
        }
    });
</script>
