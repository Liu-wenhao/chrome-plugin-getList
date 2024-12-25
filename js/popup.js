// 销售管理接口
const saleManagementApi = 'https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/venom/sales/management/listWarehouse';
// 我的备货单接口
const purchaseManagementApi = 'https://seller.kuajingmaihuo.com/oms/bg/venom/api/supplier/purchase/manager/querySubOrderList';

 // 获取当前tab标签
 const getCurrentTab = async () => {
  let queryOptions = {active: true, currentWindow: true};
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

$(document).ready(function() {
    $('#syncSaleManagementBtn').on('click', async function() {
      const tab = await getCurrentTab();
      const result = await chrome.tabs.sendMessage(tab.id, { api: saleManagementApi });
      $('#syncResult').text('同步成功');
    });
    $('#syncSaleManagementBtnDisabled').on('click', async function() {
      const tab = await getCurrentTab();
      const result = await chrome.tabs.sendMessage(tab.id, {});
      $('#syncResult').text('停止同步成功');
    });
});


//window.postMessage({ cmd: "invoke", code: "getBuffCookie" }, "*")