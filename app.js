document.body.classList.add("loading");

const video = document.querySelector('video');
const canvas = window.canvas = document.querySelector('canvas');
canvas.width = 320;
canvas.height = 180;

const constraints = {
  audio: false,
  video: { width: 320, height: 180 }
};

function onOpenCvReady() {
  document.body.classList.remove("loading");
}

function drawCircles() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  cv.imshow('imageCanvas', cv.imread(canvas));

  let mat = cv.imread('imageCanvas');
  let dst = mat.clone();
  let circles = new cv.Mat();
  cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);

  // You can try more different parameters
  // (mat, circles, method, dp, minDist, param1, param2, minRadius, maxRadius)
  cv.HoughCircles(mat, circles, cv.HOUGH_GRADIENT, 1, 45, 75, 40, 0, 200);

  // draw circles
  for (let i = 0; i < circles.cols; ++i) {
      let x = circles.data32F[i * 3];
      let y = circles.data32F[i * 3 + 1];
      let radius = circles.data32F[i * 3 + 2];
      let center = new cv.Point(x, y);
      cv.circle(dst, center, radius, [0, 0, 0, 255], 3);
  }

  cv.imshow('imageCanvas', dst);
  mat.delete();
  dst.delete();
  circles.delete();
}

document.getElementById('circlesButton').onclick = function() {
  this.disabled = true;
  drawCircles()
	this.disabled = false;
};

document.getElementById('button').onclick = function() {
  this.href = document.getElementById("imageCanvas").toDataURL();
  this.download = "image.png";
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
  setTimeout(drawCircles, 150)
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
