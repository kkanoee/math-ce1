/**
 * MathCE1 - Exercise Page
 * Main exercise interface with CPA phases and input methods
 * @module pages/exercise
 */

import { CONFIG } from '../data/config.js';
import { MicButton } from '../components/mic-button.js';
import { AnswerDisplay } from '../components/answer-display.js';
import { NumericKeyboard } from '../components/keyboard.js';
import { AdditionTable } from '../components/addition-table.js';
import { getVoiceInput } from '../services/voice-input.js';
import { createValidator } from '../services/answer-validator.js';
import { getFeedback } from '../components/feedback.js';
import { getHintSystem } from '../services/hint-system.js';
import { getMascot } from '../components/mascot.js';
import { getCalculModule } from '../modules/calcul/index.js';
import { getNumerationModule } from '../modules/numeration/index.js';
import { getGeometrieModule } from '../modules/geometrie/index.js';
import { getMesuresModule } from '../modules/mesures/index.js';
import { getProblemesModule } from '../modules/problemes/index.js';
import { getProgressionService } from '../services/progression.js';

/**
 * Exercise page component
 */
export class ExercisePage {
    constructor(params = []) {
        this.app = window.MathCE1;
        this.domain = params[0] || 'calcul';
        this.exerciseId = params[1] || null;

        this.currentExercise = null;
        this.currentPhase = 'abstract';
        this.exerciseIndex = 0;
        this.totalExercises = 5;
        this.errorsInRow = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.inputMode = 'keyboard';
        this.difficulty = 1;  // Difficulté de 1 à 10
        this.sessionExerciseHistory = [];  // Track exercises to avoid duplicates

        this.micButton = null;
        this.answerDisplay = null;
        this.keyboard = null;
        this.validator = null;
        this.voiceInput = null;
        this.feedback = null;
        this.hintSystem = null;
        this.mascot = null;
        this.module = null;
        this.progressionService = null;
        this.additionTable = null;
    }

    render() {
        const normalizedDomain = this.normalizeDomainName(this.domain);
        const domainInfo = CONFIG.DOMAINS[normalizedDomain] || CONFIG.DOMAINS.CALCUL;
        return `
      <div class="exercise-page slide-up">
        <div class="exercise-header">
          <button class="btn btn-icon back-btn" id="back-btn">←</button>
          <div class="exercise-progress">
            <div class="progress-bar">
              <div class="progress-fill" id="progress-fill" style="width: ${(this.exerciseIndex / this.totalExercises) * 100}%"></div>
            </div>
          </div>
          <span class="exercise-counter" id="exercise-counter">
            ${this.exerciseIndex + 1} / ${this.totalExercises}
          </span>
        </div>

        <div class="domain-badge">
          <span class="domain-icon">${domainInfo.icon || '📚'}</span>
          <span class="domain-name">${domainInfo.name || this.domain}</span>
        </div>

        <div class="cpa-phase-indicator" id="cpa-indicator">
          <div class="phase-dot concrete ${this.currentPhase === 'concrete' ? 'active' : ''}"></div>
          <div class="phase-dot pictorial ${this.currentPhase === 'pictorial' ? 'active' : ''}"></div>
          <div class="phase-dot abstract ${this.currentPhase === 'abstract' ? 'active' : ''}"></div>
          <span class="phase-label" id="phase-label">${this.getPhaseLabel()}</span>
        </div>

        <section class="question-section card" id="question-section">
          <div id="question-content">
            <p class="question-text">Chargement...</p>
          </div>
          <button class="btn btn-outline btn-sm question-audio-btn" id="read-question-btn" hidden>
            🔊 Lire la question
          </button>
        </section>

        <section class="answer-section">
          <div id="answer-display-container"></div>

          <div class="input-mode-toggle" id="input-mode-toggle">
            <button class="mode-btn ${this.inputMode === 'voice' ? 'active' : ''}" data-mode="voice">
              🎤 Voix
            </button>
            <button class="mode-btn ${this.inputMode === 'keyboard' ? 'active' : ''}" data-mode="keyboard">
              ⌨️ Clavier
            </button>
          </div>

          <div class="voice-input-area" id="voice-area" ${this.inputMode !== 'voice' ? 'hidden' : ''}>
            <div id="mic-button-container"></div>
          </div>

          <div id="keyboard-container" ${this.inputMode !== 'keyboard' ? 'hidden' : ''}></div>

          <button class="btn btn-outline btn-sm help-table-btn" id="help-table-btn">
            📊 Table d'addition
          </button>
        </section>

        <div id="addition-table-container"></div>

        <div id="mascot-container" class="mascot-container" hidden>
          <div class="mascot-character">🦊</div>
          <div id="mascot-bubble" class="mascot-bubble" hidden>
            <p id="mascot-message"></p>
          </div>
        </div>
      </div>
    `;
    }

