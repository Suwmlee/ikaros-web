<template>
    <div>
        <el-button :loading="running" size="medium" type="primary" @click="start">
          <span v-if="!running">刮削</span>
          <span v-else>刮削中...</span>
        </el-button>
        <el-table :data="scraperdata" :cell-style="{padding: '0', height: '20px'}" >
            <el-table-column label="原始名称"
                prop="basename"              
                >
            </el-table-column>
            <el-table-column label="原始地址" :show-overflow-tooltip="true"
                prop="basepath"
                >
            </el-table-column>
            <el-table-column label="文件大小(mb)"
                prop="filesize"
                >
            </el-table-column>
            <el-table-column label="刮削用名称"
                prop="scrapingname"
                >
            </el-table-column>
            <el-table-column label="状态"
                prop="status">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status===0" >未刮削</el-tag>
                    <el-tag v-if="scope.row.status===1" >完成</el-tag>
                    <el-tag v-if="scope.row.status===2" >失败</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="刮削后名称"
                prop="newname">
            </el-table-column>
            <el-table-column label="刮削后路径" :show-overflow-tooltip="true"
                prop="newpath" width="150" >
            </el-table-column>
            <el-table-column label="更新时间"
                prop="updatetime">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'scraper',
    data() {
        return {
            running: false,
            scraperdata: []
        }
    },
    created(){
        console.log('init data')
        this.refresh()
    },
    mounted() {
        this.timer = setInterval(this.refresh, 1500);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        start() {
            axios.post('/api/start')
                .then(response => {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        refresh() {
            axios.get('/api/scrapedata')
                .then(response => {
                    this.scraperdata = response.data.data
                    this.running = response.data.running
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
}
</script>