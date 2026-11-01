/* ==========================================
   LUDO ROYALE
   Token Movement Engine
========================================== */

window.LudoMovement = {

    // Get the board cell where a token belongs
    getTokenCell(color, progress, board) {

        // Token is still inside its base
        if (progress === -1) {

            return board.querySelector(
                `.token-slot[data-color="${color}"]`
            );

        }

        // Token is moving around the main track
        if (progress >= 0 && progress <= 51) {

            const globalPosition =
                LudoRules.getGlobalPosition(color, progress);

            return board.querySelector(
                `[data-track-index="${globalPosition}"]`
            );

        }

        // Token has entered its coloured home path
        if (progress >= 52 && progress <= 57) {

            const homeIndex = progress - 52;

            return board.querySelector(
                `[data-home-color="${color}"][data-home-index="${homeIndex}"]`
            );

        }

        return null;

    },

    // Create a token button
    createToken(color, tokenIndex) {

        const token = document.createElement("button");

        token.type = "button";

        token.className = `ludo-token ${color}`;

        token.dataset.color = color;
        token.dataset.tokenIndex = tokenIndex;

        token.setAttribute(
            "aria-label",
            `${color} token ${tokenIndex + 1}`
        );

        return token;

    },

    // Display every player's tokens
    render(state, board) {

        if (!state || !board) {
            console.error("Unable to render tokens.");
            return;
        }

        board.querySelectorAll(".ludo-token").forEach(token => {
            token.remove();
        });

        state.colors.forEach(color => {

            state.tokens[color].forEach((progress, index) => {

                const cell = this.getTokenCell(
                    color,
                    progress,
                    board
                );

                if (!cell) {
                    console.error(
                        "Token position not found:",
                        color,
                        progress
                    );
                    return;
                }

                const token = this.createToken(color, index);

                cell.appendChild(token);

            });

        });

    },

    // Move a selected token
    move(state, color, tokenIndex, diceValue) {

        const result = LudoRules.applyMove(
            state,
            color,
            tokenIndex,
            diceValue
        );

        if (!result.success) {
            return result;
        }

        return result;

    },

    // Check whether a player has any legal moves
    getAvailableMoves(state, diceValue) {

        const color = state.currentPlayer;

        return LudoRules.getLegalMoves(
            state.tokens[color],
            diceValue
        );

    }

};
