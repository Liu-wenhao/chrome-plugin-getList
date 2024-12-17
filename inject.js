// inject.js
// XMLHttpRequest
(function () {
  if (XMLHttpRequest.prototype.sayMyName) return;
  console.log("%c>>>>> 哈哈哈哈哈", "color:yellow;background:red");
  var XHR = XMLHttpRequest.prototype;
  XHR.sayMyName = "hahahahaha";
  var open = XHR.open;
  var send = XHR.send;
  XHR.open = function (method, url) {
    this._method = method; // 记录method和url
    this._url = url;
    return open.apply(this, arguments);
  };
  XHR.send = function () {
    if (this._url) {
        this.addEventListener("load", function (xhr) {
          let res = JSON.parse(xhr.currentTarget.response);
          //console.log('xhr', this._url, res)
          // 因为inject_script不能直接向background传递消息, 所以先传递消息到content_script
          window.postMessage({ 'url': this._url, "res": res }, '*');
        });
    }
    return send.apply(this, arguments);
  };
})(XMLHttpRequest);

//fetch
var originalFetch = window.fetch;
window.fetch = function (url, options) {
  var fetchPromise = originalFetch(url, options);
  //console.log('fetch', url, options);
  fetchPromise.then((res) => {
    if(res.ok && res.status == 200) {
      return res.clone().json();
    }
    console.log('res1', res);
  }).then((res) => {
    try {
      //console.log('fetch', url, res);
      // 因为inject_script不能直接向background传递消息, 所以先传递消息到content_script
      window.postMessage({ 'url': url, "res": res }, '*');
    } catch(err) {
      console.log(err);
      console.log("inject fetch Error in responseType try catch");
    }
  });
  return fetchPromise;
}