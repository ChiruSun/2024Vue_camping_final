<template>
  <div class="d-flex justify-content-center position-absolute top-50 start-50 translate-middle">
    <div class="pic-M-end d-flex align-items-center">
      <div class="todoPic d-flex flex-column justify-content-center align-items-center">
        <img src="/List_logo.png" class="img-fluid" alt="todolistLogo" />
        <img src="/ListMen.png" class="img-fluid" alt="listMen" />
      </div>
    </div>
    <div class="side-width d-flex align-items-center">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>

    <!-- <RouterView /> -->
  </div>
</template>
<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.fade-enter-active {
  transition: all 0.2s ease-out;
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}
.fade-leave-active {
  transition: all 0.2s ease-in;
}
.side-width {
  width: 336px;
}
.todoPic {
  width: 386px;
  height: 500px;
}
.pic-M-end {
  margin-right: 100px;
}
</style>
