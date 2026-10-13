gif me
======

GIF yourself up!!

https://captainbrosset.github.io/gifme

Open the demo over HTTPS, or serve this directory on localhost for local
development (for example, `python -m http.server 8000`, then open
`http://localhost:8000`). Modern browsers require a secure context for camera
access.

Allow camera access when prompted. The red record button becomes available
once the camera is playing. Each recording creates an eight-frame grayscale
GIF in the filmstrip; wait for it to finish before recording another.
Camera access or recording errors are displayed on the page.

Run the camera and recording regression tests with `node --test`.

Made possible thanks to:
- jsgif https://github.com/antimatter15/jsgif
- Originally used cravat https://github.com/captainbrosset/cravat;
  camera capture now uses `navigator.mediaDevices.getUserMedia` and `video.srcObject`.
