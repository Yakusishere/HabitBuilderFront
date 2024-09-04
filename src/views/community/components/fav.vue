<template>
  <div class="star-container" title="Fav">
    <input type="checkbox" class="checkbox" id="fav">
    <div class="svg-container">
      <svg viewBox="0 0 24 24" class="svg-outline" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3.5l2.66 5.39 5.94.86-4.3 4.2 1.02 5.94-5.32-2.8-5.32 2.8 1.02-5.94-4.3-4.2 5.94-.86L12 3.5z"
              fill="none" stroke="gray" stroke-width="2"></path>
      </svg>
      <svg viewBox="0 0 24 24" class="svg-filled" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3.5l2.66 5.39 5.94.86-4.3 4.2 1.02 5.94-5.32-2.8-5.32 2.8 1.02-5.94-4.3-4.2 5.94-.86L12 3.5z">
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
  name: 'Fav'
};
</script>

<style scoped>
/* From Uiverse.io by catraco */
.star-container {
  --star-color: rgb(255, 211, 50);
  position: relative;
  width: 50px;
  height: 50px;
  transition: .3s;
}

.star-container .checkbox {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 20;
  cursor: pointer;
}

.star-container .svg-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.star-container .svg-outline,
.star-container .svg-filled {
  fill: var(--star-color);
  position: absolute;
}

.star-container .svg-filled {
  z-index: 10;
  animation: keyframes-svg-filled 1s;
  display: none;
}

.star-container .svg-celebrate {
  position: absolute;
  animation: keyframes-svg-celebrate .5s;
  animation-fill-mode: forwards;
  display: none;
  stroke: var(--star-color);
  fill: var(--star-color);
  stroke-width: 2px;
}

.star-container .checkbox:checked~.svg-container .svg-filled {
  display: block
}

.star-container .checkbox:checked~.svg-container .svg-celebrate {
  display: block
}

.star-container .checkbox:checked~.svg-container .svg-outline {
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
    filter: brightness(1.15);
  }
}

@keyframes keyframes-svg-celebrate {
  0% {
    transform: scale(0.2); /* 更小的起始缩放 */
  }
  50% {
    opacity: 1;
    filter: brightness(1.15);
  }
  100% {
    transform: scale(0.8); /* 更小的最终缩放 */
    opacity: 0;
    display: none;
  }
}
</style>