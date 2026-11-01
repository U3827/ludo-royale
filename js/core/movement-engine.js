/* ==========================================
   LUDO ROYALE
   Board Generation System
========================================== */

window.LudoBoard = {

    // The 52 shared positions on the Ludo track
    track: [
        [6,1], [6,2], [6,3], [6,4], [6,5],
        [5,6], [4,6], [3,6], [2,6], [1,6],
        [0,6], [0,7], [0,8], [1,8], [2,8],
        [3,8], [4,8], [5,8], [6,9], [6,10],
        [6,11], [6,12], [6,13], [6,14],
        [7,14], [8,14], [8,13], [8,12],
        [8,11], [8,10], [8,9], [9,8],
        [10,8], [11,8], [12,8], [13,8],
        [14,8], [14,7], [14,6], [13,6],
        [12,6], [11,6], [10,6], [9,6],
        [8,5], [8,4], [8,3], [8,2],
        [8,1], [8,0], [7,0], [6,0]
    ],

    // Safe positions on the shared track
    safePositions: [0, 8, 13, 21, 26, 34, 39, 47],

    // Each player's six home-path positions
    homePaths: {
        red: [
            [7,1], [7,2], [7,3],
            [7,4], [7,5], [7,6]
        ],

        green: [
            [1,7], [2,7], [3,7],
            [4,7], [5,7], [6,7]
        ],

        yellow: [
            [7,13], [7,12], [7,11],
            [7,10], [7,9], [7,8]
        ],

        blue: [
            [13,7], [12,7], [11,7],
            [10,7], [9,7], [8,7]
        ]
    },

    // Home-base positions
    bases: {
        red: { row: 1, col: 1 },
        green: { row: 1, col: 10 },
        yellow: { row: 10, col: 10 },
        blue: { row: 10, col: 1 }
    },

    createCell(row, col, className = "") {

        const cell = document.createElement("div");

        cell.className = `board-cell ${className}`.trim();

        cell.style.gridRow = row + 1;
        cell.style.gridColumn = col + 1;

        cell.dataset.row = row;
        cell.dataset.col = col;

        return cell;
    },

    createBase(color, position) {

        const base = document.createElement("div");

        base.className = `home-base ${color}`;

        base.style.gridRow = `${position.row} / span 6`;
        base.style.gridColumn = `${position.col} / span 6`;

        const inner = document.createElement("div");

        inner.className = "home-inner";

        for (let i = 0; i < 4; i++) {

            const slot = document.createElement("div");

            slot.className = "token-slot";

            slot.dataset.color = color;
            slot.dataset.slot = i;

            inner.appendChild(slot);
        }

        base.appendChild(inner);

        return base;
    },

    createCenter() {

        const center = document.createElement("div");

        center.className = "board-center";

        center.style.gridRow = "7 / span 3";
        center.style.gridColumn = "7 / span 3";

        ["red", "green", "yellow", "blue"].forEach(color => {

            const triangle = document.createElement("div");

            triangle.className = `center-triangle ${color}`;

            center.appendChild(triangle);
        });

        const logo = document.createElement("div");

        logo.className = "center-logo";
        logo.textContent = "LR";

        center.appendChild(logo);

        return center;
    },

    render(container) {

        if (!container) {
            console.error("Ludo board container was not found.");
            return;
        }

        container.innerHTML = "";

        container.className = "ludo-board";

        // Create the four home bases
        Object.entries(this.bases).forEach(([color, position]) => {

            container.appendChild(
                this.createBase(color, position)
            );

        });

        // Create the shared track
        this.track.forEach((position, index) => {

            const [row, col] = position;

            const isSafe = this.safePositions.includes(index);

            const cell = this.createCell(
                row,
                col,
                isSafe ? "track safe" : "track"
            );

            cell.dataset.trackIndex = index;

            if (index === 0) cell.dataset.start = "red";
            if (index === 13) cell.dataset.start = "green";
            if (index === 26) cell.dataset.start = "yellow";
            if (index === 39) cell.dataset.start = "blue";

            container.appendChild(cell);

        });

        // Create the four coloured home paths
        Object.entries(this.homePaths).forEach(([color, path]) => {

            path.forEach((position, index) => {

                const [row, col] = position;

                const cell = this.createCell(
                    row,
                    col,
                    `home-path ${color}`
                );

                cell.dataset.homeColor = color;
                cell.dataset.homeIndex = index;

                container.appendChild(cell);

            });

        });

        // Create the central finishing area
        container.appendChild(this.createCenter());

        console.log("Ludo Royale board created successfully.");
        console.log("Shared track positions:", this.track.length);

    }

};
