<template>
  <div class="goods">
    <div class="menu-wrapper" v-el:menu-wrapper>
      <ul>
        <li v-for="item in goods" class="menu-item" :class="{'current': currentIndex===$index}" @click="selectMenu($index, $event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" v-el:foods-wrapper>
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook"><!--class名字加hook表明这个名字只是为了让js选择没有任何样式-->
          <h1 class="tittle">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px ">
              <div class="icon">
                <img :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span>月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cart-control-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
              <div></div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart v-ref:shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
  <food :food="selectedFood" v-ref:food></food>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';

  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            };
          });
        });
      return foods;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

      this.$http.get('api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {  // 拿到数据dom更新后
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
    },
    methods: {
      _initScroll() {
        this.meunScroll = new BScroll(this.$els.menuWrapper, {
          click: true // click的时候不会阻止默认事件
        });

        this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
          click: true, // click的时候不会阻止默认事件
          probeType: 3 // betterS滚动时实时监听滚动的位置
        });

        this.foodsScroll.on('scroll', (pos) => { // 回调函数的参数是pos
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectMenu(index, event) {
        if (!event._constructed) { // 浏览器原生没有这个属性，betterScroll里有，就可以区分是浏览器原生点击还是betterScroll点击，为了解决在非移动端情况下的点击会触发两次onclick事件
          return;
        }
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      _drop(target) {
        this.$nextTick(() => {  // 下一次渲染执行，防止移动端卡顿， 异步执行下落动画， 体验优化
          this.$refs.shopcart.drop(target);
        });
      },
      selectFood(food, event) {
        if (!event._constructed) { // 浏览器原生没有这个属性，betterScroll里有，就可以区分是浏览器原生点击还是betterScroll点击，为了解决在非移动端情况下的点击会触发两次onclick事件
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    },
    events: {
      'cart.add'(target) {
        this._drop(target);
      }
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/stylus/index.less";

  .goods{
    .flexP;
    position: absolute;
    top: 3.48rem;
    bottom: .92rem;
    width: 100%;
    /*height: 100%;*/
    box-sizing: border-box;
    overflow: hidden;
    .menu-wrapper{
      flex: 0 0 1.6rem;  /*等分，内容不足缩放情况，占位空间*/
      width: 1.6rem;  /*兼容安卓浏览器需写宽度*/
      background-color: #f3f5f7;
      .menu-item{
        display: table;
        height: 1.08rem;
        width: 1.12rem;
        /*margin: 0 auto;  !*视频上是padding：0 .24rem;*!*/
        padding: 0 .24rem;
        line-height: .28rem;
        &.current{
          font-weight: 700;
          margin-top: -0.01rem;
          position: relative;
          background-color: #ffffff;
          z-index: 10;
          .text{
            .border-none()
          }
         }
        .icon{
          display: inline-block;
          width: .24rem;
          height: .24rem;
          vertical-align: top;
          margin-right: .04rem;
          background-size: .24rem .24rem;
          background-repeat: no-repeat;
            &.decrease{
             .bg-image('../../components/goods/decrease_3');
             }
            &.discount{
             .bg-image('../../components/goods/discount_3');
             }
            &.guarantee{
             .bg-image('../../components/goods/guarantee_3');
             }
            &.invoice{
             .bg-image('../../components/goods/invoice_3');
             }
            &.special{
             .bg-image('../../components/goods/special_3');
             }
        }
        .text{
          font-size: .24rem;
          display: table-cell;
          width: 1.12rem;
          vertical-align: middle;
          .border-1px(rgba(7,17,27,0.1));
        }
      }
    }
    .foods-wrapper{
      .flexC(1,80%);
      .food-list{
        .tittle{
          padding-left: .28rem;
          height: .52rem;
          line-height: .52rem;
          border-left: 2px solid #d9dde1;
          font-size: .24rem;
          color: rgb(147,153,159);
          background-color: #f3f5f7;
        }
        .food-item{
          .flexP;
          margin: .36rem;
          padding-bottom: .36rem;
          .border-1px(rgba(7,17,27,0.1));
          &:last-child{
            .border-none();
            margin-bottom: 0;
           }
           .icon{
             flex: 0 0 1.14rem;
             margin: 0 .2rem 0 0;
             width: 1.14rem;
             height: 1.14rem;
             img{
               width: 1.14rem;
               height: 1.14rem;
             }
           }
            .content{
              flex: 1;
              .name{
                font-size: .28rem;
                color: rgb(7,17,27);
                line-height: .28rem;
                margin: .04rem 0 .16rem 0;
                height: .28rem;
              }
              .desc,
              .extra{
                line-height: .2rem;
                font-size: .2rem;
                color: rgb(147,153,159);
              }
              .desc{
                margin-bottom: .16rem;
                line-height: .24rem;
              }
              .extra{
                span + span{
                  margin-left: .24rem;
                }
              }
              .price{
                font-weight: 700;
                font-size: .28rem;
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
              .cart-control-wrapper{
                position: absolute;
                right: 0;
                bottom: .24rem;
              }
            }
        }
      }
    }
  }
</style>
