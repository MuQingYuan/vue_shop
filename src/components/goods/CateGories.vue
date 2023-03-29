<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col
          ><!-- 添加分类 -->
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格 -->
      <el-row>
        <tree-table
          :data="cateList"
          :columns="columns"
          index-text="#"
          show-index
          border
          :expand-type="false"
          :selection-type="false"
          class="TreeTable"
        >
          <!-- 是否有效 -->
          <template #isOk="scope">
            <i
              class="el-icon-success"
              style="color: lightgreen"
              v-if="scope.row.cat_deleted === false"
            ></i>
            <i class="el-icon-error" style="color: red" v-else></i>
          </template>
          <!-- 排序 -->
          <template #order="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag
              size="mini"
              type="success"
              v-else-if="scope.row.cat_level == 1"
              >二级</el-tag
            >
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <!-- 操作 -->
          <template #option="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editCate(scope.row.cat_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteCate(scope.row.cat_id)"
              >删除</el-button
            >
          </template>
        </tree-table>
      </el-row>
      <!-- 分页区域 -->
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querInfo.pagenum"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="querInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClose"
    >
      <el-form
        ref="editCateRef"
        :rules="editCateRule"
        :model="editCateForm"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateDialog(editCateForm.cat_id)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="30%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="ruleaddCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" prop="">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="{
              ...casccadreProps,
              expandTrigger: 'hover',
              checkStrictly: true
            }"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      querInfo: {
        // 查询商品数据列表的参数
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [
        // 商品分类的数据列表，默认为空
      ],
      total: 0, // 总的数据条数
      columns: [
        // 为table_tree指定列的定义
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template', // 表示将当前列定义为模板列
          template: 'isOk' // 表示当前这一列使用的模板名称
        },
        {
          label: '排序',
          type: 'template', // 表示将当前列定义为模板列
          template: 'order' // 表示当前这一列使用的模板名称
        },
        {
          label: '操作',
          type: 'template', // 表示将当前列定义为模板列
          template: 'option' // 表示当前这一列使用的模板名称
        }
      ],
      addCateDialogVisible: false, // 控制添加分类的对话框的显示与隐藏
      editDialogVisible: false, // 控制编辑分类的对话框的显示与隐藏
      addCateForm: {
        // 添加分类的表单数据对象
        cat_name: '', // 将要添加的分类的名称
        cat_pid: 0, // 父级分类的Id
        cat_level: 0 // 分类的等级，默认要添加的是1级分类
      },
      addCateFormRules: { // 添加分类对话框验证规则
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [
        // 父级分类列表
      ],
      casccadreProps: {
        // 指定级联选择器的配置对象
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectKeys: [
        // 选中的父级分类的Id数组
      ],
      editCateForm: {
        // 编辑分类数据列表
        cat_id: 0,
        cat_name: ''
      },
      editCateRule: {
        // 编辑对话框验证规则
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '名称长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http({
        method: 'get',
        url: 'categories',
        params: {
          type: this.querInfo.type,
          pagenum: this.querInfo.pagenum,
          pagesize: this.querInfo.pagesize
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据列表失败!')
      } else {
        this.cateList = res.data.result
        this.total = res.data.total
      }
    },
    handleSizeChange(newSize) {
      // 监听pagesize改变
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      // 监听pagenum改变
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      // 点击按钮，展示添加分类的对话框
      this.addCateDialogVisible = true
      this.getParentCateList() // 调用函数
    },
    async getParentCateList() {
      // 获取父级分类的数据列表
      const { data: res } = await this.$http({
        method: 'get',
        url: 'categories',
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败!')
      } else {
        this.parentCateList = res.data
      }
    },
    parentCateChanged() {
      // 如果selectedKeys数组中length大于0， 证明选中的父级分类
      // 反之，说明没有选中任何父级分类
      if (this.selectKeys.length > 0) {
        // 父级分类打分Id
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      // 添加分类数据
      this.$refs.ruleaddCateFormRef.validate(async(valid) => {
        if (valid !== true) {
          return this.$message.error('有错误数据！')
        } else {
          const { data: res } = await this.$http({
            method: 'post',
            url: 'categories',
            data: {
              cat_pid: this.addCateForm.cat_pid,
              cat_name: this.addCateForm.cat_name,
              cat_level: this.addCateForm.cat_level
            }
          })
          if (res.meta.status !== 201) {
            return this.$message.error('添加分类失败!')
          } else {
            this.getCateList()
            this.$message.success('添加分类成功!')
            this.addCateDialogVisible = false
          }
        }
      })
    },
    addCateDialogClosed() {
      // 监听添加对话框关闭，并且清空数据
      this.$refs.ruleaddCateFormRef.resetFields()
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectKeys = []
    },
    editDialogClose() {
      // 编辑对话框关闭，清空验证规则
      this.$refs.editCateRef.resetFields()
    },
    editCate(id) {
      this.editDialogVisible = true
      this.editCateForm.cat_id = id
    },
    editCateDialog(id) {
      // 编辑分类操作
      this.$refs.editCateRef.validate(async(valid) => {
        if (!valid) {
          return this.$message.error('有错误信息!')
        } else {
          const { data: res } = await this.$http({
            method: 'put',
            url: `categories/${id}`,
            data: {
              cat_name: this.editCateForm.cat_name
            }
          })
          if (res.meta.status !== 200) {
            return this.$message.error('编辑更新失败!')
          } else {
            this.$message.success('编辑更新成功!')
            this.editDialogVisible = false
            this.getCateList()
          }
        }
      })
    },
    async deleteCate(id) {
      // 删除分类操作
      const res = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((error) => error)
      if (res !== 'confirm') {
        return this.$message.info('取消删除分类!')
      } else {
        const { data: res } = await this.$http({
          method: 'delete',
          url: `categories/${id}`
        })
        if (res.meta.status !== 200) {
          return this.$message.error('删除分类失败!')
        } else {
          this.$message.success('删除分类成功！')
          this.getCateList()
        }
      }
    }
  }
}
</script>

<style lang="less">
.TreeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
