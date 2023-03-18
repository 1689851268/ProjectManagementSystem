import { ref } from 'vue';

/**
 * @description 加载状态的 hook
 */
const useLoading = () => {
    const isLoading = ref(false);

    const startLoading = () => {
        isLoading.value = true;
    };

    const stopLoading = () => {
        isLoading.value = false;
    };

    return {
        isLoading,
        startLoading,
        stopLoading,
    };
};

export default useLoading;
