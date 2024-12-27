//background.js
let accessToken = '';

// 接收到拦截的响应
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { type, data } = request; // 解构赋值
  let resultData = [];
  if (type == 'getInventoryNumData') {
    //const res = await getInventoryNumData(data);
    fetch('https://www.yigeerp.com/trust/temu/sales-management/list-page-new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // 假设响应是 JSON 格式
    }).then((res) => {
      if (res.code == 200) {
        resultData = transformData(res.data.list || []);
        sendResponse({
          code: 200,
          type: 'success',
          message: '成功结束',
          data: resultData
        });
      } else {
        sendResponse({
          code: 500,
          type:'error',
          message: res.message,
          data: []
        });
      }
    })
  }
  // 异步接收要求返回turn，从而使sendMessage可以异步接收回应消息
  return true;
});

function transformData(data) {
  let resultData = [];
  data.forEach((row) => {
    row.skuInfoList.forEach((item) => {
      resultData.push({
        skc: row.productSkcId,
        sku: item.productSkuId,
        num: item.availableQuantity,
        color: item.color,
      })
    })
  });
  return resultData;
}
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
    body: JSON.stringify({ username: 'admin', password: '123456' }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // 假设响应是 JSON 格式
    })
    .then(res => {
      accessToken = res.data.access_token;
    })
    .catch(error => {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      );
    });
}

login();

async function getInventoryNumData(data) {
  // 发起一个 GET 请求
  const response = await fetch('https://www.yigeerp.com/trust/temu/sales-management/list-page-new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}
