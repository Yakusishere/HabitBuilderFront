<template>
    <div>
        <button class="publish-button" @click="showModal = true">发布帖子</button>

        <el-dialog v-model="showModal" width="50%">
            <template #header>
                <span>创建帖子</span>
                <button class="cancel-button" @click="cancelPost">取消</button>
                <button class="publish-button" @click="submitPost">发布</button>
            </template>

            <div class="modal-body">
                <el-upload action="#" list-type="picture-card" :auto-upload="false"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleUploadSuccess">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    <template #file="{ file }">
                        <div>
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                            <span class="el-upload-list__item-actions">
                                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                    <el-icon>
                                        <ZoomIn />
                                    </el-icon>
                                </span>
                                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </span>
                            </span>
                        </div>
                    </template>
                </el-upload>

                <label for="title">标题：</label>
                <input type="text" v-model="post.title" id="title" />

                <label for="content">内容：</label>
                <textarea v-model="post.content" id="content"></textarea>
            </div>

            <el-dialog v-model="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
//import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'

import type { UploadFile } from 'element-plus'

const showModal = ref(false)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const post = ref({
    title: '',
    content: '',
    images: []
})

const handleUploadSuccess = (response: any, file: UploadFile) => {
    // 模拟上传成功后，将文件信息添加到 images 数组中
    post.value.images.push(file)
}

const handleRemove = (file: UploadFile) => {
    // 从 images 数组中移除对应的文件
    const index = post.value.images.findIndex(image => image.uid === file.uid)
    if (index !== -1) {
        post.value.images.splice(index, 1)
    }
    console.log('图片已删除', post.value.images)
}

const handlePictureCardPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url!
    dialogVisible.value = true
}

const submitPost = () => {
    // 这里可以添加提交帖子的逻辑，例如发送到后端 API
    console.log('发布帖子', post.value)
    resetForm()
}

const cancelPost = () => {
    resetForm()
}

const resetForm = () => {
    showModal.value = false
    post.value = {
        title: '',
        content: '',
        images: []
    }
}
</script>

<style>
body {
    font-family: Arial, sans-serif;
}

.publish-button {
    background-color: #FF4D4F;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
}

.publish-button:hover {
    background-color: #FF6F6F;
}

.cancel-button {
    background: none;
    border: none;
    color: #FF4D4F;
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

input[type="text"],
textarea {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

textarea {
    resize: vertical;
}
</style>