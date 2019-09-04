<template>
  <div class="selectAdress">
    <van-nav-bar
      title="选择地址"
      left-text="保存并返回"
      left-arrow
      @clickLeft="onSaveAddress"
    />
    <van-radio-group :value="selectIndex" @change="onAdressSelect" title="选择地址">
      <van-cell-group>
        <van-cell
          v-for="(item,index) in userAdressList"
          :key="index"
          :title="item.phone"
          size="large"
          :label="item.province + item.city + item.county + item.address"
          value-class="value-class"
          clickable
          :data-name="index"
          @click="addressSelect"
        >
          <van-radio :name="index"/>
        </van-cell>
      </van-cell-group>
      <van-cell-group>
        <van-cell
          title="添加新地址"
          size="large"
          value-class="value-class"
          clickable

          @click="addNewAddress"
        >

        </van-cell>
      </van-cell-group>
    </van-radio-group>

    <van-dialog
      zIndex="99"
      use-slot
      title="填写新地址"
      :show="dialogFlag"
      show-cancel-button
      @close="onNewAdressClose"
      @confirm="onNewAdressConfirm"
    >
      <van-cell-group>
        <van-field
          :value="inputArea.province + inputArea.city + inputArea.county || ''"
          label="省市区"
          placeholder="请选择省市区"
          @click="onSelectArea"
        />
        <van-field
          :value="inputAdress"
          clearable
          label="详细地址"
          placeholder="请输入详细地址"
          @change="inputAdressChange"

        />
        <van-field
          :value="inputPhone"
          clearable
          label="联系电话"
          placeholder="请输入联系电话"
          @change="inputPhoneChange"

        />
      </van-cell-group>

    </van-dialog>
    <van-popup  :show="popupFlag" overlay="true"  position="bottom" @close="onPopupClose">
      <van-area
        :area-list="areaList"
        @cancel="cancelSelectArea"
        @confirm="confirmSelectArea" />
    </van-popup>

    <van-toast id="van-toast" />







  </div>


</template>

<script>
  import {mapGetters} from 'vuex'
  import AreaList from '../../datas/area'
  import Toast from '../../../static/vant/toast/toast'
  export default {
    data(){
      return {
        //选择地址索引
        selectIndex:'0',
        newaddress:{},
        //选择省市区
        inputArea:{},
        //填写详细地址
        inputAdress:'',
        //填写联系电话
        inputPhone:'',
        //弹窗标记
        dialogFlag:false,
        //选择省市区标记
        popupFlag:false,
        //省市区选择器列表
        areaList:[],



      }
    },
    beforeMount(){
      //加载省市区选择器列表
      this.areaList = AreaList;
      //请求vuex获取用户地址列表
      this.$store.dispatch('getAdressList');
    },
    computed:{
      //分发用户地址列表
      ...mapGetters(['userAdressList'])
    },
    methods:{
      //确认选择地址
      onSaveAddress(){
        this.$store.dispatch('getSelectAdress',this.userAdressList[Number(this.selectIndex)]);
        wx.navigateBack({
          url:'/pages/pay/main'
        })
      },
      //单击单选，改变选项索引，选择地址
      onAdressSelect(event){
        this.selectIndex = event.mp.detail;
      },
      //单击cell，改变选项索引，选择地址
      addressSelect(event){
       this.selectIndex = event.mp.target.dataset.name.toString();
      },
      //添加新地址
      addNewAddress(){
        //打开弹窗
        this.dialogFlag = true;
      },
      //关闭弹窗
      onNewAdressClose(){
        this.dialogFlag = false;
      },
      //弹窗确认添加
      onNewAdressConfirm(){
        if(this.inputAdress == ''){
          Toast.fail('详细地址不能为空');
        }else if(this.inputPhone ==''){
          Toast.fail('联系电话不能为空');
        }else{
          this.newaddress = this.inputArea;
          this.newaddress.address = this.inputAdress;
          this.newaddress.phone = this.inputPhone;
          this.$store.dispatch('addAdressToList',this.newaddress);
        }
        //关闭弹窗
        this.onNewAdressClose();
      },
      //点击选择省市区
      onSelectArea(){
        //弹出选择器
        this.popupFlag = true;
      },
      //省市区选择确认
      confirmSelectArea(event){
        //获取省市区数据
        this.inputArea.province = event.mp.detail.values[0].name;
        this.inputArea.city = event.mp.detail.values[1].name;
        this.inputArea.county = event.mp.detail.values[2].name;
        //关闭选择器
        this.onPopupClose();
      },
      //关闭选择器
      cancelSelectArea(){
        this.onPopupClose();
      },
      //关闭选择器
      onPopupClose(){
        this.popupFlag = false;
      },
      //填写详细地址
      inputAdressChange(event){
        this.inputAdress = event.mp.detail;
      },
      //填写联系电话
      inputPhoneChange(event){
        this.inputPhone = event.mp.detail;
      }


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


</style>
