export const gameData = {
  // 1. CONFIGURAZIONE INIZIALE
  config: {
    initialStats: {
      capital: 10000,      // Soldi liquidi
      lucidity: 100        // Salute mentale / Razionalità (0-100)
    },
    gameOver: {
      bankruptcy: {
        title: "BANCAROTTA!",
        message: "Hai bruciato tutta la tua liquidità. Le scelte impulsive ti hanno lasciato a secco. Devi ricominciare imparando a gestire il rischio.",
        icon: "💸"
      },
      burnout: {
        title: "PANIC ATTACK!",
        message: "Lo stress ti ha sopraffatto. Hai perso la lucidità necessaria per prendere decisioni razionali. Sei uscito dal mercato nel momento peggiore.",
        icon: "🤯"
      },
      victory: {
        title: "FINE DEL PRIMO CAPITOLO",
        message: "Sei sopravvissuto alle prime trappole del mercato! Hai dimostrato resilienza.",
        icon: "🏆"
      }
    }
  },

  // 2. SCENE E NAVIGAZIONE
  scenes: {
    // --- SCENA 1: MENTAL ACCOUNTING ---
    "start_001": {
      id: "start_001",
      title: "Venerdì Sera: La Sorpresa",
      text: "Il telefono vibra. Notifica dalla banca: +2.000€ accreditati. È il premio produzione che non ti aspettavi! I soldi sono lì, 'freschi' e non pianificati. Ti senti invincibile.",
      biasTag: "Mental Accounting", // Etichetta educativa
      choices: [
        {
          text: "Si vive una volta sola! Prenoto la vacanza.",
          outcomeText: "Hai speso quasi tutto il bonus. La gratificazione è immediata, ti senti un re, ma il tuo patrimonio netto non è cresciuto.",
          effects: { capital: -1800, lucidity: 10 },
          nextScene: "scene_002"
        },
        {
          text: "Tutto su quella Tech Stock che vola!",
          outcomeText: "Hai investito tutto impulsivamente. Ti senti un lupo di Wall Street, ma hai aumentato drasticamente il tuo profilo di rischio.",
          effects: { capital: -2000, lucidity: 5 }, // Capital scende perché diventa "illiquido/rischio"
          nextScene: "scene_002"
        },
        {
          text: "Aggiungo al piano di accumulo esistente.",
          outcomeText: "Noioso? Forse. Ma hai trattato questi soldi come qualsiasi altro stipendio. La tua futura stabilità ringrazia.",
          effects: { capital: 0, lucidity: 5 }, // Guadagna lucidità (tranquillità) -> Flash VERDE
          nextScene: "scene_002"
        }
      ]
    },

    // --- SCENA 2: HERDING BEHAVIOR ---
    "scene_002": {
      id: "scene_002",
      title: "Sabato Sera: La Cena",
      text: "Sei a cena. Marco tira fuori il telefono: 'Ragazzi, CryptoDog ha fatto +40% ieri! State perdendo il treno!'. Tutti i tuoi amici iniziano a scaricare l'app per comprare. L'atmosfera è elettrica.",
      biasTag: "Effetto Gregge (FOMO)",
      choices: [
        {
          text: "Non voglio restare indietro! Compro!",
          outcomeText: "Ti sei unito al branco. Ti senti parte del gruppo, l'ansia di perdere l'occasione è sparita, ma hai comprato sui massimi.",
          effects: { capital: -1000, lucidity: 5 },
          nextScene: "scene_003"
        },
        {
          text: "Dico a tutti che è una truffa.",
          outcomeText: "Hai rovinato la cena. Marco ti guarda male e ti senti isolato socialmente, anche se forse hai ragione.",
          effects: { capital: 0, lucidity: -15 }, // Danno sociale/stress
          nextScene: "scene_003"
        },
        {
          text: "Interessante, ma ci guarderò domani.",
          outcomeText: "Hai resistito alla pressione sociale. È stato difficile non farsi trascinare dall'euforia collettiva.",
          effects: { capital: 0, lucidity: 5 }, // Rinforzo positivo autocontrollo
          nextScene: "scene_003"
        }
      ]
    },

    // --- SCENA 3: LOSS AVERSION ---
    "scene_003": {
      id: "scene_003",
      title: "Due Settimane Dopo: Il Risveglio",
      text: "Apri gli occhi e guardi il telefono. È tutto rosso. Il mercato perde il 5%, ma le 'CryptoDog' e i titoli tech speculativi sono crollati del 35%. I giornali titolano: 'BRUCIATI MILIARDI'.",
      biasTag: "Avversione alle Perdite",
      choices: [
        {
          text: "VENDO TUTTO! Basta dolore!",
          outcomeText: "Hai premuto 'Vendi'. Il dolore è finito, ma hai reso reale una perdita che era solo virtuale. Hai venduto sui minimi.",
          effects: { capital: 0, lucidity: -20 }, // Nota: qui la logica complessa dovrebbe calcolare la perdita reale
          nextScene: "end_chapter_1"
        },
        {
          text: "È in saldo! Compro ancora!",
          outcomeText: "Hai provato ad afferrare il coltello mentre cadeva. Coraggioso o incosciente? Solo il tempo lo dirà.",
          effects: { capital: -1000, lucidity: -5 },
          nextScene: "end_chapter_1"
        },
        {
          text: "Chiudo l'app e bevo il caffè.",
          outcomeText: "La scelta più difficile. Ignorare il rumore di fondo. Il tuo orizzonte è di 10 anni, non di 10 minuti.",
          effects: { capital: 0, lucidity: 10 },
          nextScene: "end_chapter_1"
        }
      ]
    },
    
    // --- SCENA FINALE (VITTORIA MOMENTANEA) ---
    "end_chapter_1": {
        id: "end_chapter_1",
        title: "Resoconto",
        text: "Hai superato la prima tempesta. Molti investitori si sarebbero fatti prendere dal panico o dall'euforia. Tu sei ancora in piedi.",
        biasTag: "Fine Capitolo 1",
        choices: [
            {
                text: "Ricomincia l'avventura",
                outcomeText: "Riavvio del sistema...",
                effects: { restart: true }, // Flag speciale per la logica
                nextScene: "start_001"
            }
        ]
    }
  }
};