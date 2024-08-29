<script>
import { ref, onMounted, watch } from "vue";
import instance from "@/utils/request";
import useUserInfoStore from "@/stores/userInfo.js";
import { ElMessage } from "element-plus";

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
    const isReplying = ref(false);
    const ifShowPost = ref(false);
    const receiveReplyUser = ref();
    const replyCommentCount = ref();
    const newReply = ref();
    const receiveUserName = ref("未知用户");
    const currentPage = ref(1);
    const pageSize = ref(6);
    const currentPosts = ref([]);
    const isShow = ref(true)

    const handleValue =(value)=>{
      isShow.value = value
    }

    const handleCurrentChange = (number) => {
      currentPosts.value = [];
      currentPage.value = number;

      const index = pageSize.value * (number - 1);

      for (let i = index; i < index + pageSize.value; i++) {
        if (i >= posts.value.length) {
          break;
        } else {
          currentPosts.value.push(posts.value[i]);
        }
      }
    };

    watch(selectedPost, (newValue) => {
      console.log("selectedPost has changed to:", newValue.id);
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
    const replyComment = (data) => {
      return instance.post("/comment/replyComment", data);
    };
    const searchPost = (title) => {
      return instance.get("/post/searchPost", { params: { title } });
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
          image: post.image.split(","), // 你可以根据需要调整图片的处理方式
          title: post.title,
          description: post.content,
          author: post.userName, // 你可以根据需要调整作者的处理方式
          date: new Date(post.publishDate).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }));
        handleCurrentChange(currentPage.value);
      } else {
        console.log("failed to get posts");
      }
    };

    //选择帖子
    const selectPost = async (postValue) => {
      ifShowPost.value = true;
      newReply.value = "";
      console.log("showPost:" + ifShowPost.value);
      selectedPost.value = postValue;
      console.log("selectedPostId:" + selectedPost.value.id);
    };

    const addReply = async () => {
      let res = await replyComment({
        commentCount: replyCommentCount.value,
        postId: selectedPost.value.id,
        content: newReply.value,
        sendUserId: userInfoStore.info.userId,
        receiveUserId: receiveReplyUser.value,
      });
      if (res.code === 0) {
        ElMessage({
          message: "评论成功！",
          type: "success",
        });
        newReply.value = "";
        isReplying.value = false;
      }
    };

    const getIsTypingReply = (data) => {
      console.log("data:" + data.isTyping);
      isReplying.value = data.isTyping;
      receiveReplyUser.value = data.userId;
      replyCommentCount.value = data.commentCount;
      receiveUserName.value = data.receiveUserName;
      console.log("传入的receiveUserName:" + receiveUserName.value);
    };

    const searchPostOnClick = async () => {
      let searchText = search.value;
      let res = await searchPost(searchText);
      if (res.code === 0) {
        console.log("搜索成功");
        posts.value = res.data.map((post) => ({
          id: post.postId,
          image: post.image.split(","), // 你可以根据需要调整图片的处理方式
          title: post.title,
          description: post.content,
          author: post.userName, // 你可以根据需要调整作者的处理方式
          date: new Date(post.publishDate).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }));
        handleCurrentChange(currentPage.value);
      }
    };

    onMounted(() => {
      //alert("created")
      getPostList();
    });

    return {
      currentPage,
      pageSize,
      handleCurrentChange,
      currentPosts,

      isShow,
      handleValue,

      search,
      selectedPost,
      newReply,
      ifShowPost,
      posts,
      isReplying,
      receiveReplyUser,
      replyCommentCount,
      selectPost,
      addReply,
      getAllPosts,
      getPostList,
      getPostComments,
      getIsTypingReply,
      searchPostOnClick,
    };
  },
};
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-main class="main-container">
        <div class="topBar fixed-top-bar">
          <div class="center-container">
            <el-input
              :prefix-icon="search"
              placeholder="输入搜索内容"
              clearable
              v-model="search"
              style="width: 240px; margin-top: 9px; margin-right: 4px"
              size="large"
              @keydown.enter="searchPostOnClick"
            />
            <el-button
              class="button"
              type="primary"
              auto-insert-space
              @click="searchPostOnClick"
              >搜索</el-button
            >
            <PublishPost @value="handleValue"/>
          </div>
        </div>

        <div v-if="isShow">
        <div class="pagination-container">
          <el-row>
            <el-col span="8">
              <div class="demo-pagination-block">
                <div class="demonstration"></div>
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :size="'default'"
                  :disabled="false"
                  :background="true"
                  layout="total, prev, pager, next, jumper"
                  :total="posts.length"
                  @current-change="handleCurrentChange"
                />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

        <div class="posts-container">
          <div class="posts-wrapper">
            <PostCard
              v-for="post in currentPosts"
              :key="post.id"
              :image="post.image[0]"
              :title="post.title"
              :description="post.description"
              @click="selectPost(post)"
            />
          </div>
        </div>
      </el-main>
      <el-dialog v-model="ifShowPost" width="70%" class="postDialog">
        <div class="post-container">
          <div class="postLeftSide">
            <el-carousel height="500px">
              <el-carousel-item
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
                v-for="item in selectedPost.image"
                :key="item"
              >
                <el-image
                  style="width: 100%; height: auto; object-fit: contain"
                  :src="item"
                  fit="fit"
                />
              </el-carousel-item>
            </el-carousel>
          </div>

          <div class="postRightSide">
            <div class="comments-container">
              <h2 class="post-title">{{ selectedPost.title }}</h2>
              <p class="post-author">作者: {{ selectedPost.author }}</p>
              <p class="post-date">发布日期: {{ selectedPost.date }}</p>
              <p class="post-description">
                {{ selectedPost.description }}
              </p>
              <h3>评论</h3>
              <PostComments
                :postId="selectedPost.id"
                v-on:isTypingReply="getIsTypingReply"
              />
            </div>
            <!-- 底部固定的点赞、收藏和评论框 -->
            <div v-if="!isReplying">
              <PostBottomBar :postId="selectedPost.id" />
            </div>
            <div v-if="isReplying">
              <div class="bottom-actions">
                <div class="new-comment">
                  <el-input
                    type="textarea"
                    v-model="newReply"
                    placeholder="回复评论"
                    rows="1"
                    class="comment-input"
                  />
                  <button @click="addReply" class="send-button">发送</button>
                  <button @click="isReplying = false" class="cancel-button">
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
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
  left: 30vh;
  right: 0;
  /* z-index: 10; */
  background-color: #fffffb;
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
.posts-container {
  margin-top: 20px;
  padding: 10px;
  height: calc(100vh - 70px);

  /* overflow-y: hidden; */
}

.comments-container {
  flex-grow: 1;
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

.postDialog {
  width: 70vh;
}

.post-container {
  display: flex;
  justify-content: space-between;
}

.postLeftSide {
  width: 40%;
}

.postRightSide {
  display: flex;
  flex-direction: column;
  height: 70vh;
  width: 55%;
  padding-left: 20px;
}

.post-image {
  width: 100%;
  max-height: 10;
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
  width: 55vh;
}

.comment-input {
  flex: 1;
  margin-right: 10px;
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
  /*   position: fixed; */
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

.custom-input {
  text-align: center;
}

.top-container {
  display: flex;
  flex-direction: column;
}

.main-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.pagination-container{
  z-index: 0;
  margin-top: 40px;
}
</style>