/* ==========================================
   LUDO ROYALE
   Game Screen Interface
========================================== */

window.LudoGameScreen = {

    colors: ["red", "green", "yellow", "blue"],

    create(config = {}) {

        const screen = document.createElement("section");

        screen.className = "game-screen";
        screen.id = "gameScreen";

        const totalPlayers = Number(config.players) || 2;

        const players = this.colors.slice(0, totalPlayers);

        screen.innerHTML = `

            <header class="game-header">

                <button
                    class="back-button"
                    id="backToMenu"
                    type="button"
                >
                    ← Menu
                </button>

                <div class="game-title">
                    LUDO <span>ROYALE</span>
                </div>

                <button
                    class="game-action-button"
                    id="gameSettings"
                    type="button"
                >
                    ⚙
                </button>

            </header>

            <div class="player-status" id="playerStatus">

                ${players.map((color, index) => `

                    <div
                        class="player-status-card ${index === 0 ? "active-player" : ""}"
                        data-player="${color}"
                    >

                        <span class="player-color ${color}"></span>

                        <div class="player-info">

                            <strong>
                                ${color.charAt(0).toUpperCase() + color.slice(1)}
                                Player
                            </strong>

                            <small>
                                ${index === 0 ? "Your turn" : "Waiting"}
                            </small>

                        </div>

                    </div>

                `).join("")}

            </div>

            <div class="board-container">

                <div
                    class="ludo-board"
                    id="ludoBoard"
                ></div>

            </div>

            <div class="dice-panel">

                <div class="dice-information">

                    <strong id="turnInformation">
                        Red Player's Turn
                    </strong>

                    <small id="diceInformation">
                        Roll the dice to begin.
                    </small>

                </div>

                <button
                    class="dice-button"
                    id="rollDice"
                    type="button"
                    aria-label="Roll dice"
                >
                    🎲
                </button>

            </div>

            <div class="game-controls">

                <button
                    id="restartGame"
                    type="button"
                >
                    ↻ Restart
                </button>

                <button
                    id="gameHelp"
                    type="button"
                >
                    ? How to Play
                </button>

            </div>

        `;

        return screen;

    }

};
