const firebaseConfig = {
  apiKey: "AIzaSyDxfQqJ-qiJ--2rQMeoKAjzlqoAvwrAWEA",
  authDomain: "a-jornada-do-heroi-deste-5484d.firebaseapp.com",
  projectId: "a-jornada-do-heroi-deste-5484d",
  storageBucket: "a-jornada-do-heroi-deste-5484d.firebasestorage.app",
  messagingSenderId: "921797285133",
  appId: "1:921797285133:web:08b6a1394ef8f74c95cc44"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let gameStarted = false;
let selectedCharacter = '';
let currentUser = null;

let battleSpeed = 1; 
const speedStates = [
    { text: 'x1', value: 1 },
    { text: 'x1.5', value: 1.5 },
    { text: 'x2', value: 2 },
    { text: 'x2.5', value: 2.5 },
    { text: 'x3', value: 3 }
];
let currentSpeedIndex = 0;

const playerStats = {
    maxHealth: 100,
    currentHealth: 100,
    maxStamina: 50,
    currentStamina: 50,
    attack: 20,
    drachmas: 0,
    name: '',
};

const enemyStats = {
    name: 'Slime',
    maxHealth: 150,
    currentHealth: 150,
    attack: 10,
    dodgeChance: 0.05,
    xpReward: 50,
    drachmasReward: 25
};

const swords = [
    { name: 'Espada Divina', image: './SRC/Equipamentos/Espadas/Espada%20Divina.png', className: 'espada-divina', price: 10000, description: 'Forjada pelos deuses, queima com fogo sagrado.' },
    { name: 'Espada Demoníaca', image: './SRC/Equipamentos/Espadas/Espada%20Demon%C3%ADaca.png', className: 'espada-demoniaca', price: 8500, description: 'Sussurra segredos sombrios para seu portador.' },
    { name: 'Espada de Obsidiana', image: './SRC/Equipamentos/Espadas/Espada%20de%20Obsidiana.png', className: 'espada-obsidiana', price: 5000, description: 'Afiada e mortal, corta até a alma.' },
    { name: 'Espada de Diamante', image: './SRC/Equipamentos/Espadas/Espada%20de%20Diamante.png', className: 'espada-diamante', price: 3500, description: 'Brilhante e inquebrável.' },
    { name: 'Espada de Ouro', image: './SRC/Equipamentos/Espadas/Espada%20de%20Ouro.png', className: 'espada-ouro', price: 2000, description: 'Mais para mostrar do que para lutar.' },
    { name: 'Espada de Aço', image: './SRC/Equipamentos/Espadas/Espada%20de%20A%C3%A7o.png', className: 'espada-aco', price: 1000, description: 'Confiável e resistente.' },
    { name: 'Espada de Ferro', image: './SRC/Equipamentos/Espadas/Espada%20de%20Ferro.png', className: 'espada-ferro', price: 500, description: 'Uma espada básica para iniciantes.' },
    { name: 'Espada de Madeira', image: './SRC/Equipamentos/Espadas/Espada%20de%20Madeira.png', className: 'espada-madeira', price: 100, description: 'Melhor que nada.' }
];

const startScreen = document.getElementById('start-screen');
const mainMenuContainer = document.getElementById('main-menu-container');
const loadGameScreen = document.getElementById('load-game-screen');
const instructionsScreen = document.getElementById('instructions-screen');
const characterSelectionScreen = document.getElementById('character-selection-screen');
const nameEntryScreen = document.getElementById('name-entry-screen');
const storyScreen = document.getElementById('story-screen');
const gameplayScreen = document.getElementById('gameplay-screen');
const blacksmithScreen = document.getElementById('blacksmith-screen');
const swordsScreen = document.getElementById('swords-screen');
const missionScreen = document.getElementById('mission-screen');
const missionJourneyScreen = document.getElementById('mission-journey-screen');
const battleScreen = document.getElementById('battle-screen');
const victoryScreen = document.getElementById('victory-screen');
const defeatScreen = document.getElementById('defeat-screen');
const endOfBetaScreen = document.getElementById('end-of-beta-screen');

const menuMusic1 = document.getElementById('menu-music-1');
const menuMusic2 = document.getElementById('menu-music-2');
const gameplayMusic1 = document.getElementById('gameplay-music-1');
const gameplayMusic2 = document.getElementById('gameplay-music-2');
const clickSound = document.getElementById('click-sound');
const missionJourneyMusic = document.getElementById('mission-journey-music');
const diceSound = document.getElementById('dice-sound');
const playerAttackSound = document.getElementById('player-attack-sound');
const playerSpecialAttackSound = document.getElementById('player-special-attack-sound');
const enemyAttackSound = document.getElementById('enemy-attack-sound');
const enemyDodgeSound = document.getElementById('enemy-dodge-sound');

const newGameBtn = document.getElementById('new-game-btn');
const loadGameBtn = document.getElementById('load-game-btn');
const instructionsBtn = document.getElementById('instructions-btn');
const missionBtn = document.getElementById('mission-btn');

const backFromLoadBtn = document.getElementById('back-from-load-btn');
const backFromInstructionsBtn = document.getElementById('back-from-instructions-btn');
const backFromBlacksmithBtn = document.getElementById('back-from-blacksmith-btn');
const backFromSwordsBtn = document.getElementById('back-from-swords-btn');
const backFromMissionBtn = document.getElementById('back-from-mission-btn');

const heroCard = document.getElementById('hero-card');
const heroineCard = document.getElementById('heroine-card');

const nameInput = document.getElementById('name-input');
const confirmNameBtn = document.getElementById('confirm-name-btn');
const storyPanel = document.getElementById('story-panel');
const storyTextElement = document.getElementById('story-text');
const nextBtn = document.getElementById('next-btn');

const admButton = document.getElementById('adm-button');
const admModal = document.getElementById('adm-modal');
const admDrachmasInput = document.getElementById('adm-drachmas');
const saveBtn = document.getElementById('save-btn');
const backBtn = document.getElementById('back-btn');

const saveSlotsWrapper = document.getElementById('save-slots-wrapper');
const noSavesMessage = document.getElementById('no-saves-message');
const gameplayButtons = document.querySelectorAll('.gameplay-btn');
const drachmasDisplay = document.getElementById('drachmas-display');
const swordsBtn = document.getElementById('swords-btn');
const swordsGrid = document.getElementById('swords-grid');

const missionCharacter = document.getElementById('mission-character');
const missionDialogBubble = document.getElementById('mission-dialog-bubble');
const missionDialogText = document.getElementById('mission-dialog-text');
const elderApprentice = document.getElementById('elder-apprentice');
const elderDialogBubble = document.getElementById('elder-dialog-bubble');
const elderDialogText = document.getElementById('elder-dialog-text');
const playerNameDisplay = document.getElementById('player-name-display');
const elderNameDisplay = document.getElementById('elder-name-display');

const missionJourneyPanel = document.getElementById('mission-journey-panel');
const missionJourneyText = document.getElementById('mission-journey-text');
const nextJourneyBtn = document.getElementById('next-journey-btn');

const rollDiceBtn = document.getElementById('roll-dice-btn');
const diceAnimationContainer = document.getElementById('dice-animation-container');
const diceResultContainer = document.getElementById('dice-result-container');
const diceResultElement = document.getElementById('dice-result');

const battlePlayer = document.getElementById('battle-player');
const battleEnemy = document.getElementById('battle-enemy');
const playerHud = document.getElementById('player-hud');
const enemyHud = document.getElementById('enemy-hud');
const playerHealthFill = document.getElementById('player-health-fill');
const playerHealthText = document.getElementById('player-health-text');
const playerStaminaFill = document.getElementById('player-stamina-fill');
const playerStaminaText = document.getElementById('player-stamina-text');
const enemyHealthFill = document.getElementById('enemy-health-fill');
const enemyHealthText = document.getElementById('enemy-health-text');
const attackImpactImg = document.getElementById('attack-impact-img');
const floatingTextContainer = document.getElementById('floating-text-container');
const speedMultiplierBtn = document.getElementById('speed-multiplier-btn');

const xpReward = document.getElementById('xp-reward');
const drachmasReward = document.getElementById('drachmas-reward');
const victoryBlacksmithBtn = document.getElementById('victory-blacksmith-btn');
const victoryNextMissionBtn = document.getElementById('victory-next-mission-btn');
const victoryPotionsBtn = document.getElementById('victory-potions-btn');
const victoryInventoryBtn = document.getElementById('victory-inventory-btn');

const defeatRetryBtn = document.getElementById('defeat-retry-btn');
const defeatBlacksmithBtn = document.getElementById('defeat-blacksmith-btn');
const defeatPotionsBtn = document.getElementById('defeat-potions-btn');
const defeatInventoryBtn = document.getElementById('defeat-inventory-btn');

const visualizeModal = document.getElementById('visualize-modal');
const visualizePanel = document.getElementById('visualize-panel');
const closeVisualizeBtn = document.getElementById('close-visualize-btn');
const visualizeItemName = document.getElementById('visualize-item-name');
const visualizeItemImage = document.getElementById('visualize-item-image');
const visualizeItemPrice = document.getElementById('visualize-item-price');
const visualizeBuyBtn = document.getElementById('visualize-buy-btn');
const visualizeDescBtn = document.getElementById('visualize-desc-btn');

const devMessage = document.getElementById('dev-message');
const saveWarningMessage = document.getElementById('save-warning-message');
const saveFeedbackMessage = document.getElementById('save-feedback-message');

const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const saveProgressBtn = document.getElementById('save-progress-btn');
const exitGameBtn = document.getElementById('exit-game-btn');

auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        console.log("Player authenticated with UID:", currentUser.uid);
    } else {
        currentUser = null;
        auth.signInAnonymously().catch(error => {
            console.error("Error signing in anonymously:", error);
        });
    }
});

