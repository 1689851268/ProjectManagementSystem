export interface Notification {
    id: number;
    title: string;
    content: string;
    lastUpdateTime: string;
    publishTime: string;
    publisher: {
        id: number;
        name: string;
    };
    lastUpdater: {
        id: number;
        name: string;
    };
}

export interface NotificationItem {
    id: number;
    title: string;
    content: string;
    lastUpdateTime: string;
    publishTime: string;
    publisher: string;
    lastUpdater: string;
}

export interface NotificationDetail {
    id: number;
    title: string;
    content: string;
    notificationAttachments: {
        name: string;
        storagePath: string;
    }[];
}
