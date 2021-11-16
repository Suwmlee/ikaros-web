<template>
  <transition name="dialog-fade">
    <div class="dialog-backdrop">
      <div class="dialog"
        role="dialog"
        aria-labelledby="dialogTitle"
        aria-describedby="dialogDescription"
      >
        <header
          class="dialog-header"
          id="dialogTitle"
        >
          <slot name="header">
            选择文件夹
          </slot>
          <button
            type="button"
            class="btn-close"
            @click="cancel"
            aria-label="Close dialog"
          >
            <i class="el-icon-close"></i>
          </button>
        </header>

        <section
          class="dialog-body"
          id="dialogDescription"
        >
          <el-tooltip class="item" effect="dark" :open-delay='400' :content="selectedPath" placement="right">
            <span class="span-txt" v-text="selectedPath" />
          </el-tooltip>
          <el-button @click="select(parentFolder)" class="btn-item" ><i class="el-icon-back"/>返回上级目录</el-button>
          <div class="filelist-body" v-for="item in directoryList" :key="item.index">
            <el-tooltip class="item" effect="dark" :open-delay='400' :content="item.fullname" placement="right">
              <el-button @click="select(item.fullname)" v-text="item.fullname" class="btn-item"/>
            </el-tooltip>
          </div>
        </section>

        <footer class="dialog-footer">
          <el-button
            type="button"
            class="btn-green"
            @click="close"
            aria-label="Close dialog"
          >
            确认
          </el-button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios';
  export default Vue.extend({
    name: 'FileBrowserDialog',
    data() {
        return{
            parentFolder: '',
            selectedPath: '/',
            directoryList: {}
        }
    },
    watch: {
      dialogVisible(val: boolean) {
        if (val) this.dialogInit()
      },
    },
    props: {
      dialogVisible: Boolean
    },
    methods: {
      async getDirs(path = '/') {
        try {
          const queryjson = { path: path };
          let data = (await axios.post("/api/scan/", queryjson)).data
          if (null == data.parent)
          {
            this.$message({
                        showClose: true,
                        duration: 2000,
                        message: data.error,
                        type: 'error'
                    })
          }else{
            this.directoryList = data.dirs
            this.parentFolder = data.parent
          }
        } catch (e) {
          this.showSnack(e.message)
        }
      },
      dialogInit() {
        try {
          this.select()
        } catch (e) {
          this.getDirs()
        }
      },
      select(path = '/') {
        if (path === '') {
          path = '/'
        }
        this.selectedPath = path
        this.getDirs(path)
      },
      cancel(){
        this.$emit('close');
      },
      close() {
        this.$emit('update:path', this.selectedPath)
        this.$emit('close');
      },
    },
  })
</script>

<style>
  .dialog-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dialog {
    max-height: 80vh;
    width: 450px;
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }

  .dialog-header,
  .dialog-footer {
    padding: 15px;
    display: flex;
  }

  .dialog-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .dialog-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
  }

  .span-txt {
    display: flex;
    height: 40px;
    width: 95%;
    margin: auto;
    line-height: 40px;
    align-content: center;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; 
  }

  .dialog-body {
    position: relative;
    overflow-y: auto;
    padding: 20px 10px;
  }

  .btn-item {
    width: 100%;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }

  .dialog-fade-enter,
  .dialog-fade-leave-to {
    opacity: 0;
  }

  .dialog-fade-enter-active,
  .dialog-fade-leave-active {
    transition: opacity .5s ease;
  }
</style>
