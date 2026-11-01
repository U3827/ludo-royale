/* ==========================================
   LUDO ROYALE
   Token Display System
========================================== */

window.LudoTokens = {

    renderHomeTokens(state, board) {

        if (!state || !board) {
            console.error("Token rendering failed.");
            return;
        }

        // Clear existing tokens
        board.querySelectorAll(".ludo-token").forEach(token => {
            token.remove();
        });

        // Display four tokens for every active player
        state.colors.forEach(color => {

            const tokens = state.tokens[color];

            tokens.forEach((position, index) => {

                if (position !== -1) {
                    return;
                }

                const slot = board.querySelector(
                    `.token-slot[data-color="${color}"][data-slot="${index}"]`
                );

                if (!slot) {
                    console.error(
                        `Token slot missing: ${color} ${index}`
                    );
                    return;
                }

                const token = document.createElement("button");

                token.type = "button";

                token.className = `ludo-token ${color}`;

                token.dataset.color = color;
                token.dataset.tokenIndex = index;

                token.setAttribute(
                    "aria-label",
                    `${color} token ${index + 1}`
                );

                token.title =
                    `${color.charAt(0).toUpperCase() + color.slice(1)} token ${index + 1}`;

                slot.appendChild(token);

            });

        });

        console.log("Player tokens displayed successfully.");

    }

};
