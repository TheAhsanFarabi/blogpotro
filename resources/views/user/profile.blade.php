@extends('layouts.app')

@section('content')
    <div class="{{ $user->profile_theme }} container mx-auto mt-3 p-4">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <!-- Left Column -->
            <div class="lg:col-span-2">

                {{-- Profile Card --}}
                <x-profile-card :$user />
                {{-- Blog Cards --}}
                <x-blog-card :$blogs />

            </div>
            <!-- Right Column -->
            <div class="lg:col-span-1">
                @if (Auth::id() !== $user->id)
              <!-- Report User Button -->
<button onclick="openModal()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none mb-5">
    <i class="fas fa-flag"></i> Report User
</button>

<!-- Modal -->
<div id="reportModal" class="fixed inset-0 z-50 flex items-center justify-center hidden bg-gray-800 bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg w-1/3 p-6">
        <h2 class="text-xl font-bold mb-4">Report User</h2>
        <form action="{{ route('report.user', $user->id) }}" method="POST">
            @csrf

            <!-- Select Reason -->
            <label for="reason" class="block text-sm font-medium text-gray-700 mb-2">Select Reason</label>
            <select name="reason" id="reason" class="block w-full border-gray-300 rounded-md mb-4">
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Spam">Spam</option>
                <option value="Harassment">Harassment</option>
                <option value="Fake Profile">Fake Profile</option>
                <option value="Other">Other</option>
            </select>

            <!-- Additional Details -->
            <label for="details" class="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
            <textarea name="details" id="details" placeholder="Provide additional details" class="block w-full border-gray-300 rounded-md mb-4" rows="3"></textarea>

            <!-- Submit Button -->
            <div class="flex justify-end">
                <button type="button" onclick="closeModal()" class="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Submit Report</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Script -->
<script>
function openModal() {
    document.getElementById('reportModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('reportModal').classList.add('hidden');
}
</script>

@endif

                <div class="mb-8">

                    <ul class="space-y-4 rounded-lg bg-white p-5 shadow-lg">
                        @if ($user->is_reported)
    <span class="text-red-500">⚠️ Reported</span>
@endif
                        <h2 class="mb-4 text-xl font-bold">Bio</h2>
                        <p class="text-gray-600">{{ $user->bio }}</p>
                    </ul>
                </div>
                <div class="mb-8">

                    <ul class="space-y-4 rounded-lg bg-white p-5 shadow-lg">
                        <h2 class="mb-4 text-xl font-bold">Details</h2>
                        <li class="flex flex-row items-center space-x-2 rounded-lg border-2 bg-white p-4 shadow-sm">
                            <i class="fa-solid fa-school text-gray-300"></i>
                            <p class="text-gray-600">{{ $user->institute }}</p>
                        </li>
                        <li class="flex flex-row items-center space-x-2 rounded-lg border-2 bg-white p-4 shadow-sm">
                            <i class="fa-solid fa-briefcase text-gray-300"></i>
                            <p class="text-gray-600">{{ $user->work_experience }}</p>
                        </li>
                        <li class="flex flex-row items-center space-x-2 rounded-lg border-2 bg-white p-4 shadow-sm">
                            <i class="fa-solid fa-cake-candles text-gray-300"></i>
                            <p class="text-gray-600">
                                {{ $user->dob ? \Carbon\Carbon::parse($user->dob)->format('j F, Y') : '' }}</p>
                        </li>



                    </ul>
                </div>
                <div class="mb-8">

                    <x-awards :$user />
                </div>

            </div>
        </div>
    @endsection
