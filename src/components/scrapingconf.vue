<template>
    <div>
        <el-form label-position="formlocation" label-width="80px" :model="settings">
            <el-form-item label="刮削目录">
                <el-input v-model="settings.scraping_folder">
                    <el-button slot="append" icon="el-icon-search" @click="showSourceDialog"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="输出模式" >
                <el-radio-group v-model="mode">
                    <el-radio :label="1">软链接</el-radio>
                    <el-radio :label="2">正常(移动文件)</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="mode==1" label="软链接前缀">
                <el-input v-model="settings.soft_prefix"></el-input>
            </el-form-item>
            <el-form-item label="输出目录">
                <el-input v-model="settings.success_folder">
                    <el-button slot="append" icon="el-icon-search" @click="showOutputDialog"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="目录规则">
                <el-input v-model="settings.location_rule"></el-input>
            </el-form-item>
            <el-form-item label="命名规则">
                <el-input v-model="settings.naming_rule"></el-input>
            </el-form-item>

            <el-form-item label="水印开关" >
                <el-switch
                    v-model="settings.watermark_enable"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item v-if="settings.watermark_enable==true" label="水印大小">
                <el-input type="Number" v-model="settings.watermark_size" placeholder="添加的水印相对整图的比例 1/size " ></el-input>
            </el-form-item>
            <el-form-item v-if="settings.watermark_enable==true" label="水印位置">
                <el-input type="Number" v-model="settings.watermark_location" placeholder="右上 0, 左上 1, 左下 2，右下 3"></el-input>
            </el-form-item>

            <el-form-item label="代理开关" >
                <el-switch
                    v-model="settings.proxy_enable"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item v-if="settings.proxy_enable==true" label="类型">
                <el-input v-model="settings.proxy_type"></el-input>
            </el-form-item>
            <el-form-item v-if="settings.proxy_enable==true" label="地址">
                <el-input v-model="settings.proxy_address"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">应用</el-button>
            </el-form-item>
        </el-form>

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
    name: 'scrapingconf',
    components: {
      FileBrowserDialog,
    },
    data() { 
        return {
            isDialogVisible: false,
            openDialogID: 1,
            folderPath:'',
            mode: 1,
            settings: {}
        };
    },
    mounted(){
        axios.get('/api/scrapingconf')
            .then(response => {
                console.log(response)
                this.settings = response.data;
                if (response.data.soft_link) {
                    this.mode = 1
                }else{
                    this.mode = 2
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    methods: {
        onSubmit() {
            if (this.mode === 1) {
                this.settings.soft_link = true       
            } else if (this.mode === 2) {
                this.settings.soft_link = false
            } 
            axios.post('/api/scrapingconf',this.settings)
                .then( () => {
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
                this.settings.scraping_folder = this.folderPath
            }else if (this.openDialogID === 2) {
                this.settings.success_folder = this.folderPath
            }
        }
    }

}
</script>