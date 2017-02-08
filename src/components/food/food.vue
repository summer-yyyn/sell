<template>
    <div v-show="showFlag" class="food" transition="move" v-el:food>
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="tittle">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
        </div>
        <div class="cartcontrol-wrapper">
          <cartcontrol :food="food"></cartcontrol>
        </div>
        <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFrist" transition="fade">加入购物车</div>
      </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less">
  @import "../../common/stylus/index.less";

  .food{
    position: fixed;
    left: 0;
    top: 0;
    bottom: .96rem;
    z-index: 30;
    width: 100%;
    background-color: #ffffff;
    &.move-transition{
      transition: all 0.2s linear;
      transform: translate3d(0,0,0);
     }
    &.move-enter,&.move-leave{
     /*相对自身宽度平移100%，从右到左的平移动画*/
      transform: translate3d(100%,0,0);
    }
    .image-header{
      position: relative;
      width: 100%;
      height: 0;
      /*此处100%为宽度的100%，w3c规定 padding-top 或者padding-bottom=100%时，100%为屏幕宽度的100%*/
      padding-top: 100%;
      img{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .back{
        position: absolute;
        top: .2rem;
        left: 0;
        .icon-arrow_lift{
          display: block;
          padding: .2rem;
          font-size: .4rem;
          color: #ffffff;
          /*background-color: #f8f8f8;*/
          /*border-radius: 50%;*/
        }
      }
    }
    .content{
      padding: .36rem;
      .tittle{
        line-height: .28rem;
        margin-bottom: .16rem;
        font-size: .28rem;
        font-weight: 700;
        color: rgb(7,17,27);
      }
      .detail{
        margin-bottom: .36rem;
        line-height: .2rem;
        height: .2rem;
        font-size: 0;
        .sell-count,
        .rating{
          font-size: .2rem;
          color: rgb(147,153,159);
        }
        .sell-count{
          margin-right: .24rem;
        }
      }
      .price{
        font-weight: 700;
        font-size: 0;
        line-height: .48rem;
        .now{
          margin-right: .16rem;
          font-size: .28rem;
          color: rgb(240,20,20);
        }
        .old{
          text-decoration: line-through;
          font-size: .2rem;
          color: rgb(147,153,159);
        }
      }
    }
    .cartcontrol-wrapper{
      position: absolute;
      right: .24rem;
      bottom: .24rem;
    }
    .buy{
      position: absolute;
      right: .36rem;
      bottom: .36rem;
      height: .48rem;
      background-color: rgb(0,160,220);
      z-index: 10;
      line-height: .48rem;
      padding: 0 .24rem;
      box-sizing: border-box;
      font-size: .2rem;
      color: #ffffff;
      border-radius: .24rem;
      &.fade-transition{
        transition: all 0.2s;
        opacity: 1;
       }
       &.fade-enter,&.fade-leave{
        opacity: 0;
       }
    }
  }
</style>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import cartcontrol from 'components/cartcontrol/cartcontrol';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false
      };
    },
    methods: {
      show() {
        this.showFlag = true;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$els.food, {
              click: true // 可点击
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      addFrist(event) {
        if (!event._constructed) { // 浏览器原生没有这个属性，betterScroll里有，就可以区分是浏览器原生点击还是betterScroll点击，为了解决在非移动端情况下的点击会触发两次onclick事件
          return;
        }
        this.$dispatch('cart.add', event.target);
        Vue.set(this.food, 'count', 1);
      }
    },
    components: {
      cartcontrol
    }
  };
</script>
