<template>
  <div class="modal-overlay">
    <div class="modal-content" @click.stop>
      <n-flex>
        <div class="left-container">
          <el-carousel class="post-images-carousel" :autoplay="false">
            <el-carousel-item
                v-for="image in postInfo.images"
                :key="image"
                class="post-images-container">
              <div><img :src="image" alt="" class="post-image"/></div>
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="right-container">
          <div class="avatar-container">
            <div>
              <n-flex justify="space-between">
                <div>
                  <n-flex>
                    <n-avatar
                        round
                        size="medium"
                        :src=postInfo.avatarImg
                        style="margin-left: 15px"
                    />

                    <div class="post-nick-name">
                      {{ postInfo.nickName }}
                    </div>
                  </n-flex>
                </div>

                <div class="subscribe-button">
                  <Subscribe/>
                </div>

              </n-flex>
            </div>
          </div>

          <!--内容部分（标题-内容-评论区等）-->
          <div class="content-container">
            <n-scrollbar style="max-height: 560px">
              <div class="title-container">
                <div style="margin-left: 15px;margin-right: 15px;">
                  {{ postInfo.title }}
                </div>

              </div>

              <div class="description-container">
                {{ postInfo.content }}
              </div>

              <div class="post-time-container">
                {{ postInfo.publishDate }}
              </div>

              <div style="margin-right: 25px; margin-left: 15px">
                <el-divider/>
              </div>

              <div class="comment-section-container">
                <div class="comment-count-text">
                  共{{ commentCount }}条评论
                </div>

                <div v-for="(comment,index) in commentSection" :key="index">
                  <div class="comment-container">
                    <n-flex justify="space-between">
                      <div>
                        <n-flex>
                          <div class="comment-avatar">
                            <n-avatar
                                round
                                size="medium"
                                :src=comment.avatarImg
                            />
                          </div>

                          <n-flex vertical>
                            <div style="font-size: 14px;margin-top: -3px; color: #606060">
                              {{ comment.nickName }}
                            </div>
                            <div style="font-size: 16px;margin-top: -6px;max-width: 250px">
                              {{ comment.content }}
                            </div>
                            <div>
                              <n-flex>
                                <div style="font-size: 12px; color: #7c7c7c">
                                  {{ comment.commentDate }}
                                </div>
                                <div
                                    style="cursor: pointer;font-size: 12px;color: #7c7c7c"
                                    @click="typingReply(0,comment,index)">
                                  回复
                                </div>
                              </n-flex>
                            </div>
                          </n-flex>
                        </n-flex>
                      </div>

                      <div>
                        <n-flex vertical>
                          <like
                              :initial-like="comment.isLiked"
                              :post-id="postInfo.postId"
                              style="height: 23px;width: 23px"
                          />
                          <div class="comment-likeCount-text">
                            {{ comment.likeCount }}
                          </div>
                        </n-flex>
                      </div>
                    </n-flex>
                  </div>
                  <div v-for="(reply,index2) in comment.replyVoList" :key="index2">
                    <div class="reply-container">
                      <n-flex justify="space-between">
                        <div>
                          <n-flex>
                            <div style="width: 30px">
                              <n-avatar
                                  round
                                  size="small"
                                  :src=reply.sendUserAvatarImg
                              />
                            </div>

                            <n-flex vertical>
                              <div style="font-size: 13px; margin-top: -3px; color: #606060">
                                {{ reply.sendNickName }}
                              </div>
                              <div style="font-size: 15px; margin-top: -6px; max-width: 220px">
                                {{ reply.content }}
                              </div>
                              <div>
                                <n-flex>
                                  <div style="font-size: 12px; color: #7c7c7c">
                                    回复{{ reply.receiveNickName }}于{{ reply.replyDate }}
                                  </div>
                                  <div
                                      style="cursor: pointer;font-size: 12px;color: #7c7c7c"
                                      @click="typingReply(1,reply,index)">
                                    回复
                                  </div>
                                </n-flex>
                              </div>
                            </n-flex>
                          </n-flex>
                        </div>

                        <div>
                          <n-flex vertical>
                            <like
                                :initial-like="reply.isLiked"
                                :post-id="postInfo.postId"
                                style="height: 23px;width: 23px"
                            />
                            <div class="comment-likeCount-text">
                              {{ reply.likeCount }}
                            </div>
                          </n-flex>
                        </div>
                      </n-flex>
                    </div>
                  </div>

                  <div style="margin-right: 25px; margin-left: 15px">
                    <el-divider/>
                  </div>
                </div>
              </div>
            </n-scrollbar>
          </div>

          <div class="bottom-bar-container">
            <div v-if="!isTyping">
              <n-flex>
                <div class="input-bar-container">
                  <n-input @click="typingComment" type="text" placeholder="输入评论"/>
                </div>

                <div class="like-container">
                  <n-flex>
                    <like
                        :initial-like="postInfo.isLiked"
                        :post-id="postInfo.postId"
                        style="height: 23px;width: 23px"
                    />
                    <div style="margin-top: 1px;margin-left: -3px">
                      {{ likeCount }}
                    </div>
                  </n-flex>
                </div>

                <div class="fav-container">
                  <n-flex>
                    <fav style="height: 25px; width: 25px"/>
                    <div style="margin-top: 1px; margin-left: -3px">
                      {{ favCount }}
                    </div>
                  </n-flex>
                </div>

                <div class="comment-button-container" @click="typingComment">
                  <n-flex>
                    <comment style="margin-top: 1px"/>

                    <div style="margin-top: 1px; margin-left: -4px">
                      {{ commentCount }}
                    </div>
                  </n-flex>
                </div>
              </n-flex>
            </div>

            <div v-if="isTyping">
              <n-flex v-if="isComment">
                <div class="comment-input-bar">
                  <n-input
                      type="text"
                      placeholder="输入评论"
                      v-model:value="commentInput"
                  />
                </div>

                <div class="send-button-container">
                  <n-button color="#807ce8" size="small" @click="sendCommentOnClick">
                    <div style="font-size: 13px;font-weight: normal;">
                      发送
                    </div>

                  </n-button>
                </div>

                <div class="cancel-button-container">
                  <n-button color="gray" size="small" @click="isTyping=false">
                    <div style="font-size: 13px;font-weight: normal;">
                      取消
                    </div>
                  </n-button>
                </div>
              </n-flex>

              <n-flex v-if="isReply">
                <div class="comment-input-bar">
                  <n-input
                      type="text"
                      placeholder="请输入回复"
                      v-model:value="replyInput"
                  />
                </div>

                <div class="send-button-container">
                  <n-button color="#807ce8" size="small" @click="sendReplyOnClick()">
                    <div style="font-size: 13px;font-weight: normal;">
                      发送
                    </div>

                  </n-button>
                </div>

                <div class="cancel-button-container">
                  <n-button color="gray" size="small" @click="isTyping=false">
                    <div style="font-size: 13px;font-weight: normal;">
                      取消
                    </div>
                  </n-button>
                </div>
              </n-flex>
            </div>

          </div>
        </div>
      </n-flex>


    </div>
  </div>
