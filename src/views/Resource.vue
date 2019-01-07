<template>
  <section class="page-flex">
    <!--头部-->
    <div class="m-resource-filter">
      <!--搜索-->
      <van-search
        placeholder="搜索资源"
        v-model="search.keyword"
      />
      <!--添加资源-->
      <div class="btn">
        <van-icon @click="openResourcePanel" name="plus"/>
      </div>
      <!--添加资源面板-->
      <transition name="fade">
        <div class="m-resource-panel" v-if="resource.show">
          <div @click="closeResourcePanel" class="close">
            <van-icon name="cross"/>
          </div>
          <!--按钮区域-->
          <div class="controls" v-show="resource.view === 'controls'">
            <transition name="resource-btn">
              <div
                @click="createCustomResource"
                class="btn"
                style="transition-duration: .2s"
                v-show="resource.view === 'controls'">
                <div class="icon"><i class="van-icon van-icon-edit"></i></div>
                <div class="name">自主创建</div>
              </div>
            </transition>
            <transition name="resource-btn">
              <div
                @click="createRemoteResource"
                class="btn"
                style="transition-duration: .4s"
                v-show="resource.view === 'controls'">
                <div class="icon"><i class="van-icon van-icon-exchange"></i></div>
                <div class="name">远程资源</div>
              </div>
            </transition>
            <transition name="resource-btn">
              <div
                class="btn"
                style="transition-duration: .6s"
                v-show="resource.view === 'controls'">
                <div class="icon"><i class="van-icon van-icon-question-o"></i></div>
                <div class="name">帮助</div>
              </div>
            </transition>
          </div>
          <!--自定义资源表单-->
          <transition name="fadeOutDownInUp">
            <div class="resource-form" v-if="resource.view === 'custom'">
              <div class="form-title">自定义资源</div>
              <van-cell-group class="van-hairline--left van-hairline--right">
                <van-field
                  placeholder="资源名称"
                  required
                  v-model="resource.form.name"
                />
                <van-field
                  placeholder="基础路径"
                  v-model="resource.form.basePath"
                />
                <van-field
                  placeholder="图片缩略图参数"
                  v-model="resource.form.thumbConfig"
                />
                <van-field
                  :autosize="{maxHeight:300}"
                  placeholder="资源：['/path/to/file.ext']"
                  required
                  rows="5"
                  type="textarea"
                  v-model="resource.form.filesContent"
                />
              </van-cell-group>
              <van-button @click="resourceFormSubmit" class="controls" size="large">添加资源</van-button>
            </div>
          </transition>
          <!--远程资源表单-->
          <transition name="fadeOutDownInUp">
            <div class="resource-form" v-if="resource.view === 'remote'">
              <div class="form-title">远程资源</div>
              <template v-if="resource.step === 1">
                <van-cell-group class="van-hairline--left van-hairline--right">
                  <van-field
                    placeholder="资源链接"
                    required
                    v-model="resource.form.url"
                  />
                </van-cell-group>
                <van-button @click="requestRemoteResource" class="controls" size="large" :loading="resource.loading">请求资源数据</van-button>
              </template>
              <template v-if="resource.step === 2">
                <van-cell-group class="van-hairline--left van-hairline--right">
                  <van-field
                    placeholder="资源名称"
                    required
                    v-model="resource.form.name"
                  />
                  <van-field
                    placeholder="基础路径"
                    v-model="resource.form.basePath"
                  />
                  <van-field
                    placeholder="图片缩略图参数"
                    v-model="resource.form.thumbConfig"
                  />
                  <van-field
                    :autosize="{maxHeight:300}"
                    placeholder="资源：['/path/to/file.ext']"
                    required
                    rows="5"
                    type="textarea"
                    v-model="resource.form.filesContent"
                  />
                </van-cell-group>
                <van-button @click="resourceFormSubmit" class="controls" size="large">添加资源</van-button>
              </template>
            </div>
          </transition>
        </div>
      </transition>
    </div>
    <van-list
      :finished="finished"
      @load="loadResourceData"
      class="page-container m-resource-list van-hairline--top"
      ref="pageContainer"
      v-model="loading"
    >
      <van-cell
        :key="item.id"
        is-link
        v-for="item in resourceList">
        <template slot="title">
          <i class="iconfont icon-folder"></i>
          {{ item.name }}
        </template>
      </van-cell>

      <!--<div class="btn-add-resource">
        <van-icon name="add-o"/> 添加资源
      </div>-->
    </van-list>
  </section>
</template>

