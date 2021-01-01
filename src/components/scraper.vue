<template>
    <div>
        <el-button :loading="running" size="medium" type="primary" @click="start">
          <span v-if="!running">刮削</span>
          <span v-else>刮削中...</span>
        </el-button>
        <el-table :data="scraperdata" 
                stripe 
                :cell-style="{padding: '0', height: '20px'}" >
            <el-table-column label="原始名称"
                prop="basename" >
            </el-table-column>
            <el-table-column label="原始地址" :show-overflow-tooltip="true"
                prop="basepath" >
            </el-table-column>
            <el-table-column label="大小(MB)"
                prop="filesize" width="100" >
            </el-table-column>
            <el-table-column label="刮削用名称"
                prop="scrapingname" >
            </el-table-column>
            <el-table-column label="状态"
                prop="status" width="100">
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
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :page-size="10"
            :pager-count="7"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="totalnum">
        </el-pagination>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'scraper',
    data() {
        return {
            running: false,
            currentPage: 1,
            totalnum: 10,
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
            let geturl = '/api/scrapedata/' + this.currentPage
            axios.get(geturl)
                .then(response => {
                    console.log(response)
                    this.scraperdata = response.data.data
                    this.running = response.data.running
                    this.currentPage = response.data.page
                    this.totalnum = response.data.total
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
        handleCurrentChange(num){
            this.currentPage = num
        }
    }
}
</script>

<style scoped>

.body-wrap {
    width: 1200px;
    margin: 0 auto;
}

</style>