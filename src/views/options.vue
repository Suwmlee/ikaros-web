<template>
    <div class="body-wrap">
        <el-form label-position="right" label-width="auto" >
           <el-form-item label="日志等级">
                <el-radio-group v-model="loglevel" @change="onSubmit">
                    <el-radio class="radio-btn" :label="10">DEBUG</el-radio>
                    <el-radio class="radio-btn" :label="20">INFO</el-radio>
                    <el-radio class="radio-btn" :label="30">WARNING</el-radio>
                    <el-radio class="radio-btn" :label="40">ERROR</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div >
            <el-button type="primary" @click="cleandata">清理</el-button>
            <div slot="tip" class="el-upload__tip">清理源文件已不存在的记录</div>
        </div>
        <el-divider />
        <div >
            <el-button type="primary" @click="exportdb" >导出JAV记录</el-button>
        </div>
        <el-divider />
        <div class="div-upload">
            <el-upload
                ref="upload"
                action="/api/options/importjav"
                :file-list="fileList"
                :multiple="multifile"
                :auto-upload="false">
                <el-button slot="trigger" type="primary">选择</el-button>
                <el-button style="margin-left: 10px;" type="success" @click="submitUpload">导入JAV记录</el-button>
                <div slot="tip" class="el-upload__tip">只能导入xls/xlsx文件</div>
            </el-upload>
        </div>

        <div class="row">
            <h2 >日志:</h2>
            <div class="logging_window">
                <pre id="output"></pre>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import axios from 'axios'

export default {
    name: 'options',
    data() { 
        return {
            loglevel: 20,
            fileList: [],
            multifile: false
        };
    },
    mounted(){
        axios.get('/api/options/loglevel')
            .then(response => {
                this.loglevel = response.data.loglevel;
            })
            .catch(function (error) {
                console.log(error);
            });

        var output = document.getElementById('output');
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/options/logstream', true);
        xhr.send();
        setInterval(function() {
          output.textContent = xhr.responseText;
        }, 500);
    },
    methods: {
        onSubmit() {
            const data = {loglevel: this.loglevel};
            axios.put('/api/options/loglevel', data)
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
        submitUpload() {
            this.$refs.upload.submit();
        },
        exportdb(){
            window.location.href = '/api/options/exportjav';
        },
        cleandata(){
            axios.get('/api/options/cleanrecord')
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

.radio-btn {
    margin: 8px auto;
    width: 100px;
}

.div-upload{
    width: 300px;
}

.logging_window{
    display: block;
    padding: 9.5px;
    font-size: 13px;
    line-height: 1.42857143;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    margin: auto;
}

pre {    
    height: auto;
    max-height: 800px;
    overflow: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
}

</style>
