<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div class="home">
        <el-row :gutter="30">
          <el-col :span="6" v-for="item in list" :key="item.num">
            <el-card class="box-card">
              <img :src="item.url" />
              <div class="right-area">
                <div class="top">{{ item.title }}</div>
                <div class="buttom">{{ item.num }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-card class="welcome">
              <img src="@/assets/img/tx.jpeg" class="avatar" />
              <h1>欢迎登录</h1>
            </el-card>
          </el-col>
          <el-col :span="18">
            <el-card id="main"></el-card>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-card id="pie-left"></el-card>
          </el-col>
          <el-col :span="8">
            <el-card id="pie-middle"></el-card>
          </el-col>
          <el-col :span="8">
            <el-card id="pie-right"></el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { init } from '../../components/useEcharts'
export default {
  mounted() {
    init()
  },
  data() {
    return {
      list: [
        {
          title: '访问量',
          num: 10400,
          url: require('@/assets/img/home/user.svg')
        },
        {
          title: '信息',
          num: 3721,
          url: require('@/assets/img/home/message.svg')
        },
        {
          title: '收入',
          num: 162973,
          url: require('@/assets/img/home/monkey.svg')
        },
        { title: '订单', num: 7935, url: require('@/assets/img/home/shop.svg') }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  position: relative;
  .right-area {
    position: absolute;
    right: 20px;
    top: 25px;
    text-align: center;
    .top {
      margin-bottom: 15px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.45);
    }
    .buttom {
      font-size: 20px;
      font-weight: 700;
    }
  }
}
#main,
.welcome {
  margin-top: 30px;
  height: 400px;
  text-align: center;
  h1 {
    margin-top: 40px;
  }
}
#pie-left,
#pie-right,
#pie-middle {
  margin-top: 30px;
  height: 300px;
}
#piee {
  margin-top: 30px;
  height: 200px;
}
.avatar {
  margin-top: 30px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
</style>
