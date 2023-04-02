<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col
          ><el-button type="primary" @click="addRole"
            >添加角色</el-button
          ></el-col
        >
      </el-row>

      <!--添加角色弹出框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="dialogVisible"
        width="40%"
        @close="resetRule"
      >
        <el-form
          :model="addForm"
          :rules="addRoleRules"
          ref="addRoleRefs"
          label-width="90px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoleList">确 定</el-button>
        </span>
      </el-dialog>

      <!--编辑角色弹出框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="editDialogVisible"
        width="40%"
        @close="editresetRule"
      >
        <el-form
          :model="editForm"
          :rules="editRoleRules"
          ref="editRoleRefs"
          label-width="90px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRolrList(editForm.roleId)"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template #default="scope">
            <el-row
              class="vcenter"
              v-for="(item1, id1) in scope.row.children"
              :key="id1"
              :class="['bdbottom', id1 === 0 ? 'bdtop' : '']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  class="vcenter"
                  :class="id2 === 0 ? '' : 'bdtop'"
                  v-for="(item2, id2) in item1.children"
                  :key="id2"
                >
                  <el-col :span="6">
                    <!-- 二级权限 -->
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3, id3) in item2.children"
                      :key="id3"
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="editRole(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有列表数据
      roleList: [],
      dialogVisible: false, // 添加弹窗显示与隐藏
      editDialogVisible: false, // 编辑弹窗显示与隐藏
      setRightDialogVisible: false, // 分配权限的对话框的显示与隐藏
      addForm: {
        // 添加用户表单数据
        roleName: '',
        roleDesc: ''
      },
      addRoleRules: {
        // 添加角色验证规则
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 6,
            message: '名称长度在 2 到 6 个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '名称长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      editForm: {
        // 编辑用户表单数据
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      editRoleRules: {
        // 编辑角色验证规则
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 6,
            message: '名称长度在 2 到 6 个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '名称长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      rightsList: [], // 所有权限数据
      treeProps: {
        // 树型控件的属性绑定对象
        label: 'authName',
        children: 'children'
      },
      defKeys: [
        // 默认选中的节点Id值数组
      ],
      roleId: '' // 角色id
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      // 获取所有列表数据
      const { data: res } = await this.$http({
        method: 'get',
        url: 'roles'
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      } else {
        this.roleList = res.data
      }
    },
    addRole() {
      // 添加弹出框事件
      this.dialogVisible = true
    },
    resetRule() {
      // 重置验证规则
      this.$refs.addRoleRefs.resetFields()
    },
    addRoleList() {
      // 添加角色事件
      this.$refs.addRoleRefs.validate(async(valid) => {
        if (!valid) {
          return this.$message.error('添加角色失败!')
        } else {
          const { data: res } = await this.$http({
            method: 'post',
            url: 'roles',
            data: {
              roleName: this.addForm.roleName,
              roleDesc: this.addForm.roleDesc
            }
          })
          if (res.meta.status !== 201) {
            return this.$message.error('添加角色失败!')
          } else {
            this.$message.success('添加角色成功!')
            this.dialogVisible = false
            this.getRoleList()
          }
        }
      })
    },
    async editRole(id) {
      // 根据ID查询修改角色
      const { data: res } = await this.$http({
        method: 'get',
        url: `roles/${id}`
      })
      if (res.meta.status !== 200) {
        return this.$message.error('ID查询角色失败!')
      } else {
        this.editForm.roleId = res.data.roleId
        this.editForm.roleName = res.data.roleName
        this.editForm.roleDesc = res.data.roleDesc
      }
      this.editDialogVisible = true
    },
    editresetRule() {
      // 修改重置验证规则
      this.$refs.editRoleRefs.resetFields()
    },
    editRolrList(id) {
      // 编辑角色事件
      this.$refs.editRoleRefs.validate(async(valid) => {
        if (!valid) {
          return this.$message.error('修改角色失败!')
        } else {
          const { data: res } = await this.$http({
            method: 'put',
            url: `roles/${id}`,
            data: {
              roleName: this.editForm.roleName,
              roleDesc: this.editForm.roleDesc
            }
          })
          if (res.meta.status !== 200) {
            return this.$message.error('修改角色失败!')
          } else {
            this.$message.success('修改角色成功!')
            this.getRoleList()
            this.editDialogVisible = false
          }
        }
      })
    },
    async deleteRole(id) {
      // 删除角色事件
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
        return this.$message.info('取消删除操作!')
      } else if (res === 'confirm') {
        const { data: res } = await this.$http({
          method: 'delete',
          url: `roles/${id}`
        })
        if (res.meta.status !== 200) {
          return this.$message.error('删除角色失败!')
        } else {
          this.$message.success('删除角色成功!')
          this.getRoleList()
        }
      }
    },
    async removeRightById(roleId, rightId) {
      // 删除三级权限
      const res = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (res !== 'confirm') {
        return this.$message.info('取消删除权限!')
      } else {
        const { data: res } = await this.$http({
          method: 'delete',
          url: `roles/${roleId.id}/rights/${rightId}`
        })
        if (res.meta.status !== 200) {
          return this.$message.error('取消权限失败!')
        } else {
          this.$message.success('取消权限成功!')
          roleId.children = res.data
        }
      }
    },
    async showSetRightDialog(role) {
      // 展示权限对话框
      this.roleId = role.id
      const { data: res } = await this.$http({
        method: 'get',
        url: 'rights/tree'
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败!')
      } else {
        this.rightsList = res.data
      }
      this.getLeafKeys(role, this.defKeys) // 递归获取三级节点的id
      this.setRightDialogVisible = true
    },
    getLeafKeys(node, arr) {
      // 通过递归的形式，获取角色下所有三级权限的ID，并保存到defKeys数组中
      if (!node.children) {
        // 如果当前node节点不包含children属性，则是三级节点
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClosed() {
      // 监听权限分配对话框的关闭事件
      this.defKeys = []
    },
    async allotRights() {
      // 点击为角色分配权限
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http({
        method: 'post',
        url: `roles/${this.roleId}/rights`,
        data: {
          rids: idStr
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色权限失败!')
      } else {
        this.$message.success('分配角色权限成功!')
      }
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  width: 90%;
  margin: 0 auto;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
