import {
  IS_LOAD,
  USER_INFO,
  MENU_LIST,
  CART_LIST,
  USER_ADRESS_LIST,
  USER_SELECT_ADDRESS,
  USER_ADD_ADDRESS
} from './mutation-type'
export default {
  [IS_LOAD](state,data){
    state.isLoad = data;
  },
  [USER_INFO](state,data){
    state.userInfo = data;
  },
  [MENU_LIST](state,list_data){
    state.menuList = list_data;
  },
  [CART_LIST](state,data){
    state.cartList = data;
  },
  [USER_ADRESS_LIST](state,data){
    state.userAdressList = data;
  },
  [USER_ADD_ADDRESS](state,data){
    state.userAdressList.push(data);
  },
  [USER_SELECT_ADDRESS](state,data){
    state.userSelectAdress = data;
  },
}
