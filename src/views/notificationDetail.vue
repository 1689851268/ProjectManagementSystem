<template>
    <div class="notification-detail">
        <div class="notification-detail-title mb-15">
            {{ notificationDetail.title }}
        </div>
        <div class="notification-detail-content mb-15">
            {{ notificationDetail.content }}
        </div>
        <ul class="notification-detail-edit mb-15">
            <li class="edit-publisher">
                发布人：{{ notificationDetail.publisher }}
            </li>
            <li class="edit-publishTime">
                发布时间：{{ notificationDetail.publishTime }}
            </li>
            <li class="edit-lastUpdater mt-10">
                最后修改人：{{ notificationDetail.lastUpdater }}
            </li>
            <li class="edit-lastUpdateTime">
                最后修改时间：{{ notificationDetail.lastUpdateTime }}
            </li>
        </ul>
        <div class="notification-detail-attachment">
            <div class="attachment-title">附件：</div>
            <ol class="attachment-list">
                <li
                    v-for="(
                        attachment, i
                    ) in notificationDetail.notificationAttachments"
                    :key="i"
                >
                    {{ attachment.name }}
                </li>
            </ol>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import axios from '@/utils/axios';
import { ref } from 'vue';

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

type Notification = Partial<NotificationDetail>;

// 获取路由参数
const { params } = useRoute();

// 通知详情
const notificationDetail = ref<Notification>({});

// 根据 params.id 获取通知详情
const getNotificationDetail = async () => {
    // 发送请求, 获取通知详情
    const res: rawNotificationDetail = await axios.get(
        `/notification/${params.id}`,
    );
    // 格式化数据
    notificationDetail.value = {
        ...res,
        publisher: res.publisher.name,
        lastUpdater: res.lastUpdater.name,
        publishTime: new Date(+res.publishTime).toLocaleString(),
        lastUpdateTime: new Date(+res.lastUpdateTime).toLocaleString(),
    };
    console.log('notificationDetail', notificationDetail.value);
};
getNotificationDetail();
</script>

<style scoped lang="scss">
@import '@/styles/mixins.scss';

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

ol {
    margin: 0;
    padding-left: 25px;
}

.notification-detail {
    @include content-box;
    color: #767a8a;

    .notification-detail-title {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        color: #282d30;
    }

    .notification-detail-content {
        word-break: break-all;
    }
}
</style>
