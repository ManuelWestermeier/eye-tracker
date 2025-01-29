import './css/style.css';
import './ai.js'

const stateElem = document.getElementById("state")
const errorElem = document.getElementById("error")
const textElem = document.getElementById("text")
const editView = document.getElementById("edit-view");
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = editView.getContext("2d");

const keyLayout = [
    ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
    ["Ctrl", "Alt", "Space", "Alt", "Ctrl"]
];

function drawCanvasLayout() {
    ctx.clearRect(0, 0, editView.width, editView.height);
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let xOffset = 10, yOffset = 10, keyWidth = 50, keyHeight = 50, spacing = 5;

    for (let row = 0; row < keyLayout.length; row++) {
        let x = xOffset;
        for (let col = 0; col < keyLayout[row].length; col++) {
            let key = keyLayout[row][col];
            let width = (key === "Backspace" || key === "Enter" || key === "Shift") ? keyWidth * 1.5 :
                (key === "Space" ? keyWidth * 5 : keyWidth);

            ctx.fillStyle = "#ddd";
            ctx.fillRect(x, yOffset, width, keyHeight);
            ctx.strokeStyle = "#000";
            ctx.strokeRect(x, yOffset, width, keyHeight);

            ctx.fillStyle = "#000";
            ctx.fillText(key, x + width / 2, yOffset + keyHeight / 2);
            x += width + spacing;
        }
        yOffset += keyHeight + spacing;
    }
}

drawCanvasLayout();

export function handleEyeMovement(x, y) {
    drawCanvasLayout()
    stateElem.innerText = `${x};${y}`
    ctx.fillRect(x, y, 100, 100);
}

function resizeCanvas() {
    editView.width = window.innerWidth;
    editView.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
