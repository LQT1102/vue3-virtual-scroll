<template>
  <div class="chat-demo">
    <div class="toolbar">
      <button
        v-if="!streaming"
        @click="startStream"
      >
        Start stream
      </button>
      <button
        v-else
        @click="stopStream"
      >
        Stop stream
      </button>

      <input
        v-model="search"
        placeholder="Filter..."
      >
    </div>

    <DynamicScroller
      ref="scroller"
      :items="filteredItems"
      :min-item-size="54"
      class="scroller"
      @scroll="handleScroll"
    >
      <template #before>
        <div class="notice">
          The message heights are unknown.
        </div>
      </template>

      <template #default="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[
            item.message,
          ]"
          :data-index="index"
          :data-active="active"
          :title="`Click to change message ${index}`"
          class="message"
          @click="changeMessage(item)"
        >
          <div class="avatar">
            <img
              :key="item.avatar"
              :src="item.avatar"
              alt="avatar"
              class="image"
            >
          </div>
          <div class="text">
            {{ item.message }}
          </div>
          <div class="index">
            <span>{{ item.id }} (id)</span>
            <span>{{ index }} (index)</span>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { generateMessage } from '../data'

let id = 0
let hasScrolled = false
let lastScrollTop = 0

const messages = []
for (let i = 0; i < 10000; i++) {
  messages.push(generateMessage())
}

const items = ref([])
const search = ref('')
const streaming = ref(false)
const scroller = ref(null)

const filteredItems = computed(() => {
  if (!search.value) return items.value
  const lowerCaseSearch = search.value.toLowerCase()
  return items.value.filter(i => i.message.toLowerCase().includes(lowerCaseSearch))
})

const handleScroll = (event) => {
  hasScrolled = true
  const { scrollTop, scrollHeight, clientHeight } = event.target

  if (scrollTop < lastScrollTop) {
    if (scrollTop < 100) {
      alert('Gần Top')
    }
  }
  else if (scrollTop > lastScrollTop) {
    if (scrollHeight - scrollTop - clientHeight < 100) {
      alert('Gần Bottom')
    }
  }

  lastScrollTop = scrollTop
}

const checkInitialScroll = () => {
  if (!hasScrolled) {
    alert('Chưa có scroll')
  }
}

const changeMessage = (message) => {
  Object.assign(message, generateMessage())
}

const scrollToBottom = () => {
  scroller.value?.scrollToBottom()
}

const addMessage = () => {
  for (let i = 0; i < 10; i++) {
    items.value.push({
      id: id++,
      ...messages[id % 10000],
    })
  }
  scrollToBottom()

  if (streaming.value) {
    requestAnimationFrame(addMessage)
  }
}

const startStream = () => {
  if (streaming.value) return
  streaming.value = true
  addMessage()
}

const stopStream = () => {
  streaming.value = false
}

onMounted(() => {
  setTimeout(checkInitialScroll, 100)
})

onUnmounted(() => {
  stopStream()
})
</script>

<style scoped>
.chat-demo {
  overflow: hidden;
  flex: auto 1 1;
  display: flex;
  flex-direction: column;
  height: 500px;
}

.scroller {
  flex: auto 1 1;
  height: 100%;
  overflow: hidden;
}

.toolbar {
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.toolbar input {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.toolbar button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.toolbar button:hover {
  background: #f5f5f5;
}

.notice {
  padding: 24px;
  font-size: 20px;
  color: #999;
}

.message {
  display: flex;
  min-height: 32px;
  padding: 12px;
  box-sizing: border-box;
}

.avatar {
  flex: auto 0 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
}

.avatar .image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;
}

.index,
.text {
  flex: 1;
}

.text {
  max-width: 400px;
}

.index {
  opacity: .5;
}

.index span {
  display: inline-block;
  width: 160px;
  text-align: right;
}
</style>