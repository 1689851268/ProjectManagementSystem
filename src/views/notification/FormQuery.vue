<template>
    <div class="notification-query mb-20">
        <!-- 搜索项 -->
        <el-form :inline="true" :model="formData" class="form-inline">
            <el-form-item
                class="mb-0"
                v-for="item in configurations"
                :label="$t(capitalize(item.name))"
            >
                <template v-if="item.type === 'input'">
                    <el-input
                        class="w-200"
                        v-model="formData[item.name]"
                        :placeholder="$t(`Please enter the ${item.name}`)"
                        clearable
                        @keyup.enter="queryForm"
                        @clear="queryForm"
                    />
                </template>
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
import { Configuration } from '@/views/notification/interfaces';
import useQueryCondition from '@/hooks/useQueryCondition';

const { configurations } = defineProps<{
    configurations: Configuration[]; // 表单项的默认配置
}>();

const emits = defineEmits<{
    (event: 'setQueryCondition', queryCondition: any): void; // 更新查询条件
    (event: 'resetQueryCondition'): void; // 重置查询条件
    (event: 'setCurPage', curPage: number): void; // 重置查询条件
}>();

// tool - 首字母大写
const capitalize = (str: string) => {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
};

// 表单数据 & 重置表单数据的方法
const { queryCondition: formData, resetQueryCondition: resetFormData } =
    useQueryCondition(configurations);

// 点击搜索
const queryForm = () => {
    emits('setQueryCondition', formData.value); // 更新查询条件
    emits('setCurPage', 1); // 重置当前页码
};

// 点击重置
const resetForm = () => {
    resetFormData(); // 重置表单数据
    emits('resetQueryCondition'); // 重置查询条件
    emits('setCurPage', 1); // 重置当前页码
};
</script>

<style scoped lang="scss">
@import '@/styles/mixins.scss';

.notification-query {
    @include content-box;
    display: flex;
    align-items: center;

    .form-inline {
        flex: 1;
    }
}
</style>
