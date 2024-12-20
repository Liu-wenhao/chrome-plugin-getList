
// 是否模拟点击
let isNext = false;
// 监听url
let targetUrl = '';
  //'https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/venom/sales/management/listWarehouse';

  // 监听接口
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
      chrome.runtime.sendMessage({ type: 'data', url, data: responseData }, res => {
        // 收到回复后在页面弹出提醒
        console.log('收到回复', res);
        if(isNext) {
          setTimeout(() => {
            clickNextPageBtn();
          }, 1000);
        }
      });
    } catch (e) {
      console.log('获取的数据有误，请联系管理员！', e);
    }
  },
  false
);

// 监听其他页面
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const { api } = request;
  console.log('request', api);
  // 处理请求
  if(api) {
    targetUrl = api;
    isNext = true;
    clickSearchBtn();
  } else {
    targetUrl = '';
    isNext = false;
  }
  sendResponse({res: '成功'});
});

// 点击搜索按钮
function clickSearchBtn() {
  //const searchButton = document.querySelector("[data-testid='beast-core-button']");
  const searchButton = Array.from(document.querySelectorAll('button'))
  .find(btn => btn.textContent.trim() === '查询');
  console.log("searchButton", searchButton);
  if (searchButton) {
    // 触发点击事件
    console.log("点击搜索按钮");
    searchButton.click();
  } else {
    console.log("未找到搜索按钮");
  }
}

// 点击下一页按钮获取数据
function clickNextPageBtn() {
  // 使用 document.querySelector 获取下一页按钮
  const nextPageButton = document.querySelector("[data-testid='beast-core-pagination-next']");
  console.log("nextPageButton", nextPageButton);

  if (nextPageButton) {
    // 触发点击事件
    console.log("点击下一页按钮");
    nextPageButton.click();
  } else {
    console.log("未找到下一页按钮");
  }
}

// 模拟人手修改分页大小
function clickPageSize() {
  // 使用 document.querySelector 获取下一页按钮
  const selectElementF = document.querySelector("[data-testid='beast-core-select']");
  const selectElement = document.querySelector("[data-testid='beast-core-select-htmlInput']");
  console.log("selectElement", selectElement);
  if(selectElement) {
    selectElementF.click();
    // 设置下拉框的值
    selectElement.value = 40;

    // 触发 change 事件以更新界面（可选）
    var changeEvent = new Event('change', { 'bubbles': true });
    selectElement.dispatchEvent(changeEvent);
  }

}