let devMessageTimeout;
function showDevelopmentMessage() {
    clearTimeout(devMessageTimeout);
    devMessage.classList.remove('hidden');
    devMessageTimeout = setTimeout(() => {
        devMessage.classList.add('hidden');
    }, 2000);
}

let saveWarningTimeout;
function showSaveWarningMessage() {
    clearTimeout(saveWarningTimeout);
    saveWarningMessage.classList.remove('hidden');
    saveWarningTimeout = setTimeout(() => {
        saveWarningMessage.classList.add('hidden');
    }, 2000);
}

let saveFeedbackTimeout;
function showSaveFeedback(message, isSuccess) {
    clearTimeout(saveFeedbackTimeout);
    saveFeedbackMessage.textContent = message;
    saveFeedbackMessage.style.color = isSuccess ? '#2ecc71' : '#e74c3c';
    saveFeedbackMessage.classList.remove('hidden');
    saveFeedbackTimeout = setTimeout(() => {
        saveFeedbackMessage.classList.add('hidden');
    }, 3000);
}

function resetGame() {
    gameStarted = false;
    selectedCharacter = '';
    
    playerStats.maxHealth = 100;
    playerStats.currentHealth = 100;
    playerStats.maxStamina = 50;
    playerStats.currentStamina = 50;
    playerStats.attack = 20;
    playerStats.drachmas = 0;
    playerStats.name = '';

    nameInput.value = '';

    currentStoryIndex = 0;
    currentMissionDialogueIndex = 0;
    currentMissionJourneyIndex = 0;

    currentSpeedIndex = 0;
    battleSpeed = speedStates[currentSpeedIndex].value;
    speedMultiplierBtn.textContent = speedStates[currentSpeedIndex].text;

    saveProgressBtn.classList.add('disabled');
    saveProgressBtn.style.backgroundImage = "url('./SRC/Elementos do Jogo/Botão 6.png')";
}

