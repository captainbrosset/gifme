var GifMe = (function() {

  var encoder = new GIFEncoder(),
    interval, count = 0,
    nb = 8,
    width = 225,
    height = 165,
    img = document.querySelector('#gif'),
    strip = document.querySelector('.strip'),
    downloadLink,
    isCravatReady = false,
    frameCount = 0;

  var cravat = new Cravat({
    width: width,
    height: height,
    root: document.getElementById('cravat'),
    showControls: false,

    onReady: function() {
      isCravatReady = true;
    },

    onSnap: function(dataURL) {
      frameCount++;
      encoder.addFrame(cravat._videoCtx);
      if (frameCount >= nb) {
        clearInterval(interval);
        encoder.finish();
        frameCount = 0;
        var gifData = encoder.stream().getData();
        addImageToSTrip('data:image/gif;base64,' + encode64(gifData));
        frameCount = 0;
        img.src = 'static.gif';
      }
    }
  });
  cravat.setFilter('bw');

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
    img.src = 'countdown.gif';
    encoder.setRepeat(0);
    encoder.setDelay(200);
    encoder.setSize(width, height);

    encoder.start();
    interval = setInterval(function() {
      cravat.snapNow();
    }, Math.floor(Math.random() * 100) + 400);
  };

  return {
    record : record
  };

})();