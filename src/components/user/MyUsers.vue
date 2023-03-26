<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="40%"
        @close="addDialogClose"
      >
        <!-- 对话框内容主体区域 -->
        <el-form
          ref="addFormRef"
          :model="addForm"
          :rules="addFormRules"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="addForm.phone"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="40%"
        @close="editDialogClose"
      >
        <!-- 对话框内容主体区域 -->
        <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editFormRules"
          label-width="80px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <!-- 修改那妞 -->
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    // 验证邮箱的规则
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱!'))
    }

    // 验证手机号的规则
    const checkPhone = (rule, value, cb) => {
      const regPhone =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/

      if (regPhone.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确手机号'))
    }
    return {
      queryInfo: {
        // 查询信息
        query: '',
        // 当前的页数
        pagenum: 1,
        // 每一页多少条数据
        pagesize: 5
      },
      userList: [], // 用户列表
      total: 0, // 总数据数量
      dialogVisible: false, // 添加用户对话框状态
      editDialogVisible: false, // 控制修改用户对话框的隐藏与显示
      addForm: {
        // 添加用户的表单数据
        username: '',
        password: '',
        amail: '',
        phone: ''
      },
      addFormRules: {
        // 添加用户的验证规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          {
            required: true,
            message: '请输入电话',
            trigger: 'blur'
          },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      editForm: {
        // 修改用户的表单数据
        id: '',
        rid: '',
        username: '',
        mobile: '',
        email: ''
      },
      editFormRules: {
        // 修改表单的验证规则对象
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http({
        method: 'get',
        url: 'users',
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      } else {
        this.userList = res.data.users
        this.total = res.data.total
      }
      console.log(this.userList)
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch按钮状态的改变
    async changeState(userinfo) {
      const { data: res } = await this.$http({
        method: 'put',
        url: `users/${userinfo.id}/state/${userinfo.mg_state}`
      })
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败!')
      } else {
        this.$message.success('更新用户状态成功!')
      }
      console.log(res)
    },
    addDialogClose() {
      // 监听添加用户对话框的关闭事件
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      // 点击确定按钮， 添加新用户
      this.$refs.addFormRef.validate(async(valid) => {
        if (!valid) return this.$message.error('有错误信息！')
        const { data: res } = await this.$http({
          method: 'post',
          url: 'users',
          data: {
            username: this.addForm.username,
            password: this.addForm.password,
            email: this.addForm.email,
            mobile: this.addForm.phone
          }
        })
        if (res.meta.status !== 201) return this.$message.error('添加用户失败!')
        this.$message.success('添加用户成功!')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    async showEditDialog(id) {
      // 根据点击哪个修改按钮，查询那条数据
      const { data: res } = await this.$http({
        method: 'get',
        url: `users/${id}`
      })
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败!')
      } else {
        this.editForm = res.data
        console.log(this.editForm)
      }
      // 修改用户对话框的展开
      this.editDialogVisible = true
    },
    editDialogClose() {
      // 修改对话框关闭，重置验证
      this.$refs.editFormRef.resetFields()
    },
    editUser() {
      // 修改用户信息
      this.$refs.editFormRef.validate(async(valid) => {
        if (!valid) return this.$message.error('有错误信息!')
        else {
          const { data: res } = await this.$http({
            method: 'put',
            url: `users/${this.editForm.id}`,
            data: {
              email: this.editForm.email,
              mobile: this.editForm.mobile
            }
          })
          if (res.meta.status !== 200) {
            return this.$message.error('更新用户信息失败!')
          } else {
            this.$message.success('更新用户信息成功!')
            this.editDialogVisible = false
            this.getUserList()
          }
          console.log(res)
        }
      })
    },
    async removeUserById(id) {
      // 根据id删除对应的用户
      console.log(id)
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除!')
      } else {
        const { data: res } = await this.$http({
          method: 'delete',
          url: `users/${id}`
        })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('删除用户失败!')
        } else {
          this.$message.success('删除用户成功!')
          this.getUserList()
        }
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
