<script>
import instance from '@/utils/request.js';
import { Plus } from '@element-plus/icons-vue';

export default {
    data() {
        return {
            fileList: [],
            urls: [],
        };
    },
    methods: {
        handleRemove(file, fileList) {
            this.fileList = fileList;
        },
        handlePictureCardPreview(file) {
            this.$preview(file.url);
        },
        async uploadFile(file) {
            console.log("1");
            const formData = new FormData();
            formData.append('image', file.raw); // 确保传递的是 file.raw
            console.log("2");
            try {
                const response = await instance.post('/post/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const url = response.data.data; // 假设后端返回的图片 URL 在 data 字段中
                this.urls.push(url);
                alert('File uploaded successfully');
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('Error uploading file');
            }
        },
        handleChange(file, fileList) {
            this.fileList = fileList;
            this.uploadFile(file);
        },
    },
};
</script>

<template>
    <div class="imageUploader">
        <el-upload
            ref="upload"
            class="upload-demo"
            list-type="picture-card"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :auto-upload="false"
        >
            <el-icon>
                <Plus />
            </el-icon>
        </el-upload>
        <!-- <div v-for="url in urls" :key="url">
            <el-image style="width: 100px; height: 100px" :src="url" :fit="fit" />
        </div> -->
    </div>
</template>
