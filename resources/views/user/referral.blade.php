{{-- resources/views/user/referral.blade.php --}}

@extends('layouts.app')

@section('content')
<div class="container mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold">Referral Program</h2>
    <p class="mt-4 text-gray-600">Share your referral link with your friends to earn credits!</p>

    {{-- Display success or error messages --}}
    @if (session('message'))
        <div class="mb-4 p-4 bg-green-500 text-white rounded">
            {{ session('message') }}
        </div>
    @endif

    {{-- Display the referral link --}}
    <div class="mt-6 bg-white shadow rounded-lg p-4">
        <h5 class="font-semibold">Your Referral Link</h5>
        @if($referralLink)
            <p class="mt-2" id="referralLink">{{ $referralLink }}</p>
            <button class="mt-2 bg-blue-500 text-white px-4 py-2 rounded" id="copyLinkButton">Copy Link</button>
        @else
            <p class="mt-2 text-gray-600">You do not have a referral link yet. Please generate one.</p>
            <form action="{{ route('generate.referral.link') }}" method="POST" class="mt-2">
                @csrf
                <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Generate Referral Link</button>
            </form>
        @endif
    </div>
</div>

<script>
    // JavaScript to copy the referral link to clipboard
    document.getElementById('copyLinkButton')?.addEventListener('click', function() {
        const referralLink = document.getElementById('referralLink').innerText;
        navigator.clipboard.writeText(referralLink).then(() => {
            alert('Referral link copied to clipboard!');
        }, (err) => {
            alert('Failed to copy referral link: ', err);
        });
    });
</script>
@endsection
