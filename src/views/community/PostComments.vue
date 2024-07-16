<script>
import instance from "@/utils/request";
import { ref, onMounted, watch } from "vue";
export default {
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  setup(props, { expose }) {
    //const postId = ref();
    const comments = ref([]);
    const isTypingReply = ref(false);

    const getThisPostComments = (postId) => {
      console.log("父组件传入的postId:" + postId);
      return instance.get("/comment/getThisPostComments", {
        params: { postId },
      });
    };
    const getComments = async () => {
      console.log("成功调用子组件");
      let res = await getThisPostComments(props.postId);
      if (res.code === 0) {
        console.log("获取成功");
        comments.value = res.data;
      } else if (res.code === 1) {
        console.log("获取失败");
      } else {
        console.log("bug了");
      }
    };

    watch(
      () => props.postId,
      (newPostId) => {
        getComments();
      }
    );

    onMounted(() => {
      getComments();
    });

    expose({
        isTypingReply
    })

    return {
      comments,
      isTypingReply
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
        <p class="username">用户{{ commentThread[0].sendUserId }}</p>
        <!-- 评论内容 -->
        <p class="content">{{ commentThread[0].content }}</p>
        <!-- 评论日期 -->
        <p class="date">{{ commentThread[0].commentDate }}</p>
        <!-- 点赞和回复 -->
        <p class="actions">
          <button>点赞</button> {{ commentThread[0].likeCount }}
          <button @click="isTypingReply.value = true">回复</button> {{ commentThread.length - 1 }}
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
          <p class="username">用户{{ reply.sendUserId }}</p>
          <!-- 回复内容 -->
          <p class="content">{{ reply.content }}</p>
          <!-- 回复日期和回复对象 -->
          <p class="date">
            回复 {{ commentThread[0].receiveUserId }} 于 {{ reply.commentDate }}
          </p>
          <!-- 点赞和回复 -->
          <p class="actions">
            <button>点赞</button> {{ reply.likeCount }} <button>回复</button> 0
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
  margin-left: 20px;
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
</style>
