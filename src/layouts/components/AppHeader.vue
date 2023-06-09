<template>
    <el-header class="app-header">
        <!-- 展开 / 关闭 -->
        <div class="header-btn line-height-add-3" @click="toggleCollapsed">
            <el-icon :size="iconSize" v-if="getMenuCollapsed">
                <Expand />
            </el-icon>
            <el-icon :size="iconSize" v-else><Fold /></el-icon>
        </div>
        <div class="float-right">
            <!-- 配置 -->
            <LanguageConfig class="languageConfig" />
            <!-- 个人中心 -->
            <span class="header-btn">
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                        {{ uuid }}
                        <el-icon class="el-icon--right">
                            <Setting />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item
                                @click="toPersonalCenter"
                                v-if="userStore.getIdentity !== 4"
                            >
                                个人中心
                            </el-dropdown-item>
                            <el-dropdown-item @click="logout">
                                退出登录
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </span>
        </div>
    </el-header>
</template>

<script setup lang="ts">
import { Setting, Expand, Fold } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';

import { useAppStore } from '@/store/modules/app';
import LanguageConfig from '@/components/LanguageConfig.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';

const appStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();

defineProps<{
    uuid: string;
}>();

const { getMenuCollapsed } = storeToRefs(appStore);
const iconSize = 20;

// 控制菜单栏是否展开
const toggleCollapsed = () => {
    appStore.toggleMenuCollapsed();
};

// 退出登录
const logout = () => {
    router.push('/login');
    setTimeout(() => {
        userStore.logout();
    }, 500);
};

// 跳转到个人中心
const toPersonalCenter = () => {
    router.push({
        name: 'PersonalCenter',
    });
};
</script>

<style scoped lang="scss">
.app-header {
    height: $header-height;
    border-bottom: 1px solid #ebeef5;
    padding: 0;
}

.languageConfig,
.el-dropdown-link {
    height: $header-height;
    line-height: $header-height;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.header-btn {
    display: inline-block;
    height: $header-height;
    line-height: $header-height;
    cursor: pointer;
    padding: 0 15px;
    &:hover {
        background-color: #f5f7fa;
    }
}

.line-height-add-3 {
    line-height: $header-height + 3px; // 为了视觉上居中 + 3px
}
</style>
