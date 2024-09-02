<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const isTodoPage = computed(() => route.name === 'todopage')
const isLoginPage = computed(() => route.name === 'homeLogin')
const isSignUpPage = computed(() => route.name === 'signup')
</script>

<template>
  <div
    class="position-absolute bigBg-yellow overflow-hidden z-n1"
    :class="{ 'bg-ani': isTodoPage }"
  >
    <div class="bg-box"></div>
  </div>
  <div class="d-flex justify-content-center position-absolute top-50 start-50 translate-middle">
    <div v-show="isLoginPage || isSignUpPage">
      <div class="pic-M-end">
        <div class="todoPic d-flex flex-column justify-content-center align-items-center">
          <img src="/List_logo.png" class="img-fluid" alt="todolistLogo" />
          <img src="/ListMen.png" class="img-fluid" alt="listMen" />
        </div>
      </div>
    </div>

    <RouterView />
  </div>
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
  height: 3000px;
}
.bg-ani .bg-box {
  transform: translate(-300px, -2700px) rotate(-5deg);
}
.todoPic {
  width: 386px;
  height: 500px;
}
.pic-M-end {
  margin-right: 100px;
}
</style>
<style>
body {
  font-family: 'Noto Sans TC', sans-serif;
}
.side-width {
  width: 336px;
}
</style>
