<script>
import { onMounted, ref, watch } from "vue";
import instance from "@/utils/request";
import useUserInfoStore from "@/stores/userInfo";
import PostComments from "./PostComments.vue";
import { ElMessage } from "element-plus";

export default {
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  components: {
    PostComments,
  },
  setup(props) {
    const userInfoStore = useUserInfoStore();
    const isTypingComment = ref(false);
    const isliked = ref(false);
    const isFav = ref(false);
    const newComment = ref("");

    /* /////接口部分///// */
    //是否点赞帖子接口
    const getIfLikePost = (formData) => {
      // 发送请求
      return instance.post("/likepost/getIfLikePost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    };
    //是否收藏帖子接口
    const getIfCollectPost = (formData) => {
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
    //取消点赞接口
    const deleteLikePost = (userId, postId) => {
      return instance.delete("/likepost/deleteLikePost", {
        params: {
          userId: userId,
          postId: postId,
        },
      });
    };
    //收藏帖子接口
    const addCollectPost = (data) => {
      return instance.post("/collectpost/addCollection", data);
    };
    //取消收藏接口
    const deleteCollection = (userId, postId) => {
      return instance.delete("/collectpost/deleteCollection", {
        params: {
          userId: userId,
          postId: postId,
        },
      });
    };
    //评论帖子接口
    const commentPost = (data) => {
      return instance.post("/comment/commentPost", data);
    };

    /* /////函数部分///// */
    const initPostBottomBar = async () => {
      isTypingComment.value = false;

      const formData = new FormData();
      formData.append("userId", userInfoStore.info.userId);
      formData.append("postId", props.postId);
      let ifLikeRes = await getIfLikePost(formData);
      let ifFavRes = await getIfCollectPost(formData);
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

    //点赞帖子
    const likePost = async () => {
      console.log("调用likePost方法");
      let likeRelation = ref({
        userId: userInfoStore.info.userId,
        postId: props.postId,
      });
      console.log(
        "likeRelation:" + likeRelation.value.userId + likeRelation.value.postId
      );
      let res = await addLikePost(likeRelation.value);
      if (res.code === 0) {
        console.log("点赞成功");
        isliked.value = true;
      } else {
        console.log("点赞失败");
      }
    };
    //取消点赞
    const cancelLikePost = async () => {
      console.log("调用deleteLikePost方法");
      let res = await deleteLikePost(userInfoStore.info.userId, props.postId);
      if (res.code === 0) {
        console.log("取消点赞成功");
        isliked.value = false;
      }
    };
    //收藏帖子
    const collectPost = async () => {
      console.log("收藏帖子");
      let collectRelation = ref({
        userId: userInfoStore.info.userId,
        postId: props.postId,
      });
      let res = await addCollectPost(collectRelation.value);
      if (res.code === 0) {
        console.log("收藏成功");
        isFav.value = true;
      } else {
        console.log("点赞失败");
      }
    };
    //取消收藏
    const cancelCollectPost = async () => {
      let res = await deleteCollection(userInfoStore.info.userId, props.postId);
      if (res.code === 0) {
        console.log("取消收藏成功");
        isFav.value = false;
      }
    };
    //评论帖子
    const addComment = async () => {
      if (userInfoStore.info.isPost === true) {
        if (newComment.value.trim()) {
          let data = {
            postId: props.postId,
            content: newComment.value,
            sendUserId: userInfoStore.info.userId,
          };
          let res = await commentPost(data);
          if (res.code === 0) {
            alert("评论成功");
            window.location.reload();
            newComment.value = "";
            isTypingComment.value = false;
          }
        } else {
          alert("评论不能为空哦");
        }
      } else {
        alert("没有评论权限哦");
      }
    };

    watch(
      () => props.postId,
      (newPostId) => {
        initPostBottomBar();
      }
    );

    onMounted(() => {
      initPostBottomBar();
    });
    return {
      isTypingComment,
      isliked,
      isFav,
      newComment,
      likePost,
      cancelLikePost,
      collectPost,
      cancelCollectPost,
      addComment,
    };
  },
};
</script>

<template>
  <div v-if="!isTypingComment">
    <div class="bottom-actions">
      <el-input
        type="textarea"
        placeholder="输入评论"
        rows="1"
        @click="isTypingComment = true"
        class="comment-input"
      />
      <el-button
        @click="isTypingComment = true"
        class="bottom-button custom-button"
        type="primary"
      >
        <div class="img-box">
          <img src="@/assets/comment.png" alt="" class="like-image" />
        </div>
      </el-button>
      <el-button
        v-if="!isliked"
        @click="likePost"
        class="bottom-button custom-button"
      >
        <div class="img-box">
          <img src="@/assets/like.png" alt="" class="like-image" />
        </div>
      </el-button>
      <el-button
        v-if="isliked"
        type="primary"
        @click="cancelLikePost"
        class="bottom-button custom-button"
      >
        <!-- @click 取消点赞 -->
        <div class="img-box">
          <img src="@/assets/liked.png" alt="" class="like-image" />
        </div>
      </el-button>
      <el-button
        class="bottom-button custom-button"
        v-if="!isFav"
        type="primary"
        @click="collectPost"
      >
        <div class="img-box">
          <img src="@/assets/fav.png" alt="" class="like-image" />
        </div>
      </el-button>
      <el-button
        v-if="isFav"
        type="primary"
        @click="cancelCollectPost"
        class="bottom-button custom-button"
      >
        <!-- @click取消收藏 -->
        <div class="img-box">
          <img src="@/assets/faved.png" alt="" class="like-image" />
        </div>
      </el-button>
    </div>
  </div>
  <!-- 输入评论区域 -->
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
        <div class="comment-area-button">
          <button @click="addComment" class="send-button">发送</button>
          <button @click="isTypingComment = false" class="cancel-button">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bottom-actions {
  /*  //position: fixed;
  //bottom: 10px;
  //right: 10px; */
  width: 55vh;
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

.comment-area-button {
  display: flex;
  justify-content: flex-end; /* 使按钮右对齐 */
  gap: 10px;
}

.new-comment {
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
  width: 55vh;
}

.img-box {
  width: 20px;
}
.like-image {
  width: 100%;
}
.bottom-button.custom-button {
  background-color: white;
  border-color: white;
}

.send-button {
  padding: 10px 20px;
  margin-left: 10px;
  font-size: 15px;
  border: none;
  background-color: #008e74;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.send-button:hover {
  background-color: #005445;
}

.cancel-button {
  padding: 10px 20px;
  margin-left: 10px;
  font-size: 15px;
  border: none;
  background-color: #808080;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.cancel-button:hover {
  background-color: #505050;
}
</style>