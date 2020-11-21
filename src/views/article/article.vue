<template>
  <div class="arctile-contanier">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 数据表单 -->
      <el-form ref="form" :model="form" label-width="45px" size="mini">
        <el-form-item label="状态:">
          <el-radio-group v-model="form.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择">
            <el-option label="全部" :value="null"> </el-option>
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in articleChanels"
              :key="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="arc-btn"
            :disabled="loading"
            @click="loadArticle(1)"
          >
            筛选
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到{{ totalcount }}条结果</span>
      </div>
      <!-- 数据列表 -->
      <el-table
        :data="articles"
        style="width: 100%"
        stripe
        class="list-table"
        size="mini"
        v-loading="loading"
      >
        <el-table-column prop="cover.images" label="封面" width="180">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag :type="articlestatus[scope.row.status].type"
              >{{ articlestatus[scope.row.status].text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="$router.push('/publish?id=' + scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页展示 -->
      <el-pagination
        layout="prev, pager, next"
        :total="totalcount"
        background
        :page-size="pagesize"
        :disabled="loading"
        :current-page.sync="page"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getArticles, getArticleChannels, deleteAticle } from '@/api/arctile'
export default {
  name: 'ArticleIndex',
  data() {
    return {
      loading: false,
      rangeDate: null,
      form: {
        date1: '',
        status: null,
        region: ''
      },
      // 文章频道
      articleChanels: [],
      // 文章数据
      articles: [],
      // 数据总数
      totalcount: 0,
      // 状态数据
      pagesize: 10,
      articlestatus: [
        { status: 0, type: 'warning', text: '草稿' },
        { status: 1, type: 'primary', text: '待审核' },
        { status: 2, type: 'success', text: '审核通过' },
        { status: 3, type: 'danger', text: '审核失败' },
        { status: 4, type: 'info', text: '已删除' }
      ],
      channelId: null, // 查询文章的频道,
      page: 1 // 当前页码
    }
  },
  created() {
    this.loadArticle(1)
    this.loadChanels()
  },
  methods: {
    // onSubmit() {
    //   this.loadArticle(1)
    // },
    async loadArticle(page) {
      this.loading = true
      const res = await getArticles({
        status: this.form.status,
        page,
        per_page: this.pagesize,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止日期
      })
      this.articles = res.data.data.results
      this.totalcount = res.data.data.total_count
      this.loading = false
      // console.log(res.data.data)
      // console.log(this.articles)
    },
    handleCurrentChange(page) {
      this.loadArticle(page)
    },
    async loadChanels() {
      const { data: res } = await getArticleChannels()
      // console.log(res)
      this.articleChanels = res.data.channels
    },
    async removeUserById(articleId) {
      // console.log(articleId)
      console.log(articleId.toString())
      this.$confirm('确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 确认执行这里
          deleteAticle(articleId.toString()).then(res => {
            // 删除成功，更新当前页的文章数据列表
            this.loadArticle(this.page)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      // 找到数据接口
      // 封装请求方法
      // 删除请求调用
      // 处理响应结果
      // console.log('onDeleteArticle')
    }
  }
}
</script>
<style lang="less">
.arc-btn {
  width: 10% !important;
}
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
</style>
