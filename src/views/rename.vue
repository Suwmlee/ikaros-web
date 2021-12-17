<template>
    <div>
        <el-form label-position="right" label-width="auto" :model="renameconf">
            <el-form-item label="源目录">
                <el-input v-model="renameconf.source_folder">
                    <el-button slot="append" icon="el-icon-search" @click="showDialog"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="链接类型">
                <el-radio-group v-model="renametype">
                    <el-radio :label="0">正则</el-radio>
                    <el-radio :label="1">替换</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="renametype==0" label="自定义">
                <el-input v-model="renameconf.reg" placeholder="输入自定义正则匹配规则，默认使用针对剧集的匹配规则"></el-input>
            </el-form-item>
            <el-form-item v-if="renametype==0" label="修正前缀">
                <el-input v-model="renameconf.prefix" placeholder="默认S01E, 将匹配的 E11或 [11] 修正为 S01E11"></el-input>
            </el-form-item>
            <el-form-item v-if="renametype==0" >
                <el-button type="info" size="medium" @click="preview">预览重命名</el-button>
                <el-button type="primary" size="medium" @click="apply">应用</el-button>
            </el-form-item>

            <el-form-item v-if="renametype==1" label="替换部分">
                <el-input v-model="renameconf.base"></el-input>
            </el-form-item>
            <el-form-item v-if="renametype==1" label="替换后">
                <el-input v-model="renameconf.newfix"></el-input>
            </el-form-item>
            <el-form-item v-if="renametype==1" >
                <el-button type="primary" size="medium" @click="replace">应用</el-button>
            </el-form-item>
        </el-form>
        <el-divider></el-divider>

        <el-table
            :data="prenames"
            style="width: 95%">
            <el-table-column
                prop="original"
                label="原始名字"
                >
            </el-table-column>
            <el-table-column
                prop="rename"
                label="重命名后">
            </el-table-column>
        </el-table>



        <FileBrowserDialog
            v-show="isDialogVisible"
            :dialogVisible="isDialogVisible"
            :path.sync="renameconf.source_folder"
            @close="closeDialog"
            />
    </div>
</template>

<script lang="ts">
import axios from 'axios'
import FileBrowserDialog from '../components/dialogs/FileBrowserDialog.vue'
    
export default {
    name: 'rename',
    components: {
      FileBrowserDialog,
    },
    data() { 
        return {
            isDialogVisible: false,
            prenames: [],
            renametype: 0,
            renameconf: {
                source_folder: 'E:\\Entertaiment\\ACG\\Animes',
                reg: '',
                prefix: '',
                ext_type: '',
                base: '',
                newfix: ''
            }
        };
    },
    methods: {
        preview() {
            axios.post('/api/previewrename',this.renameconf)
                .then(response => {
                    this.prenames = response.data
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        apply() {
            this.fixnames = "",
            this.prenames = "",
            axios.post('/api/renamebyreg',this.renameconf)
                .then(response => {
                    for(var i in response.data.prefix){  
                        let fix: string= i + "."+ response.data.prefix[i];  
                        this.fixnames += fix + "\r\n"; 
                    } 
                    for(var j in response.data.todo){ 
                        var src = j + "."+ response.data.todo[j];  
                        this.prenames += src + "\r\n"; 
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        replace() {
            axios.post('/api/renamebyrep',this.renameconf)
                .then(response => {
                    console.log(response)
                    this.$message({
                        showClose: true,
                        duration: 2000,
                        message: '重命名成功',
                        type: 'success'
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        showDialog() {
            this.isDialogVisible = true;
        },
        closeDialog() {
            this.isDialogVisible = false;
        }
    }
}
</script>
