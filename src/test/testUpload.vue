<script>
import instance from '@/utils/request.js';

export default {
    data() {
        return {
            selectedFile: null,
            url:"https://yakusbucket.oss-cn-wuhan-lr.aliyuncs.com/2024-07-13-01-20-43116437649787941546.jpg"
        };
    },
    methods: {
        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        async uploadFile() {
            if (!this.selectedFile) {
                alert('Please select a file');
                return;
            }
            const formData = new FormData();
            formData.append('image', this.selectedFile);

            try {
                const response = await instance.post('/post/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                alert('File uploaded successfully: ' + response.data);
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('Error uploading file');
            }
        },
    },
};
</script>


<template>
    <div>
        <input type="file" @change="handleFileChange" />
        <button @click="uploadFile">Upload</button>
    </div>

    <el-image style="width: 100px; height: 100px" :src="url" :fit="fit" />
</template>