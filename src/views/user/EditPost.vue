<script>
import { ref, onMounted } from "vue";
import instance from "@/utils/request";
import useUserInfoStore from "@/stores/userInfo.js";
import { ElMessage } from "element-plus";

export default {
  name: "test",
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  setup(props) {

    return {
    };
  },
};
</script>

<template>

</template>

<style>

</style>
