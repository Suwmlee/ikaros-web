<template>
    <div>
        <el-form label-position="formlocation" label-width="150px" :model="settings">
            <el-form-item label="输出模式" >
                <el-radio-group v-model="mode">
                    <el-radio :label="1">PT模式(软链接)</el-radio>
                    <el-radio :label="2">正常模式(移动文件)</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="软链接前缀">
                <el-input v-model="settings.soft_prefix"></el-input>
            </el-form-item>
            <el-form-item label="刮削目录">
                <el-input v-model="settings.scrape_folder"></el-input>
            </el-form-item>
            <el-form-item label="输出目录">
                <el-input v-model="settings.success_folder"></el-input>
            </el-form-item>
            <el-form-item label="目录规则">
                <el-input v-model="settings.location_rule"></el-input>
            </el-form-item>
            <el-form-item label="命名规则">
                <el-input v-model="settings.naming_rule"></el-input>
            </el-form-item>
            <el-form-item label="代理开关" >
                <el-radio-group v-model="settings.proxy_enable">
                    <el-radio :label="true">启用</el-radio>
                    <el-radio :label="false">关闭</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="类型">
                <el-input v-model="settings.proxy_type"></el-input>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="settings.proxy_address"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">应用</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'setting',
    data() { 
        return {
            mode: 1,
            settings: {
                soft_link: true,
                soft_prefix: '',
                scrape_folder: '',
                success_folder: '',
                failed_folder: '',
                location_rule: '',
                naming_rule: '', 
                proxy_enable: '',
                proxy_type: '',
                proxy_address: ''
            }
        };
    },
    mounted(){
        axios.get('/api/setting')
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
            axios.post('/api/setting',this.settings)
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
        }
    }

}
</script>