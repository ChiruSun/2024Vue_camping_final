<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const signUpUserData = ref({
  email: '',
  nickname: '',
  password: '',
  againpassword: ''
})
const message = ref({})
const router = useRouter()

const labelName = (property) => {
  const name = {
    email: 'Email',
    nickname: '您的暱稱',
    password: '密碼',
    againpassword: '再次輸入密碼'
  }
  return name[property]
}

const placeholder = (property) => {
  if (property === 'againpassword') {
    return '請再次輸入密碼'
  } else {
    return '請輸入' + labelName(property)
  }
}

const typePart = (property) => {
  if (property === 'email') {
    return 'email'
  }
  if (property === 'password' || property === 'againpassword') {
    return 'password'
  } else {
    return 'text'
  }
}

const inputBlur = (property) => {
  if (!signUpUserData.value[property]) {
    const newMessage = {
      email: '此欄位不可為空',
      nickname: '請輸入暱稱',
      password: '請輸入密碼',
      againpassword: '需要再次輸入密碼'
    }
    message.value[property] = newMessage[property]
  } else {
    message.value[property] = ''
  }
}

const goSignIn = () => {
  router.push('/')
}

const postSignUpData = () => {
  const dataExist = Object.values(signUpUserData.value).every((x) => x)

  if (dataExist) {
    if (signUpUserData.value.password === signUpUserData.value.againpassword) {
      const postData = {}
      postData.email = signUpUserData.value.email
      postData.password = signUpUserData.value.password
      postData.nickname = signUpUserData.value.nickname
      async function axiosPost() {
        try {
          let currMsg = await axios.post(
            'https://todolist-api.hexschool.io/users/sign_up',
            postData
          )
          console.log(currMsg)
          alert('帳號註冊成功，將導航到登入頁面')
          signUpUserData.value = {
            email: '',
            nickname: '',
            password: '',
            againpassword: ''
          }
          goSignIn()
        } catch (error) {
          console.log(error.response.data.message)
          const errResp = error.response.data.message
          if (errResp.indexOf('email 格式錯誤') !== -1) {
            message.value.email = 'Email格式錯誤'
          }
          if (errResp.indexOf('用戶已存在') !== -1) {
            message.value.email = '用戶已存在，請嘗試其他Email'
          }
          if (errResp.indexOf('password 長度不足 6 個字') !== -1) {
            message.value.password = '密碼長度不足6個字'
          }
        }
      }
      axiosPost()
      return
    } else {
      message.value.againpassword = '第二次輸入的密碼與第一次不符'
      return
    }
  } else {
    ;['email', 'nickname', 'password', 'againpassword'].forEach(inputBlur)
    return
  }
}
</script>

<template>
  <div class="d-flex flex-column side-width p-4">
    <h1 class="h4 fw-bold mb-4">註冊帳號</h1>
    <!-- <div class="mb-3">
      <label for="mail" class="form-label fw-bold">Email</label>
      <input
        id="mail"
        type="email"
        class="form-control"
        v-model="signUpUserData.email"
        @blur="emailBlur"
      />
      <p v-if="emailMsg" class="fw-bold emailMsg">{{ emailMsg }}</p>
    </div> -->
    <div class="mb-3">
      <div v-for="(value, property) in signUpUserData" :key="property" class="mb-3">
        <label :for="property" class="form-label fw-bold">{{ labelName(property) }}</label>
        <input
          :id="property"
          :placeholder="placeholder(property)"
          :type="typePart(property)"
          class="form-control px-3 py-2 mb-1"
          v-model="signUpUserData[property]"
          @blur="inputBlur(property)"
        />
        <p v-if="message[property]" class="fw-bold msgStyle">{{ message[property] }}</p>
      </div>
    </div>

    <div class="d-flex flex-column justify-content-center align-items-center">
      <button type="button" class="btn btn-dark px-5 mb-3 fw-bold" @click="postSignUpData">
        註冊
      </button>
      <RouterLink to="/" class="text-decoration-none fw-bold link-dark">登入</RouterLink>
    </div>
  </div>
</template>
<style scoped>
.msgStyle {
  color: #d87355;
  font-size: 14px;
  margin-bottom: 0;
}
</style>
