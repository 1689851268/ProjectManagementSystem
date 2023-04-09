<template>
    <el-scrollbar ref="scrollbar" v-loading="isLoading" class="project-detail">
        <ul class="detail-items">
            <li>
                <h3>基本信息</h3>
                <hr />
                <ul>
                    <li>项目名称：{{ project?.name }}</li>
                    <li>项目类型：{{ project?.type.name }}</li>
                    <li>项目状态：{{ project?.status.name }}</li>
                    <li>项目简介：{{ project?.description }}</li>
                    <li>
                        创建时间：
                        {{
                            new Date(+project?.applicationDate).toLocaleString()
                        }}
                    </li>
                    <li v-if="project?.applicationDate">
                        申报时间：
                        {{
                            new Date(+project?.applicationDate).toLocaleString()
                        }}
                    </li>
                    <li v-if="project?.openTime">
                        开题时间：
                        {{ new Date(+project?.openTime).toLocaleString() }}
                    </li>
                    <li v-if="project?.failureTime">
                        失效时间：
                        {{ new Date(+project?.failureTime).toLocaleString() }}
                    </li>
                    <li v-if="project?.finishTime">
                        完成时间：
                        {{ new Date(+project?.finishTime).toLocaleString() }}
                    </li>
                </ul>
            </li>
            <li v-if="projectTeacher">
                <h3>指导老师</h3>
                <hr />
                <ul>
                    <li>名称：{{ projectTeacher.name }}</li>
                    <li>账号：{{ projectTeacher.uuid }}</li>
                    <li>联系号码：{{ projectTeacher.phone || '-' }}</li>
                    <li>邮箱地址：{{ projectTeacher.email || '-' }}</li>
                </ul>
            </li>
            <li v-if="projectLeader">
                <h3>项目负责人</h3>
                <hr />
                <ul>
                    <li>名称：{{ projectLeader.name }}</li>
                    <li>账号：{{ projectLeader.uuid }}</li>
                    <li>联系号码：{{ projectLeader.phone || '-' }}</li>
                    <li>邮箱地址：{{ projectLeader.email || '-' }}</li>
                </ul>
            </li>
            <li v-if="projectSpecialist">
                <h3>审批专家</h3>
                <hr />
                <ul>
                    <li>名称：{{ projectSpecialist.name }}</li>
                    <li>账号：{{ projectSpecialist.uuid }}</li>
                    <li>联系号码：{{ projectSpecialist.phone || '-' }}</li>
                    <li>邮箱地址：{{ projectSpecialist.email || '-' }}</li>
                </ul>
            </li>
            <li v-if="members?.length > 0">
                <h3>项目组成员</h3>
                <hr />
                <template v-for="(member, index) in members">
                    <h4>成员{{ index + 1 }}</h4>
                    <ul>
                        <li>名称：{{ member.name }}</li>
                        <li>账号：{{ member.uuid }}</li>
                        <li>联系号码：{{ member.phone || '-' }}</li>
                        <li>邮箱地址：{{ member.email || '-' }}</li>
                    </ul>
                </template>
            </li>
            <li v-if="attachment?.length > 0">
                <h3>项目附件</h3>
                <hr />
                <ul>
                    <li v-for="item in attachment">
                        {{ item.type === 0 ? '开题报告' : '结题报告' }}：
                        <a
                            :href="`${baseUrl}/project-attachment/download/${item.id}`"
                            :download="item.name"
                        >
                            {{ item.name }}
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </el-scrollbar>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import ajax from '@/utils/ajax';
import useLoading from '@/hooks/useLoading';
import { ref } from 'vue';

const baseUrl = import.meta.env.VITE_AXIOS_BASEURL;

// 获取路由参数
const { params } = useRoute();

const project = ref<any>(null); // 项目信息
const members = ref<any>(null); // 项目成员
const attachment = ref<any>(null); // 项目附件
const projectLeader = ref<any>(null); // 项目负责人
const projectTeacher = ref<any>(null); // 项目指导老师
const projectSpecialist = ref<any>(null); // 项目审批专家

const getProjectDetail = async () => {
    const res: any = await ajax.get(`/project/detail/${params.id}`);
    console.log('res', res);
    project.value = res.project;
    members.value = res.members[0].students || [];
    attachment.value = res.attachment;
    projectLeader.value = res.project.projectLeader;
    projectTeacher.value = res.project.teacher;
    projectSpecialist.value = res.project.specialist;
    console.log({ projectTeacher: projectTeacher.value });
};

getProjectDetail();

// loading 状态, 开始 / 结束 loading
const { isLoading, startLoading, stopLoading } = useLoading();
</script>

<style scoped lang="scss">
@import '@/styles/mixins.scss';

.project-detail {
    @include content-box;
    box-sizing: border-box;

    .detail-items > li:not(:last-child) {
        margin-bottom: 40px;
    }
}

h4 {
    margin: 10px 0 5px;
}

a {
    $a-color: #409eff;
    color: $a-color;
    text-decoration: none;
    &:hover {
        $hover-color: #0080ff;
        color: $hover-color;
    }
    &:active {
        $active-color: #004285;
        color: $active-color;
    }
}
</style>
