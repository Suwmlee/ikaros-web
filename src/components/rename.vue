<template>
    <div>
        <el-form label-position="right" label-width="150px" :model="renameconf">
            <el-form-item label="源目录">
                <el-input v-model="renameconf.source_folder"></el-input>
            </el-form-item>
            <el-form-item label="旧名称">
                <el-input v-model="renameconf.base"></el-input>
            </el-form-item>
            <el-form-item label="修正后名称">
                <el-input v-model="renameconf.newfix"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="onSubmit">重命名</el-button>
            </el-form-item>
        </el-form>
        <el-divider></el-divider>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'rename',
    data() { 
        return {
            running: false,
            currentPage: 1,
            totalnum: 10,
            pagesize: 10,
            transferdata: [],
            renameconf: {
                source_folder: '/media/MediaServer/TV Shows/Person/Season 1',
                base: 'Person.2007.E',
                newfix: 'Person.2007.S01E',
                ext_type: '',
            }
        };
    },
    methods: {
        onSubmit() {
            axios.post('/api/rename',this.renameconf)
                .then(response => {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
}
</script>
