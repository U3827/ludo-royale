/* ==========================================
   LUDO ROYALE
   Game State Engine
========================================== */

window.LudoState = {

    colors: ["red", "green", "yellow", "blue"],

    create(config = {}) {

        const totalPlayers = Math.min(
            4,
            Math.max(2, Number(config.players) || 2)
        );

        const colors = this.colors.slice(0, totalPlayers);

        const tokens = {};
        const players = {};

        colors.forEach((color, index) => {

            tokens[color] = [-1, -1, -1, -1];

            players[color] = {
                color,
                name: `${color.charAt(0).toUpperCase() + color.slice(1)} Player`,
                type: this.getPlayerType(config, index),
                finished: false
            };

        });

        return {

            id: this.createId(),

            mode: config.mode || "computer",

            difficulty: config.difficulty || "medium",

            blueAdvantage: Boolean(config.blueAdvantage),

            players,
            colors,
            tokens,

            currentPlayerIndex: 0,
            currentPlayer: colors[0],

            diceValue: null,
            legalMoves: [],

            consecutiveSixes: 0,

            status: "playing",
            winner: null,

            moveHistory: [],

            startedAt: Date.now(),
            lastUpdated: Date.now()

        };

    },

    getPlayerType(config, index) {

        const mode = config.mode || "computer";

        if (mode === "local") {
            return "human";
        }

        if (mode === "computer") {
            return index === 0 ? "human" : "computer";
        }

        if (mode === "mixed") {

            const humanPlayers = Math.max(
                1,
                Number(config.humanPlayers) || 1
            );

            return index < humanPlayers
                ? "human"
                : "computer";

        }

        return "human";

    },

    createId() {

        if (
            window.crypto &&
            typeof window.crypto.randomUUID === "function"
        ) {
            return window.crypto.randomUUID();
        }

        return (
            "ludo-" +
            Date.now().toString(36) +
            "-" +
            Math.random().toString(36).slice(2)
        );

    },

    getCurrentPlayer(state) {

        return state.players[state.currentPlayer];

    },

    getNextPlayer(state) {

        const nextIndex =
            (state.currentPlayerIndex + 1) %
            state.colors.length;

        return state.colors[nextIndex];

    },

    nextTurn(state) {

        if (state.status !== "playing") {
            return state;
        }

        const nextIndex =
            (state.currentPlayerIndex + 1) %
            state.colors.length;

        state.currentPlayerIndex = nextIndex;
        state.currentPlayer = state.colors[nextIndex];

        state.diceValue = null;
        state.legalMoves = [];

        state.lastUpdated = Date.now();

        return state;

    },

    recordMove(state, move) {

        state.moveHistory.push({
            ...move,
            timestamp: Date.now()
        });

        state.lastUpdated = Date.now();

    },

    checkWinner(state) {

        for (const color of state.colors) {

            if (LudoRules.hasWon(state.tokens[color])) {

                state.status = "finished";
                state.winner = color;

                state.players[color].finished = true;
                state.lastUpdated = Date.now();

                return color;

            }

        }

        return null;

    },

    reset(state) {

        return this.create({
            players: state.colors.length,
            mode: state.mode,
            difficulty: state.difficulty,

            humanPlayers: Object.values(state.players)
                .filter(player => player.type === "human")
                .length,

            blueAdvantage: state.blueAdvantage
        });

    }

};
