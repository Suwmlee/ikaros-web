<template>
    <div class="body-wrap">
        <div class="row-card">
            <el-collapse >
                <el-collapse-item title="Transmission种子下载完成后执行脚本:" name="1">
                    <pre class="pre-md">
                        <code>
        #!/bin/bash
        TR_DOWNLOADS="$TR_TORRENT_DIR/$TR_TORRENT_NAME"
        curl -XPOST http://127.0.0.1:12346/api/client \
        -H 'Content-Type: application/json' \
        --data @&lt;(cat &lt;&lt;EOF
        {"path":"$TR_DOWNLOADS"}
        EOF
        )</code>
                    </pre>
                </el-collapse-item>
                <el-collapse-item title="qBittorrent种子下载完成后执行脚本:" name="2">
                    <pre class="pre-md">
                        <code>
        #!/bin/bash
        TR_DOWNLOADS="$TR_TORRENT_DIR/$TR_TORRENT_NAME"
        curl -XPOST http://127.0.0.1:12346/api/client \
        -H 'Content-Type: application/json' \
        --data @&lt;(cat &lt;&lt;EOF
        {"path":"$TR_DOWNLOADS"}
        EOF
        )</code> 
                    </pre>
                </el-collapse-item>
            </el-collapse>
        </div>

        <el-form label-position="right" label-width="auto" :model="settings">
            <el-form-item label="源前缀">
                <el-input v-model="settings.original" placeholder="需要替换的前缀"></el-input>
                <div class="tip-info" >参考简介内软链接前缀说明</div>
            </el-form-item>
            <el-form-item label="更改前缀">
                <el-input v-model="settings.prefixed" placeholder="前缀"></el-input>
                <div class="tip-info" >参考简介内软链接前缀说明，修正后，ikaros可访问的目录/文件</div>
            </el-form-item>
            <el-form-item label="刮削目录">
                <el-input v-model="settings.scrapingfolders" placeholder="以;间隔"></el-input>
                <div class="tip-info" >可使用刮削配置内刮削目录</div>
            </el-form-item>
            <el-form-item label="转移目录">
                <el-input v-model="settings.transferfolders" placeholder="以;间隔"></el-input>
                <div class="tip-info" >可使用转移配置内源目录,不推荐自动转移剧集目录</div>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="settings.mark" placeholder="备注"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
        
        </el-form>
        <el-divider>任务列表</el-divider>
        <div >
            <el-button type="danger" @click="clean" >清空</el-button>
        </div>

        <el-table
            :data="records"
            style="width: 95%">
            <el-table-column
                prop="path"
                label="任务路径"
                >
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态">
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import axios from 'axios'

export default {
    name: 'automation',
    data() { 
        return {
            settings: {},
            records: []
        };
    },
    mounted(){
        this.getTasks()
        this.timer = setInterval(this.getTasks, 1500);
        axios.get('/api/auto/conf')
            .then(response => {
                this.settings = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        onSubmit() {
            axios.post('/api/auto/conf',this.settings)
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
        getTasks() {
            axios.get('/api/auto/task')
                .then(response => {
                    this.records = response.data
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        clean() {
            axios.delete('/api/auto/task')
                .then(() => {
                    this.$message({
                        showClose: true,
                        duration: 2000,
                        message: '清理完成',
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
    margin: 5px 5px 5px 5px;
}

.row-card{
    margin-bottom: 20px;
}

.el-form-item {
    margin-bottom: 15px;
}

.tip-info {
    color: gray;
    margin-top: 3px;
    font-size: 12px;
    line-height: normal;
}

.pre-md {
    overflow-x:auto;
    background-color: #f6f8fa;
    padding: 5px;
}

</style>
