<template>
  <div class="index-container">
    <swiper indicator-dots indicator-color="#aaaaaa" indicator-active-color="white">
      <swiper-item>
        <img src="/static/images/index/cf1.jpg" alt="">
      </swiper-item>
      <swiper-item>
        <img src="/static/images/index/pizza.png" alt="">
      </swiper-item>
      <swiper-item>
        <img src="/static/images/index/waffle.jpg" alt="">
      </swiper-item>
    </swiper>
    <div class="index-welcome">
      <p>欢迎使用手机自助点餐</p>
    </div>
    <div class="index-order-btn">
      <mp-button open-type="getUserInfo" @getuserinfo="getUserInfo" type="primary" size="large" btnClass="mb15">立刻点餐</mp-button>
    </div>
    <div class="index-recommend">
      <div class="index-recommend-title">
        <img src="/static/images/index/Fork_Knife_48px_1183915_easyicon.net.png" alt="">
        <p>优惠推荐</p>
      </div>
      <div class="index-recommend-body">
        <img src="/static/images/index/restaurant-1.jpg" alt="">
        <img src="/static/images/index/restaurant-2.jpg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import mpButton from 'mpvue-weui/src/button'
  export default {
    computed:{
      ...mapGetters(['isLoad'])
    },
    components: {
      mpButton
    },
    methods: {
      toOrder(){
        if(this.isLoad){
          wx.switchTab({
            url:'/pages/order/main'
          })
        }else{
          console.log('请登录')
        }
      },
      handleGetUserInfo(){
        wx.getUserInfo({
          success:(data) => {
            this.$store.dispatch('updataIsLoad',true);
            this.$store.dispatch('updataUserInfo',data.userInfo);
            wx.switchTab({
              url:'/pages/order/main'
            })
          },
          fail:() => {
            console.log('获取失败！');
          }
        })
      },
      getUserInfo(data){
        //判断用户是否授权
        if(data.mp.detail.rawData){
          //用户授权
          this.handleGetUserInfo();
        }else{
          console.log('未授权')
        }
      },
    }
  }
</script>

<style scoped>
  .index-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .index-container swiper {
    width: 96%;
    height: 320 rpx;

  }
  .index-container swiper img {
    width: 100%;
    height: 100%;
    border-radius: 5rpx;
  }
  .index-order-btn {
    padding: 25rpx 0;
  }
  .index-recommend{
    padding-top: 30rpx;
  }
  .index-recommend-title img {
    width: 55rpx;
    height: 55rpx;
    float: left;
  }
  .index-recommend-title p {
    float: left;
  }
  .index-recommend-body {
    clear: both;
  }
  .index-recommend-body img {
    width: 350rpx;
    height: 350rpx;
    margin: 5rpx;
    border-radius: 5rpx;
  }



</style>
