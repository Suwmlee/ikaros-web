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
        <el-form label-position="right" label-width="auto" :model="scrapingconfig">
            <el-form-item label="备注名">
                <el-input v-model="scrapingconfig.remark"></el-input>
            </el-form-item>
            <el-form-item label="刮削目录">
                <el-input v-model="scrapingconfig.scraping_folder">
                    <el-button slot="append" icon="el-icon-search" @click="showSourceDialog"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="输出模式" >
                <el-radio-group v-model="mode">
                    <el-radio class="radio-btn" :label="1">软链接</el-radio>
                    <el-radio class="radio-btn" :label="2">硬链接</el-radio>
                    <el-radio class="radio-btn" :label="3">移动文件</el-radio>
                    <el-radio class="radio-btn" :label="4">直接刮削</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="mode==1" label="软链接前缀">
                <el-input v-model="scrapingconfig.soft_prefix"></el-input>
            </el-form-item>
            <el-form-item v-if="mode!=4" label="输出目录">
                <el-input v-model="scrapingconfig.success_folder">
                    <el-button slot="append" icon="el-icon-search" @click="showOutputDialog"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item v-if="mode==1 || mode == 2" label="失败目录">
                <el-input v-model="scrapingconfig.failed_folder">
                    <el-button slot="append" icon="el-icon-search" @click="showFailedDialog"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="跳过目录">
                <el-input v-model="scrapingconfig.escape_folders"></el-input>
            </el-form-item>
            <el-form-item label="大小限制">
                <el-input v-model="scrapingconfig.escape_size" placeholder="忽略小于此值的文件,单位:MB。设置为0则不限制"></el-input>
            </el-form-item>
            <el-form-item label="目录规则">
                <el-input v-model="scrapingconfig.location_rule"></el-input>
            </el-form-item>
            <el-form-item label="命名规则">
                <el-input v-model="scrapingconfig.naming_rule"></el-input>
            </el-form-item>
            <el-form-item label="刮削源">
                <el-input v-model="scrapingconfig.site_sources" placeholder="默认顺序:javbus,airav,fanza,xcity,javdb,mgstage,madou,fc2,avsox,dlsite,carib,fc2club"></el-input>
            </el-form-item>
            <el-form-item label="Javdb">
                <el-input v-model="scrapingconfig.cookies_javdb" placeholder="Javdb Cookies(有效期7天)"></el-input>
            </el-form-item>
            <el-form-item label="Javlib">
                <el-input v-model="scrapingconfig.cookies_javlib" placeholder="Javlib Cookies"></el-input>
            </el-form-item>
            <el-form-item label="刷新Emby">
                <el-input v-model="scrapingconfig.refresh_url" placeholder="Emby库刷新链接,查看说明文档"></el-input>
            </el-form-item>

            <el-form-item label="添加水印" >
                <el-switch
                    v-model="scrapingconfig.watermark_enable"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item v-if="scrapingconfig.watermark_enable==true" label="水印大小">
                <el-input type="Number" v-model="scrapingconfig.watermark_size" placeholder="添加的水印相对整图的比例 1/size " ></el-input>
            </el-form-item>
            <el-form-item v-if="scrapingconfig.watermark_enable==true" label="水印位置">
                <el-input type="Number" v-model="scrapingconfig.watermark_location" placeholder="右上:0 左上:1 左下:2 右下:3"></el-input>
            </el-form-item>

            <el-form-item label="下载剧照" >
                <el-switch
                    v-model="scrapingconfig.extrafanart_enable"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item v-if="scrapingconfig.extrafanart_enable==true" label="剧照文件夹">
                <el-input v-model="scrapingconfig.extrafanart_folder"></el-input>
            </el-form-item>

            <el-form-item label="刮削顺序" >
                <el-switch
                    active-text="同时使用多个源"
                    inactive-text="按照顺序"
                    v-model="scrapingconfig.async_request"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item label="使用代理" >
                <el-switch
                    v-model="scrapingconfig.proxy_enable"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item v-if="scrapingconfig.proxy_enable==true" label="类型">
                <el-input v-model="scrapingconfig.proxy_type"></el-input>
            </el-form-item>
            <el-form-item v-if="scrapingconfig.proxy_enable==true" label="地址">
                <el-input v-model="scrapingconfig.proxy_address"></el-input>
            </el-form-item>
            <el-form-item label="超时">
                <el-input v-model="scrapingconfig.proxy_timeout"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="addconf">新增</el-button>
                <el-button type="primary" size="medium" @click="updateconf">更新</el-button>
                <el-button type="danger" size="medium" @click="deleteconf">删除</el-button>
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
import FileBrowserDialog from '../components/dialogs/FileBrowserDialog.vue';

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
            scrapingconfig: {},
            selectedoption: -1,
            options: [],
        };
    },
    mounted(){
        this.getconfs()
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
                this.scrapingconfig = this.options[0]
                return
            }
            this.scrapingconfig = config
            if (this.scrapingconfig.main_mode === 3) {
                this.mode = 4
            }else{
                if (this.scrapingconfig.link_type === 1) {
                    this.mode = 1
                }else if (this.scrapingconfig.link_type === 2) {
                    this.mode = 2
                }else{
                    this.mode = 3
                }
            }
        },
        addconf() {
            if (this.mode === 1) {
                this.scrapingconfig.link_type = 1
                this.scrapingconfig.main_mode = 1
            } else if (this.mode === 2) {
                this.scrapingconfig.link_type = 2
                this.scrapingconfig.main_mode = 1
            } else if (this.mode === 3) {
                this.scrapingconfig.link_type = 0
                this.scrapingconfig.main_mode = 1
            } else if (this.mode === 4) {
                this.scrapingconfig.main_mode = 3
            }
            axios.post('/api/scraping/conf', this.scrapingconfig)
                .then( res => {
                    this.scrapingconfig = res.data;
                    this.selectedoption = this.scrapingconfig.id;
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
            if (this.mode === 1) {
                this.scrapingconfig.link_type = 1
                this.scrapingconfig.main_mode = 1
            } else if (this.mode === 2) {
                this.scrapingconfig.link_type = 2
                this.scrapingconfig.main_mode = 1
            } else if (this.mode === 3) {
                this.scrapingconfig.link_type = 0
                this.scrapingconfig.main_mode = 1
            } else if (this.mode === 4) {
                this.scrapingconfig.main_mode = 3
            }
            axios.put('/api/scraping/conf',this.scrapingconfig)
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
            axios.delete('/api/scraping/conf/'+ this.scrapingconfig.id)
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
        showFailedDialog() {
            this.openDialogID = 3;
            this.isDialogVisible = true;
        },
        closeDialog() {
            this.isDialogVisible = false;

            if (this.openDialogID === 1) {
                this.scrapingconfig.scraping_folder = this.folderPath
            }else if (this.openDialogID === 2) {
                this.scrapingconfig.success_folder = this.folderPath
            }else if (this.openDialogID === 3) {
                this.scrapingconfig.failed_folder = this.folderPath
            }
        }
    }

}
</script>

<style scoped>

.body-wrap{
    margin: 15px 5px 5px 5px;
}

.radio-btn {
    margin: 8px auto;
    width: 100px;
}

</style>
