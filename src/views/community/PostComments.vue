<script>
import instance from "@/utils/request";
import { ref, onMounted, watch, onUpdated } from "vue";
import useUserInfoStore from "@/stores/userInfo.js";
import { ElMessage } from "element-plus";

export default {
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  setup(props, { expose, emit }) {
    const comments = ref([]);
    const isTypingReply = ref(false);
    const userInfoStore = new useUserInfoStore();

    /* /////接口部分///// */
    const likeComment = (data) => {
      return instance.post("/likecomments/addLikeComment", data);
    };
    const getThisPostComments = (postId) => {
      return instance.get("/comment/getThisPostComments", {
        params: { postId },
      });
    };
    const getIfLikeComment = (formData) => {
      return instance.post("/likecomments/getIfLikeComment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    };
    const deleteLikeComment = (commentId, userId) => {
      return instance.delete("/likecomments/deleteLikeComment", {
        params: { commentId: commentId, userId: userId },
      });
    };
    const getId = (id) => {
      return instance.get("/user/getId", { params: { id: id } });
    };
    /* /////接口部分///// */

    /* /////函数部分///// */
    const getUserNameByUserId = async (userId) => {
      let res = await getId(userId);
      if (res.code === 0) {
        console.log("调用getId方法成功");
        console.log("userName:", res.data.userName);
        return res.data.userName;
      } else {
        return "";
      }
    };

    const addLikeComment = async (commentId) => {
      let res = await likeComment({
        userId: userInfoStore.info.userId,
        commentId: commentId,
        postId: props.postId,
      });
      if (res.code === 0) {
        console.log("成功点赞评论");
        getComments();
      }
    };

    const getComments = async () => {
      console.log("成功调用子组件");
      let res = await getThisPostComments(props.postId);
      if (res.code === 0) {
        console.log("获取成功");
        const nestedComments = res.data;
        comments.value = await Promise.all(
          nestedComments.map(async (commentArray) => {
            return await Promise.all(
              commentArray.map(async (comment) => {
                let formData = new FormData();
                formData.append("userId", userInfoStore.info.userId);
                formData.append("commentId", comment.commentId);
                console.log(
                  "userId:" +
                    userInfoStore.info.userId +
                    " commentId:" +
                    comment.commentId
                );

                try {
                  let likeRes = await getIfLikeComment(formData);
                  let likeStatus;
                  if (likeRes.code === 0) {
                    console.log("获取评论点赞成功");
                    if (likeRes.message === "true") {
                      likeStatus = true;
                    } else if (likeRes.message === "false") {
                      likeStatus = false;
                    }

                    comment.sendUserName = await getUserNameByUserId(
                      comment.sendUserId
                    );
                    comment.receiveUserId = await getUserNameByUserId(
                      comment.receiveUserId
                    );
                    comment.ifLikeComment = likeStatus;
                    console.log("commentId:" + comment.commentId);
                    console.log("likeStatus:" + comment.ifLikeComment);
                  }
                } catch (error) {
                  console.log("调用getIfLikeComment接口失败", error);
                  comment.ifLikeComment = null; // 或者其他适当的默认值
                }
                return comment;
              })
            );
          })
        );
      } else if (res.code === 1) {
        console.log("获取失败");
      } else {
        console.log("bug了");
      }
    };

    const handleReplyClick = (userId, commentCount, receiveUserName) => {
      isTypingReply.value = true;
      console.log(
        `Reply to user: ${receiveUserName}, commentCount: ${commentCount}`
      );
      emit("isTypingReply", {
        isTyping: isTypingReply.value,
        userId,
        commentCount,
        receiveUserName,
      });
    };

    const cancelLikeComment = async (object, commentId) => {
      let res = await deleteLikeComment(commentId, userInfoStore.info.userId);
      if (res.code === 0) {
        console.log("取消点赞评论成功");
        object.ifLikeComment = false;
        getComments();
      }
    };
    /* /////函数部分///// */

    watch(
      () => props.postId,
      (newPostId) => {
        isTypingReply.value = false;
        getComments();
      }
    );

    onMounted(() => {
      getComments();
    });

   /*  onUpdated(() => {
      getComments();
    }); */

    expose({
      isTypingReply,
    });

    return {
      comments,
      isTypingReply,
      handleReplyClick,
      addLikeComment,
      cancelLikeComment,
    };
  },
};
</script>

<template>
  <div>
    <div
      v-for="(commentThread, index) in comments"
      :key="index"
      class="comment-thread"
    >
      <!-- 主评论 -->
      <div class="comment">
        <!-- 用户名 -->
        <p class="username">{{ commentThread[0].sendUserName }}</p>
        <!-- 评论内容 -->
        <p class="content">{{ commentThread[0].content }}</p>
        <!-- 评论日期 -->
        <p class="date">{{ commentThread[0].commentDate }}</p>
        <!-- 点赞和回复 -->
        <p class="actions">
          <el-button
            @click="
              handleReplyClick(
                commentThread[0].sendUserId,
                commentThread[0].commentCount,
                commentThread[0].sendUserName
              )
            "
            class="bottom-button custom-button"
            type="primary"
          >
            <div class="img-box">
              <img src="@/assets/comment.png" alt="" class="like-image" />
            </div>
          </el-button>
          {{ commentThread.length - 1 }}
          <el-button
            v-if="!commentThread[0].ifLikeComment"
            @click="addLikeComment(commentThread[0].commentId)"
            class="bottom-button custom-button"
          >
            <div class="img-box">
              <img src="@/assets/like.png" alt="" class="like-image" />
            </div>
          </el-button>
          <el-button
            v-if="commentThread[0].ifLikeComment"
            @click="
              cancelLikeComment(commentThread[0], commentThread[0].commentId)
            "
            class="bottom-button custom-button"
          >
            <div class="img-box">
              <img src="@/assets/liked.png" alt="" class="like-image" />
            </div>
          </el-button>
          {{ commentThread[0].likeCount }}
        </p>
      </div>
      <!-- 回复 -->
      <div v-if="commentThread.length > 1" class="replies">
        <div
          v-for="(reply, replyIndex) in commentThread.slice(1)"
          :key="replyIndex"
          class="reply"
        >
          <!-- 用户名 -->
          <p class="username">{{ reply.sendUserName }}</p>
          <!-- 回复内容 -->
          <p class="content">{{ reply.content }}</p>
          <!-- 回复日期和回复对象 -->
          <p class="date">
            回复 {{ reply.receiveUserName }} 于 {{ reply.commentDate }}
          </p>
          <!-- 点赞和回复 -->
          <p class="actions">
            <el-button
              @click="
                handleReplyClick(
                  reply.sendUserId,
                  commentThread[0].commentCount,
                  reply.sendUserName
                )
              "
              class="bottom-button custom-button"
              type="primary"
            >
              <div class="img-box">
                <img src="@/assets/comment.png" alt="" class="like-image" />
              </div>
            </el-button>
            <el-button
              v-if="!reply.ifLikeComment"
              @click="addLikeComment(reply.commentId)"
              class="bottom-button custom-button"
            >
              <div class="img-box">
                <img src="@/assets/like.png" alt="" class="like-image" />
              </div>
            </el-button>
            <el-button
              v-if="reply.ifLikeComment"
              @click="cancelLikeComment(reply, reply.commentId)"
              class="bottom-button custom-button"
            >
              <div class="img-box">
                <img src="@/assets/liked.png" alt="" class="like-image" />
              </div>
            </el-button>
            {{ reply.likeCount }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-thread {
  margin-bottom: 20px;
}

.comment,
.reply {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
}

.replies {
  margin-left: 40px;
}

.username,
.content,
.date,
.actions {
  margin: 5px 0;
}

button {
  margin-right: 10px;
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
</style>
