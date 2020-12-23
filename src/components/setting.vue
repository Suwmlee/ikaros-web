<template>
    <div>
        <el-form :label-position="formlocation" label-width="150px" :model="settings">
            <el-form-item label="输出模式">
                <el-radio v-model="settings.mode" label="1">PT模式(软链接)</el-radio>
                <el-radio v-model="settings.mode" label="2">正常模式(移动文件)</el-radio>
            </el-form-item>
            <el-form-item label="软链接前缀">
                <el-input v-model="settings.soft_prefix"></el-input>
            </el-form-item>
            <el-form-item label="刮削目录">
                <el-input v-model="settings.scraper_folder"></el-input>
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
            formlocation: 'right',
            settings: {
                mode: '1',
                soft_prefix: '',
                scraper_folder: '',
                success_folder: '',
                failed_folder: '',
                location_rule: '',
                naming_rule: '',
            }
        };
    },
    mounted(){
        axios
            .get('http://localhost:12346/api/setting')
            .then(response => (this.settings = response))
            .catch(function (error) {
                console.log(error);
            });
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        }
    }

}
</script>