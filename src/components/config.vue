<template>
    <div class="body-wrap">
        <el-form label-position="right" label-width="auto" >
           <el-form-item label="日志等级">
                <el-radio-group v-model="loglevel" @change="onSubmit">
                    <el-radio :label="10">DEBUG</el-radio>
                    <el-radio :label="20">INFO</el-radio>
                    <el-radio :label="30">WARNING</el-radio>
                    <el-radio :label="40">ERROR</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

    </div>
</template>

<script lang="ts">
import axios from 'axios'

export default {
    name: 'config',
    data() { 
        return {
            loglevel: 20
        };
    },
    mounted(){
        axios.get('/api/loglevel')
            .then(response => {
                console.log(response)
                this.loglevel = response.data.loglevel;
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    methods: {
        onSubmit() {
            const data = {loglevel: this.loglevel};
            axios.put('/api/loglevel', data)
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
