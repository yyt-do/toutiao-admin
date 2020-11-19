// 文章相关请求模块
import request from '@/utils/request'
// 获取文章列表
export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // body参数使用data设置
    // query参数使用params设置
    // header参数使用headers设置
    params
  })
}
// 获取文章数据
export const getArticleChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}
// 删除文章
export const deleteAticle = (articleid) => {
  return request({
    method: 'DALETE',
    url: `/mp/v1_0/articles/${articleid}`
  })
}
