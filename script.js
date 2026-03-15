document.addEventListener('DOMContentLoaded', () => {
    const heartBg = document.getElementById('heart-bg');
    const mainHeart = document.getElementById('main-heart');
    const meterFill = document.getElementById('meter-fill');
    const loveStatus = document.getElementById('love-status');
    const gameContainer = document.getElementById('game-container');
    const victoryScreen = document.getElementById('victory-screen');
    const revealedText = document.getElementById('revealed-text');
    const instruction = document.getElementById('instruction');

    const loveMessage = "Every single day with you feels like a beautiful dream come true. You are my light, my heart, and my everything. I love you more than words can ever express. ❤️";

    let clickCount = 0;
    const maxClicks = 4; // User requested 4 clicks
    let heartScale = 1;

    // Create floating hearts
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤️';
        
        const startX = Math.random() * 100;
        const size = Math.random() * (30 - 15) + 15;
        const duration = Math.random() * (15 - 5) + 5;
        const delay = Math.random() * 5;

        heart.style.left = `${startX}vw`;
        heart.style.fontSize = `${size}px`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${delay}s`;

        heartBg.appendChild(heart);
        setTimeout(() => heart.remove(), (duration + delay) * 1000);
    }

    // Initial heart background
    for (let i = 0; i < 15; i++) createHeart();
    setInterval(createHeart, 1000);

    // Typing effect
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

    // Click logic
    mainHeart.addEventListener('click', () => {
        if (clickCount >= maxClicks) return;

        clickCount++;
        
        // Update scale (Explosive growth)
        heartScale += 2.0; 
        mainHeart.style.transform = `scale(${heartScale})`;
        
        // Update Meter
        const percentage = Math.round((clickCount / maxClicks) * 100);
        meterFill.style.width = `${percentage}%`;
        loveStatus.innerText = `Love Level: ${percentage}%`;

        // Instructions
        if (clickCount === 1) instruction.innerText = "It's growing!";
        if (clickCount === 2) instruction.innerText = "Almost there...";
        if (clickCount === 3) instruction.innerText = "ONE MORE CLICK!";

        // Burst of hearts
        for (let i = 0; i < 8; i++) {
            setTimeout(createHeart, Math.random() * 500);
        }

        // Victory condition
        if (clickCount >= maxClicks) {
            triggerVictory();
        }
    });

    function triggerVictory() {
        // Massive heart explode (covers screen)
        mainHeart.classList.remove('pulse');
        mainHeart.style.transition = "transform 1.2s cubic-bezier(0.95, 0.05, 0.795, 0.035)";
        mainHeart.style.transform = "scale(100)";
        mainHeart.style.opacity = "0.1";

        setTimeout(() => {
            gameContainer.style.display = 'none';
            victoryScreen.classList.add('show');
            
            setTimeout(() => {
                typeMessage(loveMessage, revealedText, 50);
            }, 800);
        }, 1000);

        // Constant heart bursts
        setInterval(createHeart, 80);
    }
});
