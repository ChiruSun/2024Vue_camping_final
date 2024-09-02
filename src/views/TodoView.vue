<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const APIurl = 'https://todolist-api.hexschool.io/'
const loginCookieToken = document.cookie.replace(
  /(?:(?:^|.*;\s*)hexSchoolSignIntoken\s*\=\s*([^;]*).*$)|^.*$/,
  '$1'
)
const APIHeader = ref({ headers: { Authorization: loginCookieToken } })
const router = useRouter()
const todoData = ref([])
const addTodo = ref({})
const isLoadingShow = ref(true)
const fliteredTodolist = computed(() => {
  const noCheckNum = todoData.value.filter((item) => item?.status === false).length
  const noCheck = todoData.value.filter((item) => item?.status === false)
  const completedCheck = todoData.value.filter((item) => item?.status === true)
  return { noCheckNum, noCheck, completedCheck }
})
const todoStatus = ref('allTodo')
const nickName = ref('')

//驗證token，取得暱稱
async function checkAccount() {
  try {
    const checkAccMsg = await axios.get(`${APIurl}users/checkout`, APIHeader.value)
    nickName.value = checkAccMsg.data.nickname
  } catch (error) {
    if (error.response.data.status === false) {
      setTimeout(() => {
        alert('驗證失敗，請重新登入')
        router.push('/')
      }, 1000)
    }
  }
}

//取得todo資料
async function getTodoData() {
  try {
    const todoCurrMsg = await axios.get(`${APIurl}todos/`, APIHeader.value)
    todoData.value = todoCurrMsg.data.data
    isLoadingShow.value = false
    return
  } catch (error) {
    if (error.response.data.status === false) {
      setTimeout(() => {
        alert('驗證失敗，請重新登入')
        router.push('/')
      }, 1000)
    }
  }
}

//增加待辦事項
async function PostAddTodo() {
  if (addTodo.value.content) {
    try {
      const addTodoResp = await axios.post(`${APIurl}todos/`, addTodo.value, APIHeader.value)
      getTodoData()
      addTodo.value.content = ''
      todoStatus.value = 'allTodo'
    } catch (error) {
      alert('新增資料錯誤，請再試一次')
      getTodoData()
    }
    return
  } else {
    return
  }
}

//更改待辦事項打勾未打勾
async function changeTodo(i) {
  const IndexNum = todoData.value.findIndex((e) => {
    return e.id === i.id
  })
  const patchId = todoData.value[IndexNum].id
  try {
    const changeResp = await axios.patch(
      `${APIurl}todos/${patchId}/toggle`,
      patchId,
      APIHeader.value
    )
    getTodoData()
  } catch (error) {
    console.log(error)
    alert('資料更新錯誤，請再試一次')
    getTodoData()
  }
}

//刪除待辦事項
async function deleteTodo(i) {
  const IndexNum = todoData.value.findIndex((e) => {
    return e.id === i.id
  })
  const deleteID = todoData.value[IndexNum].id
  try {
    const DeleteResp = await axios.delete(`${APIurl}todos/${deleteID}`, APIHeader.value)
    getTodoData()
  } catch (error) {
    alert('刪除資料錯誤，請再試一次')
    getTodoData()
  }
}

//待辦事項頁籤
function goAllTodo() {
  todoStatus.value = 'allTodo'
}
function goNoTodo() {
  todoStatus.value = 'noTodo'
}
function goCompletedTodo() {
  todoStatus.value = 'completedTodo'
}

//登出
async function goSignout() {
  try {
    const signOutMsg = await axios.post(`${APIurl}users/sign_out`, '', APIHeader.value)
    document.cookie = 'hexSchoolSignIntoken' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    alert('登出成功')
    router.push('/')
  } catch (error) {
    alert('登出失敗，請再嘗試一次')
  }
}

onMounted(() => {
  getTodoData()
  checkAccount()
})
</script>

