<template>
  <div>
    <div class="menu">
      <scroll-view
        class="menu-wrapper"
        scroll-with-animation="true"
        :scroll-into-view="navId"
        scroll-y>
        <ul class="menu-ul">
          <li
            class="menu-item"
            v-for="(items,index) in menuList"
            :class="index === currentIndex ? 'active' : ''"
            :id="'nav' + index"
            :key="index"
            @click="selectMenu(index)">
            {{items.type}}
          </li>
        </ul>
      </scroll-view>
      <scroll-view
        class="foods-wrapper"
        scroll-y
        :scroll-into-view="contentId"
        scroll-with-animation="true"
        @scroll="onScroll">
        <ul>
          <li
            v-for="(items,index) in menuList"
            :id="'con'+index"
            :key="index"
            class="food-list food-list-hook">
            <div class="food-list-title">
              <p>{{items.type}}</p>
            </div>
            <div class="food-list-body">
              <ul>
                <li v-for="(item,i) in items.items"
                    :key="i"
                    class="food-list-cell"
                >
                  <div class="food-list-cell-img">
                    <img :src="item.image" alt="">
                  </div>
                  <div class="food-list-cell-content">
                    <p class="cell-title">{{item.title}}</p>
                    <p class="cell-describe">{{item.describe}}</p>
                    <p class="cell-sales">月销量：{{item.sales}}</p>
                    <p class="cell-price">￥{{item.price}}</p>
                  </div>
                  <div class="food-list-cell-btn" @click.stop="join(item.title,item.price)">
                    <img src="/static/images/icon/plus.png" alt="">
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </scroll-view>
      <van-notify id="custom-selector" />
      <van-dialog id="van-dialog" />
    </div>

    <div class="bottom-bar">
      <!--      -->
      <div class="submit-bar" v-if="!isCartNull">
        <div class="submit-bar-total" @click="onPopup">
          <p>
            合计：
            <span>￥{{total}}</span>

          </p>
        </div>
        <div class="submit-bar-btn">
          <button @click="onSubmit">下单</button>
        </div>
      </div>
      <!--      -->
      <div id="popup" v-if="popupShow" @click="onpopupClose">
        <div id="popup-content" @click.stop>
          <scroll-view
            class="popup"
            scroll-with-animation="true"
            scroll-y>
            <ul>
              <li class="clearCart" @click="clearCart">清空购物车</li>
              <li v-for="(item,index) in cart" :key="index" class="cart-item">
                <div class="cart-item-title">
                  <p>{{item.title}}</p>
                </div>
                <div class="cart-item-num">
                  <img src="/static/images/icon/sub.png" alt="" @click="subNum(item)">
                  <span>{{item.num}}</span>
                  <img src="/static/images/icon/add.png" alt="" @click="addNum(item)">
                </div>
              </li>
            </ul>
          </scroll-view>
        </div>
      </div>

    </div>



  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Notify from  '../../../static/vant/notify/notify'
  import Dialog from '../../../static/vant/dialog/dialog';


  export default {
    onShow(){
      if(!this.isLoad){
        Dialog.alert({
          title: '请先登录',
          message: '登录后开始点单'
        }).then(() => {
          wx.switchTab({
            url: '/pages/personal/main'
          })
        });
      }
    },

    data () {
      return {
        //菜单栏数据
        // goods: [],
        contentId: '',//右侧内容区li的id
        currentIndex: 0,
        navId: '',//左侧li的id
        navUlHeight: 0,
        navItemHeight: 0,
        listHeight: [],//右侧每个内部块的高度
        contentHeight: [], //右侧内容区的高度

        //购物车数据
        cart:[],
        isCartNull:true,
        total:0,
        popupShow:false,
        cartItemNum:0

      }
    },
    methods: {
      //两栏联动
      selectMenu (index) {
        this.contentId = `con${index}`;
        this.currentIndex = index;
        // console.log(this.contentId, this.currentIndex)
      },
      onScroll (e) {
        this.contentId = ''
        let scrollTop = e.target.scrollTop;
        //右侧内部块高度数组的长度
        let length = this.listHeight.length;
        // console.log(this.listHeight);
        if (scrollTop >= this.listHeight[length - 1] - this.contentHeight) {
          return
        } else if (scrollTop > 0 && scrollTop < this.listHeight[0]) {
          this.currentIndex = 0;
        }
        for (let i = 0; i < length; i++) {

          if (scrollTop >= this.listHeight[i - 1] && scrollTop < this.listHeight[i]) {

            if (this.navId == ("nav"+length -1)) {
              this.currentIndex = length - 1;
            }
            this.currentIndex = i;
          }
        }
      },
      getFoodHeight () {
        const query = wx.createSelectorQuery()
        let h = 0
        //获取右侧每个内部块的高度
        query.selectAll('.food-list-hook').boundingClientRect((rects) => {
          rects.forEach((rect) => {
            h += rect.height
            this.listHeight.push(h);
          })
        })
        // console.log(this.listHeight);
        //获取右侧内容区显示的高度
        query.select('.foods-wrapper').boundingClientRect((rect) => {
          this.contentHeight = rect.height
        })
        //获取左侧菜单导航的高度
        query.select('.menu-ul').boundingClientRect((rect) => {
          this.navUlHeight = rect.height
        })
        //获取左侧菜单导航单项的高度
        query.select('.menu-item').boundingClientRect((rect) => {
          this.navItemHeight = rect.height
        }).exec()
      },

      //
      onPopup(){
        this.popupShow = !this.popupShow;
      },
      onpopupClose(){
        this.popupShow = false;
      },

      //购物车
      join(title,price){
        let unHas = true;
        for(let i = 0; i < this.cart.length; i++){
          if (this.cart[i].title == title){
            this.cart[i].num++;
            unHas = false;
          }else{
            unHas = true;
          }
        }
        if (unHas) {
          this.cart.push({title:title,price:price,num:1});
        }
        this.updataCart();

        Notify({
          text: '已加入购物车',
          duration: 800,
          selector: '#custom-selector',
          backgroundColor: '#6ddb51'
        });

      },
      clearCart(){
        Dialog.confirm({
          title: '',
          message: '是否清空购物车？'
        }).then(() => {
          console.log(1);
          this.cart = [];
        }).catch(() => {
          console.log(2);
        });
      },
      subNum(item){
        item.num--;
        if(item.num < 1) {
          this.cart.splice(this.cart.indexOf(item), 1);
        }
        this.updataCart();
      },
      addNum(item){
        item.num++;
        this.updataCart();
      },
      updataCart(){
        let cartTotal = 0;
        this.cart.forEach((item)=>{
          cartTotal += item.num * item.price;
        })
        this.total = cartTotal;
      },
      onSubmit(){
        if(this.cart.length > 0){
          this.$store.dispatch('getCartList',this.cart);
          wx.navigateTo({
            url:'/pages/pay/main'
          })
        }else{
          console.log('购物车为空！');
        }

      },


    },
    watch: {
      menuList () {
        // console.log(1);
        setTimeout(() => {
          this.getFoodHeight()
        }, 60)
      },
      currentIndex () {
        if (this.contentHeight < this.navUlHeight) {
          let h = this.currentIndex * this.navItemHeight;
          if (h > this.contentHeight) {
            //导航滑动
            this.navId = 'nav' + this.currentIndex;
          } else {
            this.navId = 'nav0';
          }
        }
      },
      cart(){
        if (this.cart.length > 0){
          this.isCartNull = false;
        }else{
          this.isCartNull = true;
          this.onpopupClose();
        }
      },

    },
    beforeMount () {
      this.$store.dispatch('getMenuList');
    },
    computed:{
      ...mapGetters(['menuList','isLoad']),
    }


  }