</template>

<script>
import {h, ref, onMounted} from "vue";
import {ElNotification} from 'element-plus'
import like from './like.vue';
import Fav from "@/views/community/components/fav.vue";
import Comment from "@/views/community/components/comment.vue";
import Subscribe from "@/views/community/components/subscribe.vue";
import {
  addCommentService
} from "@/api/comment.js";
import {
  addReplyService
} from "@/api/reply.js";

export default {
  name: 'BrowsePost',
  components: {
    Subscribe,
    Comment,
    Fav,
    like,
  },
  props: {
    postInfo: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const commentSection = ref([]);
    const isTyping = ref(false);
    const isComment = ref(false);
    const isReply = ref(false);
    const commentInput = ref("");

    const replyInput = ref("");
    const replyType = ref(-1);
    const replyToObject = ref(null);
    const currentCommentIndex = ref(-1);
    const replyToUser = ref("");

    const commentCount = ref();
    const likeCount = ref();
    const favCount = ref();

    const typingComment = () => {
      isTyping.value = true;
      isComment.value = true;
      isReply.value = false;
    }

    const typingReply = (type, data, index) => {
      isTyping.value = true;
      isComment.value = false;
      isReply.value = true;
      replyType.value = type;
      replyToObject.value = data;
      currentCommentIndex.value = index;
      if (type === 0) {
        replyToUser.value = data.nickName;
      } else if (type === 1) {
        replyToUser.value = data.sendNickName;
      }
      console.log("type:" + type);
      console.log("data:" + data);
      console.log("replyToUser:" + replyToUser);
    }

    const sendCommentOnClick = async () => {
      let res = await addCommentService({
        "postId": props.postInfo.postId,
        "content": commentInput.value
      });
      if (res.code === 0) {
        ElNotification({
          title: ("评论成功！"),
          message: h('i', {style: 'color: teal'}, '评论已发送，地球已接收到你的智慧信号'),
        })
        isTyping.value = false;
        commentCount.value += 1;
        commentInput.value = "";
        commentSection.value.unshift(res.data);
      }
    }

    const sendReplyOnClick = async () => {
      let res = null;
      // 回复评论
      if (replyType.value === 0) {
        res = await addReplyService({
          "commentId": replyToObject.value.commentId,
          "content": replyInput.value
        })
      }
      //回复别的回复
      else if (replyType.value === 1) {
        res = await addReplyService({
          "commentId": replyToObject.value.commentId,
          "replyToId": replyToObject.value.replyId,
          "content": replyInput.value,
        })
      }

      if (res.code === 0) {
        ElNotification({
          title: ("回复成功！"),
          message: h('i', {style: 'color: teal'}, '回复已发送，地球已接收到你的智慧信号'),
        })
        isTyping.value = false;
        replyInput.value = "";
        commentCount.value += 1;
        commentSection.value[currentCommentIndex.value].replyVoList.push(res.data);
      }
    }

    onMounted(() => {
      commentSection.value = props.postInfo.commentVoList;
      isTyping.value = isComment.value = isReply.value = false;
      commentCount.value = props.postInfo.commentCount;
      likeCount.value = props.postInfo.likeCount;
      favCount.value = props.postInfo.favCount;
    })
    return {
      commentSection,
      isTyping,
      isComment,
      isReply,
      commentInput,
      replyInput,
      replyToUser,
      likeCount,
      favCount,
      commentCount,
      typingComment,
      typingReply,
      sendCommentOnClick,
      sendReplyOnClick
    };
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  margin-top: -60px;
  border-radius: 10px;
  /*padding-right: 400px;*/
}

.left-container {
  width: 450px;
  height: 650px;
}

.right-container {
  width: 400px;
  height: 650px;
}

.post-images-carousel {
  left: 0;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  width: 450px;
  height: 100%;
}

.post-images-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f6f6f6;
  height: 650px;
}

