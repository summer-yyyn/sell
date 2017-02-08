<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-tit"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <span class="icon-keyboard_arrow_right"></span>
    </div>
    <div class="background">
      <img :src="seller.avatar">
    </div>
    <div v-show="detailShow" class="detail" transition="fade">
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :size="48" :score="seller.score"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="support">
            <li class="support-item" v-for="item in seller.supports">
              <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
              <span class="text">{{seller.supports[$index].description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="hideDetail">
        <i class="icon-close"></i>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'components/star/star';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailShow: false
      };
    },
    methods: {
      showDetail: function() {
        this.detailShow = true;
      },
      hideDetail() {
        this.detailShow = false;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    components: {
      star
    }
  };
</script>

<style lang="less">
  @import "../../common/stylus/index.less";
  .header{
    color: #ffffff;
    background: rgba(7,17,27,0.5);
    position: relative;
    overflow: hidden;
    .content-wrapper{
      font-size: 0;
      position: relative;
      padding: .48rem .24rem .36rem .48rem;
        .avatar{
          vertical-align: top;
          display: inline-block;
          img{
            width: 1.28rem;
            height: 1.28rem;
            border-radius: 2px;
          }
        }
        .content{
          margin-left: .32rem;
          display: inline-block;
          .title{
            margin-top: .04rem;
            .brand{
              width: .6rem;
              height: .36rem;
              display: inline-block;
              vertical-align: top;
              .bg-image('../../components/header/brand');
              background-repeat: no-repeat;
              background-size: .6rem .36rem;
            }
            .name{
              font-size: .32rem;
              margin-left: .12rem;
              font-weight: bold;
              line-height: .36rem;
            }
          }
          .description{
            font-size: .24rem;
            font-weight: 200;
            line-height: .24rem;
            margin-top: .16rem;
          }
          .supports{
            margin-top: .2rem;
            .icon{
              display: inline-block;
              width: .24rem;
              height: .24rem;
              margin-right: .08rem;
              background-size: .24rem .24rem;
              vertical-align: top;
              background-repeat: no-repeat;
              &.decrease{
               .bg-image('../../components/header/decrease_1');
              }
              &.discount{
               .bg-image('../../components/header/discount_1');
               }
              &.guarantee{
               .bg-image('../../components/header/guarantee_1');
               }
              &.invoice{
               .bg-image('../../components/header/invoice_1');
               }
              &.special{
               .bg-image('../../components/header/special_1');
               }
            }
            .text{
              font-size: .2rem;
              line-height: .24rem;
            }
          }
        }
        .support-count{
          position: absolute;
          right: .24rem;
          bottom: .34rem;
          padding: 0 .16rem;
          height: .48rem;
          line-height: .48rem;
          border-radius: .24rem;
          background-color: rgba(0,0,0,0.2);
          text-align: center;
          .count{
            font-size: .2rem;
            vertical-align: top;
            line-height: .48rem;
          }
          .icon-keyboard_arrow_right{
            font-size: .2rem;
            line-height: .48rem;
            margin-left: .02rem;
          }

        }
    }
    .bulletin-wrapper{
      position: relative;
      height: .56rem;
      line-height: .56rem;
      background-color: rgba(7,17,27,0.2);
      padding: 0 .44rem 0 .24rem;
      white-space: nowrap;
      overflow: hidden;
      font-size: 0.2rem;
      text-overflow: ellipsis;
      .bulletin-tit{
        display: inline-block;
        vertical-align: top;
        width: .44rem;
        height: .24rem;
        margin-top: .16rem;
        .bg-image('../../components/header/bulletin');
        background-repeat: no-repeat;
        background-size: .44rem .24rem;
      }
      .bulletin-text{
        vertical-align: top;
        font-size: .2rem;
        margin: 0 .08rem;
      }
      .icon-keyboard_arrow_right{
        position: absolute;
        right: .24rem;
        font-size: .2rem;
        top: .18rem;
      }
    }
    .background{
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      filter: blur(10px);
      width: 100%;
      height: 100%;
      img{
        width: 100%;
        height: 100%;
      }
    }

  .detail{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 0.5s;
    backdrop-filter: blur(10px);
    overflow: auto;
    &.fade-transition{
      .opacity(1,100);
      background-color: rgba(7,17,27,0.8);
     }
    &.fade-enter,
    &.fade-leave{
     .opacity(0,0);
      background-color: rgba(7,17,27,0);
     }
    .detail-wrapper{
      width: 100%;
      min-height: 100%;
      .detail-main{
        margin-top: 1.28rem;
        padding: 0 0 1.28rem 0;
        .name{
          line-height: .32rem;
          text-align: center;
          font-size: .32rem;
          font-weight: 700;
        }
        .star-wrapper{
          margin: .36rem 0 0 0;
          padding: .02rem 0;
          text-align: center;
        }
        .title{
          .flexP;
          width: 80%;
          margin: .56rem auto .48rem auto;
          .line{
            .flexC(1, 20%);
            position: relative;
            top: -0.12rem;
            border-bottom: 1px solid rgba(255,255,255,0.2);
          }
          .text{
            padding: 0 .24rem;
            font-size: .28rem;
            font-weight: 700;
          }
        }
        .support{
          width: 80%;
          margin: 0 auto;
          .support-item{
            padding: 0 .24rem;
            margin-bottom: .24rem;
            font-size: 0;
            &:last-child{
              margin-bottom: 0;
             }
             .icon{
               display: inline-block;
               width: .32rem;
               height: .32rem;
               vertical-align: top;
               margin-right: .12rem;
               background-size: .32rem .32rem;
               background-repeat: no-repeat;
              &.decrease{
               .bg-image('../../components/header/decrease_2');
               }
              &.discount{
               .bg-image('../../components/header/discount_2');
               }
              &.guarantee{
               .bg-image('../../components/header/guarantee_2');
               }
              &.invoice{
               .bg-image('../../components/header/invoice_2');
               }
              &.special{
               .bg-image('../../components/header/special_2');
               }
             }
            .text{
              line-height: .32rem;
              font-size: .24rem;
            }
          }
        }

        .bulletin{
          width: 80%;
          margin: 0 auto;
          .content{
            padding: 0 .24rem;
            line-height: .48rem;
            font-size: .24rem;
          }
        }

      }
    }
    .detail-close{
      position: relative;
      width: .64rem;
      height: .64rem;
      margin: -1.28rem auto;
      clear: both;
      font-size: .64rem;
    }
  }

  }
</style>
