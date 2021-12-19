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
            <el-form-item label="修正剧集名" >
                <el-switch
                    v-model="transconfig.fix_series"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item v-if="transconfig.fix_series" label="指定内容">
                <el-input v-model="transconfig.specified_files" placeholder="可针对源目录下的特定文件(夹)"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="transconfig.mark"></el-input>
            </el-form-item>
            <el-divider>扩展功能</el-divider>
            <el-form-item label="刷新emby">
                <el-input v-model="transconfig.refresh_url" placeholder="完整的刷新emby库链接"></el-input>
                <a href="https://emby.media/community/index.php?/topic/50862-trigger-a-library-rescan-via-cmd-line/&do=findComment&comment=487929">参考链接</a>
            </el-form-item>
            <el-form-item label="删除其他">
                <el-switch
                    v-model="transconfig.clean_others"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item label="移除中文">
                <el-switch
                    v-model="transconfig.replace_CJK"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
        </el-form>
        <el-button type="primary" size="medium" @click="addconf">新增</el-button>
        <el-button type="primary" size="medium" @click="updateconf">更新</el-button>
        <el-button type="danger" size="medium" @click="deleteconf">删除</el-button>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="12" >
                <el-button :loading="running" size="medium" type="primary" @click="onSubmit">
                    <span v-if="!running">开始</span>
                    <span v-else>转移中...</span>
                </el-button>
                <el-button v-if="running" type="danger" size="medium" @click="stop">停止</el-button>
            </el-col>
            <el-col :span="9" >
                <el-input width='auto' placeholder="模糊查询"></el-input>
            </el-col>
            <el-col :span="1" :offset="1">
                <el-button v-if="multipleSelection.length > 0" type="danger" size="medium" @click="delrecords">删除</el-button>
            </el-col>
        </el-row>
        <el-alert class="alter-tip"
            v-if="running"
            :title="tips"
            :closable="false"
            type="info">
        </el-alert>

        <el-table :data="transferdata"
                ref="multipleTable"
                stripe
                @selection-change="handleSelectionChange"
                :cell-style="{padding: '0', height: '50px'}" >
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column label="原始名称"  min-width="150" :show-overflow-tooltip="true"
                prop="srcname" >
            </el-table-column>
            <el-table-column label="原始地址" min-width="150" :show-overflow-tooltip="true"
                prop="srcpath" >
            </el-table-column>
            <!-- <el-table-column label="大小(MB)" width="80"
                prop="srcsize" >
            </el-table-column> -->
            <el-table-column label="状态" width="80"
                sortable="custom"
                prop="status" >
                <template slot-scope="scope">
                    <span v-if="scope.row.status===0" ></span>
                    <span v-if="scope.row.status===1" >锁定</span>
                    <span v-if="scope.row.status===2" >忽略</span>
                </template>
            </el-table-column>
            <el-table-column label="剧集" width="80"
                prop="isepisode" >
                <template slot-scope="scope">
                    <span v-if="scope.row.isepisode===true" >是</span>
                    <span v-if="scope.row.isepisode===false" ></span>
                </template>
            </el-table-column>
            <el-table-column label="季" width="80"
                prop="season" >
                 <template slot-scope="scope">
                    <span v-if="scope.row.season===-1" ></span>
                    <span v-if="scope.row.season > -1" >{{scope.row.season}}</span>
                </template>
            </el-table-column>
            <el-table-column label="集数" width="80"
                prop="episode" >
                 <template slot-scope="scope">
                    <span v-if="scope.row.episode===-1" ></span>
                    <span v-if="scope.row.episode > -1" >{{scope.row.episode}}</span>
                </template>
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
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :page-size="10"
            :page-sizes="[10, 20, 50, 100]"
            :pager-count="7"
            :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="sizes, prev, pager, next"
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
import FileBrowserDialog from '../components/dialogs/FileBrowserDialog.vue';


export default {
    name: 'transfer',
    components: {
      FileBrowserDialog,
    },
    data() {
        return {
            running: false,
            timerstatus: 0,
            tips: '当前无任务',
            isDialogVisible: false,
            openDialogID: 1,
            folderPath:'',
            currentPage: 1,
            totalnum: 10,
            pagesize: 10,
            transferdata: [],
            transconfig: {},
            selectedoption: -1,
            options: [],
            multipleSelection: [],
            dialogVisible: false
        };
    },
    created(){
        this.starttimer()
        this.getconfs()
    },
    beforeDestroy() {
        this.stoptimer()
    },
    methods: {
        onSubmit() {
            this.starttimer()
            axios.post('/api/transfer',this.transconfig)
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
                        console.log(this.tips)
                        if (this.timerstatus === 0) {
                            this.starttimer()
                        }
                    }else{
                        this.stoptimer()
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    this.stoptimer()
                });
        },
        starttimer(){
            if (this.timerstatus === 0) {
                this.timer = setInterval(this.refresh, 1500);
                this.timerstatus = 1
            }
        },
        stoptimer(){
            clearInterval(this.timer)
            this.timerstatus = 0
        },
        delrecords() {
            var ids = new Array();
            this.multipleSelection.forEach((item) => {
                ids.push(item.id);
            });
            axios.delete('/api/transfer/record', {data:ids})
                .then( () => {
                    this.$message({
                        showClose: true,
                        duration: 2000,
                        message: '清理成功',
                        type: 'success'
                    })
                    this.refresh()
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        handleCurrentChange(num: number){
            this.currentPage = num
            this.refresh()
        },
        handleSizeChange(val: number) {
            this.pagesize = val
            this.refresh()
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
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleEdit(index: number, row) {
            console.log(row)
        },
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
