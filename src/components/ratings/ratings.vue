<template>
  <div class="ratings" v-el:ratings>
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodeScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" v-show="needShow(rating.rateType, rating.text)" class="rating-item">
            <div class="avatar">
              <img :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend.length && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {formatDate} from 'common/js/date';
  import star from 'components/star/star';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';

  const ALL = 2;
  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: false
      };
    },
    created() {
      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {   // 保证dom被渲染
            this.scroll = new BScroll(this.$els.ratings, {
              click: true // 可点击
            });
          });
        }
      });
    },
    filters: {
      formatDate (time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
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
    methods: {
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
    components: {
      star,
      split,
      ratingselect
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/stylus/index.less";

  .ratings{
    position: absolute;
    top: 3.48rem;
    bottom: 0;
    width: 100%;
    left: 0;
    overflow: hidden;
    .overview{
      .flexP;
      padding: .36rem 0;
      .overview-left{
        flex: 0 0 2.74rem;
        padding: .12rem 0;
        width: 2.74rem;
        text-align: center;
        border-right: 1px solid rgba(7,17,27,0.1);
        @media only screen and (max-width: 6.4rem) {
          flex: 0,0,2.4rem;
          width: 2.4rem
        }
        .score{
          margin-bottom: .12rem;
          line-height: .56rem;
          font-size: .48rem;
          color: rgb(255,153,0);
        }
        .title{
          margin-bottom: .16rem;
          line-height: .48rem;
          font-size: .24rem;
          color: rgb(7,17,27);
        }
        .rank{
          line-height: .2rem;
          font-size: .2rem;
          color: rgb(147,153,159);
        }
      }
      .overview-right{
        flex: 1;
        padding: .12rem 0 .12rem .48rem;
        @media only screen and (max-width: 6.4rem) {
          padding-left: .12rem;
        }
        .score-wrapper{
          margin-bottom: .16rem;
          font-size: 0;
          .title{
            display: inline-block;
            vertical-align: top;
            font-size: .24rem;
            line-height: .36rem;
            color: rgb(7,17,27);
          }
          .star{
            display: inline-block;
            margin: 0 .24rem;
            vertical-align: top;
          }
          .score{
            display: inline-block;
            vertical-align: top;
            line-height: .36rem;
            font-size: .24rem;
            color: rgb(255,153,0);
          }
        }
        .delivery-wrapper{
          font-size: 0;
          .title{
            font-size: .24rem;
            line-height: .36rem;
            color: rgb(7,17,27);
          }
          .delivery{
            margin-left: .24rem;
            font-size: .24rem;
            color: rgb(147,153,159);
          }
        }
      }
    }
    .rating-wrapper{
      padding: 0 .36rem;
      .rating-item{
        .flexP;
        padding: .36rem 0;
        .border-1px(rgba(7,17,27,0.1));
        .avatar{
          flex: 0 0 .56rem;
          width: .56rem;
          margin-right: .24rem;
          img{
            width: .56rem;
            height: .56rem;
            border-radius: 50%;
          }
        }
        .content{
          flex: 1;
          position: relative;
          .name{
            margin-bottom: .08rem;
            line-height: .24rem;
            font-size: .2rem;
            color: rgb(7,17,27);
          }
          .star-wrapper{
            margin-bottom: .12rem;
            font-size: 0;
            .star{
              display: inline-block;
              vertical-align: top;
              margin-right: .12rem;
            }
            .delivery{
              display: inline-block;
              vertical-align: top;
              font-size: .2rem;
              line-height: .24rem;
              color: rgb(147,153,159);
            }
          }
          .text{
            line-height: .36rem;
            font-size: .24rem;
            color: rgb(7,17,27);
            margin-bottom: .16rem;
          }
          .recommend{
            line-height: .32rem;
            font-size: 0;
            .icon-thumb_up,
            .item{
              display: inline-block;
              margin: 0 .16rem .08rem 0;
              font-size: .18rem;
            }
            .icon-thumb_up{
              color: rgb(0,160,220);
            }
            .item{
              padding: 0 .12rem;
              border: 1px solid rgba(7,17,27,0.1);
              border-radius: 1px;
              color: rgb(147,153,159);
              background-color: #ffffff;
            }
          }
          .time{
            position: absolute;
            top: 0;
            right: 0;
            line-height: .24rem;
            font-size: .2rem;
            color: rgb(147,153,159);
          }
        }
      }
    }
  }
</style>
