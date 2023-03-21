<template>
    <div class="project-list">
        <el-table :data="projectList" border>
            <el-table-column
                prop="id"
                :label="$t('Project ID')"
                align="center"
            />
            <el-table-column
                prop="name"
                :label="$t('Project Name')"
                align="center"
            />
            <el-table-column prop="type" :label="$t('Type')" align="center" />
            <el-table-column
                prop="teacher"
                :label="$t('Teacher')"
                align="center"
            />
            <el-table-column
                prop="college"
                :label="$t('College')"
                align="center"
            />
            <el-table-column
                prop="publishTime"
                :label="$t('Publish Time')"
                align="center"
            />
            <el-table-column
                prop="status"
                :label="$t('Status')"
                align="center"
            />
            <el-table-column
                prop="applicationTime"
                :label="$t('Application Time')"
                align="center"
            />
            <el-table-column
                prop="projectLeader"
                :label="$t('Project Leader')"
                align="center"
            />
            <el-table-column
                prop="specialist"
                :label="$t('Specialist')"
                align="center"
            />
            <el-table-column :label="$t('Operations')" align="center">
                <template #default="scope">
                    <el-button
                        size="small"
                        @click="handleDetails(scope.$index, scope.row)"
                    >
                        {{ $t('Details') }}
                    </el-button>
                    <el-button
                        v-if="scope.row.status === 1"
                        size="small"
                        @click="handleApply(scope.$index, scope.row)"
                    >
                        {{ $t('Apply') }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            class="p-20 pl-0"
            v-if="total > pageSize"
            :current-page="curPage"
            :page-size="pageSize"
            :page-sizes="pageSizes"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script setup lang="ts">
import { Project } from './interfaces';

defineProps<{
    projectList: Array<Project>;
    total: number;
    pageSizes: Array<number>;
    pageSize: number;
    curPage: number;
    isLoading: boolean;
}>();

const emits = defineEmits<{
    (event: 'update:curPage', curPage: number): void;
    (event: 'update:pageSize', pageSize: number): void;
}>();

// 每页显示的条数改变时触发
const handleSizeChange = (val: number) => {
    emits('update:pageSize', val);
    emits('update:curPage', 1);
};

// 当前页码改变时触发
const handleCurrentChange = (val: number) => {
    emits('update:curPage', val);
};

// 点击详情时触发
const handleDetails = (index: number, row: Project) => {
    console.log(index, row);
};

// 点击申报时触发
const handleApply = (index: number, row: Project) => {
    console.log(index, row);
};
</script>

<style scoped lang="scss">
@import '@/styles/mixins.scss';

.project-list {
    @include content-box;
}
</style>
