document.addEventListener('DOMContentLoaded', () => {
    // Stage Elements
    const stages = {
        intro: document.getElementById('stage-intro'),
        game: document.getElementById('stage-game'),
        reveal: document.getElementById('stage-reveal'),
        victory: document.getElementById('victory-screen')
    };

    // Stage 1 Elements
    const envelope = document.getElementById('envelope');
    const openLetterBtn = document.getElementById('open-letter');

    // Stage 2 Elements
    const gameCanvas = document.getElementById('game-canvas');
    const gameProgress = document.getElementById('game-progress');
    const gameScore = document.getElementById('game-score');

    // Stage 3 Elements
    const mainHeart = document.getElementById('main-heart');
    const revealedText = document.getElementById('revealed-text');
    const restartBtn = document.getElementById('restart-btn');

    // State
    const loveMessage = "Every single day with you feels like a beautiful dream come true. You are my light, my heart, and my everything. I love you more than words can ever express. ❤️";
    let progress = 0;
    let clickCount = 0;
    const maxClicks = 4;
    let heartScale = 1;

    // Helper: Show Stage
    function showStage(stageKey) {
        Object.keys(stages).forEach(key => {
            if (key === stageKey) {
                stages[key].classList.remove('hidden-stage');
            } else {
                stages[key].classList.add('hidden-stage');
            }
        });
    }

    // --- STAGE 1: INTRO ---
    openLetterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        envelope.classList.add('open');
        setTimeout(() => {
            showStage('game');
            startMinigame();
        }, 1500);
    });

    // --- STAGE 2: MINIGAME ---
    function startMinigame() {
        const gameInterval = setInterval(() => {
            if (progress >= 100) {
                clearInterval(gameInterval);
                setTimeout(() => showStage('reveal'), 1000);
                return;
            }
            createFallingHeart();
        }, 600);
    }

    function createFallingHeart() {
        const heart = document.createElement('div');
        heart.classList.add('falling-collectible');
        heart.innerHTML = ['❤️', '💖', '✨', '🌸'][Math.floor(Math.random() * 4)];
        
        const startX = Math.random() * (window.innerWidth - 50);
        heart.style.left = `${startX}px`;
        heart.style.top = `-50px`;
        
        gameCanvas.appendChild(heart);

        const duration = Math.random() * 2000 + 3000;
        const animation = heart.animate([
            { transform: `translateY(0) rotate(0deg)` },
            { transform: `translateY(${window.innerHeight + 50}px) rotate(360deg)` }
        ], {
            duration: duration,
            easing: 'linear'
        });

        heart.addEventListener('click', () => {
            progress += 10;
            if (progress > 100) progress = 100;
            updateProgress();
            
            // Pop effect
            heart.style.transform = 'scale(1.5)';
            heart.style.opacity = '0';
            setTimeout(() => heart.remove(), 200);
        });

        animation.onfinish = () => heart.remove();
    }

    function updateProgress() {
        gameProgress.style.width = `${progress}%`;
        gameScore.innerText = `Love Captured: ${progress}%`;
    }

    // --- STAGE 3: REVEAL ---
    mainHeart.addEventListener('click', () => {
        if (clickCount >= maxClicks) return;

        clickCount++;
        heartScale += 2.0; 
        mainHeart.style.transform = `scale(${heartScale})`;

        // Burst effect
        for (let i = 0; i < 5; i++) createBurstHeart();

        if (clickCount >= maxClicks) {
            triggerVictory();
        }
    });

    function createBurstHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.fontSize = '24px';
        heart.style.pointerEvents = 'none';
        document.body.appendChild(heart);

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 200 + 100;
        
        heart.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => heart.remove();
    }

    function triggerVictory() {
        mainHeart.classList.remove('pulse');
        mainHeart.style.transition = "transform 1.2s cubic-bezier(0.95, 0.05, 0.795, 0.035)";
        mainHeart.style.transform = "scale(100)";
        mainHeart.style.opacity = "0.1";

        setTimeout(() => {
            showStage('victory');
            setTimeout(() => {
                typeMessage(loveMessage, revealedText, 50);
            }, 800);
        }, 1000);
    }

    function typeMessage(text, element, speed = 50) {
        let i = 0;
        element.innerHTML = "";
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    // Restart Logic
    restartBtn.addEventListener('click', () => {
        progress = 0;
        clickCount = 0;
        heartScale = 1;
        updateProgress();
        mainHeart.style.transform = `scale(1)`;
        mainHeart.style.opacity = "1";
        mainHeart.classList.add('pulse');
        envelope.classList.remove('open');
        showStage('intro');
    });

    // Background floating hearts (passive)
    function createPassiveHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.bottom = '-50px';
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.fontSize = `${Math.random() * 20 + 10}px`;
        heart.style.opacity = '0.3';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '0';
        document.body.appendChild(heart);

        heart.animate([
            { transform: 'translateY(0) scale(1)', opacity: 0.3 },
            { transform: `translateY(-${window.innerHeight + 100}px) scale(1.5)`, opacity: 0 }
        ], {
            duration: Math.random() * 5000 + 5000,
            easing: 'linear'
        }).onfinish = () => heart.remove();
    }

    setInterval(createPassiveHeart, 1000);
});
