<template>
    <div class="cartcontrol">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart" transition="move">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
      <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
    </div>
</template>
<style lang="less" rel="stylesheet/less">
  @import "../../common/stylus/index.less";
  .cartcontrol{
    font-size: 0;
    .cart-decrease{
      display: inline-block;
      padding: .12rem;
      transition: all 0.4s linear;
      &.move-transition{
        opacity: 1;
        transform: translate3d(0, 0, 0);
       }
      .inner{
        font-size: .48rem;
        line-height: .48rem;
        color: rgb(0,160,220);
        display: inline-block;
        transition: all 0.4s linear;
        transform: rotate(0);
      }
      &.move-enter,&.move-leave{
        opacity: 0;
        transform: translate3d(.48rem, 0, 0);
        .inner{
          transform: rotate(180deg);
        }
      }
    }
    .cart-decrease{

    }
    .cart-count{
      display: inline-block;
      vertical-align: top;
      width: .24rem;
      padding-top: .12rem;
      line-height: .48rem;
      text-align: center;
      font-size: .2rem;
      color: rgb(147, 153, 159);
    }
    .cart-add{
      display: inline-block;
      padding: .12rem;
      font-size: .48rem;
      line-height: .48rem;
      color: rgb(0,160,220);
    }
  }
</style>
<script type="text/ecmascript-6">
  import vue from 'vue';

  export default{
    props: {
      food: {
        type: Object
      }
    },
//      created() {
// //        console.log(this.food);
//      },
    methods: {
      addCart(event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          vue.set(this.food, 'count', 1);
          this.food.count = 1;
        } else {
          this.food.count ++;
        }
        this.$dispatch('cart.add', event.target);
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count --;
        }
      }
    }
  };
</script>
