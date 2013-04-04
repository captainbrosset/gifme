var encoder = new GIFEncoder(),
  cravat, interval, count = 0,
  nb = 6,
  width = 225,
  height = 165,
  img = document.querySelector('#gif'),
  downloadLink;

function getOneFrame() {
  encoder.start();
  interval = setInterval(function() {
    cravat.snapNow();
  }, Math.floor(Math.random() * 200) + 300);
};

function clickLink(link) {
  if (document.createEvent) {
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(event);
  } else if (link.fireEvent) {
    link.fireEvent("onclick");
  }
}

function downloadFile(url) {
  if (!downloadLink) {
    downloadLink = document.createElement('a');
    downloadLink.style.visibility = 'hidden';
    downloadLink.setAttribute('download', 'gifmetv.gif');
    document.body.appendChild(downloadLink);
  }
  downloadLink.href = url.replace('image/gif', 'application/octet-stream');
  clickLink(downloadLink);
};

function record() {
  var frameCount = 0;

  encoder.setRepeat(0);
  encoder.setDelay(200);
  encoder.setSize(width, height);

  if (!cravat) {
    cravat = new Cravat({
      width: width,
      height: height,
      root: document.getElementById('cravat'),
      showControls: false,

      onReady: function() {
        getOneFrame();
      },

      onSnap: function(dataURL) {
        img.src = 'static.gif';
        frameCount++;
        encoder.addFrame(cravat._videoCtx);
        if (frameCount >= nb) {
          clearInterval(interval);
          encoder.finish();
          frameCount = 0;
          var gifData = encoder.stream().getData()
          img.src = 'data:image/gif;base64,' + encode64(gifData);
          downloadFile(img.src);
        }
      }
    });
    cravat.setFilter('bw');
  } else {
    getOneFrame();
  }
};