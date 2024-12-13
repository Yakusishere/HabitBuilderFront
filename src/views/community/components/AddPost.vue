<template>
  <div class="modal-overlay">
    <div class="modal-content" @click.stop>
      <div class="modal-container">
        <n-flex vertical>
          <div class="header-title">
            <div style="font-size: 20px;">发布帖子</div>
          </div>

          <div class="upload-image-container">
            <div class="upload-text-container">
              <div style="font-size: 16px">上传图片</div>
            </div>

            <div class="upload-component">
              <div>
                <el-upload
                    list-type="picture-card"
                    :http-request="upload"

                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                >
                  <el-icon>
                    <Plus/>
                  </el-icon>
                </el-upload>

                <el-dialog v-model="dialogVisible">
                  <img w-full :src="dialogImageUrl" alt="Preview Image" />
                </el-dialog>
              </div>
            </div>
          </div>

          <div class = "post-input-container">
            <n-flex vertical>
              <div style="font-size: 16px">正文内容</div>
              <div style="width: 400px;">
                <n-input v-model:value="post_title" maxlength="30" show-count clearable placeholder="有趣的标题能吸引更多点赞~"/>
              </div>

              <div style="width: 750px;">
                <n-input
                    v-model:value="post_content"
                    type="textarea"
                    maxlength="500"
                    show-count
                    :autosize="{
                  minRows: 7,
                  maxRows:7,
                    }"
                    placeholder="填写正文描述，表达你的想法~"/>
              </div>
            </n-flex>
          </div>

          <div class="publish-button-container">
            <n-button color="#807ce8" @click = "publishPostOnClick()">
              发布
            </n-button>
          </div>
        </n-flex>
      </div>

    </div>
  </div>
</template>

<script>
import {uploadService,addPostService} from "@/api/post.js";
import {Plus} from '@element-plus/icons-vue'
import {ref,defineComponent} from "vue";
import { ElMessage } from 'element-plus'

export default {
  components: {
    Plus,
  },
  setup(props, { emit }) {
    const fileList = ref([]);
    const dialogImageUrl = ref('');
    const dialogVisible = ref(false);
    const imageList = ref([]);
    const post_title = ref("");
    const post_content = ref("");

    const upload = async ({ file, onSuccess, onError }) => {
      console.log("Uploading file:", file.url);// 打印文件，调试用
      const formData = new FormData();
      formData.append('image', file);  // 将文件添加到 FormData 中，'image' 是表单字段名

      try {
        const res = await uploadService(formData);  // 传递 FormData 而不是 file
        if (res.code === 0) {
          console.log("上传成功");
          let url = res.data;
          imageList.value.push(url);
          console.log("imageList:",imageList.value.length);
          onSuccess(res.data);  // 调用 onSuccess 表示上传成功
        } else {
          console.error("上传失败");
          onError(new Error("上传失败"));  // 调用 onError 表示上传失败
        }
      } catch (error) {
        console.error("上传请求失败", error);
        onError(error);  // 上传请求失败时调用 onError
      }
    };

    const handlePictureCardPreview = (uploadFile) => {
      console.log(uploadFile.url)
      dialogImageUrl.value = uploadFile.url;
      dialogVisible.value = true;
    };

    const handleRemove = (file) => {
      console.log("url"+file.url);
      // 从 images 数组中移除对应的文件
      const index = imageList.value.findIndex((image) => image === file.url);
      if (index !== -1) {
        imageList.value.splice(index, 1);
      }
      console.log("图片已删除",  imageList.value);
    };

    const getImageListString=()=> {
      return imageList.value.length === 1 ? imageList.value[0] : imageList.value.join(",");
    }

    const publishPostOnClick = async () => {
      if(imageList.value.length === 0){
        ElMessage({
          message: '请至少上传一张照片',
          type: 'warning',
        })
        return;
      }
      if (!post_title.value.trim()) {
        ElMessage({
          message: '标题不能为空',
          type: 'warning',
        })
        return;
      }
      let image = getImageListString();
      let res = await addPostService({
        "title":post_title.value,
        "content":post_content.value,
        "image":image
      })
      if(res.code === 0){
        console.log("发布成功");
        ElMessage({
          message: '发布成功',
          type: 'success',
        })
        emit('closeModal');
      }
    };

    return {
      fileList,
      dialogVisible,
      dialogImageUrl,
      post_title,
      post_content,
      Plus,
      upload,
      handlePictureCardPreview,
      handleRemove,
      publishPostOnClick,
    }
  }
}
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
  /*padding-right: 400px;*/
}

.modal-container {
  width: 850px;
  height: 650px;
}

.header-title {
  width: 850px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 30px
}

.upload-image-container {
  width: 850px;
  height: 230px;
  display: flex;
  flex-direction: column;
  padding-left: 50px;
/*  background-color: black;*/
}

.upload-component {
  padding-top: 30px;
}

.post-input-container{
  padding-left: 50px;
  height: 250px;
}

.publish-button-container{
  height: 60px;
  padding-top: 10px;
  padding-left: 50px;
}
</style>