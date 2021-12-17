<template>
    <div class="body-wrap">
        <div >
            <el-button type="primary" @click="cleandata">清理</el-button>
            <div slot="tip" class="el-upload__tip">清理源文件已不存在的记录</div>
        </div>
        <el-divider />
        <div >
            <el-button type="primary" @click="exportdb" >导出</el-button>
        </div>
        <el-divider />
        <div class="div-upload">
            <el-upload 
                ref="upload"
                action="/api/import"
                :file-list="fileList"
                :multiple="multifile"
                :auto-upload="false">
                <el-button slot="trigger" type="primary">选择记录</el-button>
                <el-button style="margin-left: 10px;" type="success" @click="submitUpload">导入</el-button>
                <div slot="tip" class="el-upload__tip">只能导入xls/xlsx文件</div>
            </el-upload>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios'

export default {
    name: 'scrapingbak',
    data() {
        return {
            fileList: [],
            multifile: false
        };
    },
    methods: {
        submitUpload() {
            this.$refs.upload.submit();
        },
        exportdb(){
            window.location.href = '/api/export';
        },
        cleandata(){
            axios.get('/api/cleandb')
                .then(response => {
                    console.log(response)
                    this.$message({
                        showClose: true,
                        duration: 2000,
                        message: '清理成功',
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

<style scoped>

.body-wrap{
    margin: 15px 5px 5px 5px;
}

.div-upload{
    width: 300px;
}

</style>
