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

                    <div class="nick-name">
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
                {{ postInfo.title }}
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
                  共{{ postInfo.commentCount }}条评论
                </div>

                <div v-for="(comment,index) in postInfo.commentVoList" :key="index">
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
                            <div style="font-size: 12px;margin-top: -3px; color: #606060">
                              {{ comment.nickName }}
                            </div>
                            <div style="margin-top: -6px;max-width: 250px">
                              {{ comment.content }}
                            </div>
                          </n-flex>
                        </n-flex>
                      </div>

                      <div>
                        点赞
                      </div>
                    </n-flex>
                  </div>
                  <div v-for="(reply,index) in comment.replyVoList" :key="index">
                    <div class="reply-container">
                      <n-flex justify="space-between">
                        <div>
                          <n-flex>
                            <div style="width: 30px">
                              <n-avatar
                                  round
                                  size="small"
                                  :src=reply.avatarImg
                              />
                            </div>

                            <n-flex vertical>
                              <div style="font-size: 12px; margin-top: -3px; color: #606060">
                                {{ reply.nickName }}
                              </div>
                              <div style="margin-top: -6px; max-width: 220px">
                                {{ reply.content }}
                              </div>
                            </n-flex>
                          </n-flex>
                        </div>

                        <div>
                          点赞
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
            <n-flex>
              <div class="input-bar-container">
                <n-input v-model:value="value" type="text" placeholder="输入评论"/>
              </div>

              <div class="like-container">
                <n-flex>
                  <like
                      :is-liked="postInfo.isLiked"
                      style="height: 23px;width: 23px"
                  />
                  <div style="margin-top: 1px;margin-left: -3px">
                    {{ postInfo.likeCount }}
                  </div>
                </n-flex>
              </div>

              <div class="fav-container">
                <n-flex>
                  <fav style="height: 25px; width: 25px"/>
                  <div style="margin-top: 1px; margin-left: -3px">
                    {{ postInfo.favCount }}
                  </div>
                </n-flex>
              </div>

              <div class="comment-button-container">
                <n-flex>
                  <comment style="margin-top: 1px"/>

                  <div style="margin-top: 1px; margin-left: -4px">
                    {{ postInfo.commentCount }}
                  </div>
                </n-flex>
              </div>
            </n-flex>
          </div>
        </div>
      </n-flex>
    </div>
  </div>
</template>

<script>
import like from './like.vue';
import Fav from "@/views/community/components/fav.vue";
import Comment from "@/views/community/components/comment.vue";
import Subscribe from "@/views/community/components/subscribe.vue";

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
  watch: {
    isLiked(newVal) {
      this.$refs.checkbox.checked = newVal;
    }
  },
  setup() {

    return {};
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

.nick-name {
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
  padding-top: 0px;
  padding-left: 15px;
  font-size: 35px;
  font-weight: bold;
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

.like-container, .fav-container, .comment-button-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 14px;
}

.like-container {
  padding-left: 10px;
}

.fav-container, .comment-button-container {
  padding-left: 5px;
}
</style>
