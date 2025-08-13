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

        // Simulate nested comments by assigning some as replies
        const shuffled = [...allComments].sort(() => Math.random() - 0.5)
        const parentComments = shuffled.slice(0, 2).map((comment) => ({
          ...comment,
          replies: [] as Comment[],
        }))

        // Assign remaining comments as replies to parent comments
        const replies = shuffled.slice(2, 6)
        if (parentComments[0]) {
          parentComments[0].replies = replies.slice(0, 1)
        }
        if (parentComments[1] && replies.length > 1) {
          parentComments[1].replies = replies.slice(1)
        }

        this.comments = parentComments
      } catch (error) {
        console.error('Failed to fetch comments: ', error)
      }
    },
  },
})
