document.addEventListener('DOMContentLoaded', () => {
    const touchCounterElement = document.getElementById('touchCounter');
    const touchButton = document.getElementById('touchButton');
    const resetButton = document.getElementById('resetButton'); // Get the new reset button

    let touchCount = 0;

    // Function to update the display, ensuring "00" for single digits
    function updateCounterDisplay() {
        touchCounterElement.textContent = touchCount.toString().padStart(2, '0');
    }

    // Initialize display
    updateCounterDisplay();

    // Add event listener to the Touch button
    touchButton.addEventListener('click', () => {
        touchCount++;
        updateCounterDisplay();
    });

    // Add event listener to the Reset button
    resetButton.addEventListener('click', () => {
        touchCount = 0; // Reset count to 0
        updateCounterDisplay(); // Update display
    });
});