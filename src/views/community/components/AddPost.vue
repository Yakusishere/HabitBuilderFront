<script setup>

</script>

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
              <n-upload
                  action="http://localhost:8080/post/upload"
                  :default-file-list="previewFileList"
                  list-type="image-card"
                  @preview="handlePreview"
              />
              <n-modal
                  v-model:show="showModal"
                  preset="card"
                  style="width: 600px"
                  title="一张很酷的图片"
              >
                <img :src="previewImageUrl" style="width: 100%">
              </n-modal>
            </div>
          </div>
        </n-flex>
      </div>

    </div>
  </div>
</template>

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

.modal-container{
  width: 850px;
  height: 650px;
}

.header-title{
  width: 850px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 30px
}

.upload-image-container{
  width: 850px;
  height: 200px;
  display: flex;
  flex-direction: column;
  padding-left: 50px
}

.upload-component{
  margin-top: 30px;
}
</style>