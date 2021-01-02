<template>
    <div>
        <el-form label-position="right" label-width="150px" :model="settings">
            <el-form-item label="需要软链接目录">
                <el-input v-model="settings.source_folder"></el-input>
            </el-form-item>
            <el-form-item label="软链接前缀">
                <el-input v-model="settings.soft_prefix"></el-input>
            </el-form-item>
            <el-form-item label="输出目录">
                <el-input v-model="settings.output_folder"></el-input>
            </el-form-item>
            <el-form-item label="过滤目录">
                <el-input v-model="settings.escape_folder"></el-input>
            </el-form-item>
            <el-form-item>
                <!-- <el-button type="primary" @click="onSubmit">应用</el-button> -->
                <el-button :loading="running" size="medium" type="primary" @click="onSubmit">
                    <span v-if="!running">转移</span>
                    <span v-else>转移中...</span>
                </el-button>
            </el-form-item>
        </el-form>

        <el-table :data="transferdata" 
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
            <el-table-column label="状态"
                prop="success">
            </el-table-column>
            <el-table-column label="软链接路径" :show-overflow-tooltip="true"
                prop="softpath" width="150" >
            </el-table-column>
            <el-table-column label="实际路径" :show-overflow-tooltip="true"
                prop="destpath" width="150" >
            </el-table-column>
            <el-table-column label="更新时间"
                prop="updatetime">
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
    name: 'transfer',
    data() { 
        return {
            running: false,
            currentPage: 1,
            totalnum: 10,
            transferdata: [],
            settings: {
                soft_prefix: '',
                source_folder: '',
                output_folder: '',
                escape_folder: '',
            }
        };
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
        onSubmit() {
            axios.post('/api/transfer',this.settings)
                .then(response => {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        refresh() {
            let geturl = '/api/transferdata/' + this.currentPage
            axios.get(geturl)
                .then(response => {
                    console.log(response)
                    this.transferdata = response.data.data
                    this.running = response.data.running
                    this.currentPage = response.data.page
                    this.totalnum = response.data.total
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        handleCurrentChange(num){
            this.currentPage = num
        }
    }
}
</script>