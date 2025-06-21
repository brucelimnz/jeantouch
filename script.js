document.addEventListener('DOMContentLoaded', () => {
    const touchCounterElement = document.getElementById('touchCounter');
    const touchButton = document.getElementById('touchButton');
    const resetButton = document.getElementById('resetButton');
    const counterBoxElement = document.querySelector('.counter-box');
    const themeToggleButton = document.getElementById('themeToggleButton'); // Get the new theme toggle button
    const bodyElement = document.body; // Reference to the body element

    let touchCount = parseInt(localStorage.getItem('touchCount') || '0', 10);

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // --- NEW: Theme Management Functions ---
    const THEME_STORAGE_KEY = 'appTheme'; // Key for localStorage

    function applyTheme(theme) {
        if (theme === 'light') {
            bodyElement.classList.add('light-mode');
            themeToggleButton.textContent = '🌙'; // Moon emoji for light mode (suggests switching to dark)
        } else {
            bodyElement.classList.remove('light-mode');
            themeToggleButton.textContent = '💡'; // Bulb emoji for dark mode (suggests switching to light)
        }
        localStorage.setItem(THEME_STORAGE_KEY, theme); // Save the current theme
    }

    function toggleTheme() {
        const currentTheme = bodyElement.classList.contains('light-mode') ? 'light' : 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }

    // Load theme on initial page load
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
        applyTheme(savedTheme); // Apply saved theme
    } else {
        // Optional: Set a default theme if none is saved (e.g., based on system preference or 'dark')
        // For now, we default to dark mode if no preference is saved in localStorage (as per current CSS default)
        // If you want to check system preference:
        // const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        // applyTheme(prefersLight ? 'light' : 'dark');
        applyTheme('dark'); // Explicitly apply default dark if no saved theme
    }
    // --- END NEW: Theme Management Functions ---


    function playBuiltInClickSound() {
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    }

    function updateCounterDisplay() {
        touchCounterElement.textContent = touchCount.toString().padStart(2, '0');
        localStorage.setItem('touchCount', touchCount);
    }

    function triggerHapticFeedback() {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    // Initialize display with loaded count
    updateCounterDisplay();

    touchButton.addEventListener('click', () => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        touchCount++;
        updateCounterDisplay();
        triggerHapticFeedback();
        playBuiltInClickSound();

        counterBoxElement.classList.add('pop');
        setTimeout(() => {
            counterBoxElement.classList.remove('pop');
        }, 100);

        touchCounterElement.classList.add('pop-number');
        setTimeout(() => {
            touchCounterElement.classList.remove('pop-number');
        }, 100);
    });

    resetButton.addEventListener('click', () => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        touchCount = 0;
        updateCounterDisplay();
        triggerHapticFeedback();
    });

    // --- NEW: Add event listener for the theme toggle button ---
    themeToggleButton.addEventListener('click', toggleTheme);
});