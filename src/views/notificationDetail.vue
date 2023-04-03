<template>
    <el-scrollbar ref="scrollbar" v-loading="isLoading">
        <div
            class="notification-detail"
            :class="{ 'h-full': !notificationDetail }"
        >
            <div class="notification-box" v-if="notificationDetail">
                <!-- 通知详情 -->
                <div class="notification-detail-title mb-15">
                    {{ notificationDetail?.title }}
                </div>
                <div class="notification-detail-content mb-15">
                    {{ notificationDetail?.content }}
                </div>
                <ul class="notification-detail-edit mb-15">
                    <li class="edit-publisher">
                        发布人：{{ notificationDetail?.publisher }}
                    </li>
                    <li class="edit-publishTime">
                        发布时间：{{ notificationDetail?.publishTime }}
                    </li>
                    <li class="edit-lastUpdater mt-10">
                        最后修改人：{{ notificationDetail?.lastUpdater }}
                    </li>
                    <li class="edit-lastUpdateTime">
                        最后修改时间：{{ notificationDetail?.lastUpdateTime }}
                    </li>
                </ul>
                <div
                    class="notification-detail-attachment"
                    v-if="showAttachment"
                >
                    <div class="attachment-title">附件：</div>
                    <ol class="attachment-list">
                        <li
                            v-for="(
                                attachment, i
                            ) in notificationDetail?.notificationAttachments"
                            :key="i"
                        >
                            <a
                                :href="`${baseUrl}/notification-attachment/download/${attachment.id}`"
                                :download="attachment.name"
                            >
                                {{ attachment.name }}
                            </a>
                        </li>
                    </ol>
                </div>

                <!-- 悬浮的返回按钮 -->
                <div class="back-btn">
                    <el-button color="#545c64" @click="backToNotification">
                        返回
                    </el-button>
                </div>
            </div>
            <!-- 内容为空 -->
            <div
                class="position-center"
                v-else-if="!notificationDetail && !isLoading"
            >
                哎哟 找不到了
            </div>
        </div>
    </el-scrollbar>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import ajax from '@/utils/ajax.js';
import { ref, computed } from 'vue';
import useLoading from '@/hooks/useLoading';

const baseUrl = import.meta.env.VITE_AXIOS_BASEURL;

interface rawNotificationDetail {
    id: number;
    title: string;
    content: string;
    lastUpdateTime: string;
    publishTime: string;
    notificationAttachments: {
        name: string;
        storagePath: string;
        id: number;
    }[];
    publisher: {
        name: string;
    };
    lastUpdater: {
        name: string;
    };
}

type NotificationDetail = Omit<
    rawNotificationDetail,
    'publisher' | 'lastUpdater'
> & {
    publisher: string;
    lastUpdater: string;
};

// 是否显示附件
const showAttachment = computed(() => {
    const attachmentLength =
        notificationDetail.value?.notificationAttachments.length || 0;
    return attachmentLength > 0;
});

// 获取路由参数
const { params } = useRoute();
// 根据 params.id 获取通知详情
const getNotificationDetail = async () => {
    // 发送请求, 获取通知详情
    const res: rawNotificationDetail = await ajax.get(
        `/notification/${params.id}`,
    );

    // 若通知已被删除  →  res 为空对象 {}  →  置空 notificationDetail
    if (!res.id /* || 1 === 1 */) {
        return new Promise((resolve) => {
            setTimeout(() => {
                return resolve(null);
            }, 1000);
        });
    }

    // 返回格式化后的数据
    return new Promise((resolve) => {
        setTimeout(() => {
            return resolve({
                ...res,
                publisher: res.publisher.name,
                lastUpdater: res.lastUpdater.name,
                publishTime: new Date(+res.publishTime).toLocaleString(),
                lastUpdateTime: new Date(+res.lastUpdateTime).toLocaleString(),
            });
        }, 1000);
    });
};

// loading 状态, 开始 / 结束 loading
const { isLoading, startLoading, stopLoading } = useLoading();

// 通知详情
const notificationDetail = ref<NotificationDetail | null>(null);
const init = async () => {
    startLoading();
    notificationDetail.value =
        (await getNotificationDetail()) as NotificationDetail;
    stopLoading();
};
init();

// 返回上一页
const router = useRouter();
const pre = ref(''); // 上一个页面的 name 属性
const backToNotification = () => {
    // 从哪个页面跳转过来的, 就返回到哪个页面; 若没有上一个页面, 则返回到通知列表
    router.push({ name: pre.value || 'Notification' });
};

defineExpose({
    pre, // 使用 defineExpose 暴露变量, 以便在 beforeRouteEnter 中使用
});
</script>

<script lang="ts">
// 另开一个 script 标签, 以使用 beforeRouteEnter
export default {
    beforeRouteEnter(_to, from, next) {
        next((vm: any) => {
            // 获取上一个页面的 name 属性
            vm.pre = from.name || '';
        });
    },
};
</script>

<style scoped lang="scss">
@import '@/styles/mixins.scss';

ol {
    margin: 0;
    padding-left: 25px;
}

li {
    margin: 5px 0;
}
$color: #6b6e7a;
.attachment-list li {
    $a-color: #409eff;
    cursor: pointer;
    color: $a-color;

    a {
        color: $a-color;
        text-decoration: none;
    }

    &:hover {
        $hover-color: #0080ff;
        color: $hover-color;
        a {
            color: $hover-color;
        }
    }

    &:active {
        $active-color: #004285;
        color: $active-color;
        a {
            color: $active-color;
        }
    }
}

.notification-detail {
    @include content-box;
    color: $color;
    position: relative;
    box-sizing: border-box;

    .notification-box {
        .notification-detail-title {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            color: #282d30;
        }

        .notification-detail-content {
            word-break: break-all;
        }

        .back-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
        }
    }
}

:deep(.el-scrollbar__view) {
    height: 100%;
}
</style>
