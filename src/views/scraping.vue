<template>
    <div class="body-wrap">
        <el-row :gutter="24">
            <el-col :span="12" >
                <el-button :loading="running" size="medium" type="primary" @click="start_all">
                    <span v-if="!running">开始</span>
                    <span v-else>刮削中...</span>
                </el-button>
                <el-button v-if="running" type="danger" size="medium" @click="stop">停止</el-button>
            </el-col>
            <el-col :span="9" >
                 <el-input width='auto' v-model="blur" placeholder="模糊查询"></el-input>
            </el-col>
        </el-row>

        <el-alert class="alter-tip"
            v-if="running"
            :title="tips"
            :closable="false"
            type="info">
        </el-alert>

        <el-table :data="scrapingrecords" 
                stripe 
                :default-sort = "{prop: 'updatetime', order: 'descending'}"
                @sort-change="changesort"
                :cell-style="{padding: '0', height: '50px'}" >
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
                    <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.$index, scope.row)"></el-button>
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

export default {
    name: 'scraping',
    data() {
        return {
            running: false,
            dialogWidth: 0,
            tips: '当前无任务',
            currentPage: 1,
            totalnum: 10,
            pagesize: 10,
            blur: '',
            sortprop: '',
            sortorder: '',
            editdialog: false,
            rowrecord: [],
            scrapingrecords: []
        }
    },
    created(){
        this.setDialogWidth()
    },
    mounted() {
        this.refresh()
        this.timer = setInterval(this.refresh, 1500);
        window.onresize = () => {
            return (() => {
                this.setDialogWidth()
            })()
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        start_all() {
            axios.post('/api/scraping')
                .then(response => {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        handleSingle(index: number, row: ScrapingRecordDto) {
            axios.post('/api/scraping', row)
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
            let geturl = '/api/scrapingrecord?' + pageparam + sortparam + blurparam
            axios.get(geturl)
                .then(response => {
                    this.scrapingrecords = response.data.data
                    this.currentPage = response.data.page
                    this.totalnum = response.data.total

                    this.running = response.data.running
                    if (this.running) {
                        let tasktotal: number = response.data.tasktotal
                        let taskfinished: number = response.data.taskfinished
                        let percentage = taskfinished / tasktotal * 100
                        this.tips = "刮削进度: " + percentage.toFixed(2) + '%' + " [" + taskfinished + "/" + tasktotal + "]"
                    }
                })
                .catch(function (error) {
                    console.log(error);
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
            axios.put('/api/scrapingrecord', this.rowrecord)
                .then(response => {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        handleDelete(index: number, row: ScrapingRecordDto) {
            axios.delete('/api/scrapingrecord/'+ row.id)
                .then(() => {
                    this.$message({
                        showClose: true,
                        duration: 2000,
                        message: '删除成功',
                        type: 'success'
                    })
                })
                .catch(function (error) {
                    this.$message({
                        showClose: true,
                        duration: 2000,
                        message: '删除失败:'+ error,
                        type: 'error'
                    })

                });
        },
        handleCurrentChange(num: number){
            this.currentPage = num
        },
        handleSizeChange(val: number) {
            this.pagesize = val
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
