document.addEventListener('DOMContentLoaded', () => {
    // Screens
    const screenInitial = document.getElementById('screen-initial');
    const screenInput = document.getElementById('screen-input');
    const screenCard = document.getElementById('screen-card');
    const screenResult = document.getElementById('screen-result');
    const dialogClose = document.getElementById('dialog-close');

    // Elements
    const btnPlay = document.getElementById('btn-play');
    const inputNumber = document.getElementById('input-number');
    const btnConfirm = document.getElementById('btn-confirm');
    const errorMsg = document.getElementById('error-msg');
    const animCard = document.getElementById('anim-card');

    const resultAnimal = document.getElementById('result-animal');
    const resultNumber = document.getElementById('result-number');
    const resultTopic = document.getElementById('result-topic');
    const btnClose = document.getElementById('btn-close');

    const btnContinue = document.getElementById('btn-continue');
    const btnExit = document.getElementById('btn-exit');

    // State
    let selectedNumber = null;

    // Helper: Show specific screen
    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.add('hidden');
            s.classList.remove('active');
        });
        screen.classList.remove('hidden');
        screen.classList.add('active');
    }

    // Event Listeners

    // Initial Screen -> Input Screen
    btnPlay.addEventListener('click', () => {
        showScreen(screenInput);
        inputNumber.value = '';
        btnConfirm.disabled = true;
        errorMsg.classList.add('hidden');
    });

    // Validate Input
    inputNumber.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val) && val >= 0 && val <= 99) {
            btnConfirm.disabled = false;
            errorMsg.classList.add('hidden');
        } else {
            btnConfirm.disabled = true;
            if (e.target.value !== '') {
                errorMsg.classList.remove('hidden');
            }
        }
    });

    // Input -> Card Animation
    btnConfirm.addEventListener('click', () => {
        selectedNumber = parseInt(inputNumber.value);
        if (selectedNumber < 0 || selectedNumber > 99) return; // Safety check

        showScreen(screenCard);

        // Reset animation state
        animCard.classList.remove('flip');

        // Simulate drawing delay then flip
        setTimeout(() => {
            // Here you could add more complex shuffle animation if desired
            animCard.classList.add('flip');

            // Wait for flip to finish then show result
            setTimeout(() => {
                showResult(selectedNumber);
            }, 800);
        }, 1000);
    });

    function showResult(number) {
        // Get data
        // For animals, we map 0-99 to 0-99 index. 
        // If animals array is smaller/larger, use modulo.
        const animalIndex = number % animals.length;
        const topicIndex = number % philosophyTopics.length;

        const animal = animals[animalIndex];
        const topic = philosophyTopics[topicIndex];

        // Populate result
        resultAnimal.textContent = animal.emoji;
        resultNumber.textContent = `No. ${number.toString().padStart(2, '0')}`;
        resultTopic.textContent = topic;

        showScreen(screenResult);
    }

    // Result -> Dialog
    btnClose.addEventListener('click', () => {
        dialogClose.classList.remove('hidden');
    });

    // Dialog: Continue -> Input
    btnContinue.addEventListener('click', () => {
        dialogClose.classList.add('hidden');
        showScreen(screenInput);
        inputNumber.value = '';
        btnConfirm.disabled = true;
    });

    // Dialog: Exit -> Initial
    btnExit.addEventListener('click', () => {
        dialogClose.classList.add('hidden');
        showScreen(screenInitial);
        selectedNumber = null;
    });

    // Keyboard Support (Enter Key)
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;

        // If Close Dialog is open
        if (!dialogClose.classList.contains('hidden')) {
            // Default to "Continue" on Enter? Or maybe ignore to strictly force choice?
            // Let's implement "Continue" as default action on Enter for smoother loop
            btnContinue.click();
            return;
        }

        // If Initial Screen is active
        if (screenInitial.classList.contains('active')) {
            btnPlay.click();
            return;
        }

        // If Input Screen is active
        if (screenInput.classList.contains('active')) {
            if (!btnConfirm.disabled) {
                btnConfirm.click();
            }
            return;
        }

        // If Result Screen is active
        if (screenResult.classList.contains('active')) {
            btnClose.click();
            return;
        }
    });
});
