import api from './api'
import type { Comment } from '@/types/comment'

export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(`/comments?/postId=${postId}`)
  return response.data
}
