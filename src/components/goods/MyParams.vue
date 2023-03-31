<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        show-icon
        title="注意：只允许第三级分类设置相关参数!"
        type="warning"
        :closable="false"
      ></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="{ ...cateProps, expandTrigger: 'hover' }"
            @change="handleChange"
            style="width: 20%"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="add"
            >添加参数</el-button
          >
          <!-- 动态参数列表 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template #default="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 动态切换tag标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="add"
            >添加属性</el-button
          >
          <!-- 静态属性列表 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template #default="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 动态切换tag标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <!-- 添加参数表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <!-- 添加参数表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList()
  },
  data() {
    return {
      cateList: [],
      cateProps: {
        // 级联选择框的配置对象
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [
        // 级联选择框双向绑定到的数据
      ],
      activeName: 'many', // 被激活的页签的名称
      manyTableData: [
        // 动态参数列表的数据
      ],
      onlyTableData: [
        // 静态属性列表的数据
      ],
      addDialogVisible: false, // 控制添加参数对话框的显示与隐藏
      addForm: {
        // 添加参数的表单数据对象
        attr_name: ''
      },
      addFormRules: {
        // 添加参数表单的验证规则
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false, // 控制修改对话框的显示与隐藏
      editForm: {
        // 修改参数的表单数据对象
        attr_name: ''
      },
      editFormRules: {
        // 修改参数表单的验证规则
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http({
        method: 'get',
        url: 'categories'
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      } else {
        this.cateList = res.data
        console.log(this.cateList)
      }
    },
    handleChange() {
      // 级联选择框选中项变化，会触发这个函数
      console.log(this.selectedCateKeys)
      this.getParamsData()
    },
    handleTabClick() {
      // tab页签点击事件被激活的名称
      this.getParamsData()
    },
    async getParamsData() {
      // 获取参数列表函数
      const { data: res } = await this.$http({
        // 根据所选分类Id，和当前面板，获取对应的参数
        method: 'get',
        url: `categories/${this.cateId}/attributes`,
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败!')
      } else {
        console.log(res.data)
        res.data.forEach((value, index, arr) => {
          value.attr_vals =
            value.attr_vals !== '' ? value.attr_vals.split(' ') : []
          // 控制每个tag的显示与隐藏
          value.inputVisible = false
          // tag标签中输入的值
          value.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      }
    },
    add() {
      // 控制添加对话框的显示
      this.addDialogVisible = true
    },
    addDialogClosed() {
      // 监听添加对话框的关闭，并且清除数据与验证规则
      this.$refs.addFormRef.resetFields()
    },
    addParams() {
      // 点击按钮，添加参数
      this.$refs.addFormRef.validate(async(valid) => {
        if (!valid) {
          this.$message.error('有错误数据!')
        } else {
          const { data: res } = await this.$http({
            method: 'post',
            url: `categories/${this.cateId}/attributes`,
            data: {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName
            }
          })
          if (res.meta.status !== 201) {
            return this.$message.error('添加失败!')
          } else {
            this.$message.success('添加成功!')
            this.getParamsData()
            this.addDialogVisible = false
          }
        }
      })
    },
    editDialogClosed() {
      // 监听修改对话框的关闭，并且清除数据与验证规
      this.$refs.editFormRef.resetFields()
    },
    async showEditDialog(id) {
      // 点击按钮，展示修改对话框
      this.editDialogVisible = true
      const { data: res } = await this.$http({
        method: 'get',
        url: `categories/${this.cateId}/attributes/${id}`,
        params: {
          attr_sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败!')
      } else {
        this.editForm = res.data
      }
    },
    editParams() {
      // 点击按钮，修改参数
      this.$refs.editFormRef.validate(async(valid) => {
        if (!valid) {
          return this.$message.error('有错误信息!')
        } else {
          const { data: res } = await this.$http({
            method: 'put',
            url: `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            data: {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName
            }
          })
          if (res.meta.status !== 200) {
            return this.$message.error('编辑参数失败!')
          } else {
            this.$message.success('编辑参数成功!')
            this.getParamsData()
            this.editDialogVisible = false
          }
        }
      })
    },
    async removeParams(attrid) {
      // 根据id删除参数
      const dataConfirm = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (dataConfirm !== 'confirm') {
        return this.$message.error('取消删除参数操作!')
      } else {
        const { data: res } = await this.$http({
          method: 'delete',
          url: `categories/${this.cateId}/attributes/${attrid}`
        })
        if (res.meta.status !== 200) {
          return this.$message.error('删除参数失败!')
        } else {
          this.$message.success('删除参数成功!')
          this.getParamsData()
        }
      }
    },
    async handleInputConfirm(row) {
      // 切换tag失去焦点，或摁下enter都会触发
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return 0
      }
      // 如果没有return，则证明输入的内容要进行处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求，保存此次操作
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      // 将对attr_vals的操作，保存到数据库
      const { data: res } = await this.$http({
        method: 'put',
        url: `categories/${this.cateId}/attributes/${row.attr_id}`,
        data: {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('添加数据失败!')
      } else {
        this.$message.success('添加数据成功!')
      }
    },
    showInput(row) {
      // 点击按钮，展示文本输入框
      row.inputVisible = true
      // 让tag文本框自动获取焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose(i, row) {
      // 删除tag标签
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    isBtnDisabled() {
      // 如果按钮需要被警用，则返回true，否则返回false
      if (this.selectedCateKeys.length === 3) {
        return false
      } else {
        return true
      }
    },
    cateId() {
      // 当前选中的三级分类ID
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      } else {
        return 0
      }
    },
    titleText() {
      // 添加动态/静态面板的标题显示
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px;
}
.el-tag {
  margin: 15px;
}
.input-new-tag {
  width: 150px;
}
</style>
