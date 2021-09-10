<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">简介</el-menu-item>
          <el-menu-item index="3">刮削</el-menu-item>
          <el-menu-item index="4">转移</el-menu-item>
          <el-menu-item index="5">重命名</el-menu-item>
          <el-menu-item index="6">自动</el-menu-item>
          <el-menu-item index="7">配置</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <Tutorial v-if="activeIndex==='1'" />
        <JavScraping v-if="activeIndex==='3'" />
        <Transfer v-if="activeIndex==='4'" />
        <Reanme v-if="activeIndex==='5'" />
        <AutoConf v-if="activeIndex==='6'" />
        <Config v-if="activeIndex==='7'" />
      </el-main>
      <el-footer><a class="site-footer" href="https://github.com/Suwmlee/ikaros">ikaros</a> {{ version }}</el-footer>
    </el-container>

  </div>
</template>

<script lang="ts">
import axios from 'axios'
import Tutorial from './components/tutorial.vue'
import JavScraping from './components/javscraping.vue'
import Transfer from './components/transfer.vue'
import Reanme from './components/rename.vue'
import AutoConf from './components/autoconf.vue'
import Config from './components/config.vue'

export default {
  name: 'App',
  components: {
    Tutorial,
    JavScraping,
    Transfer,
    Reanme,
    AutoConf,
    Config
  },
  data() {
    return {
      version:'',
      activeIndex: '1',
    };
  },
  async created() {
    this.versionInfo()
  },
  methods: {
    handleSelect(key: number) {
      this.activeIndex = key
    },
    versionInfo(){
      axios.get('/api/version')
          .then(response => {
              console.log(response)
              this.version = response.data
          })
          .catch(function (error) {
              console.log(error);
          });
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-container {
  min-height: 97vh;
}

.el-header {
  text-align: center;
  line-height: 60px;
  overflow-x: auto;
  overflow-y: hidden;
}
.el-header > ul {
  width: 450px;
}

.el-footer {
  text-align: center;
  line-height: 60px;
}

.site-footer {
    color: var(--theme-footer-link-color);
    line-height: 1.30769231;
    display: inline-block;
    text-decoration: none;
}

</style>
