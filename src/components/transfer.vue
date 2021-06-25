<template>
    <div class="body-wrap">
        <el-select v-model="selectedoption" 
                   @change="changeConf"
                   placeholder="请选择配置">
            <el-option v-for="item in options"
                       :key="item.id"
                       :label="item.mark"
                       :value="item.id">
            </el-option>
        </el-select>
        <el-divider></el-divider>
     
        <el-form label-position="right" label-width="auto" :model="transconfig">
            <el-form-item label="源目录">
                <el-input v-model="transconfig.source_folder">
                    <el-button slot="append" icon="el-icon-search" @click="showSourceDialog"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="链接类型">
                <el-radio-group v-model="transconfig.linktype">
                    <el-radio :label="0">软链接</el-radio>
                    <el-radio :label="1">硬链接</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="transconfig.linktype==0" label="软链接前缀">
                <el-input v-model="transconfig.soft_prefix"></el-input>
            </el-form-item>
            <el-form-item label="输出目录">
                <el-input v-model="transconfig.output_folder">
                    <el-button slot="append" icon="el-icon-search" @click="showOutputDialog"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="过滤目录">
                <el-input v-model="transconfig.escape_folder"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="transconfig.mark"></el-input>
            </el-form-item>
            <el-divider>扩展功能</el-divider>
            <el-form-item label="正则重命名" >
                <el-switch
                    v-model="renameflag"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item v-if="renameflag==true" label="修正前缀">
                <el-input v-model="renameprefix" ></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" size="medium" @click="addconf">新增</el-button>
        <el-button type="primary" size="medium" @click="updateconf">更新</el-button>
        <el-button type="danger" size="medium" @click="deleteconf">删除</el-button>
        <el-divider></el-divider>
        <el-button :loading="running" size="medium" type="primary" @click="onSubmit">
            <span v-if="!running">开始转移</span>
            <span v-else>转移中...</span>
        </el-button>
        <el-button v-if="running" type="danger" size="medium" @click="stop">停止</el-button>
        <el-divider></el-divider>

        <el-alert class="alter-tip"
            v-if="running"
            :title="tips"
            :closable="false"
            type="info">
        </el-alert>

        <el-table :data="transferdata" 
                stripe 
                :cell-style="{padding: '0', height: '50px'}" >
            <el-table-column label="原始名称"  min-width="150" :show-overflow-tooltip="true"
                prop="srcname" >
            </el-table-column>
            <el-table-column label="原始地址" min-width="150" :show-overflow-tooltip="true"
                prop="srcpath" >
            </el-table-column>
            <el-table-column label="大小(MB)" width="80"
                prop="srcsize" >
            </el-table-column>
            <el-table-column label="链接路径" min-width="150" :show-overflow-tooltip="true"
                prop="linkpath" >
            </el-table-column>
            <el-table-column label="实际路径" min-width="150" :show-overflow-tooltip="true"
                prop="destpath" >
            </el-table-column>
            <el-table-column label="更新时间" width="155"
                prop="updatetime" >
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

        <FileBrowserDialog
            v-show="isDialogVisible"
            :dialogVisible="isDialogVisible"
            :path.sync="folderPath"
            @close="closeDialog"
            />
    </div>

</template>

<script lang="ts">
import axios from 'axios'
import FileBrowserDialog from './dialogs/FileBrowserDialog.vue';


export default {
    name: 'transfer',
    components: {
      FileBrowserDialog,
    },
    data() {
        return {
            running: false,
            tips: '当前无任务',
            isDialogVisible: false,
            openDialogID: 1,
            folderPath:'',
            renameflag: false,
            renameprefix: "S01E",
            currentPage: 1,
            totalnum: 10,
            pagesize: 10,
            transferdata: [],
            transconfig: {
                // source_folder: '/media/Movies',
                // linktype: 0,
                // soft_prefix: '/volume1/Media/Movies',
                // output_folder: '/media/Emby/Movies',
                // escape_folder: '',
                // mark: '',
                // id: ''
            },
            selectedoption: -1,
            options: [],
        };
    },
    created(){
        console.log('init data')
        this.refresh()
        this.getconfs()
    },
    mounted() {
        this.timer = setInterval(this.refresh, 1500);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        onSubmit() {
            this.transconfig.renameflag = this.renameflag
            this.transconfig.renameprefix = this.renameprefix
            axios.post('/api/transfer',this.transconfig)
                .then(response => {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        stop() {
            axios.get('/api/stopall')
                .then(response => {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        refresh() {
            let pageparam: string = 'page=' + this.currentPage + '&size=' + this.pagesize
            let geturl: string = '/api/transrecord?' + pageparam
            axios.get(geturl)
                .then(response => {
                    this.transferdata = response.data.data
                    this.currentPage = response.data.page
                    this.totalnum = response.data.total

                    this.running = response.data.running
                    if (this.running) {
                        let tasktotal: number = response.data.tasktotal
                        let taskfinished: number = response.data.taskfinished
                        let percentage = taskfinished / tasktotal * 100
                        this.tips = "转移进度: " + percentage.toFixed(2) + '%' + " [" + taskfinished + "/" + tasktotal + "]"
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        handleCurrentChange(num: number){
            this.currentPage = num
        },
        getconfs() {
            let geturl = '/api/transconf/all'
            axios.get(geturl)
                .then(response => {
                    this.options = response.data
                    if(this.selectedoption === -1){
                        this.selectedoption = this.options[0].id;
                    }
                    this.changeConf()
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        changeConf() {
            const config = this.options.find(conf =>{
                return conf.id == this.selectedoption
            });
            if (typeof config === 'undefined') {
                this.selectedoption = this.options[0].id;
                this.transconfig = this.options[0]
                return
            }
            this.transconfig = config
        },
        addconf() {
            axios.post('/api/transconf', this.transconfig)
                .then( res => {
                    this.transconfig = res.data;
                    this.selectedoption = this.transconfig.id;
                    this.getconfs()
                    this.$message({
                        showClose: true,
                        duration: 2000,
                        message: '新增成功',
                        type: 'success'
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        updateconf() {
            axios.put('/api/transconf', this.transconfig)
                .then( res => {
                    this.transconfig = res.data;
                    this.getconfs()
                    this.$message({
                        showClose: true,
                        duration: 2000,
                        message: '更新成功',
                        type: 'success'
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        deleteconf() {
            if (this.options.length < 2) {
                this.$message({
                    showClose: true,
                    duration: 2000,
                    message: '仅剩一份配置无法删除',
                    type: 'success'
                })
                return
            }
            axios.delete('/api/transconf/'+ this.transconfig.id)
                .then( () => {
                    this.getconfs()
                    this.$message({
                        showClose: true,
                        duration: 2000,
                        message: '删除成功',
                        type: 'success'
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        showSourceDialog() {
            this.openDialogID = 1;
            this.isDialogVisible = true;
        },
        showOutputDialog() {
            this.openDialogID = 2;
            this.isDialogVisible = true;
        },
        closeDialog() {
            this.isDialogVisible = false;
            
            if (this.openDialogID === 1) {
                this.transconfig.source_folder = this.folderPath
            }else if (this.openDialogID === 2) {
                this.transconfig.output_folder = this.folderPath
            }
        }
    }
}
</script>

<style scoped>

.body-wrap{
    margin: 15px 5px 5px 5px;
}

.alter-tip {
    margin: 5px;
}

</style>
