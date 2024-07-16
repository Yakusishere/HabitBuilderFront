<script>
import { ref, watch } from "vue";
import useUserInfoStore from "@/stores/userInfo";

export default {
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const userInfoStore = useUserInfoStore();
    const isTypingComment = ref(false);
    const isliked = ref(false);
    const isFav = ref(false);

    /* /////接口部分///// */
    //是否点赞帖子接口
    const getIfLikePost = (userId, postId) => {
      console.log("getIfLikePost:" + userId + "," + postId);
      // 创建一个 FormData 对象
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("postId", postId);

      // 发送请求
      return instance.post("/likepost/getIfLikePost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    };
    //是否收藏帖子接口
    const getIfCollectPost = (userId, postId) => {
      console.log("getIfCollectPost:" + userId + "," + postId);
      // 创建一个 FormData 对象
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("postId", postId);

      // 发送请求
      return instance.post("/collectpost/getPostCollection", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    };
    //点赞帖子接口
    const addLikePost = (data) => {
      return instance.post("/likepost/addLikePost", data);
    };
    //收藏帖子接口
    const addCollectPost = (data) => {
      return instance.post("/collectpost/addCollection", data);
    };
    //评论帖子接口
    const commentPost = (data) => {
      return instance.post("/comment/commentPost", data);
    };

    /* /////函数部分///// */
    const initPostBottomBar = async () => {
      isTypingComment.value = false;
      let ifLikeRes = await getIfLikePost(
        userInfoStore.info.userId,
        props.postId
      );
      let ifFavRes = await getIfCollectPost(
        userInfoStore.info.userId,
        props.postId
      );
      if (ifLikeRes.code === 0 && ifFavRes.code === 0) {
        console.log("成功获取是否点赞、收藏帖子");
        if (ifLikeRes.message === "true") {
          console.log("已点赞");
          isliked.value = true;
        } else if (ifLikeRes.message === "false") {
          console.log("未点赞");
          isliked.value = false;
        }
        if (ifFavRes.message === "true") {
          console.log("已收藏");
          isFav.value = true;
        } else if (ifFavRes.message === "false") {
          console.log("未收藏");
          isFav.value = false;
        }
      }
    };


    watch(
      () => props.postId,
      (newPostId) => {
        initPostBottomBar();
      }
    );
    return {
      isTypingComment,
    };
  },
};
</script>

<template>
  <div v-if="!isTypingComment">
    <div class="bottom-actions">
      <el-input
        type="textarea"
        v-model="newComment"
        placeholder="输入评论"
        rows="1"
        @click="isTypingComment = true"
        class="comment-input"
      />
      <el-button type="primary" @click="addComment">提交评论</el-button>
      <el-button v-if="!isliked" type="primary" @click="likePost">
        <div class="img-box">
          <img src="@/assets/like.png" alt="" class="like-image" />
        </div>
      </el-button>
      <el-button v-if="isliked" type="primary">
        <!-- @click 取消点赞 -->
        <div class="img-box">
          <img src="@/assets/liked.png" alt="" class="like-image" />
        </div>
      </el-button>
      <el-button v-if="!isFav" type="primary" @click="collectPost">
        <div class="img-box">
          <img src="@/assets/fav.png" alt="" class="like-image" />
        </div>
      </el-button>
      <el-button v-if="isFav" type="primary">
        <!-- @click取消收藏 -->
        <div class="img-box">
          <img src="@/assets/faved.png" alt="" class="like-image" />
        </div>
      </el-button>
    </div>
  </div>
  <div v-if="isTypingComment">
    <div class="bottom-actions">
      <div class="new-comment">
        <el-input
          type="textarea"
          v-model="newComment"
          placeholder="输入评论"
          rows="1"
          class="comment-input"
        />
        <el-button type="primary" @click="addComment">发送</el-button>
        <el-button type="primary" @click="isTypingComment = false"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.bottom-actions {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 45vh;
  background-color: #fff;
  /* padding: 10px 20px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ddd;
}

.comment-input {
  flex: 1;
  margin-right: 10px;
}

.img-box {
  width: 20px;
}

.new-comment {
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
}

.like-image {
  width: 100%;
}
</style>