/* ==========================================
   LUDO ROYALE
   Application Controller
   Version 1.0
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

        modal.addEventListener("click", (event) => {

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
                        <small>Advanced strategic opponents.</small>
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
                You will play as Blue. Other players will
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
                    alert("Please leave at least one computer opponent.");
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
                Blue Advantage is an optional experimental
                mode that changes the game's probabilities.
                All players should agree before using it.
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

    console.log(
        "Selected match configuration:",
        this.state
    );

    const appRoot = document.getElementById("app");
    const mainScreen = document.getElementById("mainScreen");

    if (!window.LudoGameScreen || !window.LudoBoard) {
        alert("Game files could not be loaded. Please refresh the page.");
        return;
    }

    // Hide the main menu
    mainScreen.style.display = "none";

    // Create the game screen
    const gameScreen = LudoGameScreen.create(this.state);

    appRoot.appendChild(gameScreen);

    // Connect the dice engine
const diceButton = gameScreen.querySelector("#rollDice");
const diceInformation = gameScreen.querySelector("#diceInformation");

diceButton.addEventListener("click", async () => {

    const result = await LudoDice.animate(diceButton);

    if (result === null) {
        return;
    }

    diceInformation.textContent =
        `You rolled a ${result}!`;

    console.log("Dice result:", result);

 });

    // Return to main menu
    document.getElementById("backToMenu")
        .addEventListener("click", () => {

            gameScreen.remove();

            mainScreen.style.display = "";

        });

    // Open game settings
    document.getElementById("gameSettings")
        .addEventListener("click", () => {

            this.showSettings();

        });

    // Restart board display
    document.getElementById("restartGame")
        .addEventListener("click", () => {

            LudoBoard.render(board);

            alert("The board has been reset.");

        });

    // Temporary help information
    document.getElementById("gameHelp")
        .addEventListener("click", () => {

            alert(
                "LUDO ROYALE\n\n" +
                "Roll the dice and move your tokens.\n" +
                "The playable rules and movement system " +
                "will be connected in the next stages."
            );

        });

    console.log("Ludo Royale game screen opened successfully.");

    }

};

document.addEventListener("DOMContentLoaded", () => {
    App.init();
});
