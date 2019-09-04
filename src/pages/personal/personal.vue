<template>
    <div class="personalContainer">
      <div class="userInfo">
        <img v-if="isLoad" class="index_img" :src="userInfo.avatarUrl || ''" alt="">
        <button class="btn" v-else open-type="getUserInfo" @getuserinfo="getUserInfo">登录</button>
        <p class="userName">{{userInfo.nickName || "点击头像登录"}}</p>
      </div>
      <div>
        <van-cell-group>
          <van-cell title="个人资料" is-link icon="label-o"/>
          <van-cell title="消息中心" is-link icon="comment-o"/>
          <van-cell title="历史订单" is-link icon="todo-list-o"/>
          <van-cell title="关于本小程序" is-link icon="info-o"/>
        </van-cell-group>
      </div>


    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
    export default {
      data(){
        return {
          // userInfo:{},
          // isLoad:false
        }
      },
      beforeMount(){
        this.handleGetUserInfo();
      },
      computed:{
        ...mapGetters(['isLoad','userInfo'])
      },
      methods:{
        handleGetUserInfo(){
          wx.getUserInfo({
            success:(data) => {
              this.$store.dispatch('updataIsLoad',true);
              this.$store.dispatch('updataUserInfo',data.userInfo);
            },
            fail:() => {
              console.log('获取失败！');
            }
          })
        },
        getUserInfo(data){
          //console.log(data);
          //判断用户是否授权
          if(data.mp.detail.rawData){
            //用户授权
            this.handleGetUserInfo();

          }
        },
      }

    }
</script>

<style scoped>
  .personalContainer{
    display: flex;
    flex-direction: column;
    /*align-items: center;*/
  }
  .userInfo{
    display: flex;
    flex-direction: row;
    background: #f2f2f2;
    width: 100%;
    align-items: center;
  }
  .index_img{
    width: 150rpx;
    height: 150rpx;
    border-radius: 75rpx;
    margin: 50rpx 20rpx 50rpx 50rpx;
  }
  .userName{
    font-size: 35rpx;
    font-weight: bold;
  }
  .btn{
    width: 150rpx;
    height: 150rpx;
    border-radius: 75rpx;
    margin: 50rpx 20rpx 50rpx 50rpx;

    line-height: 150rpx;

    text-align: center;
    font-size: 35rpx;
  }
</style>
