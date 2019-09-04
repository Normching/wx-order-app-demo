<template>
  <div class="pay">
    <div class="address-choice">
      <van-cell-group title="选择配送方式">
        <van-radio-group :value="delivery" @change="onDeliveryChange">
          <van-cell-group>
            <van-cell
              title="外卖配送"
              value-class="value-class"
              clickable
              data-name="wm"
              @click="onRadioClick"
            >
              <van-radio name="wm" />
            </van-cell>
            <van-cell
              title="门店自取"
              value-class="value-class"
              clickable
              data-name="zq"
              @click="onRadioClick"
            >
              <van-radio name="zq" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </van-cell-group>
      <van-cell-group title="选择地址" v-if="delivery == 'wm' ?true:false" @click="selectAdress">
        <van-cell :title="userSelectAdress.phone || '请选择地址'"
                  size="large"
                  is-link
                  :label="userSelectAdress.province + userSelectAdress.city + userSelectAdress.county + userSelectAdress.address || ''" />
      </van-cell-group>
    </div>

    <div class="foods-list">
      <van-cell-group title="商品明细">
        <ul class="foods-list-ul">
          <li v-for="(item,index) in cartList" :key="index">
            <p>{{item.title}}</p>
            <p>×{{item.num}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.num * item.price}}</p>

          </li>
        </ul>

      </van-cell-group>
    </div>
    <div class="pay-method">
      <van-cell-group>
        <van-cell title="支付方式" is-link value="微信支付" />
      </van-cell-group>
    </div>

    <div class="bottom-bar">
      <van-submit-bar
        :price="price"
        button-text="支付"
        @submit="onSubmit"
      />
    </div>

  </div>


</template>

<script>
  import {mapGetters} from 'vuex'
  import Dialog from '../../../static/vant/dialog/dialog'

  export default {
    data(){
      return{
        delivery:'wm',
        areaList:'',
        setAddress:'true'
      }
    },
    methods:{
      onDeliveryChange(event){
        this.delivery = event.mp.detail;
      },
      onRadioClick(event){
        this.delivery = event.currentTarget.dataset.name;
      },
      selectAdress(){
        wx.navigateTo({
          url:'/pages/selectAdress/main'
        })
      },
      onSubmit(){
        console.log(this.userSelectAdress);
      }

    },
    computed:{
      ...mapGetters(['cartList','userSelectAdress']),

      price(){
        let p = 0;
        this.cartList.forEach((item)=>{
          p += item.price;
        })
        return p * 100;
      },
    },
    components:{

    }

  }
</script>

<style scoped>
  .value-class {
    flex: none !important;
    clear: both;
  }
  .value-class van-radio{
    float: right;
  }
  .pay{
    background: #f6f6f6;
  }
  .pay div{
    background: white;
    margin: 20rpx 0;
  }
  .foods-list-ul li{
    padding: 10rpx 30rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

  }







</style>
