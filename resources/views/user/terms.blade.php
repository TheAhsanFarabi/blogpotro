@extends('layouts.app')

@section('content')
<div class="container mx-auto max-w-3xl p-8 bg-white shadow-md rounded-lg my-10">
    <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">Terms of Service</h1>

    <p class="text-lg text-gray-600 mb-6">Welcome to Blogpotro! By using our website, you agree to the following terms and conditions:</p>

    <div class="space-y-8">
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
            <p class="text-gray-700">
                By accessing and using Blogpotro, you accept and agree to be bound by these terms of service. If you do not agree, you must not use our services.
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">2. User Responsibilities</h2>
            <p class="text-gray-700">
                You are responsible for the content you post and ensuring it complies with all applicable laws. You must not use Blogpotro to publish harmful, offensive, or illegal content.
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">3. Intellectual Property</h2>
            <p class="text-gray-700">
                All content on Blogpotro, including text, graphics, logos, and software, is the property of Blogpotro or its content suppliers and is protected by copyright laws.
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">4. Termination</h2>
            <p class="text-gray-700">
                We reserve the right to terminate or suspend your access to Blogpotro without notice if you violate any of the terms.
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">5. Changes to Terms</h2>
            <p class="text-gray-700">
                We may update these terms at any time without notice. It is your responsibility to review the terms periodically for changes.
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">6. Contact Us</h2>
            <p class="text-gray-700">
                If you have any questions about these Terms, please contact us at <a href="mailto:support@blogpotro.com" class="text-blue-500 underline">support@blogpotro.com</a>.
            </p>
        </div>
    </div>
</div>
@endsection
