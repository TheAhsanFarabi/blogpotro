@extends('layouts.app')

@section('content')
<div class="max-w-md mx-auto p-8 rounded-lg mt-8">
    <h1 class="text-4xl font-extrabold text-gray-800 mb-6">Help and Support</h1>

    <div class="space-y-4">
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <button class="w-full text-left font-semibold text-gray-900 mb-2 focus:outline-none flex items-center" onclick="toggleAnswer('1')">
                <span class="flex-1">What is Blogpotro?</span>
                <svg class="w-6 h-6 transform transition-transform" id="icon-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            <div id="answer-1" class="text-gray-700 hidden">
                <p>Blogpotro is a dynamic social media platform tailored for high-quality blogging. It empowers readers to delve into a wide range of content and provides writers with a platform to earn for their valuable contributions.</p>
            </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <button class="w-full text-left font-semibold text-gray-900 mb-2 focus:outline-none flex items-center" onclick="toggleAnswer('2')">
                <span class="flex-1">How can I create an account?</span>
                <svg class="w-6 h-6 transform transition-transform" id="icon-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            <div id="answer-2" class="text-gray-700 hidden">
                <p>Creating an account is easy! Click on the "Sign Up" button located on the homepage, complete the registration form with your details, and follow the instructions to set up your account.</p>
            </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <button class="w-full text-left font-semibold text-gray-900 mb-2 focus:outline-none flex items-center" onclick="toggleAnswer('3')">
                <span class="flex-1">How do I submit feedback or report an issue?</span>
                <svg class="w-6 h-6 transform transition-transform" id="icon-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            <div id="answer-3" class="text-gray-700 hidden">
                <p>We value your feedback! Visit our <a href="{{ url('/feedback') }}" class="text-blue-600 hover:underline">feedback page</a> to share your thoughts or report any issues. We appreciate your input and are committed to improving our platform.</p>
            </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <button class="w-full text-left font-semibold text-gray-900 mb-2 focus:outline-none flex items-center" onclick="toggleAnswer('4')">
                <span class="flex-1">How do I get in touch with customer support?</span>
                <svg class="w-6 h-6 transform transition-transform" id="icon-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            <div id="answer-4" class="text-gray-700 hidden">
                <p>Need assistance? Head over to our <a href="{{ url('/support') }}" class="text-blue-600 hover:underline">support page</a> where you'll find our contact information and additional resources to help you with any issues you may encounter.</p>
            </div>
        </div>
    </div>
</div>

<script>
    function toggleAnswer(id) {
        const answer = document.getElementById(`answer-${id}`);
        const icon = document.getElementById(`icon-${id}`);
        
        if (answer.classList.contains('hidden')) {
            answer.classList.remove('hidden');
            icon.style.transform = 'rotate(180deg)';
        } else {
            answer.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
        }
    }
</script>
@endsection
