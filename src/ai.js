import { handleEyeMovement } from "./main";

const stateElem = document.getElementById("state")
const errorElem = document.getElementById("error")
// console.error = (data) => errorElem && (errorElem.innerText = data)
// console.log = (data) => stateElem && (stateElem.innerText = data)
const log = (data) => stateElem && (stateElem.innerText = data)

async function loadWebGazer() {
    return new Promise((resolve, reject) => {
        if (window.webgazer) {
            resolve(window.webgazer);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://webgazer.cs.brown.edu/webgazer.js";
        script.async = true;
        script.onload = () => resolve(window.webgazer);
        script.onerror = () => reject(new Error("Failed to load WebGazer.js"));
        document.head.appendChild(script);
    });
}

async function startTracking() {
    log("Loading Model...");
    const webgazer = await loadWebGazer();

    log("Initializing WebGazer...");
    webgazer.setRegression("ridge")
        .setTracker("TFFacemesh")
        .setGazeListener((data, timestamp) => {
            if (data) {
                handleEyeMovement(data.x, data.y);
            }
        })
        .begin();

    // Hide video preview and prediction points
    webgazer.showVideoPreview(false).showPredictionPoints(false);
}

startTracking();