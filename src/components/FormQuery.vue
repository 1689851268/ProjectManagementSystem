<template>
    <div class="notification-query mb-20">
        <!-- 搜索项 -->
        <el-form :inline="true" :model="formData" class="form-inline">
            <el-form-item
                class="mb-0"
                v-for="item in configurations"
                :label="$t(getBabel(item.name))"
            >
                <template v-if="item.type === 'input'">
                    <el-input
                        class="w-200 mb-20"
                        v-model="formData[item.name]"
                        :clearable="isClearable(item.clearable)"
                        :placeholder="$t('Please input')"
                        @keyup.enter="queryForm"
                        @clear="queryForm"
                    />
                </template>
                <template v-if="item.type === 'select'">
                    <el-select
                        class="w-200 mb-20"
                        v-model="formData[item.name]"
                        :clearable="isClearable(item.clearable)"
                        :placeholder="$t('Please select')"
                        @change="queryForm"
                        @clear="queryForm"
                    >
                        <el-option
                            v-for="option in item.options"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                        />
                    </el-select>
                </template>
            </el-form-item>
        </el-form>
        <!-- 搜索按钮 -->
        <div class="pl-20 mb-20">
            <el-button type="primary" @click="queryForm">
                {{ $t('Search') }}
            </el-button>
            <el-button @click="resetForm"> {{ $t('Reset') }} </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { splitCamelCase, capitalize } from '@/utils/stringFunction';
import { Configuration } from '@/common/interfaces';
import useQueryCondition from '@/hooks/useQueryCondition';

const props = defineProps<{
    configurations: Configuration[]; // 表单项的默认配置
}>();

const emits = defineEmits<{
    (event: 'setQueryCondition', queryCondition: any): void; // 更新查询条件
    (event: 'resetQueryCondition'): void; // 重置查询条件
    (event: 'setCurPage', curPage: number): void; // 重置查询条件
}>();

// 判断是否可清空, 默认为 true
const isClearable = (cleared?: boolean) => {
    return cleared === undefined ? true : cleared;
};

/**
 * 将形如 'abcDef' 的字符串转换为 'Abc Def' 的字符串
 * @param str 需要转换的字符串
 * @returns 转换后的字符串
 */
const getBabel = (str: string) => {
    return splitCamelCase(capitalize(str));
};

// 表单数据 & 重置表单数据的方法
const { queryCondition: formData, resetQueryCondition: resetFormData } =
    useQueryCondition(props.configurations);

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
    padding-bottom: 0; // 重置 padding-bottom, 因为表单项有 margin-bottom 为 20px
    display: flex;
    align-items: center;

    .form-inline {
        flex: 1;
    }
}
</style>
