@if (session('success'))
<div id="toast" class="fixed bottom-4 right-4 bg-green-500 text-white px-5 py-2 rounded shadow-lg hidden">
    {{ session('success') }}
</div>
@elseif (session('error'))
<div id="toast" class="fixed bottom-4 right-4 bg-red-500 text-white px-5 py-2 rounded shadow-lg hidden">
    {{ session('error') }}
</div>
@endif
<script>
    const toast = document.getElementById('toast');
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
</script>