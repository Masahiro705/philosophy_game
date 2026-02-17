document.addEventListener('DOMContentLoaded', () => {
    // Screens
    const screenInitial = document.getElementById('screen-initial');
    const screenSetSelection = document.getElementById('screen-set-selection');
    const screenCategorySelection = document.getElementById('screen-category-selection');
    const screenCardGrid = document.getElementById('screen-card-grid');
    const screenInput = document.getElementById('screen-input');
    const screenCard = document.getElementById('screen-card');
    const screenResult = document.getElementById('screen-result');
    const dialogClose = document.getElementById('dialog-close');

    // Elements
    const btnPlay = document.getElementById('btn-play');
    const btnSelectionExit = document.getElementById('btn-selection-exit');
    const btnCategoryExit = document.getElementById('btn-category-exit');
    const btnCardGridExit = document.getElementById('btn-card-grid-exit');
    const btnSet1 = document.getElementById('btn-set1');
    const btnSet2 = document.getElementById('btn-set2');
    const categoryGrid = document.getElementById('category-grid');
    const cardsContainer = document.getElementById('cards-container');
    const selectedCategoryTitle = document.getElementById('selected-category-title');
    const inputNumber = document.getElementById('input-number');
    const btnConfirm = document.getElementById('btn-confirm');
    const errorMsg = document.getElementById('error-msg');
    const animCard = document.getElementById('anim-card');
    const cardFront = animCard.querySelector('.card-front');

    const resultAnimal = document.getElementById('result-animal');
    const resultNumber = document.getElementById('result-number');
    const resultTopic = document.getElementById('result-topic');
    const btnClose = document.getElementById('btn-close');

    const btnContinue = document.getElementById('btn-continue');
    const btnChangeSet = document.getElementById('btn-change-set');
    const btnExit = document.getElementById('btn-exit');

    // State
    let selectedNumber = null;
    let selectedTopicSet = null; // Will be 1 or 2

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

    // Initial Screen -> Set Selection Screen
    btnPlay.addEventListener('click', () => {
        showScreen(screenSetSelection);
    });

    btnSelectionExit.addEventListener('click', () => {
        showScreen(screenInitial);
        selectedTopicSet = null;
    });

    btnCategoryExit.addEventListener('click', () => {
        showScreen(screenSetSelection);
    });

    btnCardGridExit.addEventListener('click', () => {
        showScreen(screenCategorySelection);
    });

    // Set Selection -> Input Screen
    btnSet1.addEventListener('click', () => {
        selectedTopicSet = 1;
        showScreen(screenInput);
        inputNumber.value = '';
        btnConfirm.disabled = true;
        errorMsg.classList.add('hidden');
        setTimeout(() => inputNumber.focus(), 100);
    });

    btnSet2.addEventListener('click', () => {
        selectedTopicSet = 2;
        initCategorySelection();
    });

    const categories = [
        { id: 'A', name: '自己・アイデンティティ', start: 0 },
        { id: 'B', name: '意味・目的・価値観', start: 10 },
        { id: 'C', name: '感情・幸福', start: 20 },
        { id: 'D', name: '倫理・善悪', start: 30 },
        { id: 'E', name: '人間関係・共同体', start: 40 },
        { id: 'F', name: '知識・真理・信念', start: 50 },
        { id: 'G', name: '自由意志・責任', start: 60 },
        { id: 'H', name: '時間・記憶・死', start: 70 },
        { id: 'I', name: '仕事・お金・消費', start: 80 },
        { id: 'J', name: 'テクノロジー・将来', start: 90 }
    ];

    function initCategorySelection() {
        categoryGrid.innerHTML = '';
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.innerHTML = `<span>${cat.id}</span><br>${cat.name}`;
            btn.addEventListener('click', () => initCardGrid(cat));
            categoryGrid.appendChild(btn);
        });
        showScreen(screenCategorySelection);
    }

    function initCardGrid(category) {
        selectedCategoryTitle.textContent = `${category.id}. ${category.name}`;
        cardsContainer.innerHTML = '';

        // Create random mapping for indices 0-9
        const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        indices.forEach((topicOffset, cardIndex) => {
            const container = document.createElement('div');
            container.className = 'mini-card';
            container.innerHTML = `
                <div class="card">
                    <div class="card-face card-back"><span class="pattern">🐾</span></div>
                </div>
            `;
            container.addEventListener('click', () => selectCard(container, category.start + topicOffset));
            cardsContainer.appendChild(container);
        });

        showScreen(screenCardGrid);
    }

    function selectCard(selectedContainer, finalNumber) {
        // 1. Disable all card clicks
        document.querySelectorAll('.mini-card').forEach(c => c.style.pointerEvents = 'none');

        // 2. Capture initial position for smooth transition
        const rect = selectedContainer.getBoundingClientRect();
        selectedContainer.style.top = `${rect.top}px`;
        selectedContainer.style.left = `${rect.left}px`;
        selectedContainer.style.width = `${rect.width}px`;
        selectedContainer.style.height = `${rect.height}px`;
        selectedContainer.style.position = 'fixed';
        selectedContainer.style.margin = '0';

        // Force reflow
        void selectedContainer.offsetWidth;

        // 3. Zoom selected card, fade others
        const allCards = document.querySelectorAll('.mini-card');
        allCards.forEach(c => {
            if (c === selectedContainer) {
                c.classList.add('card-zoomed');
                // These are handled by card-zoomed class in CSS,
                // but we clarify behavior via JS for the fixed center transition
                selectedContainer.style.top = '50%';
                selectedContainer.style.left = '50%';
            } else {
                c.classList.add('fade-out');
            }
        });

        // 4. Start flip sequence after zoom completes
        setTimeout(() => {
            selectedNumber = finalNumber;
            const card = selectedContainer.querySelector('.card');

            // Ensure card-front is created with the "frame" style
            const cardFront = document.createElement('div');
            cardFront.className = 'card-face card-front';

            const animalIndex = selectedNumber % animals.length;
            const animal = animals[animalIndex];
            cardFront.textContent = animal.emoji;
            card.appendChild(cardFront);

            // Brief pause at zoomed state before flip
            setTimeout(() => {
                card.classList.add('flip');

                // Wait for flip, then show result
                setTimeout(() => {
                    showResult(selectedNumber);
                }, 800);
            }, 400);
        }, 600);
    }

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

        // Prepare card front with animal emoji
        const animalIndex = selectedNumber % animals.length;
        const animal = animals[animalIndex];
        cardFront.textContent = animal.emoji;

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

        // Choose topic set based on user selection
        const topicsArray = selectedTopicSet === 2 ? philosophyTopicsSet2 : philosophyTopics;
        const topicIndex = number % topicsArray.length;

        const animal = animals[animalIndex];
        const topic = topicsArray[topicIndex];

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
    // Dialog: Continue -> Input or Category Selection
    btnContinue.addEventListener('click', () => {
        dialogClose.classList.add('hidden');
        if (selectedTopicSet === 2) {
            initCategorySelection();
        } else {
            showScreen(screenInput);
            inputNumber.value = '';
            btnConfirm.disabled = true;
            setTimeout(() => inputNumber.focus(), 100);
        }
    });

    // Dialog: Change Set -> Set Selection
    btnChangeSet.addEventListener('click', () => {
        dialogClose.classList.add('hidden');
        showScreen(screenSetSelection);
        selectedNumber = null;
        selectedTopicSet = null;
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

        // If Set Selection Screen is active
        if (screenSetSelection.classList.contains('active')) {
            // Default to Set 1 on Enter
            btnSet1.click();
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