    init() {
        this.feedback = getFeedback();
        this.voiceInput = getVoiceInput();
        this.validator = createValidator();
        this.hintSystem = getHintSystem();
        this.mascot = getMascot();
        this.module = this.getModuleForDomain();
        this.progressionService = getProgressionService();

        // Load saved difficulty level for this domain
        this.loadSavedProgress();

        this.initAnswerDisplay();
        this.initMicButton();
        this.initKeyboard();
        this.initAdditionTable();
        this.setupEventListeners();
        this.loadExercise();

        setTimeout(() => this.showMascot('Prêt à jouer ? 🎮'), 500);
    }

    /**
     * Initialize addition table component
     */
    initAdditionTable() {
        const container = document.getElementById('addition-table-container');
        if (container) {
            this.additionTable = new AdditionTable(container);
        }
    }

    /**
     * Load saved progress for current child and domain
     */
    loadSavedProgress() {
        const currentChild = this.app?.state?.get('currentChild');
        if (currentChild && this.progressionService) {
            const domainStats = this.progressionService.getDomainStats(currentChild.id, this.domain);
            if (domainStats) {
                this.difficulty = domainStats.level || 1;
                this.currentPhase = domainStats.currentPhase || 'abstract';
                console.log(`📊 Loaded progress: Level ${this.difficulty}, Phase: ${this.currentPhase}`);
            }
        }
    }

    getModuleForDomain() {
        switch (this.domain.toLowerCase()) {
            case 'calcul':
                return getCalculModule();
            case 'numeration':
                return getNumerationModule();
            case 'geometrie':
            case 'geometry':  // Support English URL variant
                return getGeometrieModule();
            case 'mesures':
            case 'measures':  // Support English URL variant
                return getMesuresModule();
            case 'problemes':
            case 'problems':  // Support English URL variant
                return getProblemesModule();
            default:
                console.warn(`Unknown domain: ${this.domain}, falling back to calcul`);
                return getCalculModule();
        }
    }

    normalizeDomainName(domain) {
        const mapping = {
            'geometry': 'GEOMETRIE',
            'geometrie': 'GEOMETRIE',
            'measures': 'MESURES',
            'mesures': 'MESURES',
            'problems': 'PROBLEMES',
            'problemes': 'PROBLEMES',
            'calcul': 'CALCUL',
            'numeration': 'NUMERATION',
        };
        return mapping[domain.toLowerCase()] || domain.toUpperCase();
    }

    initAnswerDisplay() {
        const container = document.getElementById('answer-display-container');
        if (container) {
            this.answerDisplay = new AnswerDisplay(container);
        }
    }

    initMicButton() {
        const container = document.getElementById('mic-button-container');
        if (container) {
            this.micButton = new MicButton(container, {
                size: 'large',
                showLabel: true,
                onStart: () => this.handleVoiceStart(),
                onStop: () => this.handleVoiceStop(),
            });
            this.setupVoiceHandlers();
        }
    }

    initKeyboard() {
        const container = document.getElementById('keyboard-container');
        if (container) {
            this.keyboard = new NumericKeyboard(container, {
                onDigit: (digit) => this.handleDigit(digit),
                onBackspace: () => this.handleBackspace(),
            });
        }
    }

    setupVoiceHandlers() {
        if (!this.voiceInput) return;

        this.voiceInput.onNumber = (result) => {
            this.handleVoiceNumber(result.number);
        };

        this.voiceInput.onInterim = (result) => {
            if (this.answerDisplay) {
                this.answerDisplay.setInterim(result.transcript);
                if (result.number !== null) {
                    this.answerDisplay.setValue(result.number);
                }
            }
        };

        this.voiceInput.onError = (error) => {
            console.warn('Voice error:', error);
            this.showMascot('Réessaie de parler plus fort !');
        };
    }

