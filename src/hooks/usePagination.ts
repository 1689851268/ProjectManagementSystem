import { ref } from 'vue';

/**
 * @description 分页的 hook
 * @param limit 每页显示的条数
 */
const usePagination = (limit: number) => {
    const pageSize = ref(limit);
    const pageSizes = [limit, limit * 2, limit * 3, limit * 4]; // 每页可显示的条数
    const curPage = ref(1);
    const total = ref(0);

    const setCurPage = (newCurPage: number) => {
        curPage.value = newCurPage;
    };

    const setPageSize = (newPageSize: number) => {
        pageSize.value = newPageSize;
    };

    const setTotal = (newTotal: number) => {
        total.value = newTotal;
    };

    return {
        pageSizes,
        curPage,
        pageSize,
        total,
        setCurPage,
        setPageSize,
        setTotal,
    };
};

export default usePagination;
