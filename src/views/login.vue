<template>
    <div>登录</div>
    <el-button @click="getCollege">getCollege</el-button>
</template>

<script lang="ts" setup>
import axios from '@/utils/axios';

const getCollege = async () => {
    const res = await axios.get('/college');
    console.log('res', res);
};
</script>

<style lang="scss" scoped>
div {
    font-weight: 700;
}
</style>
