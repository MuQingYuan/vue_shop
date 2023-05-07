<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img
          src="../assets/logo.png"
          alt=""
          style="width: 50px; height: 50px"
        />
        <span>电商后台管理系统</span>
      </div>
      <!-- <el-button class="outLogn" type="info" @click="outLognDialog"
        >退出</el-button
      > -->
      <div class="right-area">
        <img src="@/assets/img/tx.jpeg" class="avatar" />
        <el-popover
          placement="top-start"
          width="150"
          trigger="hover"
          content="点击退出登录"
          @click="outLognDialog"
        >
          <el-button
            class="btn"
            style="outline: none; border: none"
            @click="outLognDialog"
            >退出登录</el-button
          >
          <span slot="reference">{{ avatarMessage.username }}</span>
        </el-popover>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          <i class="el-icon-s-operation"></i>
        </div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#fff"
          text-color="#000"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="'/' + item.path"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + sonItem.path"
              v-for="sonItem in item.children"
              :key="sonItem.id"
              @click="saveNavState('/' + sonItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ sonItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  async created() {
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
    const { data: res } = await this.$http({
      method: 'post',
      url: 'login',
      data: {
        username: 'admin',
        password: '123456'
      }
    })
    if (res.meta.status !== 200) {
      this.$message.error('获取登录用户信息失败!')
    } else {
      this.avatarMessage = res.data
    }
  },
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: '',
      avatarMessage: {}
    }
  },
  methods: {
    logout() {
      sessionStorage.removeItem('token')
      this.$router.replace('/login')
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http({
        method: 'get',
        url: 'menus'
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else {
        this.menuList = res.data
      }
    },
    // 展开与折叠菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    async outLognDialog() {
      // 退出对话框提示
      const confirm = await this.$confirm('是否退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirm !== 'confirm') {
        return this.$message.info('已经取消退出操作!')
      } else {
        sessionStorage.removeItem('token')
        this.$message.success('退出成功!')
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #53c3f1;
  color: #fff;
  font-size: 20px;

  div {
    display: flex;
    align-items: center;
    span {
      padding-left: 5px;
    }
  }

  .right-area {
    display: flex;
    align-items: center;
    margin-right: 20px;
    cursor: pointer;
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
}
.el-aside {
  background-color: #fff;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #fff;
  font-size: 18px;
  line-height: 24px;
  color: #000;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #dddddd;
  }
}
.outLogn {
  background-color: #ccffcc;
  border: none;
  color: #000;
}
</style>