const storyParts = [
    "Há muito tempo, em Éldoria, o temível Ignis, o Dragão Ancião Negro, com seus olhos escarlates e fogo devastador, aterrorizava a terra. Um dia, o herói Kaelen, empunhando a espada Aurora, conseguiu derrotá-lo em uma batalha épica.",
    "No entanto, a vitória foi breve. Glacius, a Dragão Anciã Branca, parceira de Ignis, com seus olhos azuis brilhantes e poder de gelo avassalador, desceu em vingança. Kaelen, já exausto, a enfrentou, mas acabou perecendo, transformado em uma estátua de gelo, e Éldoria caiu sob um inverno eterno.",
    "Anos se passaram, e o povo de Éldoria definha sob o domínio de Glacius. Agora, você surge. Inspirado pela lenda de Kaelen e movido pela dor do povo, você jura vingá-lo e libertar Éldoria. Mas antes de enfrentar a poderosa dragão, você deve provar seu valor, superando missões menores para forjar sua própria lenda.",
    "Você está pronto para seu primeiro desafio?"
];
let currentStoryIndex = 0;
let isTyping = false;
let typingTimeout;

function typeWriter(text, i, targetElement, callback) {
    if (i < text.length) {
        isTyping = true;
        targetElement.innerHTML += text.charAt(i);
        typingTimeout = setTimeout(() => typeWriter(text, i + 1, targetElement, callback), 50);
    } else {
        isTyping = false;
        if (callback) callback();
    }
}

function showNextStoryPart() {
    if (currentStoryIndex < storyParts.length) {
        storyTextElement.innerHTML = '';
        typeWriter(storyParts[currentStoryIndex], 0, storyTextElement);
    } else {
        stopMenuMusic();
        showScreen(gameplayScreen);
        gameStarted = true;

        saveProgressBtn.classList.remove('disabled');
        saveProgressBtn.style.backgroundImage = "url('./SRC/Elementos%20do%20Jogo/Botão%202.png')";
    }
}

function advanceStory() {
     if (isTyping) {
        clearTimeout(typingTimeout);
        storyTextElement.innerHTML = storyParts[currentStoryIndex];
        isTyping = false;
    } else {
        currentStoryIndex++;
        showNextStoryPart();
    }
}

storyPanel.addEventListener('click', advanceStory);
nextBtn.addEventListener('click', advanceStory);

function showScreen(screenToShow) {
    [mainMenuContainer, loadGameScreen, instructionsScreen, characterSelectionScreen, nameEntryScreen, storyScreen, gameplayScreen, blacksmithScreen, swordsScreen, missionScreen, missionJourneyScreen, battleScreen, victoryScreen, defeatScreen, endOfBetaScreen].forEach(screen => {
        if(screen) screen.classList.add('hidden');
    });

    if(screenToShow) {
        screenToShow.classList.remove('hidden');
    }

    if (screenToShow !== startScreen) {
        settingsButton.classList.remove('hidden');
    } else {
        settingsButton.classList.add('hidden');
    }
    
    if (screenToShow === gameplayScreen || screenToShow === missionScreen || screenToShow === blacksmithScreen || screenToShow === swordsScreen) {
        stopAllMusic();
        startGameplayMusic();
    } else if (screenToShow === missionJourneyScreen || screenToShow === battleScreen) {
        stopAllMusic();
        startMissionJourneyMusic();
    } else if (screenToShow !== defeatScreen) { 
        stopGameplayMusic();
        stopMissionJourneyMusic();
        if (!isMenuPlaying && screenToShow !== startScreen) {
            playNextMenuMusic();
        }
    }

    if (screenToShow === blacksmithScreen || screenToShow === swordsScreen || visualizeModal.classList.contains('hidden') === false) {
        drachmasDisplay.classList.remove('hidden');
    } else {
        drachmasDisplay.classList.add('hidden');
    }
}

const menuTracks = [menuMusic1, menuMusic2];
let currentMenuTrackIndex = -1;
let isMenuPlaying = false;

function playNextMenuMusic() {
    if (currentMenuTrackIndex !== -1 && menuTracks[currentMenuTrackIndex]) {
        menuTracks[currentMenuTrackIndex].pause();
        menuTracks[currentMenuTrackIndex].currentTime = 0;
    }
    currentMenuTrackIndex = (currentMenuTrackIndex === 0) ? 1 : 0;
    const nextTrack = menuTracks[currentMenuTrackIndex];
    if (nextTrack) {
        nextTrack.play().catch(e => console.error("Error playing menu music:", e));
        isMenuPlaying = true;
    }
}

function stopMenuMusic() {
    if (isMenuPlaying && currentMenuTrackIndex !== -1 && menuTracks[currentMenuTrackIndex]) {
        menuTracks[currentMenuTrackIndex].pause();
        menuTracks[currentMenuTrackIndex].currentTime = 0;
        isMenuPlaying = false;
    }
}

[menuMusic1, menuMusic2].forEach(track => {
    track.addEventListener('ended', () => {
        const gameplayScreens = [
            gameplayScreen,
            blacksmithScreen,
            swordsScreen,
            missionScreen,
            missionJourneyScreen,
            battleScreen
        ];
        const isGameplayActive = gameplayScreens.some(screen => screen && !screen.classList.contains('hidden'));
        if (isMenuPlaying && !isGameplayActive) {
            playNextMenuMusic();
        } else {
            isMenuPlaying = false;
        }
    });
});

