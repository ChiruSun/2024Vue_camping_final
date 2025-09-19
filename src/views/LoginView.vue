<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const signInUserData = ref({
  email: '',
  password: ''
})

const message = ref({})
const router = useRouter()

const labelName = (property) => {
  const name = {
    email: 'Email',
    password: '密碼'
  }
  return name[property]
}

const typePart = (property) => {
  if (property === 'email') {
    return 'email'
  }
  if (property === 'password') {
    return 'password'
  } else {
    return 'text'
  }
}

const inputBlur = (property) => {
  if (!signInUserData.value[property]) {
    const newMessage = {
      email: '此欄位不可為空',
      password: '請輸入密碼'
    }
    message.value[property] = newMessage[property]
  } else {
    message.value[property] = ''
  }
}

//transition
const loginBeforeEnter = (e) => {
  e.style.opacity = 0
  e.style.transform = 'translateX(50px)'
}
const loginEnter = (e, done) => {
  const delay = e.dataset.index * 100
  console.log(e)

  setTimeout(() => {
    e.style.transition = 'opacity 0.3s,transform 0.3s ease-out'
    e.style.opacity = 1
    e.style.transform = 'translateX(0)'
    done()
  }, delay)
}

const postSignInData = () => {
  if (signInUserData.value.email && signInUserData.value.password) {
    async function axiosPost() {
      try {
        let currMsg = await axios.post(
          'https://todolist-api.hexschool.io/users/sign_in',
          signInUserData.value
        )
        document.cookie = `hexSchoolSignIntoken=${currMsg.data.token};`
        alert('帳號登入成功')
        signInUserData.value = {
          email: '',
          password: ''
        }
        const goTodoPage = () => {
          router.push('todopage')
        }
        goTodoPage()
      } catch (error) {
        console.log(error.response.data)
        const errResp = error.response.data.message
        if (errResp.indexOf('email 格式錯誤') !== -1) {
          message.value.email = 'Email格式錯誤'
        }
        if (errResp.indexOf('用戶不存在') !== -1) {
          message.value.email = '用戶不存在，請嘗試其他Email'
        }
        if (errResp.indexOf('password 長度不足 6 個字') !== -1) {
          message.value.password = '密碼長度不足6個字'
        }
        if (errResp.indexOf('帳號密碼驗證錯誤') !== -1) {
          message.value.password = '帳號密碼驗證錯誤'
        }
      }
    }
    axiosPost()
  } else {
    inputBlur('email')
    inputBlur('password')
    return
  }
}
</script>

<template>
  <div class="p-4">
    <h1 class="h4 fw-bold mb-4 text-nowrap">最實用的線上代辦事項服務</h1>
    <transition-group appear @before-enter="loginBeforeEnter" @enter="loginEnter">
      <div
        v-for="(value, property, index) in signInUserData"
        :key="property"
        :data-index="index"
        class="mb-3"
      >
        <label :for="property" class="form-label fw-bold">{{ labelName(property) }}</label>
        <input
          :id="property"
          :type="typePart(property)"
          :placeholder="`請輸入${labelName(property)}`"
          class="form-control px-3 py-2 mb-1"
          v-model="signInUserData[property]"
          @blur="inputBlur(property)"
        />
        <p v-if="message[property]" class="fw-bold msgStyle">{{ message[property] }}</p>
      </div>
    </transition-group>
    <div class="d-flex flex-column justify-content-center align-items-center mt-6">
      <button type="button" class="btn btn-dark px-5 mb-3 fw-bold" @click="postSignInData">
        登入
      </button>
      <RouterLink to="/signup" class="text-decoration-none fw-bold link-dark">註冊</RouterLink>
    </div>
  </div>
</template>
<style scoped>
.msgStyle {
  color: #d87355;
  font-size: 14px;
  margin-bottom: 0;
}
.side-width {
  width: 336px;
}
</style>
