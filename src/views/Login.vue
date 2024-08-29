<script setup>
import { User, Lock } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import instance from "@/utils/request.js";
//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false);
const confirmPassword = ref("");
//定义数据模型
const registerData = ref({
  userName: "",
  password: "",
});
const ifRemember = ref(false);

//校验密码的函数
const checkconfirmPassword = (rule, value, callback) => {
  if (value == "") {
    callback(new Error("请再次确认密码"));
  } else if (value != registerData.value.password) {
    callback(new Error("请确保两次密码一样"));
  } else {
    callback();
  }
};

//定义表单校验规则
const rules = {
  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { max: 16, message: "用户名最大只可输入16个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 5, max: 16, message: "密码为5~16个字符", trigger: "blur" },
  ],
  //confirmPassword: [{ validator: checkconfirmPassword, trigger: "blur" }],
};

const userRegisterService = (registerData) => {
  return instance.post("/user/register", registerData);
};

const register = async () => {
  try {
    if (registerData.value.password == confirmPassword.value) {
      let result = await userRegisterService(registerData.value);
      if (result.code === 0) {
        alert("注册成功");
        isRegister.value = false; // 注册成功后切换到登录表单
      } else {
        alert("注册失败: " + result.message);
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

//提供调用登录接口的函数
const userLoginService = (loginData) => {
  /* const params =new URLSearchParams();
    for(let key in loginData){
        params.append(key,loginData[key])
    } */
  return instance.post("/user/login", loginData);
};
//登录函数
//import { useTokenStore } from "@/stores/token.js";
import { useRouter } from "vue-router";
import useUserInfoStore from "@/stores/userInfo";
const userInfoStore = useUserInfoStore();
const router = useRouter();
//const tokenStore = useTokenStore();
const login = async () => {
  try {
    let result = await userLoginService(registerData.value);
    if (result.data.isLogin === true) {
      if (result.code === 0) {
        //tokenStore.setToken(result.data.userId);
        alert("success");
        console.log("loginUserId:" + result.data.userId);
        userInfoStore.info.userId = result.data.userId;
        router.push("/main/plan/planpage");
        //////////////////////userId = result.data.userId;
      } else {
        alert("登录失败，未返回有效数据");
      }
    } else {
      alert("账号已被封");
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
//定义函数，用来清空数据模型的数据
const clearRegisterData = () => {
  (confirmPassword.value = ""),
    (registerData.value = {
      userName: "",
      password: "",
    });
};

//保存账号密码
const setCookie = (userName, password, days) => {
  var curDate = new Date();
  curDate.setDate(curDate.getDate() + 24 * 60 * 60 * 1000 * days);
  window.document.cookie =
    "userName" +
    "=" +
    userName +
    ";path=/;expires=" +
    curDate.toLocaleTimeString();
  window.document.cookie =
    "password" +
    "=" +
    password +
    ";path=/;expires=" +
    curDate.toLocaleTimeString();
  window.document.cookie =
    "ifRemember" +
    "=" +
    ifRemember +
    ";path=/;expires=" +
    curDate.toLocaleTimeString();
};

const clearCookie = () => {
  setCookie("", "", -1);
};

const getCookie = () => {
  if (document.cookie.length > 0) {
    const arr = document.cookie.split(";");
    for (let i = 0; i < arr.length; i++) {
      let userKey = arr[i].split("=");
      if (userKey[0].trim() === "userName") {
        registerData.value.userName = userKey[1];
      } else if (userKey[0].trim() === "password") {
        registerData.value.password = userKey[1];
      } else if (userKey[0].trim() === "ifRemember") {
        ifRemember.value = Boolean(userKey[1]);
      }
    }
  }
};
onMounted(() => {
  getCookie();
});

const submitForm = () => {
  if (ifRemember.value === true) {
    setCookie(registerData.value.userName, registerData.value.password, 7);
  } else {
    clearCookie();
  }
  login();
};
</script>

<template>
  <el-row class="login-page">
    <video autoplay muted loop class="bg-video">
      <source src="@/assets/bg_video.mp4" type="video/mp4" />
    </video>
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
          />
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
            placeholder="请再次输入密码"
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
            type="default"
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
        v-else
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
            <el-checkbox v-model="ifRemember">记住我</el-checkbox>
          </div>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="submitForm"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link
            type="default"
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
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  .bg-video {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: translate(-50%, -50%);
    z-index: -1;
  }

  .form {
    position: relative;
    background: rgba(255, 255, 255, 0.5); /* 半透明白色背景 */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 400px; /* 根据需要调整 */
    text-align: center;
  }

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

.input-username {
  width: 100%;
  height: 30px;
}
</style>
