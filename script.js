document.addEventListener('DOMContentLoaded', () => {
    const touchCounterElement = document.getElementById('touchCounter');
    const touchButton = document.getElementById('touchButton');
    const resetButton = document.getElementById('resetButton');
    const counterBoxElement = document.querySelector('.counter-box');

    // --- CHANGES START HERE ---
    // 1. Load the count from localStorage when the page loads
    let touchCount = parseInt(localStorage.getItem('touchCount') || '0', 10);
    // If 'touchCount' doesn't exist in localStorage, it will be '0'.
    // parseInt converts the string back to a number.
    // --- CHANGES END HERE ---

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

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
        // --- NEW: Save the count to localStorage whenever the display updates ---
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
        updateCounterDisplay(); // This now also saves to localStorage
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
        updateCounterDisplay(); // This now also saves to localStorage (reset value)
        triggerHapticFeedback();
    });
});