.post-image {
  width: 450px;
}

.avatar-container {
  width: 100%;
  height: 25px;
  padding-top: 30px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /*  background-color: #5A5F73;*/
}

.post-nick-name {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}

.subscribe-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 25px;
  margin-top: -13px;
}

.content-container {
  height: 525px;
  width: 100%;
  /*  background-color: #5A5F73;*/
}

.title-container {
  width: 100%;
  padding-top: 10px;
  padding-left: 0px;
  font-size: 35px;
  font-weight: bold;
  /*  background-color: green;*/
}

.description-container {
  width: 100%;
  max-width: 350px;
  margin-top: 5px;
  padding-left: 20px;
  font-size: 16px;
  font-weight: normal;
}

.post-time-container {
  width: 100%;
  margin-top: 35px;
  padding-left: 22px;
  font-size: 10px;
  font-weight: lighter;
}

.comment-section-container {
  padding-left: 20px;
  padding-right: 30px;
}

.comment-count-text {
  font-size: 13px;
  font-weight: lighter;
}

.comment-container {
  margin-top: 15px;
}

.comment-likeCount-text {
  text-align: center;
  margin-top: -2px;
  font-size: 12px;
}

.reply-container {
  margin-top: 15px;
  padding-left: 35px;
}

.bottom-bar-container {
  height: 60px;
  width: 100%;
  /*background-color: #5A5F73;*/
}

.bottom-bar-container {
  height: 60px;
  width: 100%;
  /*background-color: #5A5F73;*/
}

.input-bar-container {
  width: 150px;
  padding-top: 14px;
  padding-left: 15px;
}

.comment-input-bar {
  width: 230px;
  padding-top: 14px;
  padding-left: 15px;
}

.send-button-container {
  margin-top: 16px;
  margin-left: 5px;
}

.cancel-button-container {
  margin-top: 16px;
}

.like-container, .fav-container, .comment-button-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 14px;
  cursor: pointer;
}

.like-container {
  padding-left: 10px;
}

.fav-container, .comment-button-container {
  padding-left: 5px;
}

</style>
