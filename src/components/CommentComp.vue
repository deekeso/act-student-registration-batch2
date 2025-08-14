<script lang="ts" setup>
import { useCommentStore } from '@/stores/commentStore'
import { onMounted, ref } from 'vue'

const commentStore = useCommentStore()
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    await new Promise((resolve) => setTimeout(resolve, 2000))
    commentStore.getCommentsWithReplies()
    loading.value = false
  } catch (error) {
    console.error('Something went wrong!: ', error)
  }
})
</script>

<template>
  <el-container class="comment-container">
    <el-header><h1>Comments</h1></el-header>
    <el-timeline>
      <el-timeline-item v-for="(comment, index) in commentStore.comment" :key="index">
        <!--MAIN COMMENT-->
        <el-card class="comment-card" shadow="hover" style="margin-bottom: 12px">
          <!-----------------------LOADING------------------------->
          <el-skeleton
            v-if="loading"
            style="--el-skeleton-circle-size: 40px; display: flex; gap: 10px"
            animated
          >
            <template #template>
              <el-skeleton-item variant="circle" />
              <el-skeleton :rows="3" />
            </template>
          </el-skeleton>
          <!-------------------------------------------------------->

          <div class="comment-content" v-if="!loading">
            <div class="comment-header">
              <el-avatar :size="32">{{ comment.email![0].toUpperCase() }}</el-avatar>
              <div>
                <strong>{{ comment.email }}</strong>
                <div style="font-size: 12px; color: gray">@{{ comment.name }}</div>
              </div>
            </div>

            <div style="margin-top: 8px">{{ comment.body }}</div>

            <div class="comment-acts">
              <el-icon class="upvote"><Top /></el-icon>
              <span>Upvote</span>
              <el-icon class="downvote"><Bottom /></el-icon>
              <span>Downvote</span>
            </div>
          </div>
        </el-card>

        <!--REPLY SECTION-->
        <el-container class="reply-container" v-if="comment.replies && comment.replies.length">
          <h1>Replies...</h1>
          <el-card
            class="reply-card"
            v-for="(reply, index) in comment.replies"
            :key="index"
            shadow="hover"
          >
            <!---------------------LOADING--------------------->

            <el-skeleton
              v-if="loading"
              style="--el-skeleton-circle-size: 40px; display: flex; gap: 10px"
              animated
            >
              <template #template>
                <el-skeleton-item variant="circle" />
                <el-skeleton :rows="3" />
              </template>
            </el-skeleton>
            <!--------------------------------------------->

            <div class="comment-content" v-if="!loading">
              <div class="comment-header">
                <el-avatar :size="32">{{ reply.email![0].toUpperCase() }}</el-avatar>
                <div>
                  <strong>{{ reply.email }}</strong>
                  <div style="font-size: 12px; color: gray">@{{ reply.name }}</div>
                </div>
              </div>

              <div style="margin-top: 8px">{{ reply.body }}</div>
              <div class="comment-acts">
                <el-icon class="upvote"><Top /></el-icon>
                <span>Upvote</span>
                <el-icon class="downvote"><Bottom /></el-icon>
                <span>Downvote</span>
              </div>
            </div>
          </el-card>
        </el-container>
      </el-timeline-item>
    </el-timeline>
  </el-container>
</template>

<style scoped>
.comment-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 55rem;
  padding: 0 1rem;
}

.comment-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.reply-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 1.5rem;
  width: 100%;
}

.reply-content {
  display: flex;
  gap: 10px;
}

.comment-acts {
  display: flex;
  padding: 10px;
  gap: 15px;
  border-top: 1px solid #f5f5f5;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.upvote {
  color: orangered;
  font-weight: bold;
}

.comment-acts span {
  font-weight: bold;
  font-size: 14px;
}
@media (max-width: 768px) {
  .comment-container {
    padding: 0 0.5rem;
  }

  .reply-container {
    padding-left: 0.5rem;
  }

  .comment-acts {
    padding: 8px;
    gap: 10px;
  }

  .comment-acts span {
    font-size: 12px;
  }

  .comment-header div {
    font-size: 14px;
  }

  .comment-header div div {
    font-size: 11px !important;
  }
}
</style>
