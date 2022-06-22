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

        <el-form label-position="right" label-width="auto" :model="localConf">
            <el-divider>通知</el-divider>
            <el-form-item label="TG token">
                <el-input @change="confValueChange" v-model="localConf.tg_token" placeholder="Telegram token"></el-input>
                <div class="tip-info" >配置后 <a href="https://github.com/Suwmlee/ikaros/wiki/%E6%8E%A8%E9%80%81%E6%B6%88%E6%81%AF%E6%95%88%E6%9E%9C" target="_blank">效果展示</a></div>
            </el-form-item>
            <el-form-item label="TG chatid">
                <el-input @change="confValueChange" v-model="localConf.tg_chatid" placeholder="Telegram chatid"></el-input>
            </el-form-item>
            <el-form-item label="微信 corpid">
                <el-input @change="confValueChange" v-model="localConf.wechat_corpid" placeholder="企业微信 corpid"></el-input>
                <div class="tip-info" >参考 <a href="https://developer.work.weixin.qq.com/document/path/90665" target="_blank">企业微信开发指南</a></div>
            </el-form-item>
            <el-form-item label="微信 secret">
                <el-input @change="confValueChange" v-model="localConf.wechat_corpsecret" placeholder="企业微信 corpsecret"></el-input>
                <div class="tip-info" >同上</div>
            </el-form-item>
            <el-form-item label="微信 agentid">
                <el-input @change="confValueChange" v-model="localConf.wechat_agentid" placeholder="企业微信 agentid"></el-input>
                <div class="tip-info" >同上</div>
            </el-form-item>
            <el-form-item label="使用代理" >
                <el-switch @change="confValueChange"
                    v-model="localConf.proxy_enable"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item v-if="localConf.proxy_enable==true" label="类型">
                <el-input @change="confValueChange" v-model="localConf.proxy_type" placeholder="支持: http socks5 socks5h"></el-input>
            </el-form-item>
            <el-form-item v-if="localConf.proxy_enable==true" label="地址">
                <el-input @change="confValueChange" v-model="localConf.proxy_address" placeholder="127.0.0.1:1080"></el-input>
            </el-form-item>
            <el-divider>下载服务器 - Transmission</el-divider>
             <el-form-item label="服务器地址">
                <el-input @change="confValueChange" v-model="localConf.tr_url" placeholder="完整的服务器地址(含端口),如: http://192.168.1.1:5000/"></el-input>
            </el-form-item>
             <el-form-item label="登录名">
                <el-input @change="confValueChange" autoComplete="off" v-model="localConf.tr_username" placeholder="登录名"></el-input>
            </el-form-item>
             <el-form-item label="登陆密码">
                <el-input @change="confValueChange" show-password auto-complete="new-password" v-model="localConf.tr_passwd" placeholder="登陆密码"></el-input>
            </el-form-item>
             <el-form-item label="下载目录修正">
                <el-input @change="confValueChange" v-model="localConf.tr_prefix" placeholder="tr下载目录映射到ikaros目录,如: /volume1/Media:/media"></el-input>
            </el-form-item>
            <el-divider>清理</el-divider>
            <el-form-item>
                <el-button type="primary" @click="cleandata">手动清理</el-button>
                <div class="tip-info" >删除目标文件不存在的记录及关联文件(不含源文件)</div>
            </el-form-item>
            <el-form-item label="计划任务" >
                <el-switch @change="confValueChange"
                    v-model="localConf.task_clean"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
                <div class="tip-info" style="color:red">注意!! 检测源文件或目标文件不存在的记录并标记。三天后将删除所有关联文件(包含源文件),如设置transmission,也会删除关联的种子</div>
            </el-form-item>
        </el-form>

        <el-divider />

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
            localConf: {}
        };
    },
    mounted(){
        this.getconfig()
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
                        message: '保存成功',
                        type: 'success'
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getconfig() {
            axios.get('/api/options/config')
                .then(response => {
                    this.localConf = response.data;
                })
        },
        updateconfig(){
            axios.put('/api/options/config',this.localConf)
                .then( () => {
                    this.$message({
                        showClose: true,
                        duration: 2000,
                        message: '保存成功',
                        type: 'success'
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        confValueChange(v){
            console.log(v)
            this.updateconfig()
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
