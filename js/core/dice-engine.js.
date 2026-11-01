/* ==========================================
   LUDO ROYALE
   Dice Engine
========================================== */

window.LudoDice = {

    faces: {
        1: "⚀",
        2: "⚁",
        3: "⚂",
        4: "⚃",
        5: "⚄",
        6: "⚅"
    },

    isRolling: false,

    roll() {

        // Generate a random number from 1 to 6
        if (window.crypto && window.crypto.getRandomValues) {

            const values = new Uint32Array(1);

            const limit = Math.floor(
                4294967296 / 6
            ) * 6;

            do {
                window.crypto.getRandomValues(values);
            } while (values[0] >= limit);

            return (values[0] % 6) + 1;

        }

        return Math.floor(Math.random() * 6) + 1;

    },

    async animate(button) {

        if (this.isRolling || !button) {
            return null;
        }

        this.isRolling = true;

        button.disabled = true;
        button.classList.add("rolling");

        const originalFace = button.textContent;

        // Display changing dice faces during animation
        for (let i = 0; i < 8; i++) {

            const temporaryNumber =
                Math.floor(Math.random() * 6) + 1;

            button.textContent =
                this.faces[temporaryNumber];

            await new Promise(resolve =>
                setTimeout(resolve, 65)
            );

        }

        const result = this.roll();

        button.textContent = this.faces[result];

        button.classList.remove("rolling");

        button.disabled = false;

        this.isRolling = false;

        return result;

    }

};
