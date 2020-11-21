<template>
  <div>
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="form" :model="article" label-width="40px">
        <el-form-item label="标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            lang="zh"
            height="300"
            placeholder="请输入内容"
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="article.channel_id" placeholder="请选择活动频道">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="arc-btn" @click="onPublish">
            发表
          </el-button>
          <el-button class="arc-btn">
            存入草稿
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// import element-tiptap 样式
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image'
import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle
} from '@/api/arctile'
import {
  // 需要的 extensions
  Image,
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList
} from 'element-tiptap'
export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap
  },
  data() {
    return {
      article: {
        title: '',
        content: '',
        cover: {
          // 封面类型：-1：自动 0：无图 1-1张 3-3张
          type: 0,
          image: [] // 封面地址
        },
        channel_id: null
      },
      // 文章频道列表
      channels: [],
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Image({
          uploadRequest(file) {
            console.log('11')
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage(fd).then(res => {
              // console.log(res)
              return res.data.data.url
            })
          }
        })
      ]
    }
  },
  created() {
    this.loadChannels()
    // 由于我们让发布和修改使用的同一个组件
    // 所以这里要判断
    // 如果路由路径参数中有 id，则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  methods: {
    async onPublish(draft = false) {
      const articleId = this.$route.query.id
      if (articleId) {
        // 执行修改操作
        const data = await updateArticle(articleId, this.article)
        console.log(data)
      }
      const res = await addArticle(this.article, draft)
      console.log(res)
    },
    async loadChannels() {
      const {
        data: { data: res }
      } = await getArticleChannels()
      // console.log(res)
      this.channels = res.channels
    },
    // 修改文章：加载文章内容
    async loadArticle() {
      // console.log('loadArticle')
      // 找到数据接口
      // 封装请求方法
      // 请求获取数据
      const { data: res } = await getArticle(this.$route.query.id)
      // 模板绑定展示
      // console.log(res)
      this.article = res.data
    }

    // onUpdateCover(index, url) {
    //   this.article.cover.images[index] = url
    // }
  }
}
</script>

<style lang="less">
.arc-btn {
  width: 10% !important;
}
</style>
