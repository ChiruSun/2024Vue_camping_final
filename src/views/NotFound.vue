<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
onMounted(() => {
  setTimeout(() => {
    router.push('/')
  }, 3000)
})
</script>
<template>
  <div>
    <h1>404找不到頁面</h1>
    <p class="text-center">3秒後跳轉回首頁</p>
  </div>
</template>
