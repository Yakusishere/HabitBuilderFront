<script setup>
import { ref, onMounted } from "vue";
import { Lock } from "@element-plus/icons-vue";
import useUserInfoStore from "@/stores/userInfo.js";
import instance from "@/utils/request.js";
import { ElMessage } from "element-plus";

const userInfoStore = useUserInfoStore();

const userInfo = ref({
  userId: userInfoStore.info.userId,
  userName: "",
});

const Password = ref({
  userId: userInfoStore.info.userId,
  password: "",
});

const rules = {
  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      pattern: /^\S{2,10}$/,
      message: "用户名必须是2-10位的非空字符串",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 5, max: 16, message: "密码为5~16个字符", trigger: "blur" },
  ],
};

const userInfoUpdateService = (userInfoData) => {
  return instance.put("/user/update", userInfoData);
};

const updateuserName = async () => {
  const result = await userInfoUpdateService(userInfo.value);
  ElMessage.success(result.msg ? result.msg : "修改成功");
  userInfoStore.setInfo(userInfo.value);
};

const updatePassword = async () => {
  const result = await userInfoUpdateService({
    userId: Password.value.userId,
    password: Password.value.password,
  });
  ElMessage.success(result.msg ? result.msg : "修改成功");
  userInfoStore.setInfo({ ...userInfoStore.info, password: Password.value.password });
};

const passwordForm = ref(null);

const handlePasswordUpdate = async () => {
  if (!passwordForm.value) {
    console.error("passwordForm ref not bound correctly");
    return;
  }

  passwordForm.value.validate(async (valid) => {
    if (valid) {
      await updatePassword();
      console.log("password:", Password.value.password);
    } else {
      ElMessage.error("表单验证失败");
      console.log("表单验证失败");
      return false;
    }
  });
};

onMounted(() => {
  console.log("MyuserIdd:", userInfoStore.info.userId);
});
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>基本资料</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <!-- 用户名修改表单 -->
        <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="userInfo.userName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateuserName">提交修改</el-button>
          </el-form-item>
        </el-form>

        <!-- 密码修改表单 -->
        <el-form :model="Password" :rules="rules" ref="passwordForm" label-width="100px" size="large">
          <el-form-item label="密码" prop="password">
            <el-input
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入新密码"
              v-model="Password.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlePasswordUpdate">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
