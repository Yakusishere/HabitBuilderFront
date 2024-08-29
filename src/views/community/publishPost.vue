<script lang="ts">
import { ref } from "vue";
import { type UploadFile } from "element-plus";
import instance from "@/utils/request";
import useUserInfoStore from "@/stores/userInfo.js";
import { ElMessage } from "element-plus";

export default {
  name: "test",
  setup(props,{emit}) {
    const fileList = ref([]);

    const showModal = ref(false);
    const dialogImageUrl = ref("");
    const dialogVisible = ref(false);
    const disabled = ref(false);
    const userInfoStore = useUserInfoStore();
    const post = ref({
      title: "",
      content: "",
      images: [], //储存图片url
    });

    //调用上传接口
    const postUploadFile = (formData) => {
      return instance.post("/post/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    };
    const handleUpload = async (file: UploadFile) => {
      fileList.value.push(file);
      const formData = new FormData();
      formData.append("image", file.raw);
      try {
        let res;
        res = await postUploadFile(formData);
        if (res.code == 0) {
          console.log("成功上传图片");
          let myImageUrl = "";
          myImageUrl = res.data;
          post.value.images.push(myImageUrl);
        } else {
          console.log("上传失败");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file");
      }
    };

    const handleRemove = (file: UploadFile) => {
      // 从 images 数组中移除对应的文件
      const index = post.value.images.findIndex((image) => image === file.url);
      if (index !== -1) {
        post.value.images.splice(index, 1);
      }
      console.log("图片已删除", post.value.images);
    };

    const handlePictureCardPreview = (file: UploadFile) => {
      dialogImageUrl.value = file.url!;
      dialogVisible.value = true;
    };

    //创建帖子api
    const createPost = (post: any) => {
      console.log("已调用创建帖子方法");
      console.log("imageUrl:", post.value.images);
      let imageStr = post.value.images.join(",");
      console.log("imageStr:", imageStr);
      let myPost = {
        userId: userInfoStore.info.userId,
        userName: userInfoStore.info.userName,
        title: post.value.title,
        content: post.value.content,
        image: imageStr,
      };
      console.log("mypost:" + myPost.title + myPost.content + myPost.image);
      return instance.post("/post/createPost", myPost);
    };

    const submitPost = async () => {
      if (post.value.images.length === 0) {
        ElMessage({
          message: "请上传图片",
          type: "warning",
        });
        return;
      } else if (!post.value.title.trim()) {
        ElMessage({
          message: "标题不能为空",
          type: "warning",
        });
        return;
      }
      let res;
      res = await createPost(post);
      if (res.code === 0) {
        console.log("发布成功");
        //console.log("fileList:",fileList.value)
        resetForm();
        showModal.value = false;
        window.location.reload();
      } else {
        console.log("发布失败");
      }
    };

    const cancelPost = () => {
      emit("value",true);
      resetForm();
    };

    const resetForm = () => {
      showModal.value = false;
      post.value = {
        title: "",
        content: "",
        images: [],
      };
      fileList.value = [];
    };

    const checkPost =()=>{
      if(userInfoStore.info.isPost ===true){
        emit('value',false);
        showModal.value = true;
      }else{
        alert("账号已被封，无法发布")
      }
    }

    return {
      showModal,
      dialogImageUrl,
      dialogVisible,
      disabled,
      post,
      handleUpload,
      handleRemove,
      handlePictureCardPreview,
      submitPost,
      cancelPost,
      resetForm,
      fileList,
      createPost,
      checkPost,
    };
  },
};
</script>

<template>
  <div>
    <div class="publish-button">
      <el-button
        class="publish-button"
        type="primary"
        auto-insert-space
        @click="checkPost()"
        >发布帖子</el-button
      >
    </div>
    <el-dialog
      v-model="showModal"
       :modal="true"
       :visible.sync="dialogVisible"
      width="50%"
      @close="cancelPost"
      style="background-color: #fcfaf2"
    >
      <template #header>
        <span>创建帖子</span>
<!--        <button class="cancel-button" @click="cancelPost">取消</button>-->
<!--        <el-button class="publishButton" @click="submitPost">发布</el-button>-->
      </template>

      <div class="modal-body">
        <div class="imageUploader">
          <el-upload
            ref="upload"
            class="upload-demo"
            list-type="picture-card"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleUpload"
            :auto-upload="false"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </div>

        <label for="title">标题：</label>
        <el-input type="text" v-model="post.title" id="title" style="width: 200px"/>

        <label for="content">内容：</label>
        <el-input
            type="textarea"
            id="content"
            :rows="3"
            style="width: 90vh; overflow: hidden; resize: none; "
            v-model="post.content" ></el-input>
        <div style="margin-top: 20px ;margin-left:550px">
        <button class="cancel-button" @click="cancelPost">取消</button>
        <el-button class="publishButton" @click="submitPost">发布</el-button>
        </div>
      </div>

      <el-dialog
       v-model="dialogVisible"
      :modal="true"
      >
        <img width="100%" :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-dialog>
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
}
.publish-button {
  margin-top: 5px;
  margin-left: 6px;
}
/* .publish-button {
    background-color: #FF4D4F;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
} */

/* .publish-button:hover {
    background-color: #FF6F6F;
} */

.cancel-button {
  background: none;
  border: none;
  color: #ff4d4f;
  font-size: 16px;
  cursor: pointer;
}

.modal-body {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

label {
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
}

textarea {
  width: 90%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

textarea {
  resize: vertical;
  height: 50px;
}


.publishButton{
  margin-bottom: 5px;
}
</style>