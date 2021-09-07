<template>
    <div class="body-wrap">
        <pre>
        transmission 种子下载完成后执行脚本:

        #!/bin/bash
        TR_DOWNLOADS="$TR_TORRENT_DIR/$TR_TORRENT_NAME"
        wget "http://localhost:12346/api/client?path=$TR_DOWNLOADS"
        </pre>
        <el-form label-position="right" label-width="auto" :model="settings">
            <el-form-item label="源前缀">
                <el-input v-model="settings.original" placeholder="需要替换的前缀"></el-input>
            </el-form-item>
            <el-form-item label="更改前缀">
                <el-input v-model="settings.prefixed" placeholder="前缀"></el-input>
            </el-form-item>
            <el-form-item label="刮削目录">
                <el-input v-model="settings.scrapingfolders" placeholder="以;间隔"></el-input>
            </el-form-item>
            <el-form-item label="转移目录">
                <el-input v-model="settings.transferfolders" placeholder="以;间隔"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="settings.mark" placeholder="备注"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">应用</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script lang="ts">
import axios from 'axios'

export default {
    name: 'autoconf',
    data() { 
        return {
            settings: {}
        };
    },
    mounted(){
        axios.get('/api/autoconf')
            .then(response => {
                console.log(response)
                this.settings = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    methods: {
        onSubmit() {
            axios.post('/api/autoconf',this.settings)
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
    }

}
</script>

<style scoped>

.body-wrap{
    margin: 15px 5px 5px 5px;
}

</style>
