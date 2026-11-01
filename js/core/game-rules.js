/* ==========================================
   LUDO ROYALE
   Official Game Rules Engine
========================================== */

window.LudoRules = {

    START_POSITIONS: {
        red: 0,
        green: 13,
        yellow: 26,
        blue: 39
    },

    BASE: -1,
    FINISHED: 58,
    FINAL_STEP: 57,

    // Find a player's position on the shared track
    getGlobalPosition(color, progress) {

        if (progress < 0 || progress > 51) {
            return null;
        }

        const start = this.START_POSITIONS[color];

        if (start === undefined) {
            return null;
        }

        return (start + progress) % 52;

    },

    // Check whether a token can move
    canMove(progress, diceValue) {

        if (
            !Number.isInteger(diceValue) ||
            diceValue < 1 ||
            diceValue > 6
        ) {
            return false;
        }

        // A token needs a six to leave its base
        if (progress === this.BASE) {
            return diceValue === 6;
        }

        // Finished tokens cannot move
        if (
            progress < 0 ||
            progress >= this.FINISHED
        ) {
            return false;
        }

        // A token cannot move beyond the finish
        return progress + diceValue <= this.FINAL_STEP;

    },

    // Get all legal token movements
    getLegalMoves(tokens, diceValue) {

        if (!Array.isArray(tokens)) {
            return [];
        }

        return tokens
            .map((progress, tokenIndex) => ({
                tokenIndex,
                progress,
                canMove: this.canMove(progress, diceValue)
            }))
            .filter(token => token.canMove);

    },

    // Calculate the next position
    calculateMovement(progress, diceValue) {

        if (!this.canMove(progress, diceValue)) {
            return null;
        }

        if (progress === this.BASE) {
            return 0;
        }

        return progress + diceValue;

    },

    // Check whether a shared track square is safe
    isSafePosition(globalPosition) {

        return LudoBoard.safePositions.includes(
            globalPosition
        );

    },

    // Find opposing tokens that can be captured
    getCaptures(state, movingColor, destination) {

        if (
            destination < 0 ||
            destination > 51
        ) {
            return [];
        }

        const globalPosition = this.getGlobalPosition(
            movingColor,
            destination
        );

        if (
            globalPosition === null ||
            this.isSafePosition(globalPosition)
        ) {
            return [];
        }

        const captures = [];

        Object.entries(state.tokens).forEach(
            ([color, tokens]) => {

                if (color === movingColor) {
                    return;
                }

                tokens.forEach((progress, tokenIndex) => {

                    if (progress < 0 || progress > 51) {
                        return;
                    }

                    const opponentPosition =
                        this.getGlobalPosition(color, progress);

                    if (
                        opponentPosition === globalPosition
                    ) {

                        captures.push({
                            color,
                            tokenIndex
                        });

                    }

                });

            }
        );

        return captures;

    },

    // Apply a legal movement to the game state
    applyMove(state, color, tokenIndex, diceValue) {

        const tokens = state.tokens[color];

        if (
            !Array.isArray(tokens) ||
            !Number.isInteger(tokenIndex) ||
            tokenIndex < 0 ||
            tokenIndex >= tokens.length
        ) {
            return {
                success: false,
                message: "Invalid token."
            };
        }

        const currentPosition = tokens[tokenIndex];

        const destination = this.calculateMovement(
            currentPosition,
            diceValue
        );

        if (destination === null) {

            return {
                success: false,
                message: "This token cannot move."
            };

        }

        // Create a separate state so the original is not mutated
        const nextState = JSON.parse(
            JSON.stringify(state)
        );

        nextState.tokens[color][tokenIndex] = destination;

        const captures = this.getCaptures(
            state,
            color,
            destination
        );

        // Return captured tokens to their bases
        captures.forEach(capture => {

            nextState.tokens[capture.color][capture.tokenIndex] =
                this.BASE;

        });

        return {
            success: true,
            state: nextState,
            destination,
            captures,
            finished: destination === this.FINAL_STEP
        };

    },

    // Check whether a player has won
    hasWon(tokens) {

        return (
            Array.isArray(tokens) &&
            tokens.length === 4 &&
            tokens.every(
                position => position === this.FINAL_STEP
            )
        );

    }

};
