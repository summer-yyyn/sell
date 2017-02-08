<template>
  <div>
    <v-header v-bind:seller="seller"></v-header>
    <div class="tab borderpx">
      <div class="tab-item">
        <a v-link="{path:'/goods'}">商品</a>
      </div>
      <div class="tab-item">
        <a v-link="{path:'/ratings'}">评论</a>
      </div>
      <div class="tab-item">
        <a v-link="{path:'/seller'}">商家</a>
      </div>
    </div>
    <router-view :seller="seller"></router-view>

  </div>
</template>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue';
  const ERR_OK = 0;

  export default{
    data() {
      return {
        seller: {}
      };
    },
    created() {
      this.$http.get('/api/seller').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.seller = response.data;
          console.log(this.seller);
        }
      });
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="less">
  @import (reference) "./common/stylus/index.less";
  /*@import (reference) "./common/stylus/base.less";*/

  .flexpr {
    display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
    display: -ms-flexbox; /* TWEENER - IE 10 */
    display: -webkit-flex; /* NEW - Chrome */
    display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
  }
  .flexnum(@num){
    -webkit-box-flex: @num;      /* OLD - iOS 6-, Safari 3.1-6 */
    -moz-box-flex: @num;         /* OLD - Firefox 19- */
    /*width: 20%;               !* For old syntax, otherwise collapses. *!*/
    -webkit-flex: @num;          /* Chrome */
    -ms-flex: @num;              /* IE 10 */
    flex: @num;                  /* NEW, Spec - Opera 12.1, Firefox 20+ */

  }
  .tab {
    .flexpr;
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    font-size: .14rem;
    /*font-family: "microsoft yahei",SimSun,arial,sans-serif;*/
    .border-1px(rgba(7,17,27,0.1));

    .tab-item {
        .flexnum(1);
        text-align: center;

        a{
          display: block;
          font-size: .28rem;
          color: rgb(77,85,93);

          &.active{
            color: rgb(240,20,20);
           }
        }
    }
  }
</style>
