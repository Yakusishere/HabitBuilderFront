<script>
import {CreateOutline as editIcon} from "@vicons/ionicons5";
import PlanCard from "@/views/user/Components/PlanCard.vue";
import {myPlanService} from "@/api/plan.js";
import {getUserDetailService} from "@/api/user.js";
import {
  myPostListService,
  likePostListService,
  favPostListService, browsePostService
} from "@/api/post.js";
import {defineComponent, onMounted, ref} from "vue";
import EditModal from "@/views/user/Components/EditModal.vue";
import BrowsePost from "@/views/community/components/BrowsePost.vue";
import PostCardVue from "@/views/community/components/PostCard.vue";

export default defineComponent({
  name: "test",
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  components: {
    PostCardVue,
    BrowsePost,
    EditModal,
    editIcon,
    PlanCard
  },
  setup(props) {
    const myPlanList = ref([]);

    const nickName = ref();
    const avatarImg = ref();
    const myScore = ref();
    const fanCount = ref();
    const followCount = ref();
    const showEditModal = ref(false);

    const Column1 = ref([]);
    const Column2 = ref([]);
    const Column3 = ref([]);

    const Column4 = ref([]);
    const Column5 = ref([]);
    const Column6 = ref([]);

    const Column7 = ref([]);
    const Column8 = ref([]);
    const Column9 = ref([]);

    const postInfo = ref();
    const showModal = ref(false);

    const getUserDetail = async () => {
      let res = await getUserDetailService();
      if (res.code === 0) {
        nickName.value = res.data.nickName;
        avatarImg.value = res.data.avatarImg;
        myScore.value = res.data.myScore;
        fanCount.value = res.data.fanCount;
        followCount.value = res.data.followCount;
      }
    }

    const getUserPlanList = async () => {
      let res = await myPlanService();
      if (res.code === 0) {
        myPlanList.value = res.data;
      }
    }

    const openEditModal = () => {
      showEditModal.value = true;
    }

    const getMyPostList = async () => {
      let res = await myPostListService();
      if (res.code === 0) {
        clearColumn();
        addToColumn(res.data);
      }
    }

    const getFavPostList = async () => {
      let res = await favPostListService();
      if (res.code === 0) {
        let data = res.data;
        data.forEach((post, index) => {
          if (index % 3 === 0) {
            Column4.value.push(post);
          } else if (index % 3 === 1) {
            Column5.value.push(post);
          } else {
            Column6.value.push(post);
          }
        });
      }
    }

    const getLikePostList = async () => {
      let res = await likePostListService();
      if (res.code === 0) {
        let data = res.data;
        data.forEach((post, index) => {
          if (index % 3 === 0) {
            Column7.value.push(post);
          } else if (index % 3 === 1) {
            Column8.value.push(post);
          } else {
            Column9.value.push(post);
          }
        });
      }
    }

    const addToColumn = (data) => {
      data.forEach((post, index) => {
        if (index % 3 === 0) {
          Column1.value.push(post);
        } else if (index % 3 === 1) {
          Column2.value.push(post);
        } else {
          Column3.value.push(post);
        }
      });
    }

    const clearColumn = () => {
      Column1.value = [];
      Column2.value = [];
      Column3.value = [];
    };

    const browsePostOnClick = async (postId) => {
      let res = await browsePostService(postId);
      postInfo.value = res.data;
      showModal.value = true;
    }

    onMounted(() => {
      getUserDetail();
      getUserPlanList();
      getMyPostList();
      getFavPostList();
      getLikePostList();
    })

    return {
      editIcon,
      PlanCard,
      myPlanList,
      nickName,
      avatarImg,
      myScore,
      followCount,
      fanCount,
      showEditModal,
      openEditModal,
      Column1,
      Column2,
      Column3,
      Column4,
      Column5,
      Column6,
      Column7,
      Column8,
      Column9,
      getMyPostList,

      browsePostOnClick,
      postInfo,
      showModal,
    };
  },
});
</script>

