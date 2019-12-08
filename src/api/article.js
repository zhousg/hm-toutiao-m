// 提供文章相关的API函数
import request from '@/utils/request'

/**
 * 获取文章列表
 * @param {Integer} channelId - 频道ID
 * @param {Integer} timestamp - 时间戳
 */
export const getArticles = (channelId, timestamp) => {
  return request('/app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}

/**
 * 对文章不喜欢
 * @param {String} articleId - 文章ID
 */
export const disLikes = (articleId) => {
  return request('/app/v1_0/article/dislikes', 'post', {
    target: articleId
  })
}
/**
 * 取消对文章不喜欢
 * @param {String} articleId - 文章ID
 */
export const unDisLikes = (articleId) => {
  return request(`/app/v1_0/article/dislikes/${articleId}`, 'delete')
}
/**
 * 点赞
 * @param {String} articleId - 文章ID
 */
export const likings = (articleId) => {
  return request('/app/v1_0/article/likings', 'post', {
    target: articleId
  })
}
/**
 * 取消点赞
 * @param {String} articleId - 文章ID
 */
export const unLikings = (articleId) => {
  return request(`/app/v1_0/article/likings/${articleId}`, 'delete')
}

/**
 * 对文章进行举报
 * @param {String} articleId - 文章ID
 * @param {Integer} type -举报类型
 */
export const report = (articleId, type) => {
  return request('/app/v1_0/article/reports', 'post', {
    target: articleId,
    type
  })
}

/**
 * 获取联想词条
 * @param {String} q - 搜索关键字
 */
export const suggest = (q) => {
  return request('/app/v1_0/suggestion', 'get', { q })
}

/**
 * 根据搜索关键字获取文章列表
 * @param {Integer} page - 页码
 * @param {Integer} perPage - 一页多少条
 * @param {String} q - 搜索关键字
 */
export const searchArticles = ({ page = 1, perPage = 20, q }) => {
  return request('/app/v1_0/search', 'get', {
    page,
    per_page: perPage,
    q
  })
}

/**
 * 获取文章详情
 * @param {String} articleId - 文章ID
 */
export const getArticle = (articleId) => {
  return request(`/app/v1_0/articles/${articleId}`, 'get')
}

/**
 * 获取 评论 或者 回复 列表
 * @param {String} type - a 获取评论列表  c 获取回复列表
 * @param {String} source - 获取评论列表 使用文章ID  获取回复列表 使用评论ID
 * @param {Integer} offset - 获取第一页 不传  下一页（使用上一页数据的最后一个ID当作偏移量）
 */
export const getCommentsOrReplys = ({ type, source, offset, limit = 10 }) => {
  return request('/app/v1_0/comments', 'get', { type, source, offset, limit })
}

/**
 * 提交 评论 回复
 * @param {String} target - 提交评论 文章ID  提交回复  评论ID
 * @param {String} content - 内容
 * @param {String} artId - 提交回复 文章ID
 */
export const commentOrReply = (target, content, artId = null) => {
  return request('/app/v1_0/comments', 'post', { target, content, art_id: artId })
}
