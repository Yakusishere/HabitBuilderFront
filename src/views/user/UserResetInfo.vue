<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Lock } from "@element-plus/icons-vue";
import useUserInfoStore from "@/stores/userInfo.js";
import instance from "@/utils/request.js";
import { ElMessage } from "element-plus";
import { Plus, Upload } from "@element-plus/icons-vue";
import { useTokenStore } from "@/stores/token.js";

const uploadRef = ref();
const tokenStore = useTokenStore();
//用户头像地址
const userInfoStore = useUserInfoStore();
const fileState = {
  selectedFile: null,
};
const imgUrl = ref<string | null>(null);
const onUploadFile = (file) => {
  const reader = new FileReader();
  reader.readAsDataURL(file.raw);
  reader.onload = () => {
    imgUrl.value = reader.result as string;
    console.log("uploadImgUrl: " + imgUrl.value);
  };
  fileState.selectedFile = file.raw; // 获取文件对象
  console.log("Selected file:", fileState.selectedFile);
};

const userInfo = ref({
  userId: userInfoStore.info.userId,
  userName: "",
});

const Password = ref({
  userId: userInfoStore.info.userId,
  password: "",
  confirmPassword: "",
});
//校验密码的函数
const checkconfirmPassword = (rule, value, callback) => {
  if (value == "") {
    callback(new Error("请再次确认密码"));
  } else if (value != Password.value.password) {
    callback(new Error("请确保两次密码一样"));
  } else {
    callback();
  }
};

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
  confirmPassword: [{ validator: checkconfirmPassword, trigger: "blur" }],
};

const userInfoUpdateService = (userInfoData) => {
  return instance.put("/user/update", userInfoData);
};

const updateuserName = async () => {
  let result;
  result = await userInfoUpdateService(userInfo.value);
  if (result.code === 0) {
    ElMessage.success(
      result.data && result.data.msg ? result.data.msg : "用户名修改成功"
    );
    userInfoStore.setInfo(userInfo.value);
  }else{
    ElMessage.warning(
      "修改失败"
    );
  }
};

const updatePassword = async () => {
  const result = await userInfoUpdateService({
    userId: Password.value.userId,
    password: Password.value.password,
  });
  ElMessage.success(
    result.data && result.data.msg ? result.data.msg : "密码修改成功"
  );
  userInfoStore.setInfo({
    ...userInfoStore.info,
    password: Password.value.password,
  });
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
//上传头像
/* const updateAvatar=async()=>{
const result = await userInfoUpdateService({
userId: Password.value.userId,
imgUrl
.value
});
ElMessage.success(result.msg ? result.msg : "修改成功");
userInfoStore.setInfo({ ...userInfoStore.info, avatarImg: imgUrl.value});
}
*/
const userAvatar = ref({
  userId: userInfoStore.info.userId,
  avatarImg: "",
});
const updateAvatar = async () => {
  if (!fileState.selectedFile) {
    alert("Please select a file");
    return;
  }
  const formData = new FormData();
  formData.append("image", fileState.selectedFile);

  try {
    const response = await instance.post("/post/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    userAvatar.value.avatarImg = response.data;
    const result = await userInfoUpdateService({
      userId: userAvatar.value.userId,
      avatarImg: userAvatar.value.avatarImg,
    });
    ElMessage.success(
      result.data && result.data.msg ? result.data.msg : "头像修改成功"
    );
    userInfoStore.setInfo({
      ...userInfoStore.info,
      avatarImg: userAvatar.value.avatarImg,
    });
    console.log("pinia中的avatarUrl:" + userInfoStore.info.avatarImg);
    imgUrl.value = response.data.url; // 假设返回的数据包含图片的 URL
    /* userInfoStore.setInfo({
      ...userInfoStore.info,
      avatarImg: imgUrl.value,
    }); */
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("Error uploading file");
  }
};

const onUpdateAvatar = async () => {
  await updateAvatar();
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
        <el-form
          :model="userInfo"
          :rules="rules"
          label-width="100px"
          size="large"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="userInfo.userName" style="width: 20vh" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateuserName"
              >提交修改</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 密码修改表单 -->
        <el-form
          :model="Password"
          :rules="rules"
          ref="passwordForm"
          label-width="100px"
          size="large"
        >
          <el-form-item label="密码" prop="password">
            <el-input
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入新密码"
              v-model="Password.password"
              style="width: 40vh"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              :prefix-icon="Lock"
              type="confirmPassword"
              placeholder="请再次输入新密码"
              v-model="Password.confirmPassword"
              style="width: 40vh"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlePasswordUpdate"
              >提交修改</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 上传修改头像 -->
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
        <br />
        <el-button
          type="primary"
          :icon="Plus"
          size="large"
          style="margin-left: 110px"
          @click="uploadRef.$el.querySelector('input').click()"
        >
          选择图片
        </el-button>
        <el-button
          type="success"
          :icon="Upload"
          size="large"
          style="margin-left: 20px"
          @click="onUpdateAvatar"
        >
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>
<style lang="scss" scoped>
.page-container {
  background-color: #fcfaf2;
  margin-left: 15px;
}
.avatar-uploader {
  margin-left: 100px;
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style> 