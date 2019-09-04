import {
  IS_LOAD,
  USER_INFO,
  MENU_LIST,
  CART_LIST,
  USER_ADRESS_LIST,
  USER_SELECT_ADDRESS,
  USER_ADD_ADDRESS} from './mutation-type'
import listData from '../datas/list'
import userAdress from '../datas/userAdressList'

export default {
  updataIsLoad({commit},data){
    commit(IS_LOAD,data);
  },
  updataUserInfo({commit},data){
    commit(USER_INFO,data);
  },
  getMenuList({commit}){
    commit(MENU_LIST,listData);
  },
  getCartList({commit},data){
    commit(CART_LIST,data);
  },
  getAdressList({commit}){
    commit(USER_ADRESS_LIST,userAdress);
  },
  addAdressToList({commit},data){
    commit(USER_ADD_ADDRESS,data);
  },
  getSelectAdress({commit},data){
    commit(USER_SELECT_ADDRESS,data);
  },
}
