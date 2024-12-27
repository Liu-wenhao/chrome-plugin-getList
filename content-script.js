//import { clickSearchBtn, clickNextPageBtn } from './page/list.js';
//import { injectTableRowButtons } from './page/button.js';
//import { insertInputValue } from './page/insetInput.js';

// 是否模拟点击
let isNext = false;

// 当前监听url
let targetUrl = '';

const shopNameList = [
  'TemuI01EU-Naiveroo',
  'TemuI01US-Naiveroo',
  'TemuJ01EU-Ahcugour',
  'TemuJ01US-Ahcugour',
  'TemuI02EU-Foundove',
  'TemuI02US-Foundove',
  'Naiveroo-ww',
  'TemuI03EU-KOIFORU',
  'TemuI03US-KOIFORU',
  'TemuD06-MeteOrZ',
  'TemuF01-WAIHA',
  'TemuH01EU-Novelfun',
  'TemuH01US-Novelfun',
  'TemuH02EU-Homsky',
  'TemuH02US-Homsky',
  'TemuG04-ASSAB',
  'TemuG05-ANewgena',
  'TemuG06-AFoldshop',
  'TemuA07-KKitchenware',
  'TemuE11-SKN',
  'TemuA01-Faroonee',
  'TemuA02-CChengShop',
  'TemuA03-Throwate',
  'TemuA04-Phylactous',
  'TemuA05-Necklacek',
  'TemuA06-Paintingart',
  'TemuA08-Materialfab',
  'TemuA09-Officedaily',
  'TemuA10-Scriptumsset',
  'TemuA11-Goodzeal',
  'TemuB01-Shakeion',
  'TemuB02-YgGsStudio',
  'TemuB03-YgGsStudio B',
  'TemuB04-YgGsStudio C',
  'TemuC01-patiocover',
  'TemuC02-NGSS',
  'TemuC03-NGGSSaz',
  'TemuC04-NGSSa',
  'TemuD01-LTLT',
  'TemuD02-cnRed',
  'TemuD03-UOOU',
  'TemuD04-RJRoom',
  'TemuD05-RainbOow',
  'TemuD07-arButus',
  'TemuD08-Petunununia',
  'TemuD09-Researchss',
  'TemuD10-Gg0ograpePeed',
  'TemuD11-CoNnfucius',
  'TemuD12-SusieSjoh',
  'TemuE01-Ubestu',
  'TemuE02-Hibest',
  'TemuE03-Specialties N',
  'TemuE04-Specialties A',
  'TemuE05-Specialties B',
  'TemuE06-PMD',
  'TemuE07-Shakeion B',
  'TemuE08-Shakeion C',
  'TemuE09-s x u',
  'TemuE10-SXW',
  'TemuG01-BauhiniaA',
  'TemuG02-BauhiniaB',
  'TemuG03-ASSwang',
];

let shopName = '';

// 所有需要监听的url  type 1: 列表插入同步按钮 2: 输入框插入值
let allTargetUrlList = [
  {
    id: 1, // 销售管理
    url: 'https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/venom/sales/management/listWarehouse',
    resultName: 'subOrderList',
    type: 1,
  },
  {
    id: 2, // 我的备货单
    url: 'https://seller.kuajingmaihuo.com/oms/bg/venom/api/supplier/purchase/manager/querySubOrderList',
    resultName: 'subOrderForSupplierList',
    type: 1,
  },
  {
    id: 3, // 销售管理-申请备货
    url: 'https://seller.kuajingmaihuo.com/oms/bg/venom/api/supplier/sales/management/queryStockBaseInfo',
    resultName: 'subOrderList',
    type: 2,
  },
  {
    id: 4, // 销售管理-批量申请备货
    url: 'https://seller.kuajingmaihuo.com/oms/bg/venom/api/supplier/sales/management/batchQueryApplyBoundLimitNum',
    resultName: 'skcApplyBoundLimitNumMap',
    type: 2,
  },
]

// 当前页面表格数据
let tableList = [];