startScreen.addEventListener('click', () => {
    if (!isMenuPlaying) {
        currentMenuTrackIndex = Math.random() < 0.5 ? 1 : 0;
        playNextMenuMusic();
    }
    startScreen.classList.add('hidden');
    settingsButton.classList.remove('hidden');
    mainMenuContainer.classList.remove('hidden');
}, { once: true });

const gameplayTracks = [gameplayMusic1, gameplayMusic2];
let availableTracks = [...gameplayTracks];
let currentActiveGameplayTrack = null;
let isGameplayPlaying = false;

function startGameplayMusic() {
    if (isGameplayPlaying) return;
    
    stopAllMusic();

    if (availableTracks.length === 0) {
        availableTracks = [...gameplayTracks];
    }

    const trackIndex = Math.floor(Math.random() * availableTracks.length);
    currentActiveGameplayTrack = availableTracks[trackIndex];
    availableTracks.splice(trackIndex, 1);

    if (currentActiveGameplayTrack) {
        currentActiveGameplayTrack.currentTime = 0;
        currentActiveGameplayTrack.play().catch(e => console.error("Error playing gameplay music:", e));
        isGameplayPlaying = true;
        currentActiveGameplayTrack.removeEventListener('ended', handleGameplayMusicEnd);
        currentActiveGameplayTrack.addEventListener('ended', handleGameplayMusicEnd);
    }
}

function handleGameplayMusicEnd() {
    isGameplayPlaying = false;
    startGameplayMusic();
}

function stopGameplayMusic() {
    if (currentActiveGameplayTrack) {
        currentActiveGameplayTrack.pause();
        currentActiveGameplayTrack.currentTime = 0;
        currentActiveGameplayTrack.removeEventListener('ended', handleGameplayMusicEnd);
        isGameplayPlaying = false;
    }
}

function stopAllMusic() {
    stopMenuMusic();
    stopGameplayMusic();
    stopMissionJourneyMusic();
}

function startMissionJourneyMusic() {
    stopAllMusic();
    missionJourneyMusic.currentTime = 0;
    missionJourneyMusic.play().catch(e => console.error("Error playing journey music:", e));
}

function stopMissionJourneyMusic() {
    missionJourneyMusic.pause();
    missionJourneyMusic.currentTime = 0;
}

newGameBtn.addEventListener('click', () => showScreen(characterSelectionScreen));
loadGameBtn.addEventListener('click', () => {
    renderLoadScreen();
    showScreen(loadGameScreen);
});
instructionsBtn.addEventListener('click', () => showScreen(instructionsScreen));
backFromLoadBtn.addEventListener('click', () => showScreen(mainMenuContainer));
backFromInstructionsBtn.addEventListener('click', () => showScreen(mainMenuContainer));
backFromBlacksmithBtn.addEventListener('click', () => showScreen(gameplayScreen));
backFromSwordsBtn.addEventListener('click', () => showScreen(blacksmithScreen));
backFromMissionBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    showScreen(gameplayScreen);
});

heroCard.addEventListener('click', () => {
    selectedCharacter = './SRC/Personagens/Her%C3%B3i.png';
    showScreen(nameEntryScreen);
});
heroineCard.addEventListener('click', () => {
    selectedCharacter = './SRC/Personagens/Hero%C3%ADna.png';
    showScreen(nameEntryScreen);
});
confirmNameBtn.addEventListener('click', () => {
    const playerName = nameInput.value;
    if (playerName.trim() === "") {
        console.log("Por favor, digite um nome.");
    } else {
        playerStats.name = playerName;
        showScreen(storyScreen);
        currentStoryIndex = 0;
        showNextStoryPart();
    }
});

const missionDialogue = [
    { speaker: 'elder', text: "Bem-vindo, herói! Sua primeira missão o aguarda. É um teste simples, mas importante, para provar seu valor." },
    { speaker: 'elder', text: "Um slime tem causado problemas na orla da Floresta Sussurrante, assustando os viajantes e perturbando a paz. Sua tarefa é ir até lá e derrotá-lo." },
    { speaker: 'player', text: "Um slime na floresta? Entendido! Estou pronto para o desafio." },
    { speaker: 'elder', text: "Excelente! A floresta fica a leste daqui. Tenha cuidado, mesmo os menores desafios podem esconder surpresas. Volte quando a criatura for eliminada. Boa sorte, herói!" }
];
let currentMissionDialogueIndex = 0;
let isMissionTyping = false;
let missionTypingTimeout;

const missionJourneyStory = [
    "Com a missão clara em mente, você se despediu do Ancião Aprendiz e partiu em direção à Floresta Sussurrante. O sol da manhã filtrava-se pelas árvores, criando um caminho de luz e sombra.",
    "A cada passo, o som da civilização diminuía, substituído pelo farfalhar das folhas e o canto distante dos pássaros. A floresta, outrora um lugar de paz, agora carregava um ar de mistério, um presságio do que aguardava.",
    "Você apertou os punhos, sentindo o peso familiar e reconfortante. A determinação enchia seu coração. Não era apenas um slime; era o primeiro passo para libertar Éldoria do domínio de Glacius.",
    "À medida que as árvores se tornavam mais densas e a luz diminuía, você avistou uma clareira à frente. Um fedor estranho pairava no ar. Você sabia que estava perto. A aventura realmente começava agora."
];
let currentMissionJourneyIndex = 0;
let isMissionJourneyTyping = false;
let missionJourneyTypingTimeout;

function typeWriterMission(text, targetElement, i, callback) {
    if (i < text.length) {
        isMissionTyping = true;
        targetElement.innerHTML += text.charAt(i);
        missionTypingTimeout = setTimeout(() => typeWriterMission(text, targetElement, i + 1, callback), 50);
    } else {
        isMissionTyping = false;
        if (callback) callback();
    }
}

