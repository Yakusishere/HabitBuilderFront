<script setup>
import { Search } from "@element-plus/icons-vue";
import { ref } from "vue";
import instance from "@/utils/request.js";
//定义数据模型
const search = ref("");
</script>
<template>
    <div class="common-layout">
    <el-container>
        <!-- 帖子浏览搜索部分 -->
      <el-aside width="400px">
        <!-- 搜索表单 -->
    <el-form
        ref="form"
        size="large"
        autocomplete="off"
        :model="search"
      >
        <el-form-item prop="search">
          <el-input
            :prefix-icon="Search"
            placeholder="输入搜索内容"
            clearable
            v-model="search"
            style="width: 240px"
            size="large"
          ></el-input>
          </el-form-item>
          <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
          >
            搜索
          </el-button>
        </el-form-item>
        </el-form>
      
        <el-button
            class="button"
            type="primary"
            auto-insert-space
            router
            @click=""
          >
            添加个人帖子
          </el-button>
    </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </div>
    
</template>