<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const isTodoPage = ref(false)
const beforePage = () => {
  if (route.name === 'todopage') {
    isTodoPage.value = true
  }
  if (route.name !== 'todopage') {
    isTodoPage.value = false
  }
}
</script>

<template>
  <div
    class="position-absolute bigBg-yellow overflow-hidden z-n1"
    :class="{ 'bg-ani': isTodoPage }"
  >
    <div class="bg-box"></div>
  </div>
  <RouterView v-slot="{ Component }">
    <transition name="fade" mode="out-in" @before-enter="beforePage">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>
<style scoped>
.bigBg-yellow {
  /* background-color: #ffd370; */
  background-color: #fff;
  width: 100vw;
  height: 100vh;
}
.bg-box {
  background-color: #ffd370;
  width: 3000px;
  height: 2000px;
  transition: all 1s;
}
.bg-ani .bg-box {
  transform: translate(-300px, -1700px) rotate(-5deg);
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.4s ease-out;
}
.fade-leave-to {
  opacity: 0;
}
.fade-leave-active {
  transition: all 0.4s ease-in;
}
</style>
<style>
body {
  font-family: 'Noto Sans TC', sans-serif;
}
</style>
