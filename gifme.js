var GifMe = (function() {

  var encoder = new GIFEncoder(),
    interval,
    nb = 8,
    width = 225,
    height = 165,
    img = document.querySelector('#gif'),
    strip = document.querySelector('.strip'),
    recordButton = document.querySelector('.record'),
    status = document.querySelector('#status'),
    video = document.querySelector('#camera'),
    canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    isCameraReady = false,
    isRecording = false,
    frameCount = 0;

  canvas.width = width;
  canvas.height = height;

  function showError(message, error) {
    status.textContent = message;
    status.hidden = false;
    if (error) {
      console.error(message, error);
    }
  }

  function stopRecording() {
    clearInterval(interval);
    isRecording = false;
    frameCount = 0;
    recordButton.disabled = !isCameraReady;
    img.src = 'static.gif';
  }

  function stopCamera() {
    isCameraReady = false;
    stopRecording();
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(function(track) {
        track.stop();
      });
      video.srcObject = null;
    }
  }

  async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showError('Camera access requires HTTPS or localhost and a browser that supports getUserMedia.');
      return;
    }

    try {
      video.srcObject = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
      video.srcObject.getVideoTracks().forEach(function(track) {
        track.addEventListener('ended', function() {
          stopCamera();
          showError('The camera disconnected. Reload the page to reconnect.');
        });
      });
      await video.play();
      isCameraReady = true;
      recordButton.disabled = false;
    } catch (error) {
      stopCamera();
      showError('Unable to access the camera. Allow camera access and check that a camera is connected. ' + error.message, error);
    }
  }

  function captureFrame() {
    if (!isRecording) {
      return;
    }

    try {
      if (video.readyState < video.HAVE_CURRENT_DATA || !video.videoWidth || !video.videoHeight) {
        throw new Error('The camera is not providing video frames.');
      }

      var sourceWidth = video.videoWidth;
      var sourceHeight = video.videoHeight;
      var ratio = width / height;
      if (sourceWidth / sourceHeight >= ratio) {
        sourceWidth = sourceHeight * ratio;
      } else {
        sourceHeight = sourceWidth / ratio;
      }
      context.drawImage(video, (video.videoWidth - sourceWidth) / 2,
        (video.videoHeight - sourceHeight) / 2, sourceWidth, sourceHeight,
        0, 0, width, height);

      var frame = context.getImageData(0, 0, width, height);
      for (var i = 0; i < frame.data.length; i += 4) {
        var grey = Math.floor(frame.data[i] * .3 + frame.data[i + 1] * .59 + frame.data[i + 2] * .11);
        frame.data[i] = frame.data[i + 1] = frame.data[i + 2] = grey;
        frame.data[i + 3] = 255;
      }
      context.putImageData(frame, 0, 0);

      if (!encoder.addFrame(context)) {
        throw new Error('Unable to encode the GIF frame.');
      }
      frameCount++;
      if (frameCount === nb) {
        if (!encoder.finish()) {
          throw new Error('Unable to finish the GIF.');
        }
        addImageToSTrip('data:image/gif;base64,' + encode64(encoder.stream().getData()));
        stopRecording();
      }
    } catch (error) {
      stopRecording();
      showError('Unable to record the GIF. ' + error.message, error);
    }
  }

  startCamera();

  function addImageToSTrip(data) {
    var img = document.createElement('img');
    img.src = data;
    var li = document.createElement('li');
    li.appendChild(img);
    if(strip.firstElementChild) {
      strip.insertBefore(li, strip.firstElementChild);
    } else {
      strip.appendChild(li);
    }
    setTimeout(function() {li.classList.add('expanded');}, 200);
  }

  function record() {
    if (!isCameraReady || isRecording) {
      return;
    }

    encoder.setRepeat(0);
    encoder.setDelay(200);
    encoder.setSize(width, height);

    if (!encoder.start()) {
      showError('Unable to start the GIF encoder.');
      return;
    }

    status.hidden = true;
    frameCount = 0;
    isRecording = true;
    recordButton.disabled = true;
    img.src = 'countdown.gif';
    interval = setInterval(captureFrame, Math.floor(Math.random() * 100) + 400);
  }

  return {
    record : record
  };

})();