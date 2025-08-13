<script lang="ts" setup>
import { useCommentStore } from '@/stores/commentStore'
import { onMounted } from 'vue'

const commentStore = useCommentStore()

onMounted(() => {
  commentStore.getCommentsWithReplies()
})
</script>

<template>
  <el-container class="comment-container">
    <el-header><h1>Comments</h1></el-header>
    <el-timeline>
      <el-timeline-item v-for="(comment, index) in commentStore.comment" :key="index">
        <!--MAIN COMMENT-->
        <el-card class="comment-card" shadow="hover" style="margin-bottom: 12px">
          <div class="comment-content">
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
            <div class="comment-content">
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

  width: 55rem;
}

.comment-content {
  display: flex;
  gap: 10px;
}

.reply-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 2rem;
  width: 55rem;
  width: inherit;
}

.reply-content {
  display: flex;
  gap: 10px;
}

.comment-acts {
  display: flex;
  padding: 10px 20px;
  gap: 20px;
  border-top: 1px solid #f5f5f5;
  margin-top: 1rem;
}

.upvote {
  color: orangered;
  font-weight: bold;
}

.comment-acts span {
  font-weight: bold;
}
</style>
