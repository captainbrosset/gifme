function ScreenLetStoreUploader(imageData, callback) {
  try {
    var xhr = new XMLHttpRequest(),
      formData = new FormData();
    formData.append('data', imageData);
    xhr.open('POST', "http://screenletstore.appspot.com/__/upload", true);
    xhr.onload = function(e) {
      callback({
        responseText: this.responseText,
        error: false
      });
    };
    xhr.send(formData);
  } catch (e) {
    callback({
      responseText: null,
      error: e.message
    });
  }
};