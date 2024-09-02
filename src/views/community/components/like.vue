<template>
  <div class="heart-container" title="Like">
    <input type="checkbox" class="checkbox" id="Give-It-An-Id" :checked="isLiked">
    <div class="svg-container">
      <svg viewBox="0 0 24 24" class="svg-outline" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="none" stroke="gray" stroke-width="2"></path>
      </svg>
      <svg viewBox="0 0 24 24" class="svg-filled" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z">
        </path>
      </svg>
      <svg class="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="10,10 20,20"></polygon>
        <polygon points="10,50 20,50"></polygon>
        <polygon points="20,80 30,70"></polygon>
        <polygon points="90,10 80,20"></polygon>
        <polygon points="90,50 80,50"></polygon>
        <polygon points="80,80 70,70"></polygon>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'like',
  props: {
    isLiked: {
      type: Boolean,
      required: true
    }
  },
};
</script>

<style scoped>
/* From Uiverse.io by catraco */
.heart-container {
  --heart-color: rgb(255, 50, 73);
  position: relative;
  width: 50px;
  height: 50px;
  transition: .3s;
}

.heart-container .checkbox {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 20;
  cursor: pointer;
}

.heart-container .svg-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.heart-container .svg-outline,
.heart-container .svg-filled {
  fill: var(--heart-color);
  position: absolute;
}

.heart-container .svg-filled {
  z-index: 10;
  animation: keyframes-svg-filled 1s;
  display: none;
}

.heart-container .svg-celebrate {
  position: absolute;
  animation: keyframes-svg-celebrate .5s;
  animation-fill-mode: forwards;
  display: none;
  stroke: var(--heart-color);
  fill: var(--heart-color);
  stroke-width: 2px;
}

.heart-container .checkbox:checked~.svg-container .svg-filled {
  display: block
}

.heart-container .checkbox:checked~.svg-container .svg-celebrate {
  display: block
}

.heart-container .checkbox:checked~.svg-container .svg-outline {
  display: none; /* 点击后隐藏灰色轮廓 */
}

@keyframes keyframes-svg-filled {
  0% {
    transform: scale(0);
  }

  25% {
    transform: scale(1.2);
  }

  50% {
    transform: scale(1);
    filter: brightness(1.5);
  }
}

@keyframes keyframes-svg-celebrate {
  0% {
    transform: scale(0.2); /* 更小的起始缩放 */
  }
  50% {
    opacity: 1;
    filter: brightness(1.5);
  }
  100% {
    transform: scale(0.8); /* 更小的最终缩放 */
    opacity: 0;
    display: none;
  }
}
</style>