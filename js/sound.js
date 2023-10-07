import soundFile from "../static/audio/minecraft_click.mp3"

class Sound {
    inputs = {
        xInputs: document.getElementsByName("x"),
        rInputs: document.getElementsByClassName("r"),
        submit: document.getElementsByClassName("submit-button"),
        paginationButtons: document.getElementsByClassName("pagination-button")
    }
    sound = new Audio(soundFile);

    constructor() {
        this.addEventListeners();
    }

    updateButtons() {
        this.paginationButtons = document.getElementsByClassName("pagination-button")
        this.addEventListeners()
    }

    addEventListeners() {
        for (let [key, value] of Object.entries(this.inputs)) {
            for (let input of value) {
                input.addEventListener("click", this.playSound.bind(this));
            }
        }
    }

    playSound() {
        this.sound.play();
    }
}

export const sound = new Sound();