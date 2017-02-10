<template>
  <div class="sellers" v-el:sellers>
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active': favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="item in seller.supports">
            <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
            <span class="text">{{seller.supports[$index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" v-el:pic-wrapper>
          <ul class="pic-list" v-el:pic-list>
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item border-1px" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {saveToLocal, loadFromLocal} from 'common/js/stroe';
  import star from 'components/star/star';
  import split from 'components/split/split';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    watch: {
      'seller'() {
        this._initScroll();
        this._initPics();
      }
    },
    ready() {
      this._initScroll();
      this._initPics();
    },
    methods: {
      _initScroll () {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$els.sellers, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      _initPics () {
        if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$els.picList.style.width = width + 'px';
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$els.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
      },
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      }
    },
    components: {
      star,
      split
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/stylus/index.less";

  .sellers{
    position: absolute;
    top: 3.48rem;
    bottom: 0;
    width: 100%;
    left: 0;
    overflow: hidden;
    .overview{
      position: relative;
      padding: .36rem;
      .title{
        margin-bottom: .16rem;
        line-height: .28rem;
        color: rgb(7,17,27);
        font-size: .28rem;
      }
      .desc{
        padding-bottom: .36rem;
        font-size: 0;
        .border-1px(rgba(7,17,27,0.1));
        .star{
          display: inline-block;
          vertical-align: top;
          margin-right: .16rem;
        }
        .text{
          display: inline-block;
          vertical-align: top;
          margin-right: .24rem;
          line-height: .36rem;
          font-size: .2rem;
          color: rgb(77,85,93);
        }
      }
      .remark{
        .flexP();
        padding-top: .36rem;
        .block{
          flex: 1;
          text-align: center;
          border-right: 1px solid rgba(7,17,27,0.1);
          &:last-child{
            border: none;
           }
          h2{
            margin-bottom: .08rem;
            line-height: .2rem;
            font-size: .2rem;
            color: rgb(147,153,159);
          }
          .content{
            line-height: .48rem;
            font-size: .2rem;
            color: rgb(7,17,27);
            .stress{
              font-size: .48rem;
            }
          }
        }
      }
      .favorite{
        position: absolute;
        width: 1rem;
        right: .2rem;
        top: .36rem;
        font-size: 0;
        text-align: center;
        .icon-favorite{
          display: block;
          line-height: .48rem;
          font-size: .48rem;
          margin-bottom: .08rem;
          color: #d4d6d9;
          &.active{
            color: rgb(240,20,20);
           }
        }
        .text{
          line-height: .2rem;
          font-size: .2rem;
          color: rgb(77,85,93);
        }
      }
    }
    .bulletin{
      padding: .36rem .36rem 0 .36rem;
      .title{
        margin-bottom: .16rem;
        line-height: .28rem;
        font-size: .28rem;
        color: rgb(7,17,27);
      }
      .content-wrapper{
        padding: 0 .24rem .32rem;
        .border-1px(rgba(7,17,27,0.1));
        .content{
          line-height: .48rem;
          font-size: .24rem;
          color: rgb(240,20,20);
        }
      }
      .supports{
        .support-item{
          padding: .32rem .24rem;
          font-size: 0;
          .border-1px(rgba(7,17,27,0.1));
          &:last-child{
           .border-none;
           }
        }
        .icon{
          display: inline-block;
          width: .32rem;
          height: .32rem;
          margin-right: .12rem;
          background-size: .32rem .32rem;
          vertical-align: top;
          background-repeat: no-repeat;
          &.decrease{
           .bg-image('../../components/seller/decrease_4');
           }
          &.discount{
           .bg-image('../../components/seller/discount_4');
           }
          &.guarantee{
           .bg-image('../../components/seller/guarantee_4');
           }
          &.invoice{
           .bg-image('../../components/seller/invoice_4');
           }
          &.special{
           .bg-image('../../components/seller/special_4');
           }
        }
        .text{
          line-height: .32rem;
          font-size: .24rem;
          color: rgb(7,17,27);
        }
      }
    }
    .pics{
      padding: .36rem;
      .title{
        margin-bottom: .24rem;
        line-height: .28rem;
        color: rgb(7,17,27);
        font-size: .28rem;
      }
      .pic-wrapper{
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        .pic-list{
          font-size: 0;
          .pic-item{
            display: inline-block;
            margin-right: 6px;
            width: 2.4rem;
            height: 1.8rem;
            &:last-child{
              margin: 0;
             }
            img{
              /*width: 2.4rem;*/
              /*height: 1.8rem;*/
            }
          }
        }
      }
    }
    .info{
        padding: .36rem .36rem 0 .36rem;
        color: rgb(7,17,27);
    .title{
      padding-bottom: .24rem;
      line-height: .24rem;
      font-size: .28rem;
    .border-1px(rgba(7,17,27,0.1));
    }
    .info-item{
      padding: .32rem .24rem;
      .border-1px(rgba(7,17,27,0.1));
        line-height: .32rem;
        font-size: .24rem;
      &:last-child{
       .border-none;
       }
      }
    }
  }
</style>
