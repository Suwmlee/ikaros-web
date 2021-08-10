<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="first">刮削</el-menu-item>
      <el-menu-item index="second">配置</el-menu-item>
      <el-menu-item index="third">备份记录</el-menu-item>
    </el-menu>
    <Scraping v-if="activeIndex==='first'"  />
    <ScrapingConf v-if="activeIndex==='second'" />
    <ScrapingBak v-if="activeIndex==='third'" />
  </div>
</template>

<script lang="ts">
import Scraping from './scraping.vue'
import ScrapingConf from './scrapingconf.vue'
import ScrapingBak from './scrapingbak.vue'

  export default {
    name: 'JavScraping',
    components: {
        Scraping,
        ScrapingConf,
        ScrapingBak
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
