<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchInfo">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="serach"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-row>
        <el-table :data="orderList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column
            label="订单编号"
            prop="order_number"
            width="250"
          ></el-table-column>
          <el-table-column
            label="订单价格"
            prop="order_price"
          ></el-table-column>
          <el-table-column label="是否付款" prop="order_pay">
            <template #default="scope">
              <el-tag type="success" v-if="scope.row.order_pay === '1'"
                >已付款</el-tag
              >
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send"></el-table-column>
          <el-table-column label="下单时间" prop="create_time">
            <template #default="scope">
              {{ scope.row.create_time | timeFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <!-- 修改地址按钮 -->
              <el-tooltip
                effect="dark"
                content="修改订单地址"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showBox"
                ></el-button>
              </el-tooltip>
              <!-- 物流进度-->
              <el-tooltip
                effect="dark"
                content="物流进度"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="success"
                  icon="el-icon-location"
                  size="mini"
                  @click="showProgressBox"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 底部分页 -->
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <!-- 修改订单地址对话框 -->
    <el-dialog
      title="修改订单地址"
      :visible.sync="addressVisible"
      width="40%"
      @close="addressDialogClosed"
    >
      <!-- 表单数据 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRefs"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="40%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in progressInfo"
          :key="index"
          :timestamp="item.time"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  created() {
    this.getOrderList()
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      searchInfo: '',
      total: 0,
      orderList: [
        // 订单列表数据
      ],
      addressVisible: false, // 控制修改订单地址对话框显示与隐藏
      addressForm: {
        // 修改订单地址表单数据
        address1: [],
        address2: ''
      },
      addressFormRules: {
        // 修改订单地址表单验证规则
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      progressVisible: false, // 控制物流进度对话框显示与隐藏
      progressInfo: [
        // 物流信息
      ]
    }
  },
  methods: {
    async getOrderList() {
      // 获取订单列表数据
      const { data: res } = await this.$http({
        method: 'get',
        url: 'orders',
        params: {
          query: this.queryInfo.query,
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败!')
      } else {
        this.total = res.data.total
        this.orderList = res.data.goods
      }
    },
    handleCurrentChange(newPage) {
      // 当前第几页切换事件
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    handleSizeChange(newSize) {
      // 切换每页多少条数据事件
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    showBox() {
      // 展示修改订单地址对话框
      this.addressVisible = true
    },
    addressDialogClosed() {
      // 监听关闭修改订单地址对话框，并清空验证规则和数据
      this.$refs.addressFormRefs.resetFields()
    },
    showProgressBox() {
      // 物流进度对话框
      this.progressVisible = true
      this.progressInfo = [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context:
            '【北京市】北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 【北京海淀育新小区营业点】',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context:
            '快件在【北京顺义集散中心】已装车,准备发往 【北京海淀育新小区营业点】',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 【北京顺义集散中心】',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context:
            '快件在【北京宝胜营业点】已装车,准备发往 【北京顺义集散中心】',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ]
    },
    serach() {
      // 订单搜索事件
      this.searchInfo = ''
      this.getOrderList()
    }
  }
}
</script>

<style lang="less" scoped></style>
