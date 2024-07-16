<script>
import { onMounted, ref, watch } from "vue";
import instance from "@/utils/request";
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
    const deleteLikePost = (formData) => {
      return instance.post("/likepost/deleteLikePost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    };
    //收藏帖子接口
    const addCollectPost = (data) => {
      return instance.post("/collectpost/addCollection", data);
    };
    //取消收藏接口
    const deleteCollection = (formData) => {
      return instance.post("/collectpost/deleteCollection", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
      const formData = new FormData();
      formData.append("userId", userInfoStore.info.userId);
      formData.append("postId", props.postId);
      let res = await deleteLikePost(formData);
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
      console.log("调用deleteCollection方法");
      const formData = new FormData();
      formData.append("userId", userInfoStore.info.userId);
      formData.append("postId", props.postId);
      let res = await deleteCollection(formData);
      if (res.code === 0) {
        console.log("取消收藏成功");
        isFav.value = false;
      }
    };
    //评论帖子
    const addComment = async () => {
      if (newComment.value.trim()) {
        let data = {
          postId: props.postId,
          content: newComment.value,
          sendUserId: userInfoStore.info.userId,
        };
        let res = await commentPost(data);
        if (res.code === 0) {
          alert("评论成功");
          newComment.value = "";
          isTypingComment = false;
        }
      } else {
        alert("评论不能为空哦");
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
      <el-button type="primary" @click="isTypingComment = true">评论</el-button>
      <el-button v-if="!isliked" type="primary" @click="likePost">
        <div class="img-box">
          <img src="@/assets/like.png" alt="" class="like-image" />
        </div>
      </el-button>
      <el-button v-if="isliked" type="primary" @click="cancelLikePost">
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
      <el-button v-if="isFav" type="primary" @click="cancelCollectPost">
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