import './css/style.css';
import * as faceapi from 'face-api.js';

const stateElem = document.getElementById("state");
const errorElem = document.getElementById("error");

async function loadModels() {
  try {
    stateElem.innerText = "Loading models...";
    // Ensure correct path to your cloned models directory
    await faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/refs/heads/master/tiny_face_detector/');
    await faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/refs/heads/master/face_landmark_68/');

    stateElem.innerText = "Models loaded successfully.";
  } catch (err) {
    errorElem.innerText = ("Error loading models:", err);
  }
}

async function initFaceDetection() {
  await loadModels(); // Ensure models are loaded before starting detection

  const video = document.createElement('video');
  video.autoplay = true;
  video.style.width = '640px';
  video.style.height = '480px';
  document.body.appendChild(video);

  try {
    // Get webcam stream
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    // Wait until the video metadata is loaded
    video.addEventListener('loadedmetadata', () => {
      video.play();

      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);

      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      // Start detecting on video playback
      video.addEventListener('play', async () => {
        stateElem.innerText = ("Starting detection...");
        requestAnimationFrame(async function update() {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();

          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

          // Log coordinates of the eyes
          if (resizedDetections.length > 0) {
            resizedDetections.forEach(detection => {
              const landmarks = detection.landmarks;
              const leftEye = landmarks.getLeftEye();
              const rightEye = landmarks.getRightEye();

              console.log([leftEye, rightEye]);
            });
          }

          requestAnimationFrame(update);
        });
      });
    });
  } catch (err) {
    errorElem.innerText = ("Error accessing webcam:", err);
  }
}

// Initialize the app
initFaceDetection();