<template>
  <div class="vw-100 vh-100">
    <nav class="d-flex justify-content-between px-6 py-3">
      <div class="logo-size"><img src="/List_logo.png" class="img-fluid" alt="todolistLogo" /></div>
      <div class="d-flex">
        <p class="fw-bold me-3">{{ nickName }}的代辦</p>
        <a href="#" class="text-decoration-none link-dark" @click.prevent="goSignout">登出 </a>
      </div>
    </nav>
    <div class="d-flex justify-content-center pt-6">
      <div class="list-width">
        <div class="d-flex shadow todoinput-outside mb-3">
          <input
            type="text"
            class="border-0 outline-none todo-input w-100"
            v-model.trim="addTodo.content"
            placeholder="新增待辦事項"
          />
          <button type="button" class="btn btn-dark p-1" @click="PostAddTodo">
            <img src="/plus.svg" class="btn-image" alt="plus" />
          </button>
        </div>
        <!-- loading -->
        <div v-show="isLoadingShow">
          <div class="d-flex justify-content-center mt-5">
            <span class="loader"></span>
          </div>
        </div>

        <!-- list -->
        <div v-show="!isLoadingShow">
          <div class="d-flex flex-column align-items-center mt-5" v-if="todoData.length === 0">
            <p class="mb-4 text-dark">目前尚無待辦事項</p>
            <div class="no-todo-img"><img src="/noTodo.png" alt="No-todo" class="img-fluid" /></div>
          </div>
          <div class="bg-white w-100 rounded shadow" v-else>
            <div class="d-flex">
              <a
                href="#"
                class="fw-bold page-a"
                :class="{ 'page-active': todoStatus === 'allTodo' }"
                @click.prevent="goAllTodo"
                >全部</a
              >
              <a
                href="#"
                class="fw-bold page-a"
                :class="{ 'page-active': todoStatus === 'noTodo' }"
                @click.prevent="goNoTodo"
                >待完成</a
              >
              <a
                href="#"
                class="fw-bold page-a"
                :class="{ 'page-active': todoStatus === 'completedTodo' }"
                @click.prevent="goCompletedTodo"
                >已完成</a
              >
            </div>

            <div class="pt-3 ps-4 pb-4 pe-3">
              <!-- 全部 -->
              <div v-if="todoStatus === 'allTodo'">
                <div v-for="i in todoData" :key="i.id">
                  <div class="d-flex align-items-center mb-2">
                    <div class="d-flex align-items-center pb-2 w-100 border-bottom me-2">
                      <input
                        type="checkbox"
                        class="todo-check me-3"
                        v-model="i.status"
                        @change="changeTodo(i)"
                      />
                      <p class="mb-0 text-dark fs-14" :class="{ 'check-success': i.status }">
                        {{ i.content }}
                      </p>
                    </div>
                    <button type="button" class="btn close-btn" @click="deleteTodo(i)"></button>
                  </div>
                </div>
              </div>
              <!-- 待完成 -->
              <div v-if="todoStatus === 'noTodo'">
                <div v-for="i in fliteredTodolist.noCheck" :key="i.id">
                  <div class="d-flex align-items-center mb-2">
                    <div class="d-flex align-items-center pb-2 w-100 border-bottom me-2">
                      <input
                        type="checkbox"
                        class="todo-check me-3"
                        v-model="i.status"
                        @change="changeTodo(i)"
                      />
                      <p class="mb-0 text-dark fs-14" :class="{ 'check-success': i.status }">
                        {{ i.content }}
                      </p>
                    </div>
                    <button type="button" class="btn close-btn" @click="deleteTodo(i)"></button>
                  </div>
                </div>
              </div>
              <!-- 已完成 -->
              <div v-if="todoStatus === 'completedTodo'">
                <div v-for="i in fliteredTodolist.completedCheck" :key="i.id">
                  <div class="d-flex align-items-center mb-2">
                    <div class="d-flex align-items-center pb-2 w-100 border-bottom me-2">
                      <input
                        type="checkbox"
                        class="todo-check me-3"
                        v-model="i.status"
                        @change="changeTodo(i)"
                      />
                      <p class="mb-0 text-dark fs-14" :class="{ 'check-success': i.status }">
                        {{ i.content }}
                      </p>
                    </div>
                    <button type="button" class="btn close-btn" @click="deleteTodo(i)"></button>
                  </div>
                </div>
              </div>
              <div class="mt-3">
                <p class="mb-0 fs-14 text-dark">{{ fliteredTodolist.noCheckNum }} 個待完成項目</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.logo-size {
  width: 243px;
  height: 39px;
}
.list-width {
  width: 500px;
}
.todo-input:focus {
  outline: 0;
}
.todoinput-outside {
  background-color: #fff;
  border-radius: 10px;
  padding: 4px 4px 4px 14px;
}
.btn-image {
  width: 30px;
  height: 30px;
}

.todo-check {
  width: 20px;
  height: 20px;
  appearance: none;
  border: 1px solid #9f9a91;
  border-radius: 5px;
}

.todo-check:checked {
  background-image: url(/checkicon.svg);
  background-position: center center;
  background-size: 38px 38px;
  border: none;
}

.close-btn {
  width: 24px;
  height: 24px;
  background-image: url(/close.svg);
  background-position: center center;
  background-size: contain;
  padding: 0;
  border: 0;
  margin-bottom: 16px;
  border-radius: 0;
}

.close-btn:active {
  border: 0;
}

.check-success {
  color: #9f9a91 !important;
  text-decoration: line-through;
}

.no-todo-img {
  width: 240px;
}

.page-a {
  width: 100%;
  color: #9f9a91;
  text-align: center;
  text-decoration: none;
  padding: 16px;
  border-bottom: 2px solid #efefef;
}

.page-a:hover {
  color: #333333;
  box-sizing: border-box;
  background-color: #eeeeee;
  /* border-bottom: 2px solid #333333; */
}
.page-active {
  cursor: default;
  color: #333333;
  border-bottom: 2px solid #333333;
}

.page-active:hover {
  background-color: #ffffff;
}
</style>
