<template>
  <div class="login_container">
    <div class="left-container">
      <span>欢迎光临</span>
    </div>
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        class="login_form"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            show-password
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="comfirmLoginForm">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.comfirmLoginForm()
      }
    })
  },
  data() {
    return {
      // 登录表单的数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    comfirmLoginForm() {
      this.$refs.loginFormRef.validate(async(valid) => {
        if (!valid) {
          return this.$message({ message: '数据请求失败', type: 'error' })
        } else {
          const { data: res } = await this.$http({
            url: 'login',
            method: 'post',
            data: {
              username: this.loginForm.username,
              password: this.loginForm.password
            }
          })
          if (res.meta.status !== 200) {
            this.$message({
              message: '登录失败！',
              type: 'error'
            })
          } else {
            this.$message({
              message: '恭喜你，登录成功！',
              type: 'success'
            })
            sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home/welcome')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  display: flex;
  width: 100%;
  height: 100%;
}
.left-container {
  position: relative;
  width: 70%;
  height: 100%;
  background-color: #53c3f1;
  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 40px;
    font-weight: 700;
  }
}
.login_box {
  position: relative;
  width: 30%;
  background-color: #fff;
  // border-radius: 3px;

  .avatar_box {
    height: 100px;
    width: 100px;
    margin: 40% auto 15px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    width: 100%;
    padding: 0 20px;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
