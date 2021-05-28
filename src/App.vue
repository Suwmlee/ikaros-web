<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">快速开始</el-menu-item>
          <el-menu-item index="2">配置</el-menu-item>
          <el-menu-item index="3">刮削</el-menu-item>
          <el-menu-item index="4">转移</el-menu-item>
          <el-menu-item index="5">重命名</el-menu-item>
          <el-menu-item index="6">计划任务</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <Tutorial v-if="activeIndex==='1'" msg="Welcome to Ikaros"/>
        <ScrapingConf v-if="activeIndex==='2'" />
        <Scraping v-if="activeIndex==='3'" />
        <Transfer v-if="activeIndex==='4'" />
        <Reanme v-if="activeIndex==='5'" />
        <Task v-if="activeIndex==='6'" />
      </el-main>
    </el-container>

  </div>
</template>

<script lang="ts">
import Tutorial from './components/tutorial.vue'
import Scraping from './components/scraping.vue'
import ScrapingConf from './components/scrapingconf.vue'
import Transfer from './components/transfer.vue'
import Reanme from './components/rename.vue'
import Task from './components/task.vue'

export default {
  name: 'App',
  components: {
    Tutorial,
    Scraping,
    ScrapingConf,
    Transfer,
    Reanme,
    Task
  },
  data() {
    return {
      activeIndex: '1',
    };
  },
  methods: {
    handleSelect(key: number) {
      this.activeIndex = key
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
