import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from 'components/goods/goods';
import seller from 'components/seller/seller';
import ratings from 'components/ratings/ratings';
import rem from 'common/js/rem';

// import './common/stylus/index.less';
// import 'common/stylus/mixin.less';

Vue.use(VueRouter);
Vue.use(VueResource);

/* eslint-disable no-new */
// 为了保证new新对象的时候不是必须赋值给一个变量设定

let app = Vue.extend(App, rem);
let router = new VueRouter({
  linkActiveClass: 'active'
});
router.map({
  '/goods': {
    component: goods
  },
  '/seller': {
    component: seller
  },
  '/ratings': {
    component: ratings
  }
});

router.start(app, '#app');

// router.go('/goods'); // 默认去打开goods组件
