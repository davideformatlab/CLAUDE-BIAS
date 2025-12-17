import { gameData } from './data.js';

// --- STATO DEL GIOCO ---
let currentState = {
    stats: { ...gameData.config.initialStats },
    currentSceneId: "start_001"
};

// Variabili per ricordare i valori del turno precedente
let prevCapital = gameData.config.initialStats.capital;
let prevLucidity = gameData.config.initialStats.lucidity;

// --- MAPPA IMMAGINI ---
// Qui associamo l'ID della scena al file immagine corrispondente
const sceneImages = {
    "start_001": "img/bdi_intro.jpg",
    "scene_002": "img/sms_phishing.jpg",
    "scene_003": "img/supermarket.jpg"
};

// --- RIFERIMENTI DOM ---
const ui = {
    capitalVal: document.getElementById('stat-capital-val'),
    lucidityVal: document.getElementById('stat-lucidity-val'),
    barCapital: document.getElementById('bar-capital'),
    barLucidity: document.getElementById('bar-lucidity'),
    
    sceneTitle: document.getElementById('scene-title'),
    sceneText: document.getElementById('scene-text'),
    sceneImg: document.getElementById('scene-img'), // Riferimento all'immagine
    sceneBias: document.getElementById('scene-bias'),
    choicesArea: document.getElementById('choices-area'),
    
    feedbackArea: document.getElementById('feedback-area'),
    feedbackText: document.getElementById('feedback-text'),
    btnNext: document.getElementById('btn-next'),

    // Riferimento al div dell'overlay
    flashOverlay: document.getElementById('flash-overlay'),
    
    // Nuovi elementi UI
    onboardingBox: document.getElementById('onboarding-box'),
    gameContainer: document.getElementById('game-container'),
    btnStartGame: document.getElementById('btn-start-game')
};

// --- MOTORE DI GIOCO ---

/**
 * Gestisce il Feedback Visivo (Flash schermo + Scossa HUD)
 * @param {string} type - 'capital' o 'lucidity'
 * @param {boolean} isDamage - true = danno (rosso), false = guadagno (verde)
 */
function triggerVisualFeedback(type, isDamage) {
    
    // 1. GESTIONE FLASH A TUTTO SCHERMO
    if (ui.flashOverlay) {
        // Rimuoviamo le classi attive per poterle riavviare
        ui.flashOverlay.classList.remove('flash-damage-active');
        ui.flashOverlay.classList.remove('flash-gain-active');

        // TRUCCO: Forza il browser a ricalcolare il layout (Reflow)
        // Questo serve a resettare l'animazione CSS istantaneamente
        void ui.flashOverlay.offsetWidth;

        // Aggiungiamo la classe corretta in base al tipo (Danno o Guadagno)
        if (isDamage) {
            ui.flashOverlay.classList.add('flash-damage-active');
        } else {
            ui.flashOverlay.classList.add('flash-gain-active');
        }

        // Pulizia opzionale: rimuovi le classi alla fine dell'animazione (0.8s nel CSS)
        setTimeout(() => {
            ui.flashOverlay.classList.remove('flash-damage-active');
            ui.flashOverlay.classList.remove('flash-gain-active');
        }, 800);
    }

    // 2. GESTIONE SHAKE SULLE BARRE (Solo se è DANNO)
    if (isDamage) {
        let container = null;
        if (type === 'capital') container = ui.barCapital.closest('.stat-box');
        if (type === 'lucidity') container = ui.barLucidity.closest('.stat-box');

        if (container) {
            container.classList.remove('shake-damage'); // Reset
            void container.offsetWidth; // Reflow
            container.classList.add('shake-damage');
            
            setTimeout(() => container.classList.remove('shake-damage'), 500);
        }
    }
}

function updateHUD() {
    // --- RILEVAMENTO CAMBIAMENTI ---
    
    // Controllo Capitale
    if (currentState.stats.capital < prevCapital) {
        triggerVisualFeedback('capital', true); // DANNO (Rosso + Shake)
    } else if (currentState.stats.capital > prevCapital) {
        triggerVisualFeedback('capital', false); // CURA (Verde)
    }
    
    // Controllo Lucidità
    if (currentState.stats.lucidity < prevLucidity) {
        triggerVisualFeedback('lucidity', true); // DANNO
    } else if (currentState.stats.lucidity > prevLucidity) {
        triggerVisualFeedback('lucidity', false); // CURA
    }

    // Aggiorna i "precedenti" per il prossimo turno
    prevCapital = currentState.stats.capital;
    prevLucidity = currentState.stats.lucidity;

    // --- AGGIORNAMENTO GRAFICA BARRE ---

    // Aggiorna Numeri
    ui.capitalVal.innerText = currentState.stats.capital.toLocaleString() + "€";
    ui.lucidityVal.innerText = currentState.stats.lucidity + "%";

    // Aggiorna Lunghezza Barre
    const capPercentage = Math.min(100, Math.max(0, (currentState.stats.capital / 15000) * 100));
    ui.barCapital.style.width = capPercentage + "%";
    
    const lucPercentage = Math.min(100, Math.max(0, currentState.stats.lucidity));
    ui.barLucidity.style.width = lucPercentage + "%";

    // Stato critico (barra rossa se bassa)
    if (lucPercentage < 20) ui.barLucidity.classList.add('critical');
    else ui.barLucidity.classList.remove('critical');
}

