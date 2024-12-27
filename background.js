//background.js
let accessToken = '';

// 接收到拦截的响应
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('====================================');
  console.log('background.js收到拦截的响应：', request);
  console.log('====================================');
  const { type } = request; // 解构赋值

  sendResponse({
    type: true ? 'success' : 'danger',
    message: '成功结束',
    next: false,
  });

  // 异步响应sendMessage的写法：
  // 异步接收要求返回turn，从而使sendMessage可以异步接收回应消息
  return true;
});

function getAccessToken() {
  chrome.cookies.getAll(
    { domain: 'https://www.yigeerp.com' },
    function (cookies) {
      console.log('cookies', cookies);
    }
  );
}

function login() {
  // 发起一个 GET 请求
  fetch('https://www.yigeerp.com/v1/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: '刘文豪', password: 'hao1996' }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // 假设响应是 JSON 格式
    })
    .then(res => {
      accessToken = res.data.access_token;
      getData();
    })
    .catch(error => {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      );
    });
}

login();

function getData() {
  getAccessToken();
  // 发起一个 GET 请求
  fetch('https://www.yigeerp.com/trust/temu/sales-management/list-page-new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      skuType: 'productSkuIds',
      skcType: 'productSkcIds',
      shopNameList: ['TemuD04-RJRoom'],
      selectStatusList: [],
      skuGoodStatusList: [],
      pageNum: 1,
      pageSize: 20,
      check: true,
      skuCodes: null,
      skcCodes: null,
      skuValue: '',
      skcValue: '5289053997',
      productSkuIds: '',
      productSkcIds: '5289053997',
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // 假设响应是 JSON 格式
    })
    .then(res => {
      if (res.code == 200) {
        console.log(res.data.list); // 处理返回的数据
      }
    })
    .catch(error => {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      );
    });
}
