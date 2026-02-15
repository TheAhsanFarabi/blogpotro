

<div class="mb-4">
    <div class="grid grid-cols-3 gap-4">
        <!-- Aqua Mist -->
        <label class="cursor-pointer">
            <input type="radio" name="theme[background_color]" value="aqua-mist" class="hidden peer" onchange="changeTheme('aqua-mist')">
            <div
                class="border p-4 rounded-lg bg-[#ACDDEE] text-black text-center peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-500 transition-all duration-200">
                Aqua Mist
            </div>
        </label>
        <!-- Sea Foam -->
        <label class="cursor-pointer">
            <input type="radio" name="theme[background_color]" value="sea-foam" class="hidden peer" onchange="changeTheme('sea-foam')">
            <div
                class="border p-4 rounded-lg bg-[#CAF1DE] text-black text-center peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-500 transition-all duration-200">
                Sea Foam
            </div>
        </label>
        <!-- Mint Breeze -->
        <label class="cursor-pointer">
            <input type="radio" name="theme[background_color]" value="mint-breeze" class="hidden peer" onchange="changeTheme('mint-breeze')">
            <div
                class="border p-4 rounded-lg bg-[#E1F8DC] text-black text-center peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-500 transition-all duration-200">
                Mint Breeze
            </div>
        </label>
        <!-- Lemon Chiffon -->
        <label class="cursor-pointer">
            <input type="radio" name="theme[background_color]" value="lemon-chiffon" class="hidden peer" onchange="changeTheme('lemon-chiffon')">
            <div
                class="border p-4 rounded-lg bg-[#FEF8DD] text-black text-center peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-500 transition-all duration-200">
                Lemon Chiffon
            </div>
        </label>
        <!-- Peach Glow -->
        <label class="cursor-pointer">
            <input type="radio" name="theme[background_color]" value="peach-glow" class="hidden peer" onchange="changeTheme('peach-glow')">
            <div
                class="border p-4 rounded-lg bg-[#FFE7C7] text-black text-center peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-500 transition-all duration-200">
                Peach Glow
            </div>
        </label>
       <!-- Pink Bliss -->
       <label class="cursor-pointer">
        <input type="radio" name="theme[background_color]" value="pink-bliss" class="hidden peer" onchange="changeTheme('pink-bliss')">
        <div
            class="border p-4 rounded-lg bg-[#FDDFDF] text-black text-center peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-500 transition-all duration-200">
            Pink Bliss
        </div>
    </label>
    </div>
</div>



<script>
    function changeTheme(theme) {
        const themeContainer = document.getElementById('theme-container');

        // Remove all theme classes
        themeContainer.classList.remove('aqua-mist', 'sea-foam', 'mint-breeze', 'lemon-chiffon', 'peach-glow', 'pink-bliss');

        // Add the selected theme class
       
        themeContainer.classList.add(theme);

        // Set the selected radio button
        document.querySelector(`input[name="theme[background_color]"][value="${theme}"]`).checked = true;
    }
</script>
