<template>
    <div class="body-wrap">
         <el-select v-model="selectedoption"
                @change="changeConf"
                placeholder="请选择配置">
            <el-option v-for="item in options"
                    :key="item.id"
                    :label="item.remark"
                    :value="item.id">
            </el-option>
        </el-select>
        <el-divider></el-divider>
        <el-row :gutter="24">
            <el-col :span="12" >
                <el-button :loading="running" size="medium" type="primary" @click="start_all">
                    <span v-if="!running">开始</span>
                    <span v-else>刮削中...</span>
                </el-button>
                <el-button v-if="running" type="danger" size="medium" @click="stop">停止</el-button>
            </el-col>
            <el-col :md="8" >
                <el-input width='auto' v-model="blur" @input="handleSearch" placeholder="模糊查询"></el-input>
            </el-col>
            <el-col :md="3" :xs="10">
                <el-button-group>
                    <el-button :disabled="multipleSelection.length === 0" icon="el-icon-delete" type="danger" @click="delrecords"></el-button>
                </el-button-group>
                <confirm-dialog title="确认" message="删除刮削后的文件" subConfirmMessage="同时删除原始文件" ref="confirm"></confirm-dialog>
            </el-col>
        </el-row>

        <el-alert class="alter-tip"
            v-if="running"
            :title="tips"
            :closable="false"
            type="info">
        </el-alert>

        <el-table :data="scrapingrecords"
                ref="multipleTable"
                stripe
                @selection-change="handleSelectionChange"
                @sort-change="changesort"
                :default-sort = "{prop: 'updatetime', order: 'descending'}"
                :cell-style="{padding: '0', height: '50px'}" >
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column label="原始名称" min-width="150" :show-overflow-tooltip="true"
                prop="srcname" >
            </el-table-column>
            <el-table-column label="原始地址" min-width="150" :show-overflow-tooltip="true"
                prop="srcpath" >
            </el-table-column>
            <el-table-column label="大小(MB)" width="80" 
                prop="srcsize" >
            </el-table-column>
            <el-table-column label="状态" width="80"
                sortable="custom"
                prop="status" >
                <template slot-scope="scope">
                    <span v-if="scope.row.status===0" >未刮削</span>
                    <span v-if="scope.row.status===1" >完成</span>
                    <span v-if="scope.row.status===2" >失败</span>
                    <span v-if="scope.row.status===3" >忽略</span>
                    <span v-if="scope.row.status===4" >进行中</span>
                </template>
            </el-table-column>
            <el-table-column label="刮削用番号" min-width="120" :show-overflow-tooltip="true"
                prop="scrapingname" >
            </el-table-column>
            <el-table-column label="中文" width="100"
                sortable="custom"
                prop="cnsubtag" >
                <template slot-scope="scope">
                    <span v-if="scope.row.cnsubtag===true" >是</span>
                    <span v-if="scope.row.cnsubtag===false" ></span>
                </template>
            </el-table-column>
            <el-table-column label="分集编号" min-width="80" :show-overflow-tooltip="true"
                prop="cdnum">
                <template slot-scope="scope">
                    <span v-if="scope.row.cdnum" v-text="scope.row.cdnum"></span>
                </template>
            </el-table-column>
            <el-table-column label="刮削后路径" min-width="150" :show-overflow-tooltip="true"
                prop="destpath" >
            </el-table-column>
            <el-table-column label="更新时间" width="155"
                sortable="custom"
                prop="updatetime">
            </el-table-column>
            <el-table-column label="删除时间" width="155"
                prop="deadtime">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-refresh-right"
                    @click="handleSingle(scope.$index, scope.row)"></el-button>
                    <el-button
                    size="mini"
                    icon="el-icon-edit"
                    @click="handleEdit(scope.$index, scope.row)"></el-button>
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

        <el-dialog :close-on-click-modal="false" :visible.sync="editdialog" :width="dialogWidth">
            <el-form :model="rowrecord" label-width="auto">
                <el-form-item label="原始名称" prop="srcname">
                    <span v-text="rowrecord.srcname" />
                </el-form-item>
                <el-form-item label="原始地址" prop="srcpath">
                    <span v-text="rowrecord.srcpath" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="rowrecord.status">
                        <el-radio class="radio-btn" :label="0">未刮削</el-radio>
                        <el-radio class="radio-btn" :label="1">完成</el-radio>
                        <el-radio class="radio-btn" :label="2">失败</el-radio>
                        <el-radio class="radio-btn" :label="3">忽略</el-radio>
                    </el-radio-group>
                    <div class="tip-info" >如需重新刮削,请修改状态为: 未刮削;将使用页面选择的刮削配置</div>
                </el-form-item>
                <el-form-item label="刮削番号" prop="scrapingname">
                    <el-input v-model="rowrecord.scrapingname" />
                    <div class="tip-info" >强制使用此番号刮削</div>
                </el-form-item>
                <el-form-item label="中文标记" prop="cnsubtag">
                    <el-switch
                        v-model="rowrecord.cnsubtag"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="流出标记" prop="leaktag">
                    <el-switch
                        v-model="rowrecord.leaktag"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="无码标记" prop="uncensoredtag">
                    <el-switch
                        v-model="rowrecord.uncensoredtag"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="破解标记" prop="hacktag">
                    <el-switch
                        v-model="rowrecord.hacktag"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="分集编号" prop="cdnum">
                    <el-input type="number" v-model="rowrecord.cdnum" :min="0"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="dialogexit()">取消</el-button>
                <el-button type="primary" @click="dialogupdate()" >修改</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import axios from 'axios'