// 监听接口
window.addEventListener(
  'message',
  event => {
    if (!event.data || Object.keys(event.data).length === 0) {
      return;
    }
    if(!allTargetUrlList.map(item => item.url).includes(event.data.url)){
      return;
    }
    let { url, res } = event.data;
    let resultData = res.result || {};
    // 向表格中自动注入按钮
    let [ resultObj ] = allTargetUrlList.filter(item => item.url == url)
    if (resultObj.type == 1) {
      tableList = resultData[resultObj.resultName] || [];
      injectTableRowButtons();
    };
    if (resultObj.type == 2) {
      // 销售管理-申请备货-插入值
      batchInsertInventoryNum();
      //insertInputValue();
      //applyForStockingUp();
    };
    if(!targetUrl) return;
    let responseData = null;
    // popup点击同步按钮
    try {
      responseData = res.result || {};
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

// 表格中注入按钮同步当前行数据
function injectTableRowButtons() {
  // 获取表格中的所有行
  const rows = document.querySelectorAll('tbody tr');
  let index = -1;
  rows.forEach(row => {
    const syncButton = Array.from(row.querySelectorAll('span'))
  .find(btn => btn.textContent.trim() === '同步');
    if(syncButton) return;
    // 获取行中的申请备货按钮
    // 获取行中最后一个单元格的按钮
    const tds = row.querySelector('td:last-child');
    const targetButton = tds.querySelector('[data-testid="beast-core-button-link"]');
    if (targetButton) {
      index++;
      const button = document.createElement('span');
      button.textContent = '同步';
      // 为按钮添加样式
      button.style.color = '#0071f3'; // 蓝色文字
      button.style.fontSize = '12px'; // 字体大小
      button.style.margin = '6px 0px'; // 外边距
      button.style.cursor = 'pointer'; // 鼠标指针样式
      button.setAttribute('sync-index', index);
      button.addEventListener('click', () => {
        const rowIndex = button.getAttribute('sync-index');
        console.log('点击了同步按钮，当前行数据：', rowIndex, tableList[rowIndex]);
        // 发消息给background.js，并接收其回复
        chrome.runtime.sendMessage({ type: 'data', data: tableList[rowIndex] }, res => {
          // 收到回复后在页面弹出提醒
          console.log('收到回复', res);
        });
      });
      targetButton.parentNode.insertBefore(button, targetButton);
    }
    // 如果未找到目标按钮，不插入新按钮
  });
}


function applyForStockingUp() {
  // 获取表格中的所有行
  const rows = document.querySelectorAll('tbody tr');
  let index = -1;
  rows.forEach(row => {
    // 获取行中的申请备货按钮
    const targetButton = Array.from(row.querySelectorAll('span'))
  .find(btn => btn.textContent.trim() === '申请备货');
  console.log('targetButton', targetButton);
    if (targetButton) {
      index++;
      targetButton.setAttribute('sync-index', index);
      targetButton.addEventListener('click', () => {
        const rowIndex = targetButton.getAttribute('sync-index');
        console.log('点击了申请备货按钮，当前行数据：', rowIndex, tableList[rowIndex]);
        // 发消息给background.js，并接收其回复
        chrome.runtime.sendMessage({ type: 'data', data: tableList[rowIndex] }, res => {
          // 收到回复后在页面弹出提醒
          console.log('收到回复', res);
        });
      });
    }
  });
}
// 单个申请备货插入值
function insertInputValue(){
  // 获取表格中的所有行
  const rows = document.querySelectorAll('form tbody tr');
  let index = -1;
  rows.forEach(row => {
    // 获取行中最后一个单元格的按钮
    const tds = row.querySelector('td:last-child');
    const targetInput = tds.querySelector('[data-testid="beast-core-inputNumber-htmlInput"]');
    if (targetInput) {
      index++;
      targetInput.setAttribute('i', index);
      targetInput.value = 15;
      // 触发输入事件，以更新页面显示
      const event = new Event('input', { bubbles: true });
      targetInput.dispatchEvent(event);
    }
  });
}

// 批量申请备货插入值
function batchInsertInventoryNum(){
  chrome.runtime.sendMessage({ type: 'getCookie' }, res => {
    // 收到回复后在页面弹出提醒
    console.log('getCookie', res);
  });
  // 获取表格中的所有行
  const element = document.querySelector('[data-testid="beast-core-icon"]');
  if(element) {
    shopName = element.textContent.trim();
  }
  // 获取表格中的所有行
  const theadTr = document.querySelectorAll('form thead tr');
  theadTr.forEach(row => {
    // 获取行中最后一个单元格的按钮
    const th = row.querySelector('th:nth-last-child(2)');
    if (th) {
      th.innerHTML = `<span>${th.textContent}</span><br><span>库存数量</span>`;
    }
  });
  const rows = document.querySelectorAll('form tbody tr');
  let index = -1;
  rows.forEach(row => {
    // 获取行中最后一个单元格的按钮
    const td = row.querySelector('td:nth-last-child(2)');
    td.innerHTML =  `<span>${td.textContent}</span><br><span>12</span>`
  });
}