function typeWriterMissionJourney(text, targetElement, i, callback) {
    if (i < text.length) {
        isMissionJourneyTyping = true;
        targetElement.innerHTML += text.charAt(i);
        missionJourneyTypingTimeout = setTimeout(() => typeWriterMissionJourney(text, targetElement, i + 1, callback), 50);
    } else {
        isMissionJourneyTyping = false;
        if (callback) callback();
    }
}

function showNextMissionDialoguePart() {
    missionDialogText.innerHTML = '';
    elderDialogText.innerHTML = '';
    playerNameDisplay.classList.remove('hidden');
    elderNameDisplay.classList.remove('hidden');
    missionDialogBubble.classList.remove('hidden');
    elderDialogBubble.classList.remove('hidden');
    if (currentMissionDialogueIndex < missionDialogue.length) {
        const currentLine = missionDialogue[currentMissionDialogueIndex];
        let targetTextElement = (currentLine.speaker === 'player') ? missionDialogText : elderDialogText;
        typeWriterMission(currentLine.text, targetTextElement, 0);
    } else {
        missionDialogBubble.classList.add('hidden');
        elderDialogBubble.classList.add('hidden');
        playerNameDisplay.classList.add('hidden');
        elderNameDisplay.classList.add('hidden');
        missionCharacter.classList.add('hidden');
        elderApprentice.classList.add('hidden');
        currentMissionDialogueIndex = 0;
        startMissionJourney();
    }
}

function advanceMissionDialogue() {
    if (isMissionTyping) {
        clearTimeout(missionTypingTimeout);
        const currentLine = missionDialogue[currentMissionDialogueIndex];
        if (currentLine.speaker === 'player') {
            missionDialogText.innerHTML = currentLine.text;
        } else {
            elderDialogText.innerHTML = currentLine.text;
        }
        isMissionTyping = false;
    } else {
        currentMissionDialogueIndex++;
        showNextMissionDialoguePart();
    }
}

function startMissionJourney() {
    showScreen(missionJourneyScreen);
    currentMissionJourneyIndex = 0;
    showNextMissionJourneyPart();
}

function showNextMissionJourneyPart() {
    if (currentMissionJourneyIndex < missionJourneyStory.length) {
        missionJourneyText.innerHTML = '';
        typeWriterMissionJourney(missionJourneyStory[currentMissionJourneyIndex], missionJourneyText, 0);
    } else {
        startBattle();
    }
}

function advanceMissionJourney() {
    if (isMissionJourneyTyping) {
        clearTimeout(missionJourneyTypingTimeout);
        missionJourneyText.innerHTML = missionJourneyStory[currentMissionJourneyIndex];
        isMissionJourneyTyping = false;
    } else {
        currentMissionJourneyIndex++;
        showNextMissionJourneyPart();
    }
}

missionBtn.addEventListener('click', () => {
    showScreen(missionScreen);
    drachmasDisplay.classList.add('hidden');
    if (selectedCharacter) {
        missionCharacter.style.backgroundImage = `url('${selectedCharacter}')`;
    } else {
        missionCharacter.style.backgroundImage = `url('./SRC/Personagens/Her%C3%B3i.png')`;
    }
    missionCharacter.classList.remove('hidden');
    elderApprentice.classList.remove('hidden');
    playerNameDisplay.textContent = playerStats.name || 'Herói';
    currentMissionDialogueIndex = 0;
    showNextMissionDialoguePart();
});

missionScreen.addEventListener('click', advanceMissionDialogue);
missionJourneyScreen.addEventListener('click', advanceMissionJourney);
nextJourneyBtn.addEventListener('click', advanceMissionJourney);

document.querySelectorAll('.gameplay-btn').forEach(button => {
    const buttonText = button.textContent.trim();
    if (buttonText === "VENDEDOR DE POÇÃO" || buttonText === "INVENTÁRIO") {
         button.addEventListener('click', (e) => {
            e.preventDefault();
            showDevelopmentMessage();
        });
    }
});

document.getElementById('blacksmith-btn').addEventListener('click', () => showScreen(blacksmithScreen));

swordsBtn.addEventListener('click', () => showScreen(swordsScreen));

let isDragging = false;
let wasDragged = false;
let offsetX, offsetY;

admButton.addEventListener('mousedown', (e) => {
    isDragging = true;
    wasDragged = false;
    offsetX = e.clientX - admButton.getBoundingClientRect().left;
    offsetY = e.clientY - admButton.getBoundingClientRect().top;
    admButton.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        wasDragged = true;
        admButton.style.left = `${e.clientX - offsetX}px`;
        admButton.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    admButton.style.cursor = 'grab';
});

admButton.addEventListener('click', () => {
    if (wasDragged) return;
    admDrachmasInput.value = playerStats.drachmas;
    admModal.classList.remove('hidden');
});

backBtn.addEventListener('click', () => admModal.classList.add('hidden'));

saveBtn.addEventListener('click', () => {
    const newDrachmas = parseInt(admDrachmasInput.value, 10);
    if (!isNaN(newDrachmas)) {
        playerStats.drachmas = newDrachmas;
        drachmasDisplay.textContent = `Dracmas: ${playerStats.drachmas}`;
    }
    admModal.classList.add('hidden');
});

const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const allAudio = document.querySelectorAll('audio');

function applyVolume(volumeLevel) {
    allAudio.forEach(audio => {
        audio.volume = volumeLevel;
    });
}