    setupEventListeners() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setInputMode(btn.dataset.mode);
            });
        });

        document.getElementById('read-question-btn')?.addEventListener('click', () => this.readQuestion());
        document.getElementById('back-btn')?.addEventListener('click', () => this.app.router.navigate('home'));

        // Addition table help button
        document.getElementById('help-table-btn')?.addEventListener('click', () => {
            if (this.additionTable) {
                this.additionTable.toggle();
            }
        });
    }

    loadExercise() {
        this.currentExercise = this.generateExercise();
        this.renderQuestion();

        if (this.hintSystem) {
            this.hintSystem.setExercise(this.currentExercise);
        }

        if (this.validator) {
            this.validator.setExpectedAnswer(this.currentExercise.answer);
            this.validator.onCorrect = () => this.handleCorrectAnswer();
            this.validator.onIncorrect = () => this.handleIncorrectAnswer();
        }

        if (this.answerDisplay) {
            this.answerDisplay.clear();
        }
    }

    generateExercise() {
        const maxAttempts = 10; // Prevent infinite loops
        let attempt = 0;
        let exercise = null;

        while (attempt < maxAttempts) {
            attempt++;

            if (this.module && typeof this.module.generateExercise === 'function') {
                const exerciseTypes = this.module.getExerciseTypes?.() || [];
                const randomType = exerciseTypes.length > 0
                    ? exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)].id
                    : null;

                exercise = this.module.generateExercise({
                    difficulty: this.difficulty,
                    type: randomType,
                    phase: this.currentPhase,
                });
            } else {
                // Fallback to simple addition
                const range = CONFIG.NUMBER_RANGES[this.difficulty] || CONFIG.NUMBER_RANGES[1];
                const a = Math.floor(Math.random() * (range.max / 2)) + 1;
                const b = Math.floor(Math.random() * (range.max / 2)) + 1;

                exercise = {
                    id: `add_${Date.now()}`,
                    type: 'addition',
                    domain: this.domain,
                    phase: this.currentPhase,
                    question: `${a} + ${b} = ?`,
                    questionText: `Combien font ${a} plus ${b} ?`,
                    a,
                    b,
                    answer: a + b,
                    difficulty: this.difficulty,
                };
            }

            // Check if this exercise is different from previous ones in this session
            if (!this.isDuplicateExercise(exercise)) {
                // Save to history
                this.addToExerciseHistory(exercise);
                return exercise;
            }
        }

        // If we couldn't avoid duplicates after max attempts, return the last generated
        this.addToExerciseHistory(exercise);
        return exercise;
    }

    /**
     * Check if exercise is a duplicate of one already in session
     * @param {Object} exercise - Exercise to check
     * @returns {boolean} True if duplicate
     */
    isDuplicateExercise(exercise) {
        if (!this.sessionExerciseHistory || this.sessionExerciseHistory.length === 0) {
            return false;
        }

        return this.sessionExerciseHistory.some(prev => {
            // Compare key properties to detect duplicates
            if (exercise.question && prev.question) {
                return exercise.question === prev.question;
            }
            if (exercise.a !== undefined && exercise.b !== undefined) {
                return exercise.a === prev.a && exercise.b === prev.b && exercise.type === prev.type;
            }
            if (exercise.answer !== undefined) {
                return exercise.answer === prev.answer && exercise.questionText === prev.questionText;
            }
            return false;
        });
    }

    /**
     * Add exercise to session history
     * @param {Object} exercise - Exercise to add
     */
    addToExerciseHistory(exercise) {
        if (!this.sessionExerciseHistory) {
            this.sessionExerciseHistory = [];
        }
        this.sessionExerciseHistory.push({
            question: exercise.question,
            questionText: exercise.questionText,
            a: exercise.a,
            b: exercise.b,
            answer: exercise.answer,
            type: exercise.type,
        });
    }

    renderQuestion() {
        const questionSection = document.getElementById('question-content');
        if (!questionSection || !this.currentExercise) return;

        const ex = this.currentExercise;

        // Use exercise's questionText or build from exercise data
        let questionHTML;

        if (ex.questionText) {
            questionHTML = `<p class="question-text">${ex.questionText}</p>`;
        } else if (ex.question) {
            questionHTML = `<p class="question-text">${ex.question}</p>`;
        } else {
            questionHTML = `<p class="question-text">Réponds à la question</p>`;
        }

        // Add visual elements based on exercise type and phase
        // Only show equation for calcul-type exercises, not for comparison/mesures exercises
        const isCalculExercise = ex.domain === 'calcul' ||
            ['addition', 'subtraction', 'multiplication', 'problemWithVisual'].includes(ex.type);

        if (ex.a !== undefined && ex.b !== undefined && isCalculExercise) {
            switch (this.currentPhase) {
                case 'concrete':
                    questionHTML = this.renderConcreteQuestion(ex.a, ex.b, ex.operator);
                    break;
                case 'pictorial':
                    questionHTML = this.renderPictorialQuestion(ex.a, ex.b, ex.operator);
                    break;
                case 'abstract':
                default:
                    if (ex.question) {
                        questionHTML = `
                            <p class="question-text">Combien font :</p>
                            <p class="question-equation">${ex.a} ${ex.operator || '+'} ${ex.b} = ?</p>
                        `;
                    }
            }
        }

        // Special rendering for specific exercise types
        if (ex.type === 'counting' && ex.count) {
            questionHTML = this.renderCountingExercise(ex);
        } else if (ex.type === 'recognition' && ex.targetShape) {
            questionHTML = this.renderShapeRecognition(ex);
        } else if (ex.type === 'countSides' && ex.shape) {
            questionHTML = this.renderCountSides(ex);
        } else if (ex.type === 'time' && ex.hours !== undefined) {
            questionHTML = this.renderTimeExercise(ex);
        } else if (ex.type === 'money' && ex.coins) {
            questionHTML = this.renderMoneyExercise(ex);
        } else if (ex.type === 'length' && ex.length) {
            questionHTML = this.renderLengthExercise(ex);
        } else if (ex.subtype === 'wordProblem') {
            questionHTML = this.renderWordProblem(ex);
        }

        questionSection.innerHTML = questionHTML;

        // Setup QCM option buttons for multiple choice exercises
        if (ex.isMultipleChoice) {
            this.setupQCMButtons();
        }

        const readBtn = document.getElementById('read-question-btn');
        if (readBtn) readBtn.hidden = false;
    }

    setupQCMButtons() {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const answer = btn.dataset.answer;
                const index = parseInt(btn.dataset.index);

                // Check if answer is correct
                if (answer === this.currentExercise.answer || index === this.currentExercise.answerIndex) {
                    btn.classList.add('correct');
                    this.handleCorrectAnswer();
                } else {
                    btn.classList.add('incorrect');
                    this.handleIncorrectAnswer();
                }

                // Disable all buttons after selection
                buttons.forEach(b => b.disabled = true);
            });
        });
    }

    renderConcreteQuestion(a, b, operator = '+') {
        const cubesA = Array(Math.min(a, 20)).fill('<div class="cube"></div>').join('');
        const cubesB = Array(Math.min(b, 20)).fill('<div class="cube" style="background: linear-gradient(135deg, #E74C3C, #C0392B);"></div>').join('');
        const opSymbol = operator === '-' ? '−' : '+';

        return `
            <p class="question-text">${operator === '-' ? 'Combien reste-t-il de cubes ?' : 'Combien y a-t-il de cubes en tout ?'}</p>
            <div class="manipulables-area">
                <div class="manipulable-group" style="display: flex; gap: 4px; flex-wrap: wrap;">
                    ${cubesA}
                </div>
                <span style="font-size: 32px; margin: 0 16px;">${opSymbol}</span>
                <div class="manipulable-group" style="display: flex; gap: 4px; flex-wrap: wrap;">
                    ${cubesB}
                </div>
            </div>
        `;
    }

    renderPictorialQuestion(a, b, operator = '+') {
        const opSymbol = operator === '-' ? '−' : '+';
        return `
            <p class="question-text">Regarde le modèle et trouve le résultat :</p>
            <div class="pictorial-area">
                <div class="bar-model">
                    <div class="bar-row">
                        <div class="bar-segment part-a" style="flex: ${a};">${a}</div>
                        ${operator !== '-' ? `<div class="bar-segment part-b" style="flex: ${b};">${b}</div>` : ''}
                    </div>
                    <div class="bar-row">
                        <div class="bar-segment unknown" style="flex: ${operator === '-' ? a - b : a + b};">?</div>
                    </div>
                </div>
                <p class="equation-display">${a} ${opSymbol} ${b} = ?</p>
            </div>
        `;
    }

    renderCountingExercise(ex) {
        const icon = ex.icon || '🔵';
        const items = Array(ex.count).fill(`<span class="count-item">${icon}</span>`).join('');
        return `
            <p class="question-text">${ex.questionText || 'Combien y a-t-il d\'éléments ?'}</p>
            <div class="counting-area" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; font-size: 32px;">
                ${items}
            </div>
        `;
    }

    renderShapeRecognition(ex) {
        const shapeIcons = { circle: '⭕', square: '🟥', rectangle: '🟦', triangle: '🔺', pentagon: '⬠', hexagon: '⬡' };
        const icon = shapeIcons[ex.targetShape.id] || '⬡';

        return `
            <p class="question-text">${ex.questionText || 'Comment s\'appelle cette forme ?'}</p>
            <div class="shape-display" style="font-size: 80px; text-align: center; margin: 20px 0;">
                ${icon}
            </div>
            <div class="options-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                ${ex.options.map((opt, i) => `
                    <button class="option-btn btn" data-answer="${opt.name}" data-index="${i}">
                        ${opt.icon} ${opt.name}
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderCountSides(ex) {
        const shapeIcons = { circle: '⭕', square: '🟥', rectangle: '🟦', triangle: '🔺', pentagon: '⬠', hexagon: '⬡' };
        const icon = shapeIcons[ex.shape.id] || '⬡';

        return `
            <p class="question-text">${ex.questionText || `Combien de côtés a un ${ex.shape.name} ?`}</p>
            <div class="shape-display" style="font-size: 100px; text-align: center; margin: 20px 0;">
                ${icon}
            </div>
        `;
    }

    renderTimeExercise(ex) {
        const hourAngle = (ex.hours % 12) * 30 + (ex.minutes / 60) * 30;
        const minuteAngle = ex.minutes * 6;

        return `
            <p class="question-text">${ex.questionText || 'Quelle heure est-il ?'}</p>
            <div class="clock-display" style="text-align: center; margin: 20px 0;">
                <svg width="150" height="150" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="#fff" stroke="#333" stroke-width="3"/>
                    ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => {
            const angle = (h * 30 - 90) * Math.PI / 180;
            const x = 50 + 35 * Math.cos(angle);
            const y = 50 + 35 * Math.sin(angle);
            return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="10">${h}</text>`;
        }).join('')}
                    <line x1="50" y1="50" x2="${50 + 25 * Math.sin(hourAngle * Math.PI / 180)}" y2="${50 - 25 * Math.cos(hourAngle * Math.PI / 180)}" stroke="#333" stroke-width="4" stroke-linecap="round"/>
                    <line x1="50" y1="50" x2="${50 + 35 * Math.sin(minuteAngle * Math.PI / 180)}" y2="${50 - 35 * Math.cos(minuteAngle * Math.PI / 180)}" stroke="#666" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="50" cy="50" r="3" fill="#333"/>
                </svg>
            </div>
            <p class="hint-text" style="text-align: center; color: #666; font-size: 14px;">Indice : La petite aiguille montre les heures</p>
        `;
    }

    renderMoneyExercise(ex) {
        const coinIcons = { 1: '🪙', 2: '🪙', 5: '🪙', 10: '💰', 20: '💰' };
        const coins = ex.coins.map(c => `<span class="coin" style="font-size: 40px; position: relative;">${coinIcons[c] || '🪙'}<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #333;">${c}€</span></span>`).join(' ');

        return `
            <p class="question-text">${ex.questionText || 'Combien d\'euros au total ?'}</p>
            <div class="money-display" style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin: 20px 0;">
                ${coins}
            </div>
        `;
    }

    renderLengthExercise(ex) {
        // Use 14px per cm to match ruler graduations
        const pxPerCm = 14;
        const barWidth = ex.length * pxPerCm;

        return `
            <p class="question-text">${ex.questionText || 'Quelle est la longueur ?'}</p>
            <div class="ruler-display" style="text-align: center; margin: 20px 0;">
                <svg width="300" height="60" viewBox="0 0 300 60">
                    <rect x="10" y="10" width="${barWidth}" height="20" fill="#3498DB" rx="2"/>
                    <rect x="10" y="35" width="280" height="20" fill="#F4D03F" rx="2"/>
                    ${Array.from({ length: 21 }, (_, i) => `
                        <line x1="${10 + i * pxPerCm}" y1="35" x2="${10 + i * pxPerCm}" y2="${i % 5 === 0 ? 45 : 40}" stroke="#333" stroke-width="1"/>
                        ${i % 5 === 0 ? `<text x="${10 + i * pxPerCm}" y="58" text-anchor="middle" font-size="8">${i}</text>` : ''}
                    `).join('')}
                </svg>
            </div>
        `;
    }

    renderWordProblem(ex) {
        return `
            <div class="word-problem">
                <p class="problem-text" style="font-size: 18px; line-height: 1.6; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    ${ex.questionText || ex.question}
                </p>
                ${ex.equation ? `<p class="equation-hint" style="text-align: center; color: #666; margin-top: 10px;">💡 ${ex.equation}</p>` : ''}
            </div>
        `;
    }

    setInputMode(mode) {
        this.inputMode = mode;

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        const voiceArea = document.getElementById('voice-area');
        const keyboardArea = document.getElementById('keyboard-container');

        if (voiceArea) voiceArea.hidden = mode !== 'voice';
        if (keyboardArea) keyboardArea.hidden = mode !== 'keyboard';

        if (mode === 'keyboard' && this.voiceInput) {
            this.voiceInput.stop();
        }
    }

    handleVoiceStart() {
        if (this.answerDisplay) this.answerDisplay.showListening();
        this.voiceInput?.start();
    }

    handleVoiceStop() {
        if (this.answerDisplay) this.answerDisplay.setState('idle');
    }

    handleVoiceNumber(number) {
        if (this.answerDisplay) {
            this.answerDisplay.setValue(number);
            this.answerDisplay.clearInterim();
        }
        if (this.validator) {
            this.validator.validateVoice(number);
        }
    }

    handleDigit(digit) {
        if (this.validator) this.validator.addDigit(digit);
        if (this.answerDisplay) this.answerDisplay.appendDigit(digit);
    }

    handleBackspace() {
        if (this.validator) this.validator.removeDigit();
        if (this.answerDisplay) this.answerDisplay.removeLastDigit();
    }

    handleCorrectAnswer() {
        this.errorsInRow = 0;
        this.streak++;

        if (this.hintSystem) this.hintSystem.recordSuccess();
        if (this.answerDisplay) this.answerDisplay.showCorrect();

        this.app.audio?.playSuccess();
        this.feedback?.showSuccess();

        this.showMascot('Bravo ! 🎉');
        this.addStar();

        // Save progression and check for level up
        this.saveProgression(true);

        if (this.streak >= CONFIG.STREAK_LENGTH_FOR_BONUS && this.streak % CONFIG.STREAK_LENGTH_FOR_BONUS === 0) {
            setTimeout(() => {
                this.feedback?.showStreak(this.streak);
                this.showMascot(`Série de ${this.streak} ! Super ! 🔥`);
                for (let i = 0; i < CONFIG.STARS_STREAK_BONUS; i++) {
                    this.addStar();
                }
            }, 1000);
        }

        setTimeout(() => this.nextExercise(), CONFIG.ANIMATION.FEEDBACK_DISPLAY_MS);
    }

    /**
     * Save progression after each exercise
     * @param {boolean} isCorrect - Whether the answer was correct
     */
    saveProgression(isCorrect) {
        const currentChild = this.app?.state?.get('currentChild');
        if (!currentChild || !this.progressionService) return;

        const result = this.progressionService.updateProgression(
            currentChild.id,
            this.domain,
            isCorrect,
            this.currentPhase
        );

        // Update streak tracking
        if (this.streak > 0) {
            this.progressionService.updateStreak(currentChild.id, this.domain, this.streak);
        }

        // Handle level up!
        if (result.levelUp) {
            this.difficulty = result.newLevel;
            this.showLevelUpCelebration(result.newLevel);
        }
    }

    /**
     * Show level up celebration
     * @param {number} newLevel - The new level reached
     */
    showLevelUpCelebration(newLevel) {
        // Delay to not overlap with correct answer feedback
        setTimeout(() => {
            this.feedback?.triggerConfetti();
            this.app.audio?.playSuccess();

            const messages = CONFIG.MASCOT_MESSAGES.LEVEL_UP;
            const message = messages[Math.floor(Math.random() * messages.length)];
            this.showMascot(`🌟 Niveau ${newLevel} ! ${message}`);

            // Show a visual notification
            this.showLevelUpNotification(newLevel);
        }, 1500);
    }

    /**
     * Show level up notification banner
     * @param {number} newLevel - The new level
     */
    showLevelUpNotification(newLevel) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <span class="level-up-icon">🎉</span>
                <div class="level-up-text">
                    <strong>Niveau ${newLevel} débloqué !</strong>
                    <p>Tu progresses super bien !</p>
                </div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #7ED321, #5BA318);
            color: white;
            padding: 16px 24px;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideDown 0.5s ease, fadeOut 0.5s ease 3s forwards;
            text-align: center;
        `;

        // Add animation keyframes if not exists
        if (!document.getElementById('level-up-styles')) {
            const style = document.createElement('style');
            style.id = 'level-up-styles';
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                }
                .level-up-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .level-up-icon {
                    font-size: 32px;
                }
                .level-up-text strong {
                    font-size: 18px;
                    display: block;
                }
                .level-up-text p {
                    margin: 4px 0 0 0;
                    font-size: 14px;
                    opacity: 0.9;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove after animation
        setTimeout(() => notification.remove(), 4000);
    }

    handleIncorrectAnswer() {
        this.errorsInRow++;
        this.streak = 0;

        if (this.answerDisplay) this.answerDisplay.showIncorrect();
        this.app.audio?.playEncouragement();

        // Save progression (incorrect answer)
        this.saveProgression(false);

        // Vider la case de réponse après un délai
        setTimeout(() => {
            if (this.answerDisplay) {
                this.answerDisplay.clear();
            }
            if (this.validator) {
                this.validator.reset();
            }
        }, 1000);

        // Afficher le bouton "Voir la réponse" après 2 erreurs
        if (this.errorsInRow >= 2) {
            this.showRevealButton();
        }

        if (this.hintSystem) {
            const hint = this.hintSystem.recordError();
            if (hint) {
                this.showHint(hint);
                return;
            }
        }

        const hint = this.currentExercise?.hint;
        if (hint && this.errorsInRow >= 2) {
            this.showMascot(hint);
        } else {
            this.showMascot(this.getEncouragementMessage());
        }
    }

    showRevealButton() {
        // Vérifier si le bouton existe déjà
        if (document.getElementById('reveal-answer-btn')) return;

        const questionSection = document.getElementById('question-section');
        if (!questionSection) return;

        const btn = document.createElement('button');
        btn.id = 'reveal-answer-btn';
        btn.className = 'btn btn-outline btn-sm reveal-answer-btn';
        btn.innerHTML = '💡 Voir la réponse';
        btn.addEventListener('click', () => this.revealAnswer());

        questionSection.appendChild(btn);
    }

    revealAnswer() {
        if (!this.currentExercise) return;

        const answer = this.currentExercise.answer;

        // Afficher la réponse dans la mascotte
        this.showMascot(`La réponse est : ${answer} 🎯`);

        // Mettre la réponse dans le champ
        if (this.answerDisplay) {
            this.answerDisplay.setValue(answer);
            this.answerDisplay.setState('revealed');
        }

        // Supprimer le bouton
        const btn = document.getElementById('reveal-answer-btn');
        if (btn) btn.remove();

        // Passer à l'exercice suivant après un délai
        setTimeout(() => this.nextExercise(), 2500);
    }

    showHint(hint = null) {
        if (!hint && this.hintSystem) {
            hint = this.hintSystem.generateHint();
        }

        if (hint?.content) {
            this.showMascot(hint.content);
        } else if (this.currentExercise?.hint) {
            this.showMascot(this.currentExercise.hint);
        } else {
            const messages = CONFIG.MASCOT_MESSAGES.HINT;
            this.showMascot(messages[Math.floor(Math.random() * messages.length)]);
        }

        if (hint?.type === 'detailed' && this.keyboard && this.inputMode === 'keyboard') {
            const firstDigit = String(this.currentExercise.answer)[0];
            this.keyboard.highlightKey(firstDigit);
        }
    }

    getEncouragementMessage() {
        const messages = CONFIG.MASCOT_MESSAGES.ENCOURAGEMENT;
        return messages[Math.floor(Math.random() * messages.length)];
    }

    addStar() {
        const currentChild = this.app?.state?.get('currentChild');
        if (currentChild) {
            currentChild.stars = (currentChild.stars || 0) + CONFIG.STARS_PER_EXERCISE;
            this.app.state.set('currentChild', currentChild);

            const children = this.app.storage.get('children') || [];
            const index = children.findIndex(c => c.id === currentChild.id);
            if (index >= 0) {
                children[index] = currentChild;
                this.app.storage.set('children', children);
            }
        }
    }

    nextExercise() {
        this.exerciseIndex++;

        if (this.exerciseIndex >= this.totalExercises) {
            this.showSessionSummary();
            return;
        }

        this.updateProgress();
        if (this.keyboard) this.keyboard.clearHighlights();
        this.loadExercise();
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const counter = document.getElementById('exercise-counter');

        if (progressFill) {
            progressFill.style.width = `${((this.exerciseIndex) / this.totalExercises) * 100}%`;
        }

        if (counter) {
            counter.textContent = `${this.exerciseIndex + 1} / ${this.totalExercises}`;
        }
    }

    showSessionSummary() {
        const container = document.querySelector('.exercise-page');
        if (!container) return;

        const currentChild = this.app?.state?.get('currentChild');
        const starsEarned = this.totalExercises * CONFIG.STARS_PER_EXERCISE;
        const normalizedDomain = this.normalizeDomainName(this.domain);
        const domainInfo = CONFIG.DOMAINS[normalizedDomain] || {};
        const maxDifficulty = CONFIG.DIFFICULTY?.MAX || 10;
        const canLevelUp = this.difficulty < maxDifficulty;

        // Track best streak
        this.bestStreak = Math.max(this.bestStreak, this.streak);

        container.innerHTML = `
            <div class="session-summary bounce-in">
                <div class="summary-mascot">🎉</div>
                <h2 class="summary-title">Bravo ${currentChild?.name || ''} !</h2>
                <p>Tu as terminé la session de <strong>${domainInfo.name || this.domain}</strong> !</p>
                <p class="difficulty-badge">📈 Niveau ${this.difficulty}</p>

                <div class="summary-stats">
                    <div class="summary-stat">
                        <span class="summary-stat-icon">⭐</span>
                        <span class="summary-stat-value">${starsEarned}</span>
                        <span class="summary-stat-label">étoiles gagnées</span>
                    </div>
                    <div class="summary-stat">
                        <span class="summary-stat-icon">✅</span>
                        <span class="summary-stat-value">${this.totalExercises}</span>
                        <span class="summary-stat-label">exercices</span>
                    </div>
                    <div class="summary-stat">
                        <span class="summary-stat-icon">🔥</span>
                        <span class="summary-stat-value">${this.bestStreak}</span>
                        <span class="summary-stat-label">meilleure série</span>
                    </div>
                </div>

                <div class="summary-actions">
                    ${canLevelUp ? `
                        <button class="btn btn-primary btn-lg" id="level-up-btn">
                            Niveau suivant 🚀
                        </button>
                    ` : `
                        <button class="btn btn-success btn-lg" id="level-up-btn">
                            🏆 Niveau Maximum !
                        </button>
                    `}
                    <button class="btn btn-outline" id="restart-btn">
                        🔄 Recommencer niveau ${this.difficulty}
                    </button>
                    <button class="btn btn-outline" id="progress-btn">
                        📊 Voir mes progrès
                    </button>
                    <button class="btn btn-outline" id="home-btn">
                        🏠 Accueil
                    </button>
                </div>
            </div>
        `;

        this.feedback?.triggerConfetti();
        this.app.audio?.playSuccess();
        this.saveSessionToHistory();

        // Niveau suivant
        document.getElementById('level-up-btn')?.addEventListener('click', () => {
            if (canLevelUp) {
                this.difficulty = Math.min(this.difficulty + 1, maxDifficulty);
            }
            this.restartSession();
        });

        // Recommencer même niveau
        document.getElementById('restart-btn')?.addEventListener('click', () => {
            this.restartSession();
        });

        document.getElementById('progress-btn')?.addEventListener('click', () => {
            this.app.router.navigate('progress');
        });

        document.getElementById('home-btn')?.addEventListener('click', () => {
            this.app.router.navigate('home');
        });
    }

    restartSession() {
        // Reset session state
        this.exerciseIndex = 0;
        this.streak = 0;
        this.errorsInRow = 0;

        // Re-render the exercise page
        const appMain = document.querySelector('.app-main');
        if (appMain) {
            appMain.innerHTML = this.render();
            this.init();
        }
    }

    saveSessionToHistory() {
        const currentChild = this.app?.state?.get('currentChild');
        if (!currentChild) return;

        const session = {
            id: `session_${Date.now()}`,
            childId: currentChild.id,
            domain: this.domain,
            exerciseCount: this.totalExercises,
            starsEarned: this.totalExercises * CONFIG.STARS_PER_EXERCISE,
            bestStreak: this.streak,
            completedAt: new Date().toISOString(),
        };

        const sessions = this.app.storage.get('sessions') || [];
        sessions.unshift(session);

        if (sessions.length > CONFIG.LIMITS.MAX_SESSIONS_STORED) {
            sessions.length = CONFIG.LIMITS.MAX_SESSIONS_STORED;
        }

        this.app.storage.set('sessions', sessions);
    }

    getPhaseLabel() {
        switch (this.currentPhase) {
            case 'concrete': return 'Manipuler';
            case 'pictorial': return 'Visualiser';
            case 'abstract': return 'Calculer';
            default: return '';
        }
    }

    readQuestion() {
        if (!this.currentExercise) return;

        const text = this.currentExercise.questionText || this.currentExercise.question || 'Question';

        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
        }
    }

    showMascot(message) {
        const mascotContainer = document.getElementById('mascot-container');
        const mascotBubble = document.getElementById('mascot-bubble');
        const mascotMessage = document.getElementById('mascot-message');

        if (mascotContainer && mascotBubble && mascotMessage) {
            mascotMessage.textContent = message;
            mascotContainer.hidden = false;
            mascotBubble.hidden = false;
            mascotBubble.classList.add('bounce');

            setTimeout(() => {
                mascotBubble.classList.remove('bounce');
                mascotBubble.hidden = true;
            }, 3000);
        }
    }

    destroy() {
        if (this.voiceInput) this.voiceInput.stop();
        if (this.validator) this.validator.destroy();
        if (this.micButton) this.micButton.destroy();
        if (this.answerDisplay) this.answerDisplay.destroy();
        if (this.keyboard) this.keyboard.destroy();
    }
}
