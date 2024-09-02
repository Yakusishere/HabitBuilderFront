<template>
  <div class="subscribeContainer">
    <input type="checkbox" id="subscribeToggle" class="subscribeToggle" />
    <label for="subscribeToggle" class="subscribeBtn">
    <span class="IconContainer">
      <svg viewBox="0 0 448 512" height="0.9em" class="icon plusIcon">
        <path
            d="M432 256c0 13.3-10.7 24-24 24h-136v136c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H88c-13.3 0-24-10.7-24-24s10.7-24 24-24h136V88c0-13.3 10.7-24 24-24s24 10.7 24 24v136h136c13.3 0 24 10.7 24 24z"
        ></path>
      </svg>
      <svg viewBox="0 0 448 512" height="0.9em" class="icon barsIcon">
        <path
            d="M16 132h416c8.8 0 16-7.2 16-16V92c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v24c0 8.8 7.2 16 16 16zm416 64H16c-8.8 0-16 7.2-16 16v24c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-24c0-8.8-7.2-16-16-16zm0 128H16c-8.8 0-16 7.2-16 16v24c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-24c0-8.8-7.2-16-16-16z"
        ></path>
      </svg>
    </span>
      <p class="text">关注</p>
      <p class="text subscribedText">已关注</p>
    </label>
  </div>
</template>

<style scoped>
.subscribeContainer {
  display: inline-block;
}

.subscribeToggle {
  display: none;
}

.subscribeBtn {
  width: 90px;
  height: 35px;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.349);
  background-color: rgb(12, 12, 12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition-duration: 0.3s;
  overflow: hidden;
}

.IconContainer {
  width: 25px;
  height: 25px;
  background: linear-gradient(to bottom, #807ce8, #6c68d9);
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 2;
  transition-duration: 0.3s;
}

.icon {
  fill: white;
}

.text {
  height: 100%;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 1;
  transition-duration: 0.3s;
  font-size: 1.04em;
  transition: width 0.3s ease, font-size 0.3s ease;
}

.subscribedText {
  display: none;
  white-space:nowrap;
}

.subscribeToggle:checked + .subscribeBtn {
  background-color: grey;
}

.subscribeToggle:checked + .subscribeBtn .plusIcon {
  display: none;
}

.subscribeToggle:checked + .subscribeBtn .barsIcon {
  display: block;
}

.subscribeToggle:checked + .subscribeBtn .text {
  display: none;
}

.subscribeToggle:checked + .subscribeBtn .subscribedText {
  display: flex;
}

/* 默认情况下，隐藏barsIcon */
.barsIcon {
  display: none;
}

.subscribeBtn:hover .IconContainer {
  width: 80px;
  transition-duration: 0.3s;
}

.subscribeBtn:hover .text {
  transform: translate(10px);
  width: 0;
  font-size: 0;
  transition-duration: 0.3s;
}

.subscribeToggle:checked + .subscribeBtn:hover .IconContainer {
  width: 25px;
}

.subscribeToggle:checked + .subscribeBtn:hover .subscribedText {
  transform: translate(0);
  width: 50px;
  font-size: 1.04em;
}

.subscribeBtn:active {
  transform: scale(0.95);
  transition-duration: 0.3s;
}
</style>

<script>
</script>