import axios from 'axios'

const API_URL = 'https://jsonplaceholder.typicode.com'

export const fetchCommentsApi = async (id: number) => {
  const response = await axios.get(`${API_URL}/comments?postId=${id}`)
  return response.data
}

export const fetchRepliesApi = async () => {
  const response = await axios.get(`${API_URL}/comments`)
  return response.data
}
