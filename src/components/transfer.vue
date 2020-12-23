<template>
    <div>
        <el-form :label-position="right" label-width="150px" :model="settings">
            <el-form-item label="需要软链接目录">
                <el-input v-model="settings.source_folder"></el-input>
            </el-form-item>
            <el-form-item label="软链接前缀">
                <el-input v-model="settings.soft_prefix"></el-input>
            </el-form-item>
            <el-form-item label="输出目录">
                <el-input v-model="settings.output_folder"></el-input>
            </el-form-item>
            <el-form-item label="过滤目录">
                <el-input v-model="settings.escape_folder"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">应用</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'transfer',
    data() { 
        return {
            settings: {
                soft_prefix: '',
                source_folder: '',
                output_folder: '',
                escape_folder: '',
            }
        };
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        }
    }
}
</script>