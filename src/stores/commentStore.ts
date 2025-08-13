import { fetchCommentsApi, fetchRepliesApi } from '@/apis/commentApi'
import type { CommentWithReplies } from '@/types/Comment'
import { defineStore } from 'pinia'

export const useCommentStore = defineStore('comments', {
  state: () => ({
    comment: [] as CommentWithReplies[],
  }),

  actions: {
    // async getComments() {
    //   try {
    //     const randomNumber = Math.floor(Math.random() * 100) + 1
    //     const fetchedComments = await fetchCommentsApi(randomNumber)

    //     this.comment = fetchedComments
    //     console.log('fetched comments:', fetchedComments)
    //   } catch (error) {
    //     console.error('Error has occured: ', error)
    //   }
    // },

    async getCommentsWithReplies() {
      try {
        const randomPostId = Math.floor(Math.random() * 100) + 1
        const fetchedComments = await fetchCommentsApi(randomPostId)
        const allComments = await fetchRepliesApi()

        const commentWithReplies = fetchedComments.map((comment: Comment) => {
          const shuffleArray = [...allComments].sort(() => 0.5 - Math.random())
          const randomReplies = shuffleArray.slice(0, 3)
          return { ...comment, replies: randomReplies }
        })

        this.comment = commentWithReplies
        console.log('fetched comments:', fetchedComments)
      } catch (error) {
        console.error('Error has occured: ', error)
      }
    },
  },
})
