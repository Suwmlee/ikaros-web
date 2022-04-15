<template>
    <div class="body-wrap">
        <el-form label-position="right" label-width="auto" >
           <el-form-item label="日志等级">
                <el-radio-group v-model="loglevel" @change="updateloglvl">
                    <el-radio class="radio-btn" :label="10">DEBUG</el-radio>
                    <el-radio class="radio-btn" :label="20">INFO</el-radio>
                    <el-radio class="radio-btn" :label="30">WARNING</el-radio>
                    <el-radio class="radio-btn" :label="40">ERROR</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <el-divider>通知</el-divider>
         <el-form label-position="right" label-width="auto" :model="notificationConf">
            <el-form-item label="TG token">
                <el-input v-model="notificationConf.tg_token" placeholder="Telegram token"></el-input>
            </el-form-item>
            <el-form-item label="TG chatid">
                <el-input v-model="notificationConf.tg_chatid" placeholder="Telegram chatid"></el-input>
            </el-form-item>
            <el-form-item label="微信 corpid">
                <el-input v-model="notificationConf.wechat_corpid" placeholder="企业微信 corpid"></el-input>
                <div class="tip-info" >参考 <a href="https://developer.work.weixin.qq.com/document/path/90665" target="_blank">企业微信开发指南</a></div>
            </el-form-item>
            <el-form-item label="微信 secret">
                <el-input v-model="notificationConf.wechat_corpsecret" placeholder="企业微信 corpsecret"></el-input>
                <div class="tip-info" >同上</div>
            </el-form-item>
            <el-form-item label="微信 agentid">
                <el-input v-model="notificationConf.wechat_agentid" placeholder="企业微信 agentid"></el-input>
                <div class="tip-info" >同上</div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updatenotification">更新</el-button>
            </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <div >
            <el-button type="primary" @click="cleandata">清理</el-button>
            <div slot="tip" class="el-upload__tip">清理源文件已不存在的记录</div>
        </div>
        <el-divider />
        <!-- <div >
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
        </div> -->

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
            multifile: false,
            loginfo: '',
            logtimer: null,
            notificationConf: {}
        };
    },
    mounted(){
        this.getnotification()
        axios.get('/api/options/loglevel')
            .then(response => {
                this.loglevel = response.data.loglevel;
            })
            .catch(function (error) {
                console.log(error);
            });
        this.updateLog()
    },
    methods: {
        updateloglvl() {
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
        getnotification() {
            axios.get('/api/options/notification')
                .then(response => {
                    this.notificationConf = response.data;
                })
        },
        updatenotification(){
            axios.put('/api/options/notification',this.notificationConf)
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
        },
        xhrRequestLog() {
            var output = document.getElementById('output');
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/api/options/logstream', true);
            xhr.onreadystatechange = function() {
                switch(xhr.readyState){
                    case 4://DONE
                        console.log("restart xhr")
                        clearInterval(this.logtimer)
                        this.logtimer = null;
                        this.updateLog()
                        break;
                }}.bind(this)
            xhr.send();
            this.logtimer = setInterval(function() {
                if (this.loginfo != xhr.responseText) {
                    console.log("update log")
                    this.loginfo = xhr.responseText;
                    output.textContent = this.loginfo;
                    output.scrollTop = output.scrollHeight; 
                }
            }.bind(this), 2000);
        },
        updateLog(){
            setTimeout(function(){this.xhrRequestLog()}.bind(this), 1000)
        },
        // TODO formate
        logFormate(logs){
            console.log(logs)

            return logs
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
