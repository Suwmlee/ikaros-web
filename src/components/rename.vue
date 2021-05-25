<template>
    <div>
        <el-form label-position="right" label-width="150px" :model="renameconf">
            <el-form-item label="源目录">
                <el-input v-model="renameconf.source_folder">
                    <el-button slot="append" icon="el-icon-search" @click="showDialog"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="正则">
                <el-input v-model="renameconf.reg"></el-input>
            </el-form-item>
            <el-form-item label="备选正则">
                <el-input v-model="renameconf.reg2"></el-input>
            </el-form-item>
            <el-form-item label="修正前缀">
                <el-input v-model="renameconf.prefix"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="preview">预览</el-button>
                <el-button type="danger" size="medium" @click="apply">应用</el-button>
            </el-form-item>
        </el-form>
        <el-divider></el-divider>
                
        <el-row>
            <el-col :span="10">
                <div class="grid-content">
                   <el-input
                        readonly
                        type="textarea"
                        :rows="2"
                        style="white-space: pre-line;"
                        v-text="prenames"
                        >
                    </el-input>
                </div>
            </el-col>
            <el-col :span="4"><div class="grid-content">
                   <i class="el-icon-mobile-phone"></i>
                </div></el-col>
            <el-col :span="10"><div class="grid-content">
                   <el-input
                        readonly
                        type="textarea"
                        style="white-space: pre-line;"
                        v-text="fixnames"
                        >
                    </el-input>
                </div></el-col>
        </el-row>

        <FileBrowserDialog
            v-show="isDialogVisible"
            :dialogVisible="isDialogVisible"
            :path.sync="renameconf.source_folder"
            @close="closeDialog"
            />
    </div>
</template>

<script>
import axios from 'axios'
import FileBrowserDialog from './dialogs/FileBrowserDialog';

export default {
    name: 'rename',
    components: {
      FileBrowserDialog,
    },
    data() { 
        return {
            isDialogVisible: false,
            prenames: "",
            fixnames: "",
            renameconf: {
                source_folder: 'E:\\Entertaiment\\ACG\\Animes',
                reg: '[\\[第 ][0-9.svidevoa\\(\\)]*[\\]話话 ]',
                reg2: '\\.e[0-9videvoa\\(\\)]{1,}[.]',
                prefix: 'S01E',
                ext_type: '',
            }
        };
    },
    methods: {
        preview() {
            this.fixnames = "",
            this.prenames = "",
            axios.post('/api/previewrename',this.renameconf)
                .then(response => {
                    for(var i in response.data.prefix){  
                        var fix= i + "."+ response.data.prefix[i];  
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
        apply() {
            this.fixnames = "",
            this.prenames = "",
            axios.post('/api/renamebyreg',this.renameconf)
                .then(response => {
                    for(var i in response.data.prefix){  
                        var fix= i + "."+ response.data.prefix[i];  
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
        showDialog() {
            this.isDialogVisible = true;
        },
        closeDialog() {
            this.isDialogVisible = false;
        }
    }
}
</script>
