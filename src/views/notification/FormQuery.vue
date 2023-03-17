<template>
    <div class="notification-query mb-20">
        <!-- 搜索项 -->
        <el-form :inline="true" :model="formData" class="form-inline">
            <el-form-item
                class="mb-0"
                v-for="item in formItems"
                :label="$t(item.queryTitle)"
            >
                <el-input
                    class="w-200"
                    v-model="formData[item.queryTip]"
                    :placeholder="$t(`Please enter the ${item.queryTip}`)"
                    clearable
                    @keyup.enter="queryForm"
                    @clear="queryForm"
                />
            </el-form-item>
        </el-form>
        <!-- 搜索按钮 -->
        <div class="pl-20">
            <el-button type="primary" @click="queryForm">
                {{ $t('Search') }}
            </el-button>
            <el-button @click="resetForm"> {{ $t('Reset') }} </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const { queryCondition } = defineProps<{
    queryCondition: any;
}>();

// tool - 首字母大写
const capitalize = (str: string) => {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
};

// 表单项
const formItems = Object.keys(queryCondition).map((key) => {
    return {
        queryTitle: capitalize(key),
        queryTip: key,
    };
});

// 表单数据
const formData = ref({ ...queryCondition });

// 查询
const queryForm = () => {
    console.log('formData', formData.value);
};

// 重置
const resetForm = () => {
    formData.value = queryCondition;
    queryForm(); // 重置后查询
};
</script>

<style scoped lang="scss">
.notification-query {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    border-bottom: 1px solid #ebeef5;
    display: flex;
    align-items: center;

    .form-inline {
        flex: 1;
    }
}
</style>