<script>
  import db from '@/libs/db'
  import axios from '@/plugin/axios'
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'Resource',
    data() {
      return {
        loading: false,
        finished: false,
        resourceList: [], // 资源列表
        paging: {
          currentIndex: 1,
          pageSize: 31
        },
        search: {
          keyword: ''
        },
        resource: {
          show: false,
          view: '',
          loading: false,
          form: {
            name: '',
            basePath: '',
            thumbConfig: '',
            filesContent: ''
          },
        }
      }
    },
    computed: {
      ...mapState('app', [
        'resources'
      ])
    },
    watch: {},
    methods: {
      ...mapMutations('app', [
        'addResource',
        'removeResource',
      ]),
      loadResourceData() {
        this.resourceList = this.resourceList.concat(this.resources.splice(this.paging.currentIndex, this.paging.pageSize))
        this.paging.currentIndex = this.paging.currentIndex + this.paging.pageSize
        if (this.resourceList.length === this.resources.length) {
          this.finished = true
        }
        this.loading = false
      },
      openResourcePanel() {
        this.resource.show = true;
        setTimeout(() => {
          this.resource.view = 'controls'
        }, 400)
      },
      closeResourcePanel() {
        this.resource = {
          show: false,
          view: '',
          form: {
            name: '',
            basePath: '',
            thumbConfig: '',
            filesContent: ''
          },
        }
      },
      createCustomResource() {
        this.resource.view = 'custom'
      },
      createRemoteResource() {
        this.resource.view = 'remote'
        this.resource.step = 1
      },
      resourceFormSubmit() {
        let isValid = true
        let resource = {}
        let files = []
        let form = this.resource.form
        if (form.name.trim() === '') {
          this.$toast('名称不能为空')
          isValid = false
        } else if (form.filesContent === '') {
          this.$toast('资源不能为空')
          isValid = false
        } else {
          let files
          try {
            files = JSON.parse(form.filesContent)
          } catch (e) {
            this.$toast('转换失败，资源不是标准的JSON类型！')
            isValid = false
          }
        }

        resource = {
          name: form.name,
          basePath: form.basePath,
          thumbConfig: form.thumbConfig,
          files: files
        }
        if (isValid) {
          this.addResource(resource)
        }
      },
      requestRemoteResource(){
        this.resource.loading = true
        if(this.resource.form.url.trim() === ''){
          this.$toast('URL 不能为空！')
          return false
        }

        axios.jsonp(this.resource.form.url).then(res => {
          debugger
          // 解析数据
        }).catch(err => {
          this.$toast('请求数据失败，请检查url！')
        }).finally(()=>{
          this.resource.loading = false
        })
      }
    },
    beforeMount() {
      let cacheState = db.get('page.index.state').value()
      Object.assign(this, cacheState)
    },
    mounted() {
    },
    activated() {
      this.$refs.pageContainer.$el.scrollTop = this.scrollTop
    },
    deactivated() {
      this.scrollTop = this.$refs.pageContainer.$el.scrollTop
    }
  }
</script>

<style type="text/scss" lang="scss">
  .m-resource-filter {
    display: flex;
    background-color: #f2f2f2;

    .van-search {
      flex: 1;
    }

    & > .btn {
      font-size: 18px;
      line-height: 44px;
      width: 44px;
      text-align: center;

      i {
        position: relative;
        top: 3px;
      }
    }
  }

  .m-resource-list {
    .item {

    }

    .btn-add-resource {
      line-height: 44px;
      border-radius: 5px;
      background-color: #fafafa;
      margin: 20px;
      text-align: center;
      font-size: 13px;

      i {
        position: relative;
        top: 3px;
        font-size: 15px;
      }
    }
  }

  .m-resource-panel {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 202;
    background-color: #fff;
    box-shadow: 0 0 200px #ccc;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .close {
      position: absolute;
      right: 0;
      top: 0;
      text-align: center;
      z-index: 2;

      i {
        font-size: 20px;
        padding: 12px;
      }
    }

    & > .controls {
      position: absolute;
      bottom: 50px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;

      .btn {
        flex: 1;
        text-align: center;

        i {
          padding: 12px;
          text-align: center;
          border-radius: 50%;
          background-color: #fc6b21;
          color: #fff;
          font-size: 20px;
        }

        .name {
          margin-top: 10px;
          color: #333;
        }

        &:nth-child(2) i {
          background-color: #f5ad1b;
        }

        &:nth-child(3) i {
          background-color: #08d;
        }
      }
    }

    .resource-form {
      padding: 0 20px 20px;

      .form-title {
        line-height: 66px;
        font-size: 16px;
        color: #333;
      }

      .van-cell-group {
      }

      .controls {
        margin-top: 20px;
      }
    }
  }
</style>
