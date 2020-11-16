<template>
  <div class="login-container">
    <el-form :model="user" :rules="rules" ref="user">
      <div class="login-image"></div>
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked"
          >我已阅读相关条件与和隐私政策</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('user')"
          :disabled="!checked"
          :loading="loginloading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data() {
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      checked: true,
      loginloading: false,
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
        // code: [
        //   { required: true, message: '请输入验证码', trigger: 'change' },
        //   { type: 'number', message: '验证码不正确' }
        // ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.loginloading = true
      // 表单验证
      this.$refs[formName].validate(async valid => {
        if (!valid) return
        const res = await login(this.user)
        // console.log(res.data.data)
        if (res.status !== 201) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        this.loginloading = false
        // 将接口返回的用户相关数据放到本地存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))
        this.$router.push('/layout')
      })
    }
  }
}
</script>
<style lang="less">
.login-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('../../images/login_bg.jpg') no-repeat;
  background-size: cover;
}
.el-form {
  background-color: #fff;
  padding: 50px;
  min-width: 300px;
  .login-image {
    width: 100%;
    height: 57px;
    margin-left: 20px;
    margin-bottom: 20px;
    background: url('../../images/logo_index.png') no-repeat;
  }
  .el-button {
    width: 100%;
  }
}
</style>