import {ScrapingRecordDto} from '../types/ika-record'
import ConfirmDialog from '../components/dialogs/ConfirmDialog.vue'

export default {
    name: 'scraping',
    components:{
        ConfirmDialog
    },
    data() {
        return {
            running: false,
            timer:null,
            timerstatus: 0,
            dialogWidth: 0,
            tips: '刮削中',
            currentPage: 1,
            totalnum: 10,
            pagesize: 10,
            blur: '',
            sortprop: '',
            sortorder: '',
            editdialog: false,
            rowrecord: [],
            scrapingrecords: [],
            multipleSelection: [],
            selectedoption: -1,
            options: [],
            scrapingconfig: {},
        }
    },
    created(){
        this.setDialogWidth()
    },
    mounted() {
        this.getconfs()
        this.refresh()
        window.onresize = () => {
            return (() => {
                this.setDialogWidth()
            })()
        }
    },
    beforeDestroy() {
        this.stoptimer()
    },
    methods: {
        getconfs() {
            let geturl = '/api/scraping/conf/all'
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
                return
            }
            this.scrapingconfig = config
        },
        start_all() {
            this.running = true;
            this.starttimer()
            axios.post('/api/scraping', this.scrapingconfig)
                .then(response => {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        handleSingle(index: number, row: ScrapingRecordDto) {
            this.running = true;
            this.starttimer()
            row.configid = this.scrapingconfig.id
            axios.post('/api/scraping/single', row)
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
        changesort(sortProps: any){
            this.sortprop = sortProps.prop
            this.sortorder = sortProps.order
        },
        refresh() {
            let pageparam: string = 'page=' + this.currentPage + '&size=' + this.pagesize
            let sortparam = '&sortprop=' + this.sortprop + '&sortorder=' + this.sortorder
            let blurparam = '&blur=' + this.blur 
            let geturl = '/api/scraping/record?' + pageparam + sortparam + blurparam
            axios.get(geturl)
                .then(response => {
                    this.timerstatus = 0;
                    this.scrapingrecords = response.data.data
                    this.currentPage = response.data.page
                    this.totalnum = response.data.total

                    this.running = response.data.running
                    if (this.running) {
                        let tasktotal: number = response.data.tasktotal
                        let taskfinished: number = response.data.taskfinished
                        let percentage = taskfinished / tasktotal * 100
                        this.tips = "刮削进度: " + percentage.toFixed(2) + '%' + " [" + taskfinished + "/" + tasktotal + "]"

                        this.starttimer()
                    }else{
                        this.stoptimer()
                    }
                })
                .catch(function(error) {
                    console.log(error);
                    this.timerstatus = 0;
                    this.starttimer()
                }.bind(this));
        },
        starttimer(){
            if (this.timerstatus === 0) {
                this.timer = setTimeout(function() {this.refresh()}.bind(this), 2000)
                this.timerstatus = 1
            }
        },
        stoptimer(){
            clearInterval(this.timer)
            this.timer = null;
            this.timerstatus = 0
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
        handleSearch(){
            this.refresh()
        },
        delrecords() {
            this.$refs.confirm
            .show()
            .then(() => {
                // alert(this.$refs.confirm.subcheck)
                var delsrc =this.$refs.confirm.subcheck
                var ids = new Array();
                this.multipleSelection.forEach((item) => {
                    ids.push(item.id);
                });
                const del = {'ids': ids, 'delsrc': delsrc}
                axios.delete('/api/scraping/record', {data: del})
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
                })
                .catch(() => {
                    console.log("You rejected");
                });
        },
        handleEdit(index: number, row: ScrapingRecordDto) {
            this.rowrecord = row;
            this.editdialog = true
        },
        dialogexit() {
            this.editdialog = false
        },
        dialogupdate() {
            this.editdialog = false
            axios.put('/api/scraping/record', this.rowrecord)
                .then(response => {
                    this.refresh()
                    console.log(response)
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
        setDialogWidth() {
            // console.log(document.body.clientWidth)
            var val = document.body.clientWidth
            const def = 700
            if (val < def) {
                this.dialogWidth = '90%'
            } else {
                this.dialogWidth = def + 'px'
            }
        },
    }
}
</script>

<style scoped>

.body-wrap{
    margin: 15px 5px 5px 5px;
}
.el-col {
    border-radius: 4px;
}

.alter-tip {
    margin: 5px;
}

.radio-btn {
    margin: 8px auto;
    width: 100px;
}

.tip-info {
    color: gray;
    margin-top: 3px;
    font-size: 12px;
    line-height: normal;
}
</style>
