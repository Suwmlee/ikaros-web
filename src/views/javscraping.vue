<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="first">刮削</el-menu-item>
      <el-menu-item index="second">配置</el-menu-item>
    </el-menu>
    <Scraping v-if="activeIndex==='first'"  />
    <ScrapingConf v-if="activeIndex==='second'" />
  </div>
</template>

<script lang="ts">
import Scraping from './scraping.vue'
import ScrapingConf from './scrapingconf.vue'

  export default {
    name: 'JavScraping',
    components: {
        Scraping,
        ScrapingConf,
    },
    data() {
      return {
        activeIndex: 'first',
      };
    },
    methods: {
      handleSelect(key: number) {
        this.activeIndex = key
      }
    }
  };
</script>
