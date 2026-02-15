@extends('layouts.app')

@section('content')
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<div class="container mx-auto py-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-6">{{ $course->title }}</h1>
    <p class="text-lg text-gray-600 mb-8">{{ $course->description }}</p>

    @if (auth()->user()->courses->contains($course))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span class="block sm:inline">You already own this course!</span>
        </div>

        <h3 class="text-2xl font-semibold text-gray-800 mb-4">Modules</h3>
        <div class="flex flex-col space-y-4">
            @foreach ($course->modules as $index => $module)
                <div class="flex items-center space-x-4">
                    <div class="w-6 h-6 rounded-full bg-violet-400"></div> <!-- Colored Circle -->
                    <a href="{{ route('modules.show', [$course, $module]) }}" class="flex-1 bg-white rounded-lg shadow-md p-4 hover:bg-gray-100 transition duration-300">
                        <h4 class="text-lg font-medium text-gray-900">{{ $index + 1 }}. {{ $module->title }}</h4> <!-- Added numbering -->
                    </a>
                </div>
            @endforeach
        </div>
        {{-- Show Download Certificate Button if Score > 3 --}}
        @php
            $userCourse = \App\Models\UserCourse::where('user_id', auth()->id())
                ->where('course_id', $course->id)
                ->first();
        @endphp

        @if ($userCourse && $userCourse->score > 3)
            <div class="mt-8">
                <button id="downloadCertificate" class="inline-block px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow hover:bg-green-600 transition duration-300">
                    Download Certificate
                </button>
            </div>
        @endif
    @else
        <form method="POST" action="{{ route('courses.buy', $course) }}" class="mt-8">
            @csrf
            <button type="submit" class="inline-block px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition duration-300">
                Buy Course for 10 Credits
            </button>
        </form>
    @endif
</div>

<!-- Load jsPDF -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<script>
    // Ensure the DOM is fully loaded before attaching the event listener
    document.addEventListener('DOMContentLoaded', function () {
        const downloadButton = document.getElementById('downloadCertificate');
        
        if (downloadButton) {
            downloadButton.addEventListener('click', function () {
                // Call a function to generate and download the certificate PDF
                generateCertificate();
            });
        }
    });

    function generateCertificate() {
    const courseTitle = "{{ $course->title }}";
    const userName = "{{ auth()->user()->name }}";
    const iconUrl = '{{ asset("images/logo-sm.png") }}'; // Get the icon URL from the asset

    // Create PDF using jsPDF library
    const { jsPDF } = window.jspdf; // Ensure we access jsPDF from the window
    const doc = new jsPDF('landscape', 'pt', 'a4'); // Landscape orientation for A4 size

    // Set background color
    doc.setFillColor(255, 255, 255); // White background
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

    // Add the icon at the top left corner
    doc.addImage(iconUrl, 'PNG', 40, 30, 60, 60); // Adjust the size and position as needed

    // Title
    doc.setFontSize(30);
    doc.setTextColor(40, 44, 52); // Dark gray color
    doc.text('Certificate of Completion', doc.internal.pageSize.width / 2, 100, { align: 'center' });

    // Add a decorative line
    doc.setLineWidth(2);
    doc.line(50, 110, doc.internal.pageSize.width - 50, 110); // Horizontal line

    // Content Section
    doc.setFontSize(20);
    doc.setTextColor(70, 70, 70); // Medium gray
    doc.text('This is to certify that', doc.internal.pageSize.width / 2, 150, { align: 'center' });
    
    // User Name
    doc.setFontSize(28);
    doc.setFont('Helvetica', 'bold'); // Bold font for name
    doc.text(userName, doc.internal.pageSize.width / 2, 200, { align: 'center' });
    
    // Course Completion Message
    doc.setFontSize(20);
    doc.setFont('Helvetica', 'normal'); // Normal font for course title
    doc.text('has successfully completed the course:', doc.internal.pageSize.width / 2, 250, { align: 'center' });
    
    // Course Title
    doc.setFontSize(22);
    doc.setFont('Helvetica', 'bold');
    doc.text(courseTitle, doc.internal.pageSize.width / 2, 300, { align: 'center' });

    // Add a decorative line at the bottom
    doc.setLineWidth(2);
    doc.line(50, 320, doc.internal.pageSize.width - 50, 320); // Horizontal line

    // Footer
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(100, 100, 100); // Lighter gray for footer
    doc.text('Date: ' + new Date().toLocaleDateString(), doc.internal.pageSize.width - 150, 340, { align: 'right' });
    
    // Save the PDF
    doc.save(`${userName}_Certificate_${courseTitle}.pdf`);
}

</script>
@endsection
