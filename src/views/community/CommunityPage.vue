<template>
  <n-layout>
    <n-layout-header class="header">
      <div class="search-bar-container">
        <n-flex justify="space-between">
          <div></div>
          <div class="search-bar">
            <n-input v-model:value="searchPostInput" type="text" placeholder="搜索帖子" class="input-bar"/>
          </div>
          <n-button text ghost color="#f8f8ff" @click="showAddPost = true">
            <template #icon>
              <n-icon>
                <add-post-icon/>
              </n-icon>
            </template>
            发布帖子
          </n-button>
        </n-flex>

      </div>
    </n-layout-header>

    <n-layout-content class="content">
      <div class="content-container">
        <div class="posts-container">
          <n-row gutter="16">
            <n-col class="post-col" span="6">
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
            <n-col class="post-col" span="6">
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
            <n-col class="post-col" span="6">
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
            <n-col class="post-col" span="6">
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
          </n-row>
        </div>
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

      <div>
        <transition name="modal-fade">
          <div v-if="showAddPost" @click="showAddPost=false">
            <add-post @closeModal="showAddPost = false" />
          </div>
        </transition>
      </div>
    </n-layout-content>
  </n-layout>
</template>

<script>
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import PostCardVue from "@/views/community/components/PostCard.vue"
import PostCard from "@/views/community/CardPost.vue";
import BrowsePost from "@/views/community/components/BrowsePost.vue";
import AddPost from "@/views/community/components/AddPost.vue"
import {
  postListService,
  browsePostService
} from "@/api/post.js";
import 'animate.css';
import {NIcon} from "naive-ui";
import {
  AddCircleOutline as addPostIcon
} from "@vicons/ionicons5";

const Column1 = ref([]);
const Column2 = ref([]);
const Column3 = ref([]);
const Column4 = ref([]);
const showModal = ref(false);
const showAddPost = ref(false);
const postInfo = ref(null);
const searchPostInput = ref("");

export default defineComponent({
  components: {
    BrowsePost,
    PostCard,
    PostCardVue,
    addPostIcon,
    AddPost
  },
  setup() {
    const getPostList = async () => {
      let res = await postListService({}, '', '');
      clearColumn();
      addToColumn(res.data);
    }

    const searchPost = async ()=>{
      let res = await postListService({"title":searchPostInput.value},'','');
      clearColumn();
      addToColumn(res.data);
    }

    const addToColumn = (data) =>{
      data.forEach((post, index) => {
        if (index % 4 === 0) {
          Column1.value.push(post);
        } else if (index % 4 === 1) {
          Column2.value.push(post);
        } else if (index % 4 === 2) {
          Column3.value.push(post);
        } else {
          Column4.value.push(post);
        }
      });
    }

    const clearColumn = () => {
      Column1.value = [];
      Column2.value = [];
      Column3.value = [];
      Column4.value = [];
    };

    const browsePostOnClick = async (postId) => {
      let res = await browsePostService(postId);
      postInfo.value = res.data;
      console.log(postInfo.value)
      showModal.value = true;
    }

    watch(searchPostInput, (newValue, oldValue) => {
      // 如果输入框的值发生变化，则调用搜索方法
      if (newValue.trim() !== oldValue.trim()) {
        searchPost(); // 调用搜索方法
      }
    });

    onMounted(() => {
      clearColumn();
      getPostList();
    });

    return {
      searchPostInput,
      browsePostOnClick,
      postInfo,
      showModal,
      showAddPost,
      Column1,
      Column2,
      Column3,
      Column4,
      addPostIcon,
    };
  }
});
</script>

<style scoped>
.header {
  height: 10vh;
  width: 100%;
  background-color: #807ce8;
}

.search-bar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 60px;
  padding-right: 60px;
}

.search-bar {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.input-bar {
  width: 250px;
}

.content {
  height: 90vh;
  z-index: 0;
}

.content-container {
  height: 100%;
  width: 100%;
  overflow-x: auto;
}

.posts-container {
  display: flex;
  min-width: 1120px;
  padding: 20px 20px;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 弹窗内容样式 */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
}

/* 弹窗动画效果 */
.modal-fade-leave-active {
  transition: opacity 0.5s; /* 设置相同的时长 */
}

.modal-fade-leave-to {
  opacity: 0;
}
</style>