</script>

<style scoped>
  .menu {
    overflow: hidden;

  }

  .menu-wrapper {
    position: absolute;
    left: 0;
    background: #cccccc;
    width: 200rpx;
    height: 100%;
    text-align: center;
  }

  .menu-wrapper li {
    height: 100rpx;
    line-height: 100rpx;
  }

  .active {
    background: white;
  }


  .foods-wrapper {
    position: absolute;
    left: 200rpx;
    height: 100%;
  }

  .foods-wrapper .food-list {
    padding-top: 20rpx;

  }

  .food-list-cell{
    box-shadow: 5rpx 5rpx 5rpx #d5d5d5;
    display: flex;
    align-items: center;
    padding-left: 20rpx;
    height: 220rpx;
    position: relative;
    width: 500rpx;
    margin-left: 15rpx;
    margin-top: 15rpx;
  }
  .food-list-cell-img{

  }
  .food-list-cell-img img{
    width: 150rpx;
    height: 150rpx;

  }
  .food-list-cell-content{
    padding-left: 20rpx;
  }
  .food-list-cell-btn{


  }
  .food-list-cell-btn img{
    width: 45rpx;
    height: 45rpx;
    position: absolute;
    bottom: 25rpx;
    right: 25rpx;

  }
  .cell-describe,.cell-sales{
    font-size: 22rpx;
    color: #5f5f5f;
  }
  .cell-describe{
    font-size: 25rpx;
  }
  .cell-price{
    font-weight: bold;
  }
  /**/
  .bottom-bar{
  }


  /**/
  .cart{
    width: 100%;
    height: 100rpx;
    background: #5f5f5f;
    position: fixed;
    bottom: 0;
  }
  #popup{
    display: block;
    width: 750rpx;
    height: 100%;
    z-index: 12;
    position: absolute;
    background:rgba(0,0,0,0.4);

  }
  #popup-content{
    display: block;
    width: 100%;
    position: absolute;
    bottom: 100rpx;
    max-height: 300rpx;
    background: #ffffff;

  }
  .popup{
    max-height: 300rpx;
  }
  .cart-item{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 25rpx;
  }
  .cart-item-title{

  }
  .cart-item-num{
    float: right;
  }
  .cart-item-num img{
    float: left;
    width: 38rpx;
    height: 38rpx;
    margin:0 10rpx;
  }
  .cart-item-num span{
    float: left;
    line-height: 38rpx;
  }
  .clearCart{
    background: #f0f0f0;
    padding-left: 10rpx;
    color: #5f5f5f;
  }
  /**/
  .submit-bar{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100rpx;
    z-index: 13;
    background: #f0f0f0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: center;
  }
  .submit-bar-total{
    padding: 0 20rpx;
    line-height: 100rpx;
  }
  .submit-bar-total span{
    color: red;
    font-size: 45rpx;
  }
  .submit-bar-btn{
    /*border: 1rpx solid red;*/
    width: 200rpx;
  }
  .submit-bar-btn button{
    background: #e50000;
    color: white;
    height: 100rpx;
    border-radius: 0 !important;
  }




</style>
