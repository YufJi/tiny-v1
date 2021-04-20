//index.js
//获取应用实例
// const config = require('../../config.js');
const app = getApp()

let envSwitchKeys = '';
console.log('app', app.globalData);
Page({
  data: {
    env: 'uat',
    firstEntry: [{
        id: 'approve',
        name: app.globalData.lang['OA_formlist_btn_my_approval'],
        url: '/pages/approve/index'
      },
      {
        id: 'commit',
        name: app.globalData.lang['OA_formlist_btn_my_submitted'],
        url: '/pages/submitted/index'
      }
    ],
    secondEntry: [{
        id: 'money',
        name: app.globalData.lang['OA_index_link_reimbursement'],
        url: '/pages/costaccount/index'
      },
      {
        id: 'travel',
        name: app.globalData.lang['OA_index_link_businesstravel'],
        url: '/pages/travelPay/index'
      },
      {
        id: 'taxNumber',
        name: app.globalData.lang['OA_index_link_taxnumber'],
        url: '/pages/taxNumber/index'
      },
      {
        id: 'approving',
        name: app.globalData.lang['OA_index_link_authorize'],
        url: '/pages/warrant/index'
      },
      {
        id: '',
        name: '',
        url: '',
        key: '@'
      },
      {
        id: '',
        name: '',
        url: '',
        key: '#'
      }
    ]

  },

  onLoad() {
    console.log('page load')
  },
  // 路由跳转
  navRouterTo(event) {
    this.callbackInfo(event);
  },

  callbackInfo(event) {
    let that = this;
    if (!app.globalData.userEmpcode) {
        wx.showToast({
          title: 'Invalid User Info',
          icon: 'none'
        })
    } else {
      wx.navigateTo({
        url: event.currentTarget.dataset.url
      });
    }
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.lang['OA_index_share_title'],
      content: app.globalData.lang['OA_index_share_content'],
      imageUrl: 'https://pic.c-ctrip.com/platform/h5/miniapp/oaoffice/oa.png',
      path: '/page/index',
      webpageUrl: '/page/index'
    }
  },

  switchToProd: function() {
    wx.showModal({
      title: '切换到生产环境?',
      success: (res) => {
        if (res.confirm) {
          // 需要更新缓存
          config.update('prod');
          this.setData({
            env: config.env
          });
          wx.removeStorageSync('defaultCostData');
          wx.removeStorageSync('defaultTravelData');
        }
      }
    })
  }
})