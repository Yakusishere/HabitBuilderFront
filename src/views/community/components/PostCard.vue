<template>
  <div class="main">
    <div class="card">
      <img :src=image class="img-view">
    </div>
    <div class="card_back"></div>
    <div class="title-container">

      <div class="text_title">
        <n-ellipsis style="max-width: 240px">
          {{ title }}
        </n-ellipsis>
      </div>

    </div>
    <div class="data">
      <div class="avatar-container">
        <n-avatar
            round
            size="small"
            :src=avatarImg
        />
      </div>
      <div class="text">
        <div class="text_m">{{ nickName }}</div>
      </div>
    </div>
    <div class="btns">
      <div class="likes">
        <svg class="likes_svg" viewBox="-2 0 105 92">
          <path
              d="M85.24 2.67C72.29-3.08 55.75 2.67 50 14.9 44.25 2 27-3.8 14.76 2.67 1.1 9.14-5.37 25 5.42 44.38 13.33 58 27 68.11 50 86.81 73.73 68.11 87.39 58 94.58 44.38c10.79-18.7 4.32-35.24-9.34-41.71Z"></path>
        </svg>
        <span class="likes_text">{{ likeCount }}</span>
      </div>
      <div class="fav">
        <svg class="fav_svg" viewBox="0 0 24 24" title="Star">
          <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z">
          </path>
        </svg>
        <span class="fav_text">{{ favCount }}</span>
      </div>

      <!--      <div class="views">
              <svg class="views_svg" viewBox="0 0 30.5 16.5" title="Views">
                <path
                    d="M15.3 0C8.9 0 3.3 3.3 0 8.3c3.3 5 8.9 8.3 15.3 8.3s12-3.3 15.3-8.3C27.3 3.3 21.7 0 15.3 0zm0 14.5c-3.4 0-6.2-2.8-6.2-6.2C9 4.8 11.8 2 15.3 2c3.4 0 6.2 2.8 6.2 6.2 0 3.5-2.8 6.3-6.2 6.3z"></path>
              </svg>
              <span class="views_text">332</span>
            </div>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostCard',
  props: {
    image: {
      type: String,
      required: true
    },
    avatarImg: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    nickName: {
      type: String,
      required: true
    },
    likeCount: {
      type: Number,
      required: true
    },
    favCount: {
      type: Number,
      required: true
    }
  }
};
</script>

<style scoped>
.card {
  cursor: pointer;
}

.img-view {
  width: 270px;
}

.card_back {
  position: absolute;
  width: 270px;
  height: 7em;
  background-color: rgba(30, 31, 38, 0.88);
  border-radius: 7px;
  margin-top: -1em;
  transition: .2s ease-in-out;
  z-index: -1;
}

.main:hover .card_back {
  margin-top: -1em;
  height: 8.5em;
  cursor: pointer;
}

.main:hover .fl {
  opacity: 1;
  cursor: pointer;
  margin-right: 0.5em;
}

.title-container {
  width: 270px;
  margin-bottom: -10px;
  /*  background-color: #631d1d;*/
}

.text_title {
  margin-left: 15px;
  margin-right: 15px;
  font-family: Montserrat, sans-serif;
  color: white;
  /*  font-weight: bold;*/
  font-size: 1.3em;
}

.data {
  padding-left: 15px;
  display: flex;
  flex-direction: row;
  margin-top: 1em;
}

.avatar-container {
  width: 2.25em;
  height: 2.45em;
}

.text {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 0.5em;
  font-family: Montserrat, sans-serif;
  color: white;
}

.text_m {
  font-weight: bold;
  font-size: 0.9em;
}

.btns {
  padding-left: 15px;
  display: flex;
  gap: 0.5em;
  transition: .2s ease-in-out;
}

.likes {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5em;
  height: 1.4em;
  border-radius: 4px;
  margin-top: -0.5em;
  opacity: 0;
  background-color: #444857;
  transition: .2s ease-in-out;
}

.likes_text {
  font-family: Montserrat;
  font-size: 0.8em;
  margin-left: 0.25em;
  color: white;
}

.likes_svg {
  width: 10px;
  height: 10px;
  fill: white;
}

.likes:hover {
  background-color: #5A5F73;
  cursor: pointer;
}

.fav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5em;
  height: 1.4em;
  border-radius: 4px;
  margin-top: -0.5em;
  opacity: 0;
  background-color: #444857;
  transition: .24s ease-in-out;
}

.fav_text {
  font-family: Montserrat;
  font-size: 0.8em;
  margin-left: 0.25em;
  color: white;
}

.fav_svg {
  width: 14px;
  height: 14px;
  fill: white;
}

.fav:hover {
  background-color: #5A5F73;
  cursor: pointer;
}

.views {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3em;
  height: 1.4em;
  border-radius: 4px;
  margin-top: -0.5em;
  opacity: 0;
  background-color: #444857;
  transition: .28s ease-in-out;
}

.views_text {
  font-family: Montserrat;
  font-size: 0.8em;
  margin-left: 0.25em;
  color: white;
}

.views_svg {
  width: 12px;
  height: 12px;
  fill: white;
}

.views:hover {
  background-color: #5A5F73;
  cursor: pointer;
}

.main:hover .likes {
  margin-top: 0.5em;
  opacity: 1;
}

.main:hover .fav {
  margin-top: 0.5em;
  opacity: 1;
}

.main:hover .views {
  margin-top: 0.5em;
  opacity: 1;
}


/* The Main Switch */

.card_content {
  display: flex;
  align-items: center;
  justify-content: center;
}


</style>