function updateVolumeUI(value) {
    const valueAsInt = parseInt(value, 10);
    volumeValue.textContent = `${valueAsInt}%`;
    let level = '';
    if (valueAsInt === 0) level = 'nulo';
    else if (valueAsInt >= 1 && valueAsInt <= 49) level = 'baixo';
    else if (valueAsInt >= 50 && valueAsInt <= 89) level = 'medio';
    else if (valueAsInt >= 90) level = 'maximo';
    volumeSlider.dataset.volumeLevel = level;
    volumeSlider.style.setProperty('--volume-progress', `${valueAsInt}%`);
    if (valueAsInt >= 90) volumeSlider.style.background = `linear-gradient(to right, #ff7300 0%, #ff0000 var(--volume-progress), #5e4539 var(--volume-progress), #5e4539 100%)`;
    else if (valueAsInt >= 50 && valueAsInt <= 89) volumeSlider.style.background = `linear-gradient(to right, #ffee00 0%, #ff7300 var(--volume-progress), #5e4539 var(--volume-progress), #5e4539 100%)`;
    else if (valueAsInt >= 1 && valueAsInt <= 49) volumeSlider.style.background = `linear-gradient(to right, #00ff00 0%, #ffee00 var(--volume-progress), #5e4539 var(--volume-progress), #5e4539 100%)`;
    else volumeSlider.style.background = `#5e4539`;
    const sliderWidth = volumeSlider.offsetWidth;
    const thumbWidth = 50;
    const percent = valueAsInt / 100;
    const thumbPosition = percent * (sliderWidth - thumbWidth) + (thumbWidth / 2);
    volumeValue.style.left = `${thumbPosition}px`;
}

function loadVolume() {
    const initialVolume = 50;
    volumeSlider.value = initialVolume;
    applyVolume(initialVolume / 100);
    updateVolumeUI(initialVolume);
    localStorage.setItem('gameVolume', initialVolume);
}

settingsButton.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    updateVolumeUI(volumeSlider.value);
});
closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));

saveProgressBtn.addEventListener('click', async () => {
    if (!gameStarted) {
        showSaveWarningMessage();
        return;
    }
    if (!currentUser) {
        showSaveFeedback("Erro: Jogador não autenticado.", false);
        return;
    }

    const saveData = {
        playerStats: playerStats,
        selectedCharacter: selectedCharacter,
        savedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection('saves').doc(currentUser.uid).set(saveData);
        showSaveFeedback("Progresso salvo com sucesso!", true);
        settingsModal.classList.add('hidden');
    } catch (error) {
        console.error("Error saving game:", error);
        showSaveFeedback("Erro ao salvar o progresso.", false);
    }
});

async function renderLoadScreen() {
    saveSlotsWrapper.innerHTML = '';
    if (!currentUser) {
        noSavesMessage.textContent = "Autenticando...";
        noSavesMessage.classList.remove('hidden');
        return;
    }

    try {
        const doc = await db.collection('saves').doc(currentUser.uid).get();
        if (doc.exists) {
            noSavesMessage.classList.add('hidden');
            const saveData = doc.data();
            const slotHTML = `
                <div class="save-slot" data-save-id="${doc.id}">
                    <div class="character-portrait" style="background-image: url('${saveData.selectedCharacter}')"></div>
                    <div class="character-info">
                        <p>${saveData.playerStats.name}</p>
                        <p>Dracmas: ${saveData.playerStats.drachmas}</p>
                    </div>
                    <button class="delete-save-btn" title="Excluir Save"></button>
                </div>`;
            saveSlotsWrapper.innerHTML = slotHTML;
            
            document.querySelector('.save-slot').addEventListener('click', (event) => {
                if (!event.target.classList.contains('delete-save-btn')) {
                    loadGameFromSave(saveData);
                }
            });

            document.querySelector('.delete-save-btn').addEventListener('click', (event) => {
                event.stopPropagation();
                deleteSave(doc.id);
            });

        } else {
            noSavesMessage.textContent = "Você não tem nenhum save salvo";
            noSavesMessage.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Error loading saves:", error);
        noSavesMessage.textContent = "Erro ao carregar saves.";
        noSavesMessage.classList.remove('hidden');
    }
}

async function deleteSave(saveId) {
    if (!currentUser || currentUser.uid !== saveId) {
        console.error("Authentication error or mismatch trying to delete save.");
        showSaveFeedback("Erro: Não foi possível deletar o save.", false);
        return;
    }

    try {
        await db.collection('saves').doc(saveId).delete();
        showSaveFeedback("Save deletado com sucesso!", true);
        renderLoadScreen();
    } catch (error) {
        console.error("Error deleting save:", error);
        showSaveFeedback("Erro ao deletar o save.", false);
    }
}

function loadGameFromSave(saveData) {
    Object.assign(playerStats, saveData.playerStats);
    selectedCharacter = saveData.selectedCharacter;
    
    drachmasDisplay.textContent = `Dracmas: ${playerStats.drachmas}`;
    
    gameStarted = true;
    saveProgressBtn.classList.remove('disabled');
    saveProgressBtn.style.backgroundImage = "url('./SRC/Elementos%20do%20Jogo/Botão%202.png')";

    stopMenuMusic();
    showScreen(gameplayScreen);
}

exitGameBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
    resetGame();
    stopAllMusic();
    showScreen(mainMenuContainer);
    playNextMenuMusic();
});

volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    applyVolume(value / 100);
    updateVolumeUI(value);
});
volumeSlider.addEventListener('change', (e) => localStorage.setItem('gameVolume', e.target.value));

const sleep = ms => new Promise(res => setTimeout(res, ms / battleSpeed));

function updateHealthBar(entity, barFill, barText) {
    const percentage = (entity.currentHealth / entity.maxHealth) * 100;
    barFill.style.width = `${percentage}%`;
    barText.textContent = `${entity.currentHealth}/${entity.maxHealth}`;
}

function updateStaminaBar() {
    const percentage = (playerStats.currentStamina / playerStats.maxStamina) * 100;
    playerStaminaFill.style.width = `${percentage}%`;
    playerStaminaText.textContent = `${playerStats.currentStamina}/${playerStats.maxStamina}`;
}

