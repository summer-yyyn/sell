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
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFrist" transition="fade">加入购物车</div>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="tittle">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="tittle">商品评价</h1>
          <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <i :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></i>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
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
      position: relative;
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
    .info{
      padding: .36rem;
      .tittle{
        line-height: .28rem;
        margin-bottom: .12rem;
        font-size: .28rem;
        color: rgb(7,17,27);
      }
      .text{
        line-height: .48rem;
        padding: 0 .16rem;
        font-size: .24rem;
        color: rgb(77,85,93);
      }
    }
    .rating{
      padding-top: .36rem;
      .tittle{
        line-height: .28rem;
        font-size: .28rem;
        color: rgb(7,17,27);
        margin-left: .18rem;
      }
      .rating-wrapper{
        padding: 0 18px;
        .rating-item{
          position: relative;
          padding: .32rem 0;
          .border-1px(rgba(7,17,27,0.1));
          .user{
            position: absolute;
            right: 0;
            top: .32rem;
            line-height: .24rem;
            font-size: 0;
            .name{
              display: inline-block;
              vertical-align: top;
              margin-right: .12rem;
              font-size: .2rem;
              color: rgb(147,153,159);
            }
            .avatar{
              border-radius: 50%;
            }
          }
          .time{
            margin-bottom: .12rem;
            line-height: .24rem;
            font-size: .2rem;
            color: rgb(147,153,159);
          }
          .text{
            line-height: .32rem;
            font-size: .24rem;
            color: rgb(7,17,27);
            .icon-thumb_up,
            .icon-thumb_down{
              margin-right: .08rem;
              line-height: .32rem;
              font-size: .24rem;
            }
            .icon-thumb_up{
              color: rgb(0,160,220);
            }
            .icon-thumb_down{
              color: rgb(147,153,159);
            }
          }
        }
        .no-rating{
          padding: .32rem 0;
          font-size: .24rem;
          color: rgb(147,153,159);
        }
      }
    }
  }
</style>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import {formatDate} from 'common/js/date';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';

//  const POSITIVE = 0;
//  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      show() {
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = false;
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
      },
      needShow (type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      }
    },
    events: {
      'ratingtype.select'(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      'content.toggle'(onlyContent) {
        this.onlyContent = onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>
