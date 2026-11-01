/* ==========================================
   LUDO ROYALE
   Application Controller
   Version 2.0
========================================== */

"use strict";

const App = {

    state: {
        mode: null,
        difficulty: "medium",
        players: 2,
        humanPlayers: 1,
        blueAdvantage: false,
        sound: true
    },

    init() {

        this.bindEvents();
        this.createModal();

        console.log("LUDO ROYALE initialized successfully.");

    },

    bindEvents() {

        document.getElementById("playComputer")
            .addEventListener("click", () => {
                this.selectMode("computer");
            });

        document.getElementById("localMultiplayer")
            .addEventListener("click", () => {
                this.selectMode("local");
            });

        document.getElementById("mixedMode")
            .addEventListener("click", () => {
                this.selectMode("mixed");
            });

        document.getElementById("settingsButton")
            .addEventListener("click", () => {
                this.showSettings();
            });

    },

    createModal() {

        const modal = document.createElement("div");

        modal.id = "gameModal";
        modal.className = "game-modal";

        modal.innerHTML = `
            <div class="modal-content">

                <button class="modal-close"
                        id="closeModal"
                        aria-label="Close">×</button>

                <div id="modalBody"></div>

            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                this.closeModal();
            }

        });

        document.getElementById("closeModal")
            .addEventListener("click", () => {
                this.closeModal();
            });

    },

    openModal(content) {

        document.getElementById("modalBody").innerHTML = content;

        document.getElementById("gameModal")
            .classList.add("active");

        document.body.style.overflow = "hidden";

    },

    closeModal() {

        document.getElementById("gameModal")
            .classList.remove("active");

        document.body.style.overflow = "";

    },

    selectMode(mode) {

        this.state.mode = mode;

        if (mode === "computer") {
            this.showDifficulty();
        }

        else if (mode === "local") {
            this.showLocalPlayers();
        }

        else if (mode === "mixed") {
            this.showMixedPlayers();
        }

    },

    showDifficulty() {

        this.openModal(`

            <div class="modal-heading">

                <span class="modal-icon">🤖</span>

                <h2>Choose Your Challenge</h2>

                <p>Select your opponent's intelligence.</p>

            </div>

            <div class="choice-list">

                <button class="choice-button"
                        data-difficulty="easy">

                    <span>🟢</span>

                    <div>
                        <strong>Easy</strong>
                        <small>Relaxed gameplay for beginners.</small>
                    </div>

                    <span>›</span>

                </button>

                <button class="choice-button selected"
                        data-difficulty="medium">

                    <span>🟡</span>

                    <div>
                        <strong>Medium</strong>
                        <small>Balanced strategic gameplay.</small>
                    </div>

                    <span>›</span>

                </button>

                <button class="choice-button"
                        data-difficulty="hard">

                    <span>🔴</span>

                    <div>
                        <strong>Hard</strong>
                        <small>More strategic computer opponents.</small>
                    </div>

                    <span>›</span>

                </button>

            </div>

            <button class="primary-button"
                    id="continueGame">

                CONTINUE →

            </button>

        `);

        document.querySelectorAll("[data-difficulty]")
            .forEach(button => {

                button.addEventListener("click", () => {

                    document.querySelectorAll("[data-difficulty]")
                        .forEach(item => {
                            item.classList.remove("selected");
                        });

                    button.classList.add("selected");

                    this.state.difficulty =
                        button.dataset.difficulty;

                });

            });

        document.getElementById("continueGame")
            .addEventListener("click", () => {
                this.showComputerPlayers();
            });

    },

    showComputerPlayers() {

        this.openModal(`

            <div class="modal-heading">

                <span class="modal-icon">🎮</span>

                <h2>Match Configuration</h2>

                <p>Choose how many players will compete.</p>

            </div>

            <div class="player-options">

                ${[2, 3, 4].map(number => `

                    <button class="player-option
                        ${this.state.players === number ? "selected" : ""}"
                        data-players="${number}">

                        ${number} Players

                    </button>

                `).join("")}

            </div>

            <div class="setting-note">
                You will play as Red. Other players will
                be controlled by the computer.
            </div>

            <button class="primary-button"
                    id="startMatch">

                START MATCH →

            </button>

        `);

        this.bindPlayerOptions();

        document.getElementById("startMatch")
            .addEventListener("click", () => {
                this.prepareGame();
            });

    },

    showLocalPlayers() {

        this.openModal(`

            <div class="modal-heading">

                <span class="modal-icon">👥</span>

                <h2>Local Multiplayer</h2>

                <p>Choose the number of human players.</p>

            </div>

            <div class="player-options">

                ${[2, 3, 4].map(number => `

                    <button class="player-option
                        ${this.state.players === number ? "selected" : ""}"
                        data-players="${number}">

                        ${number} Players

                    </button>

                `).join("")}

            </div>

            <div class="setting-note">
                All selected players will control their
                own tokens on this device.
            </div>

            <button class="primary-button"
                    id="startMatch">

                START MATCH →

            </button>

        `);

        this.bindPlayerOptions();

        document.getElementById("startMatch")
            .addEventListener("click", () => {
                this.prepareGame();
            });

    },

    showMixedPlayers() {

        this.openModal(`

            <div class="modal-heading">

                <span class="modal-icon">🎯</span>

                <h2>Mixed Multiplayer</h2>

                <p>Combine human players and computer opponents.</p>

            </div>

            <label class="input-label">
                Human Players
            </label>

            <select id="humanCount" class="game-select">

                <option value="1">1 Human</option>
                <option value="2" selected>2 Humans</option>
                <option value="3">3 Humans</option>

            </select>

            <label class="input-label">
                Total Players
            </label>

            <select id="totalCount" class="game-select">

                <option value="2">2 Players</option>
                <option value="3">3 Players</option>
                <option value="4" selected>4 Players</option>

            </select>

            <button class="primary-button"
                    id="startMixed">

                CONTINUE →

            </button>

        `);

        document.getElementById("startMixed")
            .addEventListener("click", () => {

                const humans =
                    Number(document.getElementById("humanCount").value);

                const total =
                    Number(document.getElementById("totalCount").value);

                if (humans >= total) {

                    alert(
                        "Please leave at least one computer opponent."
                    );

                    return;

                }

                this.state.humanPlayers = humans;
                this.state.players = total;

                this.prepareGame();

            });

    },

    bindPlayerOptions() {

        document.querySelectorAll("[data-players]")
            .forEach(button => {

                button.addEventListener("click", () => {

                    document.querySelectorAll("[data-players]")
                        .forEach(item => {
                            item.classList.remove("selected");
                        });

                    button.classList.add("selected");

                    this.state.players =
                        Number(button.dataset.players);

                });

            });

    },

    showSettings() {

        this.openModal(`

            <div class="modal-heading">

                <span class="modal-icon">⚙️</span>

                <h2>Game Settings</h2>

                <p>Customise your gaming experience.</p>

            </div>

            <div class="settings-row">

                <span>Sound Effects</span>

                <input type="checkbox"
                       id="soundSetting"
                       ${this.state.sound ? "checked" : ""}>

            </div>

            <div class="settings-row">

                <span>Blue Advantage Mode</span>

                <input type="checkbox"
                       id="blueSetting"
                       ${this.state.blueAdvantage ? "checked" : ""}>

            </div>

            <p class="setting-note">
                Blue Advantage is an experimental option.
                Its gameplay effect will be implemented separately.
            </p>

            <button class="primary-button"
                    id="saveSettings">

                SAVE SETTINGS

            </button>

        `);

        document.getElementById("saveSettings")
            .addEventListener("click", () => {

                this.state.sound =
                    document.getElementById("soundSetting").checked;

                this.state.blueAdvantage =
                    document.getElementById("blueSetting").checked;

                this.closeModal();

            });

    },

    prepareGame() {

        this.closeModal();

        const appRoot = document.getElementById("app");
        const mainScreen = document.getElementById("mainScreen");

        if (
            !window.LudoGameScreen ||
            !window.LudoBoard ||
            !window.LudoState ||
            !window.LudoRules ||
            !window.LudoMovement ||
            !window.LudoDice
        ) {

            alert(
                "Some game files could not be loaded. Please refresh."
            );

            return;

        }

        mainScreen.style.display = "none";

        const gameScreen = LudoGameScreen.create(this.state);

        appRoot.appendChild(gameScreen);

        let matchState = LudoState.create(this.state);

        gameScreen.gameState = matchState;

        const board = gameScreen.querySelector("#ludoBoard");

        const diceButton = gameScreen.querySelector("#rollDice");

        const diceInformation =
            gameScreen.querySelector("#diceInformation");

        const turnInformation =
            gameScreen.querySelector("#turnInformation");

        let isProcessingMove = false;
        let computerTimer = null;

        LudoBoard.render(board);

        // ==================================
        // UPDATE GAME DISPLAY
        // ==================================

        function refreshGame() {

            LudoMovement.render(matchState, board);

            matchState.colors.forEach(color => {

                const player = matchState.players[color];

                const card = gameScreen.querySelector(
                    `[data-player="${color}"]`
                );

                if (!card) return;

                card.querySelector("strong").textContent =
                    player.name;

                card.querySelector("small").textContent =
                    player.type === "computer"
                        ? "Computer"
                        : "Human Player";

                card.classList.toggle(
                    "active-player",
                    color === matchState.currentPlayer
                );

            });

            const currentPlayer =
                matchState.players[matchState.currentPlayer];

            turnInformation.textContent =
                `${currentPlayer.name}'s Turn`;

            gameScreen.gameState = matchState;

        }

        function showMessage(message) {

            diceInformation.textContent = message;

        }

        // ==================================
        // COMPUTER DECISION SYSTEM
        // ==================================

        function chooseComputerMove(moves, color) {

            const difficulty = matchState.difficulty;

            if (difficulty === "easy") {

                return moves[
                    Math.floor(Math.random() * moves.length)
                ];

            }

            let bestMove = moves[0];
            let bestScore = -Infinity;

            moves.forEach(move => {

                const destination =
                    LudoRules.calculateMovement(
                        move.progress,
                        matchState.diceValue
                    );

                let score = Math.random() * 3;

                // Reward leaving the base
                if (move.progress === -1) {
                    score += 15;
                }

                // Reward reaching the finish
                if (destination === 57) {
                    score += 100;
                }

                // Reward capturing opponents
                const captures = LudoRules.getCaptures(
                    matchState,
                    color,
                    destination
                );

                score += captures.length *
                    (difficulty === "hard" ? 35 : 20);

                // Reward safe positions
                if (destination >= 0 && destination <= 51) {

                    const globalPosition =
                        LudoRules.getGlobalPosition(
                            color,
                            destination
                        );

                    if (
                        LudoRules.isSafePosition(globalPosition)
                    ) {

                        score +=
                            difficulty === "hard" ? 15 : 8;

                    }

                }

                if (score > bestScore) {

                    bestScore = score;
                    bestMove = move;

                }

            });

            return bestMove;

        }

        // ==================================
        // COMPUTER TURN SCHEDULER
        // ==================================

        function scheduleComputerTurn() {

            clearTimeout(computerTimer);

            if (matchState.status !== "playing") {
                return;
            }

            const player =
                matchState.players[matchState.currentPlayer];

            if (player.type === "human") {

                diceButton.disabled = false;

                return;

            }

            diceButton.disabled = true;

            showMessage(`${player.name} is thinking...`);

            computerTimer = setTimeout(() => {

                rollForCurrentPlayer(true);

            }, 1000);

        }

        // ==================================
        // ROLL DICE
        // ==================================

        async function rollForCurrentPlayer(isComputer = false) {

            if (
                isProcessingMove ||
                matchState.status !== "playing" ||
                matchState.diceValue !== null
            ) {
                return;
            }

            isProcessingMove = true;

            diceButton.disabled = true;

            const result = await LudoDice.animate(diceButton);

            if (result === null) {

                isProcessingMove = false;

                scheduleComputerTurn();

                return;

            }

            const color = matchState.currentPlayer;

            matchState.diceValue = result;

            if (result === 6) {

                matchState.consecutiveSixes++;

            } else {

                matchState.consecutiveSixes = 0;

            }

            showMessage(
                `${color.toUpperCase()} rolled ${result}.`
            );

            // Three consecutive sixes
            if (matchState.consecutiveSixes >= 3) {

                showMessage(
                    "Three consecutive sixes! Turn lost."
                );

                matchState.consecutiveSixes = 0;

                matchState.diceValue = null;
                matchState.legalMoves = [];

                LudoState.nextTurn(matchState);

                refreshGame();

                isProcessingMove = false;

                scheduleComputerTurn();

                return;

            }

            // Identify legal token movements
            matchState.legalMoves =
                LudoMovement.getAvailableMoves(
                    matchState,
                    result
                );

            // No available movement
            if (matchState.legalMoves.length === 0) {

                matchState.diceValue = null;
                matchState.legalMoves = [];

                isProcessingMove = false;

                if (result === 6) {

                    showMessage(
                        "No legal moves, but six gives another roll."
                    );

                    diceButton.disabled = false;

                    return;

                }

                showMessage(
                    "No legal moves. Next player's turn."
                );

                matchState.consecutiveSixes = 0;

                LudoState.nextTurn(matchState);

                refreshGame();

                scheduleComputerTurn();

                return;

            }

            isProcessingMove = false;

            // Computer selects a token automatically
            if (isComputer) {

                const selectedMove = chooseComputerMove(
                    matchState.legalMoves,
                    color
                );

                showMessage(
                    `${color.toUpperCase()} is moving a token...`
                );

                computerTimer = setTimeout(() => {

                    completeTokenMove(
                        selectedMove.tokenIndex
                    );

                }, 800);

                return;

            }

                        // Highlight selectable human tokens
            refreshGame();

            matchState.legalMoves.forEach(move => {

                const token = board.querySelector(
                    `.ludo-token[data-color="${color}"]` +
                    `[data-token-index="${move.tokenIndex}"]`
                );

                if (token) {

                    token.style.outline = "3px solid white";
                    token.style.cursor = "pointer";

                }

            });

            diceButton.disabled = true;

            showMessage(
                "Select one of your highlighted tokens."
            );

        }


        // ==================================
        // COMPLETE TOKEN MOVEMENT
        // ==================================

        function completeTokenMove(tokenIndex) {

            if (
                isProcessingMove ||
                matchState.diceValue === null
            ) {
                return;
            }

            const color = matchState.currentPlayer;

            const selectedMove = matchState.legalMoves.find(
                move => move.tokenIndex === tokenIndex
            );

            if (!selectedMove) return;

            isProcessingMove = true;

            const rolledNumber = matchState.diceValue;

            const result = LudoMovement.move(
                matchState,
                color,
                tokenIndex,
                rolledNumber
            );

            if (!result.success) {

                isProcessingMove = false;
                showMessage(result.message);

                return;

            }

            Object.assign(matchState, result.state);

            LudoState.recordMove(matchState, {
                color,
                tokenIndex,
                diceValue: rolledNumber,
                destination: result.destination,
                captures: result.captures
            });

            const winner = LudoState.checkWinner(matchState);

            matchState.diceValue = null;
            matchState.legalMoves = [];

            refreshGame();

            if (winner) {

                showMessage(
                    `${winner.toUpperCase()} WINS LUDO ROYALE!`
                );

                diceButton.disabled = true;
                isProcessingMove = false;

                alert(`${winner.toUpperCase()} PLAYER WINS! 🏆`);

                return;

            }

            if (result.captures.length > 0) {

                showMessage(
                    `${result.captures.length} opponent token(s) captured!`
                );

            }

            if (rolledNumber === 6) {

                showMessage(
                    `${color.toUpperCase()} rolled six! Roll again.`
                );

            } else {

                matchState.consecutiveSixes = 0;

                LudoState.nextTurn(matchState);

            }

            refreshGame();

            isProcessingMove = false;

            scheduleComputerTurn();

        }


        // ==================================
        // TOKEN SELECTION
        // ==================================

        board.addEventListener("click", event => {

            const token = event.target.closest(".ludo-token");

            if (!token) return;

            if (
                matchState.status !== "playing" ||
                matchState.diceValue === null ||
                isProcessingMove
            ) {
                return;
            }

            const color = token.dataset.color;

            if (color !== matchState.currentPlayer) return;

            const currentPlayer =
                matchState.players[matchState.currentPlayer];

            if (currentPlayer.type === "computer") return;

            const tokenIndex =
                Number(token.dataset.tokenIndex);

            completeTokenMove(tokenIndex);

        });


        // ==================================
        // DICE BUTTON
        // ==================================

        diceButton.addEventListener("click", () => {

            rollForCurrentPlayer(false);

        });


        // ==================================
        // RETURN TO MAIN MENU
        // ==================================

        gameScreen.querySelector("#backToMenu")
            .addEventListener("click", () => {

                clearTimeout(computerTimer);

                gameScreen.remove();

                mainScreen.style.display = "";

            });


        // ==================================
        // GAME SETTINGS
        // ==================================

        gameScreen.querySelector("#gameSettings")
            .addEventListener("click", () => {

                this.showSettings();

            });


        // ==================================
        // RESTART MATCH
        // ==================================

        gameScreen.querySelector("#restartGame")
            .addEventListener("click", () => {

                if (!confirm("Are you sure you want to restart?")) {
                    return;
                }

                clearTimeout(computerTimer);

                matchState = LudoState.create(this.state);

                gameScreen.gameState = matchState;

                diceButton.disabled = false;
                diceButton.textContent = "🎲";

                isProcessingMove = false;

                LudoBoard.render(board);

                refreshGame();

                showMessage("New match started. Roll the dice.");

                scheduleComputerTurn();

            });


        // ==================================
        // GAME HELP
        // ==================================

        gameScreen.querySelector("#gameHelp")
            .addEventListener("click", () => {

                alert(
                    "LUDO ROYALE\n\n" +
                    "1. Roll a six to bring a token out of its base.\n" +
                    "2. Select a highlighted token to move it.\n" +
                    "3. Capture opponents on unprotected squares.\n" +
                    "4. Rolling six gives another roll.\n" +
                    "5. Three consecutive sixes lose the turn.\n" +
                    "6. Finish all four tokens to win."
                );

            });


        // ==================================
        // START MATCH
        // ==================================

        refreshGame();

        showMessage("Roll the dice to begin.");

        scheduleComputerTurn();

        console.log(
            "LUDO ROYALE match started:",
            matchState
        );

    }

};


// Initialise application
document.addEventListener("DOMContentLoaded", () => {

    App.init();

});
