const emojis = ['😀', '😂', '😎', '🥳', '😇', '🤔', '😡', '😱', '😴'];
let targetEmoji;
let selectedEmoji = null;
let timer;
let timeLeft;
let attempts = 3;
let difficultyLevel = 'easy';
let emojiCount = 9;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateCaptcha() {
    clearInterval(timer);
    const shuffledEmojis = shuffle([...emojis]).slice(0, emojiCount);
    targetEmoji = shuffledEmojis[Math.floor(Math.random() * shuffledEmojis.length)];
    document.getElementById('target-emoji').innerText = targetEmoji;

    const emojiGrid = document.getElementById('emoji-grid');
    emojiGrid.innerHTML = '';
    shuffledEmojis.forEach(emoji => {
        const emojiElement = document.createElement('div');
        emojiElement.classList.add('emoji');
        emojiElement.innerText = emoji;
        emojiElement.addEventListener('click', () => selectEmoji(emojiElement, emoji));
        emojiGrid.appendChild(emojiElement);
    });

    document.getElementById('verify-button').disabled = false;
    document.getElementById('result-message').innerText = '';
    document.getElementById('attempts-message').innerText = `Attempts left: ${attempts}`;
    setTimer();
}

function selectEmoji(element, emoji) {
    document.querySelectorAll('.emoji').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    selectedEmoji = emoji;
}

function setTimer() {
    switch (difficultyLevel) {
        case 'easy':
            timeLeft = 15;
            break;
        case 'medium':
            timeLeft = 10;
            break;
        case 'hard':
            timeLeft = 5;
            break;
    }
    document.getElementById('timer').innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('verify-button').disabled = true;
            document.getElementById('result-message').innerText = 'Time is up! ❌';
            document.getElementById('result-message').style.color = 'red';
            attempts--;
            if (attempts > 0) {
                setTimeout(generateCaptcha, 2000);
            } else {
                document.getElementById('result-message').innerText = 'No attempts left. ❌';
            }
        }
    }, 1000);
}

function playSound(correct) {
    const sound = new Audio(correct ? 'correct.mp3' : 'wrong.mp3');
    sound.play();
}

document.getElementById('verify-button').addEventListener('click', () => {
    clearInterval(timer);
    const resultMessage = document.getElementById('result-message');
    if (selectedEmoji === targetEmoji) {
        resultMessage.innerText = 'Verified! ✅';
        resultMessage.style.color = 'green';
        document.querySelectorAll('.emoji').forEach(el => {
            if (el.innerText === targetEmoji) el.classList.add('correct');
        });
        playSound(true);
    } else {
        resultMessage.innerText = 'Try Again! ❌';
        resultMessage.style.color = 'red';
        document.querySelectorAll('.emoji').forEach(el => {
            if (el.innerText === selectedEmoji) el.classList.add('wrong');
        });
        playSound(false);
        attempts--;
        document.getElementById('attempts-message').innerText = `Attempts left: ${attempts}`;
        if (attempts > 0) {
            setTimeout(generateCaptcha, 2000);
        } else {
            resultMessage.innerText = 'No attempts left. ❌';
        }
    }
});

document.getElementById('difficulty').addEventListener('change', (event) => {
    difficultyLevel = event.target.value;
    switch (difficultyLevel) {
        case 'easy':
            emojiCount = 9;
            break;
        case 'medium':
            emojiCount = 12;
            break;
        case 'hard':
            emojiCount = 15;
            break;
    }
    generateCaptcha();
});

window.onload = generateCaptcha;
