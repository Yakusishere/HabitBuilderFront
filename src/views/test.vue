<script setup>
import { ref } from "vue";
import instance from "@/utils/request.js";

// 控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false);

const confirmPassword = ref("");

// 定义数据模型
const registerData = ref({
  userName: "",
  password: "",
});

// 定义表单校验规则
const rules = {
  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { max: 16, message: "用户名最大只可输入16个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 5, max: 16, message: "密码为5~16个字符", trigger: "blur" },
  ],
};

const userRegisterService = (registerData) => {
  return instance.post("/user/register", registerData);
};

const register = async () => {
  try {
    if (registerData.value.password == confirmPassword.value) {
      let result = await userRegisterService(registerData.value);
      if (result.code === 0) {
        alert("Success");
      } else {
        alert("Fail: " + result.message);
      }
    } else {
      alert("两次密码不一致");
    }
  } catch (error) {
    console.error(
      "Register Error: ",
      error.response ? error.response.data : error.message
    );
    alert(
      "Error: " + (error.response ? error.response.data.message : error.message)
    );
  }
};

// 提供调用登录接口的函数
const userLoginService = (loginData) => {
  return instance.post("/user/login", loginData);
};

// 登录函数
import { useTokenStore } from "@/stores/token.js";
import { useRouter } from "vue-router";
const router = useRouter();
const tokenStore = useTokenStore();

const login = async () => {
  try {
    let result = await userLoginService(registerData.value);
    if (result.code === 0) {
      //alert(result.data.msg ? result.data.msg : "注册成功");
      //tokenStore.setToken(result.data.data);
      router.push("/");
      alert("登录成功");
    } else {
      alert("失败");
    }
  } catch (error) {
    console.error(
      "Login Error: ",
      error.response ? error.response.data : error.message
    );
    alert(
      "Error: " + (error.response ? error.response.data.message : error.message)
    );
  }
};

// 定义函数，用来清空数据模型的数据
const clearRegisterData = () => {
  confirmPassword.value = "";
  registerData.value = {
    username: "",
    password: "",
  };
};
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册表单 -->
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
        :model="registerData"
        :rules="rules"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="userName">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="registerData.userName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="registerData.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
            v-model="confirmPassword"
          ></el-input>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="register"
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link
            type="info"
            :underline="false"
            @click="
              isRegister = false;
              clearRegisterData();
            "
          >
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录表单 -->
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-if="!isRegister"
        :model="registerData"
        :rules="rules"
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="userName">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="registerData.userName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="registerData.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="login"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link
            type="info"
            :underline="false"
            @click="
              isRegister = true;
              clearRegisterData();
            "
          >
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background: url("@/assets/login_bg.png") no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
