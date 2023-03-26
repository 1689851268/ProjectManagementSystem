import { ref } from 'vue';

const useDialog = () => {
    const visible = ref(false);

    const openDialog = () => {
        visible.value = true;
    };

    const closeDialog = () => {
        visible.value = false;
    };

    return {
        visible,
        openDialog,
        closeDialog,
    };
};

export default useDialog;
