<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'hightlight':totalCount>0}">
            <i class="icon-shopping_cart" :class="{'hightlight':totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'hightlight':totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <div transition="drop" v-for="ball in balls" v-show="ball.show" class="ball">
        <div class="inner inner-hook"></div>
      </div>
    </div>
    <div class="shopcart-list" v-show="listShow" transition="fold">
      <div class="list-header">
        <h1 class="tittle">购物车</h1>
        <span class="empty" @click="empty">清空</span>
      </div>
      <div class="list-content" v-el:list-content>
        <ul>
          <li class="food" v-for="food in selectFoods">
            <div class="name">{{food.name}}</div>
            <div class="price">
              <span>￥{{food.price*food.count}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food"></cartcontrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="list-mask" @click="hideList" v-show="listShow" transition="fade"></div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';

  export default {
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [
//            {
//              price: 3,
//              count: 2
//            }
          ];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      };
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
//          return '￥' + ${this.minPrice} + '元起送';
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;   // 折叠
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$els.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        };
        return show;
      }
    },
    methods: {
      drop(el) {
//        console.log(el);
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hideList() {
        this.fold = true;
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      }
    },
    transitions: {
      drop: {
        beforeEnter(el) {
          let count = this.balls.length;
          while (count--) {
            let ball = this.balls[count];
            if (ball.show) {
              let rect = ball.el.getBoundingClientRect();// 获取当前dom相对于视口的位置
              let x = rect.left - 32;
              let y = -(window.innerHeight - rect.top - 22);
              el.style.display = '';
              el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
              el.style.transform = `translate3d(0, ${y}px, 0)`;
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
              inner.style.transform = `translate3d(${x}px, 0, 0)`;
            };
          };
        },
        enter(el) {
          // 手动触发浏览器重绘  还不懂
          /* eslint-disable no-unused-vars */
          let rf = el.offsetHeight;
          this.$nextTick(() => {
            el.style.webkitTransform = 'translate3d(0, 0, 0)';
            el.style.transform = 'translate3d(0, 0, 0)';
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = 'translate3d(0, 0, 0)';
            inner.style.transform = 'translate3d(0, 0, 0)';
          });
        },
        afterEnter(el) {
          let ball = this.dropBalls.shift();
          if (ball) {
            ball.show = false;
            el.style.display = 'none';
          }
        }
      }
    },
    components: {
      cartcontrol
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/stylus/index.less";

  .shopcart{
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    width: 100%;
    height: .96rem;
    background-color: #cccccc;
    .content{
      .flexP;
      font-size: 0;
      background-color: #141d27;
      .content-left{
        .flexC(1, 80%);
        .logo-wrapper{
          display: inline-block;
          position: relative;
          top: -0.2rem;
          margin: 0 .24rem;
          padding: .12rem;
          width: 1.12rem;
          height: 1.12rem;
          box-sizing: border-box;
          vertical-align: top;
          border-radius: 50%;
          background-color: #141d27;
          .logo{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            vertical-align: top;
            background-color: #2b343c;
            text-align: center;
            &.hightlight{
              background-color: rgb(0,160,220);
             }
            .icon-shopping_cart{
              color: #80858a;
              font-size: .48rem;
              line-height: .88rem;
              &.hightlight{
                 color: #ffffff;
               }
            }
          }
          .num{
            position: absolute;
            top: 0;
            right: 0;
            width: .48rem;
            height: .32rem;
            line-height: .32rem;
            text-align: center;
            color: #ffffff;
            border-radius: .32rem;
            font-size: .18rem;
            font-weight: 700;
            background-color: rgb(240,20,20);
            box-shadow: 0 .08rem .16rem 0 rgba(0, 0, 0, 0.4);
          }
        }
        .price{
          display: inline-block;
          font-size: .32rem;
          color: rgba(255,255,255,0.4);
          line-height: .48rem;
          vertical-align: top;
          margin-top: .24rem;
          padding-right: .24rem;
          box-sizing: border-box;
          border-right: .01rem solid rgba(255, 255, 255,0.1);
          font-weight: 700;
          &.hightlight{
            color: #ffffff;
           }
        }
        .desc{
          display: inline-block;
          vertical-align: top;
          line-height: .48rem;
          margin: .24rem 0 0 .24rem;
          font-size: .2rem;
          color: rgba(255, 255, 255, 0.4);
        }
      }
      .content-right{
        flex: 0 0 2.1rem;
        width: 2.1rem;
        .pay{
          font-size: .24rem;
          height: .96rem;
          line-height: .96rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 700;
          background-color: #2b333b;
          &.not-enough{
            background-color: #2b333b;
           }
           &.enough{
            background-color: #00b43c;
            color: #ffffff;
            }
        }
      }
    }
    .ball-container{
      .ball{
        position: fixed;
        left: .64rem;
        bottom: .44rem;
        z-index: 200;
        &.drop-transition{
           transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75 ,0.41);
           /*transition: all 0.4s ;*/
          .inner{
            width: .32rem;
            height: .32rem;
            border-radius: 50%;
            background-color: rgb(0,160,220);
            transition: all 0.4s linear;
          }
         }
      }
    }
    .shopcart-list{
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      &.fold-transition{
        transition: all 0.5s;
        transform: translate3d(0, -100%, 0);
       }
       &.fold-enter,&.fold-leave{
        transform: translate3d(0, 0, 0);
        }
      .list-header{
        height: .8rem;
        line-height: .8rem;
        padding: 0 .36rem;
        background-color: #f3f5f7;
        border-bottom: 1px solid rgba(7,17,27,0.1);
        .tittle{
          float: left;
          font-size: .28rem;
          color: rgb(7,17,27);
        }
        .empty{
          float: right;
          font-size: .24rem;
          color: rgb(0,160,220);
        }
      }
      .list-content{
        padding: 0 .36rem;
        max-height: 4.34rem;
        overflow: hidden;
        background-color: #ffffff;
        .food{
          position: relative;
          padding: .24rem 0;
          height: .96rem;
          box-sizing: border-box;
          .border-1px(rgba(7,17,27,0.1));
          .name{
            /*display: inline-block;*/
            /*height: .48rem;*/
            line-height: .48rem;
            font-size: .28rem;
            color: rgb(7,17,27);
          }
          .price{
            position: absolute;
            right: 1.8rem;
            bottom: .24rem;
            height: .48rem;
            line-height: .48rem;
            font-size: .28rem;
            color: rgb(240,20,20);
            font-weight: 700;
          }
          .cartcontrol-wrapper{
            position: absolute;
            right: 0;
            bottom: .12rem;
          }
        }
      }
    }
  }
  .list-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    &.fade-transition{
      transition: all 0.5s;
      opacity: 1;
      background-color: rgba(7,17,27,0.6);
     }
     &.fade-enter,&.fade-leave{
      opacity: 0;
      background-color: rgba(7,17,27,0);
     }
  }
</style>
