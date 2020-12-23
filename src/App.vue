<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">快速开始</el-menu-item>
          <el-menu-item index="2">配置</el-menu-item>
          <el-menu-item index="3">刮削</el-menu-item>
          <el-menu-item index="4">历史</el-menu-item>
          <el-menu-item index="5">转移</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <Tutorial v-if="activeIndex==='1'" msg="Welcome to Spike"/>
        <Settings v-if="activeIndex==='2'" />
        <Scraper v-if="activeIndex==='3'" />
        <History v-if="activeIndex==='4'" />
        <Transfer v-if="activeIndex==='5'" />
      </el-main>
    </el-container>

  </div>
</template>

<script>
import Tutorial from './components/tutorial.vue'
import Settings from './components/setting'
import Scraper from './components/scraper'
import History from './components/history'
import Transfer from './components/transfer'

export default {
  name: 'App',
  components: {
    Tutorial,
    Settings,
    Scraper,
    History,
    Transfer
  },
  data() {
    return {
      activeIndex: '1',
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
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
