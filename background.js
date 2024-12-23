//background.js
// 接收到拦截的响应
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('====================================');
  console.log('background.js收到拦截的响应：', request);
  console.log('====================================');
  const { type } = request; // 解构赋值
//  if(type === 'inject') {
//    chrome.tabs.query({}, (tabs) => {
//      for (const tab of tabs) {
//        if(tabId == tab.id) {
//          chrome.scripting.executeScript({
//            target: { tabId: tab.id },
//            files: ["inject.js"],
//            world: 'MAIN'
//          });
//        }
//
//      }
//    });
//  }
  sendResponse({
    type: true ? 'success' : 'danger',
    message: '成功结束',
    next: false
  });
  //if (request.action == 'getCookie') {
  //  chrome.cookies.getAll({ domain: request.domain }, function (cookies) {
  //    sendResponse({ cookies: cookies, request: request });
  //  });
  //}
  // 异步响应sendMessage的写法：
  // 异步接收要求返回turn，从而使sendMessage可以异步接收回应消息
  return true;
});