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
                            {{ attachment.name }}
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
import axios from '@/utils/axios';
import { ref, computed } from 'vue';
import useLoading from '@/hooks/useLoading';

interface rawNotificationDetail {
    id: number;
    title: string;
    content: string;
    lastUpdateTime: string;
    publishTime: string;
    notificationAttachments: {
        name: string;
        storagePath: string;
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
    const res: rawNotificationDetail = await axios.get(
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

// 返回通知列表
const router = useRouter();
const backToNotification = () => {
    // TODO: 返回上一页
    // 学生返回 Notification, 教师返回 NotificationList
    router.push({ name: 'Notification' });
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

.notification-detail {
    @include content-box;
    color: #767a8a;
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
