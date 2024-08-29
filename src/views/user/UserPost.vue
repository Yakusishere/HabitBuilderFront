<script >
import { ref, onMounted, watch } from "vue";
import instance from "@/utils/request";
import useUserInfoStore from "@/stores/userInfo.js";
import EditPost from '@/views/user/EditPost.vue';
import { ElMessage } from "element-plus";

//import type { TabsPaneContext } from 'element-plus'

import PostCard from '@/views/community/CardPost.vue';
import PostBottomBar from "@/views/community/PostBottomBar.vue";
import PostComments from "@/views/community/PostComments.vue";

export default {
  name: "userPost",
  components: {
    PostComments,
    PostBottomBar,
    PostCard,
    EditPost,
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
    const isEditable = ref();
    const tabName=ref("first")
    //const activeName = 'first';

    watch(selectedPost, (newValue) => {
      console.log("selectedPost has changed to:", newValue.id);
    });

    //调对用户获取所有帖子的接口
    const getUserPostService = (userId) => {
      return instance.get("post/getPostByUserId", { params: { userId } });
    };
    //根据用户获取喜欢帖子的接口
     const getUserLikePostService = (userId) => {
      return instance.get("likepost/getLikePostByUserId", { params: { userId } });
    };
    //根据用户获取收藏帖子的接口
     const getUserCollectPostService = (userId) => {
      return instance.get("collectpost/getCollections", { params: { userId } });
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
      console.log("获取个人帖子");
      let res = await getUserPostService(userInfoStore.info.userId);
      console.log("method used");
      if (res.code === 0) {
        console.log("gotPosts:" + res.data);
        console.log("success got posts");
        posts.value = res.data.map((post) => ({
          id: post.postId,
          image: post.image.split(','), // 你可以根据需要调整图片的处理方式
          title: post.title,
          description: post.content,
          author: post.userName, // 你可以根据需要调整作者的处理方式
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

    const getLikePostList = async () => {
      console.log("获取个人点赞过帖子");
      let res = await getUserLikePostService(userInfoStore.info.userId);
      console.log("method used");
      if (res.code === 0) {
        console.log("gotPosts:" + res.data);
        console.log("success got posts");
        posts.value = res.data.map((post) => ({
          id: post.postId,
          image: post.image && typeof post.image === 'string' ? post.image.split(',') : [],// 你可以根据需要调整图片的处理方式
          title: post.title,
          description: post.content,
          author: post.userName, // 你可以根据需要调整作者的处理方式
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


    const getCollectPostList = async () => {
      console.log("获取个人收藏过帖子");
      let res = await getUserCollectPostService(userInfoStore.info.userId);
      console.log("method used");
      if (res.code === 0) {
        console.log("gotPosts:" + res.data);
        console.log("success got posts");
        posts.value = res.data.map((post) => ({
          id: post.postId,
          image: post.image && typeof post.image === 'string' ? post.image.split(',') : [], // 你可以根据需要调整图片的处理方式
          title: post.title,
          description: post.content,
          author: post.userName, // 你可以根据需要调整作者的处理方式
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
    const deletePost = async (postId) => {
      ifShowPost.value = false;
      console.log("发起删除请求:", postId);
      try {
        const formData = new FormData();
        formData.append('postId', postId);

        const response = await instance.delete('/post/deletePost', {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: formData
        });

        console.log("服务器响应:", response);
        window.location.reload();
        
        if (response && response.data) {
          console.log("服务器响应数据:", response.data);
          if (response.data.code === 0) {
            posts.value = posts.value.filter(post => post.id !== postId);
            if (selectedPost.value && selectedPost.value.id === postId) {
              selectedPost.value = null;
            }
            getPostList();
            console.log("删除成功");
          } else {
            console.log("删除失败", response.data.message);
          }
        } else {
          console.log("服务器未返回数据");
        }
      } catch (error) {
        console.error("删除帖子时发生错误", error);
      }
    };
    const searchPostOnClick = async () => {
      let searchText = search.value;
      let res = await searchPost(searchText);
      if (res.code === 0) {
        console.log("搜索成功");
        posts.value = res.data.map((post) => ({
          id: post.postId,
          image: post.image.split(','), // 你可以根据需要调整图片的处理方式
          title: post.title,
          description: post.content,
          author: post.userName, // 你可以根据需要调整作者的处理方式
          date: new Date(post.publishDate).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }));
        
      }
    };
    
    const handleTabClick = (tab) => {
      tabName.value = tab.props.name; // 获取标签页的名称属性
      console.log(`Tab clicked: ${tabName}`);

      // 根据标签页名称执行不同的方法
      if (tabName.value === "first") {
        isEditable.value = true;
        getPostList();
      } else if (tabName.value === "second") {
        isEditable.value = false;
        getLikePostList();
      } else if (tabName.value === "third") {
        isEditable.value = false;
        getCollectPostList();
      }
    };

    const handleEditPost = (postId) => {
  // 隐藏详细页面
  ifShowPost.value = false;

  // 设置一定的延迟，确保页面切换流畅
  setTimeout(() => {
    // 设置选中的帖子信息，并调用编辑页面的 fetchPostDetails 方法
    selectedPost.value = posts.value.find(post => post.id === postId);
    EditPost.methods.fetchPostDetails(postId);
  }, 300); // 可以根据需要调整延迟时间
};


    onMounted(() => {
      //alert("created")
      getPostList();
    });

    return {
      search,
      selectedPost,
      newReply,
      ifShowPost,
      posts,
      isReplying,
      receiveReplyUser,
      replyCommentCount,
      isEditable,
      selectPost,
      addReply,
      getUserPostService,
      getUserLikePostService,
      getUserCollectPostService,
      getPostList,
      getPostComments,
      getIsTypingReply,
      deletePost,
      searchPostOnClick,
      handleTabClick,
      getLikePostList,
      getCollectPostList,
      handleEditPost,
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
            <el-tabs @tab-click="handleTabClick" class="demo-tabs">
              <el-tab-pane label="个人帖子" name="first" ></el-tab-pane>
    <el-tab-pane label="历史点赞" name="second"></el-tab-pane>
    <el-tab-pane label="历史收藏" name="third"></el-tab-pane>
  </el-tabs>
          </div>
        </div>
        <div class="posts-container">
          <div class="posts-wrapper">
            <PostCard
              v-for="post in posts"
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
            <div class="post-actions">
              <EditPost :post="selectedPost" v-if="isEditable" />
              <el-button class="delete-button" @click="deletePost(selectedPost.id)"v-if="isEditable"
                         style="margin-right: 5vh;margin-top: 0.5vh;height: 4.2vh">删除</el-button>
            </div>
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
  margin-top: 70px;
  padding: 10px;
  height: calc(100vh - 70px);
  overflow-y: scroll;
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
.post-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 10px;
}
</style>