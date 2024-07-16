<script>
import { Search } from "@element-plus/icons-vue";
import { ref, onMounted, watch } from "vue";
import instance from "@/utils/request";
import useUserInfoStore from "@/stores/userInfo.js";

import PostCard from "./CardPost.vue";
import PublishPost from "./publishPost.vue";
import PostBottomBar from "./PostBottomBar.vue";
import PostComments from "./PostComments.vue";

export default {
  name: "communityPage",
  components: {
    PostComments,
    PostBottomBar,
    PostCard,
    PublishPost,
  },
  setup() {
    const search = ref("");
    const selectedPost = ref(null);
    const posts = ref([]);
    const userInfoStore = useUserInfoStore();
    const PostCommentsRef = ref(null);

    watch(selectedPost, (newValue) => {
      console.log("selectedPost has changed to:", newValue.id);
      // 这里可以添加其他需要在selectedPost变化时执行的逻辑
    });

    //调用获取所有帖子接口
    const getAllPosts = () => {
      return instance.get("/post/getAllPost");
    };
    //调用获取帖子评论接口
    const getPostComments = (postId) => {
      return instance.get("/comment/getThisPostComments", {
        params: { postId },
      });
    };
    //根据id查找用户名接口
    const getUserById = (id) => {
      return instance.get("/user/getId", { params: { id } });
    };

    const getPostList = async () => {
      let res = await getAllPosts();
      console.log("method used");
      if (res.code === 0) {
        console.log("gotPosts:" + res.data);
        console.log("success got posts");
        posts.value = res.data.map((post) => ({
          id: post.postId,
          image: post.image, // 你可以根据需要调整图片的处理方式
          title: post.title,
          description: post.content,
          author: `用户${post.userId}`, // 你可以根据需要调整作者的处理方式
          date: new Date(post.publishDate).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }));
      } else {
        console.log("failed to get posts");
      }
    };

    //选择帖子
    const selectPost = async (postValue) => {
      selectedPost.value = postValue;
      console.log("selectedPostId:" + selectedPost.value.id);
      getCommentListOnClick();
    };

    // 获取评论列表
    const getCommentListOnClick = async () => {
      let res;
      res = await getPostComments(selectedPost.value.id);
      if (res.code === 0) {
        console.log("获取评论列表成功");
        selectedPost.comments = res.data;
      } else if (res.code === 1) {
        console.log("获取评论列表失败");
      }
    };

    const addComment = () => {
      if (newComment.value.trim()) {
        selectedPost.value.comments.push({
          id: Date.now(),
          author: "当前用户",
          text: newComment.value,
          replies: [],
        });
        newComment.value = "";
      }
    };

    const showReplyInput = (comment, reply = null) => {
      if (reply) {
        reply.showReplyInput = true;
      } else {
        comment.showReplyInput = true;
      }
    };

    const addReply = (comment, reply = null) => {
      if (reply) {
        if (reply.newReplyText.trim()) {
          reply.replies = reply.replies || [];
          reply.replies.push({
            id: Date.now(),
            author: "当前用户",
            text: reply.newReplyText,
          });
          reply.newReplyText = "";
          reply.showReplyInput = false;
        }
      } else {
        if (comment.newReplyText.trim()) {
          comment.replies.push({
            id: Date.now(),
            author: "当前用户",
            text: comment.newReplyText,
            replies: [],
          });
          comment.newReplyText = "";
          comment.showReplyInput = false;
        }
      }
    };

    onMounted(() => {
      //alert("created")
      getPostList();
    });

    return {
      search,
      selectedPost,
      PostCommentsRef,
      selectPost,
      addComment,
      showReplyInput,
      addReply,
      posts,
      getAllPosts,
      getPostList,
      getPostComments,
    };
  },
};
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <div class="topBar fixed-top-bar">
          <div class="center-container">
            <el-input
              :prefix-icon="search"
              placeholder="输入搜索内容"
              clearable
              v-model="search"
              style="width: 240px"
              size="large"
            ></el-input>
            <el-button class="button" type="primary" auto-insert-space
              >搜索</el-button
            >
            <PublishPost />
          </div>
        </div>
        <div class="posts-container">
          <div class="posts-wrapper">
            <PostCard
              v-for="post in posts"
              :key="post.id"
              :image="post.image"
              :title="post.title"
              :description="post.description"
              @click="selectPost(post)"
            />
          </div>
        </div>
      </el-main>
      <el-aside class="aside-fixed">
        <div v-if="selectedPost" class="post-details">
          <h2 class="post-title">{{ selectedPost.title }}</h2>
          <img :src="selectedPost.image" alt="Post Image" class="post-image" />
          <p class="post-author">作者: {{ selectedPost.author }}</p>
          <p class="post-date">发布日期: {{ selectedPost.date }}</p>
          <p class="post-description">{{ selectedPost.description }}</p>

          <div class="comments-section">
            <h3>评论</h3>
            <PostComments :postId="selectedPost.id" />
            <!-- 底部固定的点赞、收藏和评论框 -->
            <PostBottomBar :postId="selectedPost.id" />
          </div>
        </div>

        <div v-else class="no-post-selected">请选择一个帖子以查看详情</div>
      </el-aside>
    </el-container>
  </div>
</template>

<style scoped>
/* 全局样式 */
body,
html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

/* 固定顶部搜索框 */
.fixed-top-bar {
  position: fixed;
  top: 0;
  left: 20vh;
  right: 0;
  /* z-index: 10; */
  background-color: #fff;
  padding: 10px;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
}

.topBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.center-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

/* 固定侧边栏 */
.aside-fixed {
  position: fixed;
  top: 60px;
  bottom: 0;
  right: 0;
  width: 45vh;
  z-index: 20;
  overflow-y: auto;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.posts-container {
  margin-top: 70px;
  margin-right: 360px;
  padding: 10px;
  height: calc(100vh - 70px);
  overflow-y: auto;
}

.posts-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.post-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  flex: 0 0 auto;
  background-color: #fff;
}

.post-image {
  width: 100%;
  height: auto;
}

.post-content {
  padding: 15px;
}

.post-title {
  font-size: 18px;
  margin: 0 0 10px 0;
}

.post-description {
  font-size: 14px;
  color: #666;
}

.post-details {
  padding: 20px;
}

.post-author,
.post-date {
  font-size: 14px;
  color: #999;
}

.no-post-selected {
  font-size: 16px;
  color: #666;
  text-align: center;
  padding: 20px;
}

/* 评论样式 */
.comments-section {
  margin-top: 20px;
}

.comment {
  margin-bottom: 10px;
}

.comment-author {
  font-weight: bold;
}

.comment-text {
  margin: 5px 0;
}

.new-comment {
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
}

.comment-input {
  flex: 1;
  margin-right: 10px;
}

.replies {
  margin-left: 20px;
  margin-top: 10px;
}

.reply {
  margin-bottom: 5px;
}

.reply-author {
  font-weight: bold;
}

.reply-text {
  margin: 5px 0;
}

.reply-input {
  margin-top: 10px;
  margin-left: 20px;
}

.el-button {
  margin-top: 10px;
}

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

.img-box {
  width: 20px;
}

.like-image {
  width: 100%;
}
</style>