function renderScene(sceneId) {
    const scene = gameData.scenes[sceneId];
    
    if (!scene) {
        console.error("Scena non trovata:", sceneId);
        return;
    }

    ui.sceneTitle.innerText = scene.title;
    ui.sceneText.innerText = scene.text;
    ui.sceneBias.innerText = scene.biasTag || "INFO";

    // Gestione Immagine
    // Usa l'immagine dalla mappa, oppure quella nell'oggetto scena, oppure un default
    const imgSrc = sceneImages[sceneId] || scene.image || "img/bdi_intro.jpg";
    if (ui.sceneImg) ui.sceneImg.src = imgSrc;
    
    // Nascondi feedback, mostra scelte
    ui.feedbackArea.classList.add('hidden');
    ui.choicesArea.innerHTML = ''; 

    scene.choices.forEach((choice) => {
        const btn = document.createElement('button');
        btn.className = 'btn-choice';
        btn.innerText = choice.text;
        btn.onclick = () => handleChoice(choice);
        ui.choicesArea.appendChild(btn);
    });
}

function handleChoice(choice) {
    // 1. Applica Effetti logici
    if (choice.effects) {
        if (choice.effects.restart) {
            restartGame();
            return;
        }

        if (choice.effects.capital) currentState.stats.capital += choice.effects.capital;
        if (choice.effects.lucidity) currentState.stats.lucidity += choice.effects.lucidity;
    }

    // 2. Chiamiamo updateHUD -> rileva i cambiamenti e attiva i flash
    updateHUD();

    if (checkGameOver()) return;

    // 3. Mostra Feedback
    ui.choicesArea.innerHTML = ''; 
    ui.feedbackArea.classList.remove('hidden');
    ui.feedbackText.innerText = choice.outcomeText;

    ui.btnNext.onclick = () => {
        if (choice.nextScene) {
            currentState.currentSceneId = choice.nextScene;
            renderScene(choice.nextScene);
        } else {
            alert("Fine della demo o scena mancante.");
        }
    };
}

function checkGameOver() {
    let gameOverData = null;

    if (currentState.stats.capital <= 0) {
        gameOverData = gameData.config.gameOver.bankruptcy;
    }
    else if (currentState.stats.lucidity <= 0) {
        gameOverData = gameData.config.gameOver.burnout;
    }

    if (gameOverData) {
        showGameOverScreen(gameOverData);
        return true;
    }
    return false;
}

function showGameOverScreen(data) {
    ui.sceneTitle.innerText = data.title;
    ui.sceneBias.innerText = "GAME OVER";
    ui.sceneText.innerText = data.message;
    ui.choicesArea.innerHTML = '';
    ui.feedbackArea.classList.add('hidden');
    
    const btnRestart = document.createElement('button');
    btnRestart.className = 'btn-choice';
    btnRestart.innerText = "🔄 Riprova";
    btnRestart.style.border = "2px solid #e74c3c";
    btnRestart.onclick = restartGame;
    ui.choicesArea.appendChild(btnRestart);

    // Aggiungi icona grande all'inizio del testo
    const iconDiv = document.createElement('div');
    iconDiv.style.fontSize = "4rem";
    iconDiv.style.textAlign = "center";
    iconDiv.style.marginBottom = "20px";
    iconDiv.innerText = data.icon;
    
    // Pulisci eventuale icona precedente se ricarichi la funzione
    const existingIcon = ui.sceneText.querySelector('div');
    if(existingIcon) existingIcon.remove();
    
    ui.sceneText.prepend(iconDiv);
}

function restartGame() {
    currentState.stats = { ...gameData.config.initialStats };
    prevCapital = gameData.config.initialStats.capital;
    prevLucidity = gameData.config.initialStats.lucidity;
    
    currentState.currentSceneId = "start_001";
    
    // Reset manuale HUD
    ui.capitalVal.innerText = currentState.stats.capital.toLocaleString() + "€";
    ui.lucidityVal.innerText = currentState.stats.lucidity + "%";
    ui.barCapital.style.width = "100%";
    ui.barLucidity.style.width = "100%";
    ui.barLucidity.classList.remove('critical');

    renderScene("start_001");
}

function startGame() {
    // Nascondi onboarding, mostra game container
    ui.onboardingBox.style.display = 'none';
    ui.gameContainer.classList.remove('hidden');
    
    // Avvia la prima scena
    renderScene("start_001");
}

// Avvio
document.addEventListener('DOMContentLoaded', () => {
    // Gestisci il click sul pulsante Start
    if (ui.btnStartGame) {
        ui.btnStartGame.addEventListener('click', startGame);
    }
});
