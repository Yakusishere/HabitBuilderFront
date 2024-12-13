<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div style="padding-left: 30px;padding-right: 30px;padding-bottom: 30px;">
        <h3>修改用户信息</h3>
        <form @submit.prevent="handleSubmit">
          <!-- 用户昵称 -->
          <div class="form-group">
            <label for="nickname">昵称</label>
            <input v-model="form.nickname" type="text" id="nickname" placeholder="请输入昵称"/>
          </div>

          <!-- 用户密码 -->
          <div class="form-group">
            <label for="password">密码</label>
            <input v-model="form.password" type="password" id="password" placeholder="请输入密码"/>
          </div>

          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input v-model="form.confirmPassword" type="password" id="confirmPassword" placeholder="请再次输入密码"/>
          </div>

          <!-- 用户头像 -->
          <div class="form-group">
            <label for="avatar">头像</label>
            <input @change="handleAvatarChange" type="file" id="avatar" accept="image/*"/>
            <img v-if="avatarPreview" :src="avatarPreview" alt="头像预览" class="avatar-preview"/>
          </div>

          <!-- 提交按钮 -->
          <button type="submit">提交</button>
        </form>
      </div>

    </div>
  </div>
</template>

<script>
import {uploadService} from "@/api/post.js";
import {ref} from "vue";
import {updateUserService} from "@/api/user.js";
import {ElMessage} from "element-plus";

export default {
  name: 'EditModal',
  data() {
    return {
      form: {
        nickname: '',
        password: '',
        confirmPassword: '',
      },
      avatarPreview: null,
    };
  },
  methods: {
    async handleSubmit() {

      const data = ref({});

      if (this.form.nickname.trim() !== '') {
        data.value.nickName = this.form.nickname;  // 传入 data 中
      }

      if (this.form.password.trim() !== '') {
        if (this.form.password !== this.form.confirmPassword) {
          alert('密码和确认密码不一致');
          return;
        }
        data.value.password = this.form.password;  // 传入 data 中
      }

      if (!this.avatarFile) {
        const formData = new FormData();
        formData.append('image', this.avatarFile);
        let res = await uploadService(formData);
        data.value.avatarImg = res.data;
      }

      let updateRes = await updateUserService(data);
      if(updateRes.code === 0){
        ElMessage({
          message: '发布成功',
          type: 'success',
        })
      }

      // 清空表单
      this.form.nickname = '';
      this.form.password = '';
      this.form.confirmPassword = '';
      this.avatarPreview = null;
    },

    handleAvatarChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.avatarFile = file;
        this.avatarPreview = URL.createObjectURL(file);
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  margin-top: -60px;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
}

h3 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-top: 10px;
}
</style>
