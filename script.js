document.addEventListener('DOMContentLoaded', () => {
    const touchCounterElement = document.getElementById('touchCounter');
    const touchButton = document.getElementById('touchButton');
    const resetButton = document.getElementById('resetButton');

    let touchCount = 0;

    // Initialize AudioContext (create once)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Function to generate and play a basic click/beep sound
    function playBuiltInClickSound() {
        if (!audioContext) return; // Exit if AudioContext isn't available

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine'; // A sine wave for a clean beep
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note (440 Hz)

        // Connect oscillator to gain node, and gain node to destination (speakers)
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Set gain (volume) and schedule it to fade out quickly
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Start volume
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05); // Fade out over 50ms

        oscillator.start(audioContext.currentTime); // Start playing immediately
        oscillator.stop(audioContext.currentTime + 0.05); // Stop after 50ms
    }


    // Function to update the display, ensuring "00" for single digits
    function updateCounterDisplay() {
        touchCounterElement.textContent = touchCount.toString().padStart(2, '0');
    }

    // Function to trigger haptic feedback
    function triggerHapticFeedback() {
        if (navigator.vibrate) {
            navigator.vibrate(50); // Vibrate for 50ms
        }
    }

    // Initialize display
    updateCounterDisplay();

    // Add event listener to the Touch button
    touchButton.addEventListener('click', () => {
        // Resume AudioContext if it's suspended (common on some mobile browsers before first user interaction)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        touchCount++;
        updateCounterDisplay();
        triggerHapticFeedback(); // Trigger haptic feedback

        playBuiltInClickSound(); // Play the built-in sound
    });

    // Add event listener to the Reset button
    resetButton.addEventListener('click', () => {
        // Resume AudioContext if it's suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        touchCount = 0; // Reset count to 0
        updateCounterDisplay(); // Update display
        triggerHapticFeedback(); // Trigger haptic feedback
        // You could also add a separate, perhaps slightly different, built-in sound here if you want
    });
});