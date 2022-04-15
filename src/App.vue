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
          <el-menu-item index="7">选项</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <Tutorial v-if="activeIndex==='1'" />
        <JavScraping v-if="activeIndex==='3'" />
        <Transfer v-if="activeIndex==='4'" />
        <Reanme v-if="activeIndex==='5'" />
        <Automation v-if="activeIndex==='6'" />
        <Options v-if="activeIndex==='7'" />
      </el-main>
      <el-footer class="site-footer" ><a href="https://github.com/Suwmlee/ikaros" target="_blank">ikaros</a> {{ version }}</el-footer>
    </el-container>

  </div>
</template>

<script lang="ts">
import axios from 'axios'
import Tutorial from './views/tutorial.vue'
import JavScraping from './views/javscraping.vue'
import Transfer from './views/transfer.vue'
import Reanme from './views/rename.vue'
import Automation from './views/automation.vue'
import Options from './views/options.vue'

export default {
  name: 'App',
  components: {
    Tutorial,
    JavScraping,
    Transfer,
    Reanme,
    Automation,
    Options
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