function showFloatingText(text, color, target) {
    const textElement = document.createElement('div');
    textElement.className = 'floating-text';
    textElement.textContent = text;
    textElement.style.color = color;

    const targetRect = target.getBoundingClientRect();
    const containerRect = battleScreen.getBoundingClientRect();
    
    textElement.style.left = `${targetRect.left - containerRect.left + (targetRect.width / 2) - 30}px`;
    textElement.style.top = `${targetRect.top - containerRect.top}px`;

    floatingTextContainer.appendChild(textElement);
    setTimeout(() => {
        textElement.remove();
    }, 2000 / battleSpeed);
}

function checkBattleStatus() {
    if (enemyStats.currentHealth <= 0) {
        showVictoryScreen();
        return true;
    }
    if (playerStats.currentHealth <= 0) {
        showDefeatScreen();
        return true;
    }
    return false;
}

async function enemyAttackSequence() {
    battleEnemy.style.right = '65%';
    enemyHud.style.right = '52%';
    await sleep(2000);

    battleEnemy.style.right = '73%';
    enemyHud.style.right = '59.5%';
    battleEnemy.style.zIndex = 12;
    battlePlayer.style.zIndex = 11;

    attackImpactImg.style.left = '25%';
    attackImpactImg.style.right = '';
    attackImpactImg.classList.remove('hidden');
    enemyAttackSound.play();
    
    playerStats.currentHealth = Math.max(0, playerStats.currentHealth - enemyStats.attack);
    showFloatingText(`-${enemyStats.attack}`, 'white', battlePlayer);
    updateHealthBar(playerStats, playerHealthFill, playerHealthText);
    
    await sleep(1500);

    attackImpactImg.classList.add('hidden');
    battleEnemy.style.right = '25%';
    enemyHud.style.right = '12%';
    battleEnemy.style.zIndex = 10;
}

async function playerAttackSequence(damage, sound, staminaCost = 0) {
    playerStats.currentStamina -= staminaCost;
    updateStaminaBar();

    battlePlayer.style.left = '65%';
    playerHud.style.left = '52%';
    await sleep(2000);

    battlePlayer.style.left = '73%';
    playerHud.style.left = '59.5%';
    battlePlayer.style.zIndex = 12;
    battleEnemy.style.zIndex = 11;

    if (Math.random() < enemyStats.dodgeChance) {
        showFloatingText('Esquivou', 'yellow', battleEnemy);
        enemyDodgeSound.play();
        battleEnemy.style.right = '20%';
        enemyHud.style.right = '7%';
        await sleep(100);

        battlePlayer.style.left = '25%';
        playerHud.style.left = '12%';
        battlePlayer.style.zIndex = 10;
        
        await sleep(1400); 
        battleEnemy.style.right = '25%';
        enemyHud.style.right = '12%';
        return;
    }

    attackImpactImg.style.right = '25%';
    attackImpactImg.style.left = '';
    attackImpactImg.classList.remove('hidden');
    sound.play();
    
    enemyStats.currentHealth = Math.max(0, enemyStats.currentHealth - damage);
    showFloatingText(`-${damage}`, 'white', battleEnemy);
    updateHealthBar(enemyStats, enemyHealthFill, enemyHealthText);

    await sleep(1500);

    attackImpactImg.classList.add('hidden');
    battlePlayer.style.left = '25%';
    playerHud.style.left = '12%';
    battlePlayer.style.zIndex = 10;
}

async function handleDiceRoll() {
    rollDiceBtn.classList.add('disabled');
    rollDiceBtn.textContent = 'Rolou o Dado';
    rollDiceBtn.disabled = true;

    diceAnimationContainer.classList.remove('hidden');
    diceSound.currentTime = 0;
    diceSound.play();

    await sleep(1500);

    diceAnimationContainer.classList.add('hidden');
    const result = Math.floor(Math.random() * 20) + 1;
    
    diceResultElement.textContent = result;
    diceResultContainer.classList.remove('hidden');

    diceResultElement.style.animation = 'none';
    void diceResultElement.offsetWidth;
    diceResultElement.style.animation = '';
    
    await sleep(2000);
    diceResultContainer.classList.add('hidden');
    
    playerStats.currentStamina = Math.min(playerStats.maxStamina, playerStats.currentStamina + 5);
    updateStaminaBar();

    if (result >= 1 && result <= 12) {
        await enemyAttackSequence();
    } else if (result >= 13 && result <= 17) {
        await playerAttackSequence(playerStats.attack, playerAttackSound);
    } else if (result >= 18 && result <= 20) {
        if (playerStats.currentStamina >=35) {
            const specialDamage = playerStats.attack * 2;
            await playerAttackSequence(specialDamage, playerSpecialAttackSound, 35);
        } else {
            const strongDamage = playerStats.attack * 1.5;
            await playerAttackSequence(strongDamage, playerAttackSound);
        }
    }
    
    if (!checkBattleStatus()) {
        rollDiceBtn.classList.remove('disabled');
        rollDiceBtn.textContent = 'ROLAR DADO';
        rollDiceBtn.disabled = false;
    }
}

rollDiceBtn.addEventListener('click', handleDiceRoll);

speedMultiplierBtn.addEventListener('click', () => {
    currentSpeedIndex = (currentSpeedIndex + 1) % speedStates.length;
    const newState = speedStates[currentSpeedIndex];
    battleSpeed = newState.value;
    speedMultiplierBtn.textContent = newState.text;
});

