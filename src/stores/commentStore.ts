import { getCommentsByPostId } from '@/services/commentServices'
import type { Comment } from '@/types/comment'
import { defineStore } from 'pinia'

export const useCommentStore = defineStore('comment', {
  state: () => ({
    comments: [] as Comment[],
  }),

  actions: {
    async fetchCommentsByPostId(postId: number) {
      try {
        const allComments = await getCommentsByPostId(postId)

        // simulate a random selection of comments
        const shuffled = [...allComments].sort(() => Math.random() - 0.5)

        // select 2 parent comments and the rest as replies
        const parentComments = shuffled.slice(0, 2)

        // ensure replies are at least 2 per parent comment
        const replies = shuffled.slice(2)

        // assign replies to parent comments
        parentComments.forEach((comment) => {
          const replyCount = Math.floor(Math.random() * 2) + 1
          comment.replies = replies.slice(0, replyCount)
        })

        this.comments = parentComments
      } catch (error) {
        console.error('Failed to fetch comments: ', error)
      }
    },
  },
})
