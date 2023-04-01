<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框与添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="goAddPage"
            >添加商品</el-button
          ></el-col
        >
      </el-row>
      <!-- table表格区域 -->
      <el-row>
        <el-table :data="goodsList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name"></el-table-column>
          <el-table-column
            label="商品价格（元）"
            prop="goods_price"
            width="120"
          ></el-table-column>
          <el-table-column
            label="商品重量"
            prop="goods_weight"
            width="90"
          ></el-table-column>
          <el-table-column label="创建时间" prop="add_time" width="160"
            ><template #default="scope">{{
              scope.row.add_time | timeFormat
            }}</template></el-table-column
          >
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="editGoods(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="removeById(scope.row)"
                >删除</el-button
              >
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
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        >
        </el-pagination>
      </el-row>
    </el-card>

    <!-- 编辑商品对话框 -->
    <el-dialog
      title="编辑商品"
      :visible.sync="dialogVisible"
      width="40%"
      @close="closeDialog"
    >
      <el-form
        ref="editFormRef"
        :model="editGoodsList"
        :rules="editGoodsRules"
        label-width="80px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsList.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editGoodsList.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGoodsList.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editGoodsList.goods_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit(editGoodsList.goods_id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getGoodsList()
  },
  data() {
    return {
      queryInfo: {
        // 查询参数对象
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0, // 商品列表总数据
      goodsList: [
        // 商品列表
      ],
      dialogVisible: false, // 控制编辑对话框显示与隐藏
      editGoodsList: {
        // 编辑商品列表
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: {},
        attrs: []
      },
      editGoodsRules: {
        // 编辑商品表单验证规则
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getGoodsList() {
      // 根据分页获取对应的商品列表
      const { data: res } = await this.$http({
        method: 'get',
        url: 'goods',
        params: {
          query: this.queryInfo.query,
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败!')
      } else {
        this.total = res.data.total
        this.goodsList = res.data.goods
      }
    },
    handleSizeChange(newSize) {
      // 页大小改变触发
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(pageNum) {
      // 当前页码值改变触发
      this.queryInfo.pagenum = pageNum
      this.getGoodsList()
    },
    async removeById(row) {
      // 删除商品操作
      const confirm = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirm !== 'confirm') {
        return this.$message.info('取消了删除操作!')
      } else {
        const { data: res } = await this.$http({
          method: 'delete',
          url: `goods/${row.goods_id}`
        })
        if (res.meta.status !== 200) {
          return this.$message.error('删除商品失败!')
        } else {
          this.$message.success('删除商品成功!')
          this.getGoodsList()
        }
      }
    },
    async editGoods(row) {
      // 编辑商品事件
      this.dialogVisible = true
      this.editGoodsList = row
    },
    closeDialog() {
      // 关闭编辑对话框，重置验证规则
      this.$refs.editFormRef.resetFields()
    },
    confirmEdit(id) {
      // 提交编辑商品列表数据
      this.$refs.editFormRef.validate(async(valid) => {
        if (!valid) {
          return this.$message.error('请检查，有错误数据!')
        } else {
          const { data: res } = await this.$http({
            method: 'put',
            url: `goods/${id}`,
            data: {
              goods_cat: '0',
              goods_name: this.editGoodsList.goods_name,
              goods_price: this.editGoodsList.goods_price,
              goods_number: this.editGoodsList.goods_number,
              goods_weight: this.editGoodsList.goods_weight,
              goods_introduce: this.editGoodsList.goods_introduce,
              pics: this.editGoodsList.pics,
              attrs: this.editGoodsList.attrs
            }
          })
          if (res.meta.status !== 200) {
            return this.$message.error('编辑商品失败!')
          } else {
            this.$message.success('编辑商品成功!')
            this.editGoodsList = {}
            this.dialogVisible = false
            this.getGoodsList()
          }
        }
      })
    },
    goAddPage() {
      // 添加商品事件
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped></style>