function startBattle() {
    showScreen(battleScreen);
    battlePlayer.style.backgroundImage = `url('${selectedCharacter}')`;
    battleEnemy.style.backgroundImage = `url('./SRC/Inimigos/Slime.png')`;
    
    playerStats.currentHealth = playerStats.maxHealth;
    playerStats.currentStamina = playerStats.maxStamina;
    enemyStats.currentHealth = enemyStats.maxHealth;
    
    updateHealthBar(playerStats, playerHealthFill, playerHealthText);
    updateStaminaBar();
    updateHealthBar(enemyStats, enemyHealthFill, enemyHealthText);
    
    rollDiceBtn.classList.remove('disabled');
    rollDiceBtn.textContent = 'ROLAR DADO';
    rollDiceBtn.disabled = false;
}

function showVictoryScreen() {
    stopMissionJourneyMusic();
    showScreen(victoryScreen);

    playerStats.drachmas += enemyStats.drachmasReward;
    
    xpReward.textContent = `Você ganhou: ${enemyStats.xpReward} xp`;
    drachmasReward.textContent = `Você ganhou: ${enemyStats.drachmasReward} Dracmas`;
    drachmasDisplay.textContent = `Dracmas: ${playerStats.drachmas}`;
}

victoryBlacksmithBtn.addEventListener('click', showDevelopmentMessage);
victoryPotionsBtn.addEventListener('click', showDevelopmentMessage);
victoryInventoryBtn.addEventListener('click', showDevelopmentMessage);

victoryNextMissionBtn.addEventListener('click', () => {
    showScreen(endOfBetaScreen);
    startGameplayMusic();
});

function showDefeatScreen() {
    showScreen(defeatScreen);
}

defeatRetryBtn.addEventListener('click', () => {
    startBattle();
});

defeatBlacksmithBtn.addEventListener('click', showDevelopmentMessage);
defeatPotionsBtn.addEventListener('click', showDevelopmentMessage);
defeatInventoryBtn.addEventListener('click', showDevelopmentMessage);

endOfBetaScreen.addEventListener('click', () => {
    resetGame(); 
    stopAllMusic();
    showScreen(mainMenuContainer);
    playNextMenuMusic();
});

document.querySelectorAll('.gameplay-btn').forEach(button => {
    button.addEventListener('mousedown', () => button.classList.add('clicked'));
    button.addEventListener('mouseup', () => button.classList.remove('clicked'));
     button.addEventListener('mouseleave', () => button.classList.remove('clicked'));
});

function renderSwords() {
    swordsGrid.innerHTML = '';
    swords.forEach(sword => {
        const swordItem = document.createElement('div');
        swordItem.className = 'sword-item ' + sword.className;
        const imageContainer = document.createElement('div');
        imageContainer.className = 'sword-image-container';
        const swordImage = document.createElement('img');
        swordImage.src = sword.image;
        swordImage.alt = sword.name;
        imageContainer.appendChild(swordImage);
        const visualizeButton = document.createElement('button');
        visualizeButton.className = 'visualize-btn';
        visualizeButton.textContent = 'VISUALIZAR';
        visualizeButton.addEventListener('click', () => {
            let displayName = sword.name;
            if (displayName.length > 15) {
                const breakPoint = displayName.lastIndexOf(' ', 15);
                if (breakPoint > 0) displayName = displayName.substring(0, breakPoint) + '<br>' + displayName.substring(breakPoint + 1);
            }
            visualizeItemName.innerHTML = displayName;
            visualizeItemImage.src = sword.image;
            visualizeItemImage.alt = sword.name;
            visualizeItemPrice.textContent = `D$:${sword.price}`;
            visualizeDescBtn.dataset.description = sword.description;
            visualizeModal.classList.remove('hidden');
            drachmasDisplay.classList.remove('hidden');
        });
        ['mousedown', 'mouseup', 'mouseleave'].forEach(evt => {
            visualizeButton.addEventListener(evt, () => visualizeButton.classList.toggle('clicked', evt === 'mousedown'));
        });
        swordItem.appendChild(imageContainer);
        swordItem.appendChild(visualizeButton);
        swordsGrid.appendChild(swordItem);
    });
}

function closeVisualizeModal() {
    visualizeModal.classList.add('hidden');
    if (gameplayScreen.classList.contains('hidden')) {
         drachmasDisplay.classList.remove('hidden');
    } else {
         drachmasDisplay.classList.add('hidden');
    }
}

closeVisualizeBtn.addEventListener('click', closeVisualizeModal);
visualizeModal.addEventListener('click', (event) => {
    if (event.target === visualizeModal) closeVisualizeModal();
});
visualizePanel.addEventListener('click', (event) => event.stopPropagation());
visualizeDescBtn.addEventListener('click', (event) => console.log(`Descrição: ${event.currentTarget.dataset.description}`));
visualizeBuyBtn.addEventListener('click', () => console.log("COMPRAR button clicked!"));

document.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.error("Error playing sound:", e));
    }
});

loadVolume();
renderSwords();
resetGame();

const gameContainer = document.getElementById('game-container');
const orientationWarning = document.getElementById('orientation-warning');

const baseWidth = 1280;
const baseHeight = 720;

function adjustGameScaleAndOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isPortrait && window.matchMedia("(pointer: coarse)").matches) {
        orientationWarning.style.display = 'flex';
        gameContainer.style.display = 'none';
    } else {
        orientationWarning.style.display = 'none';
        gameContainer.style.display = 'block';

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const scaleX = screenWidth / baseWidth;
        const scaleY = screenHeight / baseHeight;
        const scale = Math.min(scaleX, scaleY);

        gameContainer.style.transform = `scale(${scale})`;
        
        const newWidth = baseWidth * scale;
        const newHeight = baseHeight * scale;
        gameContainer.style.left = `${(screenWidth - newWidth) / 2}px`;
        gameContainer.style.top = `${(screenHeight - newHeight) / 2}px`;
    }
}

window.addEventListener('resize', adjustGameScaleAndOrientation);
document.addEventListener('DOMContentLoaded', adjustGameScaleAndOrientation);
