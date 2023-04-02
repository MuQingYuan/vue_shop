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
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  created() {},
  async mounted() {
    // mounted中此时页面dom结构已经渲染完毕
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http({
      // 获取折现图数据
      method: 'get',
      url: 'reports/type/1'
    })
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败! ')
    }
    // 准备要渲染的数据
    const result = { ...this.options, ...res.data }
    // 调用eachrts方法渲染数据
    myChart.setOption(result)
  },
  data() {
    return {
      options: {
        // 需要合并的数据
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
