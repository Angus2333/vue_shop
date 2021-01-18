<template>
  <div class="order-box">
    <s-header :name="'我的订单'" :backUrl="'/user'"></s-header>
    <van-tabs v-model:active="status" :color="'#1baeae'" class="order-tab" @click="onChangeTab">
      <van-tab title="全部" name=""></van-tab>
      <van-tab title="待付款" name="0"></van-tab>
      <van-tab title="待确认" name="1"></van-tab>
      <van-tab title="待发货" name="2"></van-tab>
      <van-tab title="已发货" name="3"></van-tab>
      <van-tab title="交易完成" name="4"></van-tab>
    </van-tabs>
    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="order-list-refresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          @load="onLoad"
          :offset="10"
          finished-text="没有更多了"
        >
        <div class="order-item-box" v-for="(item, index) in list" :key="index">
          <div class="order-item-header">
            <span>订单时间：{{item.createTime}}</span>
            <span>{{item.orderStatusString}}</span>
          </div>

          <van-card
            v-for="good in item.newBeeMallOrderItemVOS"
            :key="good.goodsId"
            :num="good.goodsCount"
            :price="good.sellingPrice"
            desc="全场包邮"
            :title="good.goodsName"
            :thumb="$filters.prefix(good.goodsCoverImg)"
          />
        </div>

        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import sHeader from "@/components/SimpleHeader";
import { reactive, toRefs } from 'vue';
import { getOrderList } from '@/service/order.js'
export default {
  components: {
    sHeader
  },
  setup() {
    const state = reactive({
      status: '',
      refreshing: false,
      loading: false,
      finished: false,
      page: 1,
      totalpage: 0,
      list: []
    })

    const onChangeTab = (name, title) => {
      console.log(name, title);
      state.status = name
      onRefresh()
    }

    // 请求数据
    const onLoad = () => { // 列表渲染自动执行
      if (!state.refreshing && state.page < state.totalpage) {
        state.page += 1
      }
      if (state.refreshing) {
        state.list = []
        state.refreshing = false
      }
      loadData()
    }

    const loadData = async () => {
      const { data, data: { list } } = await getOrderList({ pagenumber: state.page, status: state.status })
      state.list = state.list.concat(list)
      state.totalpage = data.totalPage
      state.loading = false
      if (state.page >= data.totalPage) {
        state.finished = true
      }
      console.log(state.list);
    }

    const onRefresh = () => {
      state.refreshing = true
      state.finished = false
      state.loading = true
      state.page = 1
      onLoad()
    }

    return {
      ...toRefs(state),
      onChangeTab,
      onRefresh,
      onLoad
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .order-box {
    .order-header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10000;
      .fj();
      .wh(100%, 44px);
      line-height: 44px;
      padding: 0 10px;
      .boxSizing();
      color: #252525;
      background: #fff;
      border-bottom: 1px solid #dcdcdc;
      .order-name {
        font-size: 14px;
      }
    }
    .order-tab {
      margin-top: 44px;
      position: fixed;
      left: 0;
      z-index: 1000;
      width: 100%;
      border-bottom: 1px solid #e9e9e9;
    }
    .content {
      height: calc(~"(100vh - 70px)");
      overflow: hidden;
      overflow-y: scroll; 
      margin-top: 78px;
    }
    .order-list-refresh {
      .van-card__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .van-pull-refresh__head {
        background: #f9f9f9;
      }
      // .van-list {
      //   min-height: calc(100vh - 88px);
      //   background: #f9f9f9;
      //   margin-top: 20px;
      // }
      .order-item-box {
        margin: 20px 10px;
        background-color: #fff;
        .order-item-header {
          padding: 10px 20px 0 20px;
          display: flex;
          justify-content: space-between;
        }
        .van-card {
          background-color: #fff;
          margin-top: 0;
        }
      }
    }
  }
</style>