<template>
  <div style="height:100vh">
    <div class="upper-container">
      <div class="info-container">
        <div class="avatar-container">
          <n-flex justify="center">
            <n-avatar
                round
                :size="150"
                :src=avatarImg
            />
          </n-flex>
        </div>

        <div class="text-container">
          <n-flex>
            <div class="nick-name">
              {{ nickName }}
            </div>

            <div class="edit-button">
              <n-button quaternary circle @click="openEditModal">
                <template #icon>
                  <n-icon>
                    <edit-icon/>
                  </n-icon>
                </template>
              </n-button>
            </div>

          </n-flex>


          <div class="score">
            用户积分：{{ myScore }}
          </div>

          <div class="count-info">
            <n-flex>
              <div class="follow-count">关注：{{ followCount }}</div>
              <div class="fan-count">粉丝：{{ fanCount }}</div>
              <!--              <div class="like-fav-count">获赞与收藏：20</div>-->
            </n-flex>

          </div>
        </div>
      </div>
    </div>

    <div class="lower-container">
      <div class="switch-buttons">
        <div style="width: 80%;z-index: 0;">
          <n-tabs default-value="plan" :bar-width="200" justify-content="center" type="line">
            <n-tab-pane name="plan" tab="计划">
              <div v-for="(plan, index) in myPlanList" :key="index" class="plan-list-container">
                <PlanCard
                    :plan-id="plan.planId"
                    :title="plan.title"
                    :description="plan.description"
                    :start-time="plan.startDate"
                    :end-time="plan.endDate"
                />
              </div>
            </n-tab-pane>

            <n-tab-pane name="post" tab="帖子">
              <n-row gutter="16">
                <n-col class="post-col" span="8">
                  <div v-for="(post, index) in Column1" :key="index" class="post-card">
                    <PostCardVue
                        @click="browsePostOnClick(post.postId)"
                        :image="post.overviewImage"
                        :avatarImg="post.avatarImg"
                        :title="post.title"
                        :nickName="post.nickName"
                        :like-count="post.likeCount"
                        :fav-count="post.favCount"
                    />
                  </div>
                </n-col>
                <n-col class="post-col" span="8">
                  <div v-for="(post, index) in Column2" :key="index" class="post-card">
                    <PostCardVue
                        @click="browsePostOnClick(post.postId)"
                        :image="post.overviewImage"
                        :avatarImg="post.avatarImg"
                        :title="post.title"
                        :nickName="post.nickName"
                        :like-count="post.likeCount"
                        :fav-count="post.favCount"
                    />
                  </div>
                </n-col>
                <n-col class="post-col" span="8">
                  <div v-for="(post, index) in Column3" :key="index" class="post-card">
                    <PostCardVue
                        @click="browsePostOnClick(post.postId)"
                        :image="post.overviewImage"
                        :avatarImg="post.avatarImg"
                        :title="post.title"
                        :nickName="post.nickName"
                        :like-count="post.likeCount"
                        :fav-count="post.favCount"
                    />
                  </div>
                </n-col>
              </n-row>
            </n-tab-pane>

            <n-tab-pane name="fav" tab="收藏">
              <n-row gutter="16">
                <n-col class="post-col" span="8">
                  <div v-for="(post, index) in Column4" :key="index" class="post-card">
                    <PostCardVue
                        @click="browsePostOnClick(post.postId)"
                        :image="post.overviewImage"
                        :avatarImg="post.avatarImg"
                        :title="post.title"
                        :nickName="post.nickName"
                        :like-count="post.likeCount"
                        :fav-count="post.favCount"
                    />
                  </div>
                </n-col>
                <n-col class="post-col" span="8">
                  <div v-for="(post, index) in Column5" :key="index" class="post-card">
                    <PostCardVue
                        @click="browsePostOnClick(post.postId)"
                        :image="post.overviewImage"
                        :avatarImg="post.avatarImg"
                        :title="post.title"
                        :nickName="post.nickName"
                        :like-count="post.likeCount"
                        :fav-count="post.favCount"
                    />
                  </div>
                </n-col>
                <n-col class="post-col" span="8">
                  <div v-for="(post, index) in Column6" :key="index" class="post-card">
                    <PostCardVue
                        @click="browsePostOnClick(post.postId)"
                        :image="post.overviewImage"
                        :avatarImg="post.avatarImg"
                        :title="post.title"
                        :nickName="post.nickName"
                        :like-count="post.likeCount"
                        :fav-count="post.favCount"
                    />
                  </div>
                </n-col>
              </n-row>
            </n-tab-pane>

            <n-tab-pane name="like" tab="点赞">
              <n-row gutter="16">
                <n-col class="post-col" span="8">
                  <div v-for="(post, index) in Column7" :key="index" class="post-card">
                    <PostCardVue
                        @click="browsePostOnClick(post.postId)"
                        :image="post.overviewImage"
                        :avatarImg="post.avatarImg"
                        :title="post.title"
                        :nickName="post.nickName"
                        :like-count="post.likeCount"
                        :fav-count="post.favCount"
                    />
                  </div>
                </n-col>
                <n-col class="post-col" span="8">
                  <div v-for="(post, index) in Column8" :key="index" class="post-card">
                    <PostCardVue
                        @click="browsePostOnClick(post.postId)"
                        :image="post.overviewImage"
                        :avatarImg="post.avatarImg"
                        :title="post.title"
                        :nickName="post.nickName"
                        :like-count="post.likeCount"
                        :fav-count="post.favCount"
                    />
                  </div>
                </n-col>
                <n-col class="post-col" span="8">
                  <div v-for="(post, index) in Column9" :key="index" class="post-card">
                    <PostCardVue
                        @click="browsePostOnClick(post.postId)"
                        :image="post.overviewImage"
                        :avatarImg="post.avatarImg"
                        :title="post.title"
                        :nickName="post.nickName"
                        :like-count="post.likeCount"
                        :fav-count="post.favCount"
                    />
                  </div>
                </n-col>
              </n-row>
            </n-tab-pane>
          </n-tabs>
        </div>

      </div>
    </div>
  </div>

  <div>
    <transition name="modal-fade">
      <div v-if="showEditModal" @click="showEditModal = false">
        <EditModal/>
      </div>
    </transition>
  </div>

  <div>
    <transition name="modal-fade">
      <div v-if="showModal" @click="showModal = false">
        <BrowsePost
            :postInfo="postInfo"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.upper-container {
  width: 100%;
  height: 300px;
  /*  background-color: grey;*/
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.info-container {
  /*  background-color: green;*/
  width: 600px;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.avatar-container {
  width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text-container {
  width: 300px;
  height: 100%;
  /*  background-color: #6c68d9;*/
  display: flex;
  flex-direction: column;
}

.nick-name {
  margin-top: 80px;
  font-size: 33px;
  font-weight: bold;
}

.edit-button {
  margin-top: 90px;
}

.score {
  margin-top: 10px;
  font-size: 13px;
  color: grey;
}

.lower-container {
  width: 100%;
}

.count-info {
  margin-top: 12px;
}

.fan-count {
  margin-left: 10px;
}

.like-fav-count {
  margin-left: 10px;
}

.switch-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.plan-list-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.post-col {
  min-width: 280px;
}

.post-card {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 20px;
}
</style>
