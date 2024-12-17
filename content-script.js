//content-script.js
// 获取temu销售管理
let targetUrl =
  'https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/venom/sales/management/listWarehouse';

window.addEventListener(
  'message',
  event => {
    if (!event.data || Object.keys(event.data).length === 0) {
      return;
    }
    let { url, res } = event.data;
    if (url != targetUrl) return;
    console.log('event', event.data);
    let responseData = null;
    // 使用try-catch兼容接收到的message格式不是对象的异常情况
    try {
      responseData = res.result;
      // 发消息给background.js，并接收其回复
      chrome.runtime.sendMessage({ url, data: responseData }, res => {
        // 收到回复后在页面弹出提醒
        console.log('收到回复', res);
      });
    } catch (e) {
      console.log('获取的数据有误，请联系管理员！', e);
    }
  },
  false
);
