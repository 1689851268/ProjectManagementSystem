<template>
    <el-dialog
        title="更新用户"
        width="25%"
        :model-value="props.visible"
        :before-close="handleClose"
        :close-on-click-modal="false"
        align-center
    >
        <el-form :model="form" :rules="rules" ref="ruleFormRef">
            <el-form-item prop="identity">
                <el-select
                    v-model="form.identity"
                    clearable
                    placeholder="用户身份"
                    style="width: 100%"
                    disabled
                >
                    <el-option
                        v-for="item in identities"
                        :label="item.name"
                        :value="`${item.id}`"
                    />
                </el-select>
            </el-form-item>
            <el-form-item prop="name">
                <el-input
                    v-model="form.name"
                    clearable
                    placeholder="用户姓名"
                />
            </el-form-item>
            <el-form-item prop="psw">
                <el-input
                    v-model="form.psw"
                    type="password"
                    clearable
                    placeholder="用户密码"
                    show-password
                />
            </el-form-item>
            <el-form-item prop="pswAgain">
                <el-input
                    v-model="form.pswAgain"
                    type="password"
                    clearable
                    placeholder="确认密码"
                    show-password
                />
            </el-form-item>
            <el-form-item prop="phone">
                <el-input
                    v-model.number="form.phone"
                    clearable
                    placeholder="联系电话（选填）"
                />
            </el-form-item>
            <el-form-item prop="email">
                <el-input
                    v-model="form.email"
                    clearable
                    placeholder="邮箱地址（选填）"
                />
            </el-form-item>
            <el-form-item
                prop="college"
                v-if="form.identity === '1' || form.identity === '2'"
            >
                <el-select
                    v-model="form.college"
                    clearable
                    placeholder="所属学院"
                    style="width: 100%"
                    @change="handleCollegeChange"
                >
                    <el-option
                        v-for="item in colleges"
                        :label="item.name"
                        :value="`${item.id}`"
                    />
                </el-select>
            </el-form-item>
            <el-form-item prop="major" v-if="form.identity === '1'">
                <el-select
                    v-model="form.major"
                    clearable
                    placeholder="所属专业"
                    style="width: 100%"
                >
                    <el-option
                        v-for="item in majors"
                        :label="item.name"
                        :value="`${item.id}`"
                    />
                </el-select>
            </el-form-item>
            <el-form-item prop="class" v-if="form.identity === '1'">
                <el-input
                    v-model.number="form.class"
                    clearable
                    placeholder="所属班级"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose()"> Cancel </el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { useMetaDataStore } from '@/store/metaData';
import { watch, ref, reactive } from 'vue';
import { MetaData } from '@/common/interfaces';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import axios from '@/utils/axios';
import { UserInfo, UserInfoState } from '../utils/interfaces';

const props = defineProps<{
    visible: boolean;
    curUser: UserInfoState | null;
    identity: number;
}>();

const emit = defineEmits<{
    (e: 'update:visible', newVal: boolean): void;
    (e: 'initUserList'): void;
}>();

const ruleFormRef = ref<FormInstance>(); // 表单实例

// 表单数据
const form = reactive<UserInfo>({
    identity: `${props.identity}`,
    name: '',
    psw: '',
    pswAgain: '',
    phone: '',
    email: '',
    college: '',
    major: '',
    class: '',
});

const majors = ref<MetaData[]>([]); // 专业信息

// 更新 college 时, 获取专业信息
const handleCollegeChange = async () => {
    // 发送请求获取专业信息
    const major: MetaData[] = await axios.get('/major', {
        params: { collegeId: form.college },
    });
    form.major = ''; // 清空 major 表单项
    majors.value = major; // 更新专业信息
};

// 监听 props.curUser 变化, 更新表单数据
watch(
    () => props.curUser,
    (newVal) => {
        form.name = newVal?.name || '';
        form.psw = newVal?.password || '';
        form.pswAgain = newVal?.password || '';
        form.phone = newVal?.phone ? +newVal?.phone : '';
        form.email = newVal?.email || '';
        form.class = newVal?.class || '';
        form.college = newVal?.college ? `${newVal.college.id}` : '';
        form.major = newVal?.major ? `${newVal.major.id}` : '';
        if (newVal?.major) {
            majors.value = [{ id: newVal.major.id, name: newVal.major.name }];
        }
    },
    { immediate: true },
);

const identities = ref<MetaData[]>([]); // 用户身份
const colleges = ref<MetaData[]>([]); // 学院信息
// 监听元数据变化, 更新用户身份和学院信息
const metaDataStore = useMetaDataStore();
metaDataStore.$subscribe(
    (_, state) => {
        identities.value = state.identities;
        colleges.value = state.colleges;
    },
    { immediate: true },
);

// 表单验证规则
const rules = reactive<FormRules>({
    identity: {
        required: true,
        message: 'Please input Activity name',
        trigger: 'change',
    },
    name: [
        {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur',
        },
        {
            min: 1,
            max: 30,
            message: 'Length should be 1 to 30',
            trigger: 'blur',
        },
    ],
    psw: [
        {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur',
        },
        {
            min: 1,
            max: 20,
            message: 'Length should be 1 to 20',
            trigger: 'blur',
        },
    ],
    pswAgain: [
        {
            validator: (_: any, value: string, callback: any) => {
                if (value !== form.psw) {
                    callback(new Error("Two inputs don't match!"));
                } else {
                    callback();
                }
            },
            trigger: 'blur',
        },
    ],
    phone: [
        {
            validator: (_: any, value: string, callback: any) => {
                const str = value.toString();
                if (str.length === 0) {
                    // 手机号码长度为 0 位, 不校验
                    callback();
                } else if (str.length === 11) {
                    // 手机号码长度为 11 位
                    callback();
                } else {
                    callback(new Error('Phone number must be 11 digits'));
                }
            },
            trigger: 'blur',
        },
        { type: 'number', message: 'age must be a number' },
    ],
    email: {},
    college: {
        required: true,
        message: 'Please input Activity name',
        trigger: 'change',
    },
    major: {
        required: true,
        message: 'Please input Activity name',
        trigger: 'change',
    },
    class: [
        {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur',
        },
        { type: 'number', message: 'age must be a number' },
    ],
});

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        // 校验通过, 发送请求新增用户
        if (valid) {
            updateUser();
        } else {
            console.log('error submit!', fields);
        }
    });
};

// 发送请求新增用户
const updateUser = async () => {
    const res: any = await axios.patch(`/user/${props.curUser?.uuid}`, {
        identity: form.identity,
        name: form.name,
        password: form.psw,
        phone: form.phone,
        email: form.email,
        college: form.college,
        major: form.major,
        class: form.class,
    });

    // 更新成功, 弹窗提示, 关闭弹窗, 刷新列表数据
    if (res.status === 201 || res.affected === 1) {
        ElMessage({
            message: '更新成功',
            type: 'success',
        });
        handleClose();
        emit('initUserList');
    } else {
        // 更新失败, 弹窗提示
        ElMessage({
            message: '更新失败',
            type: 'error',
        });
    }
};

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};

// 关闭弹窗
const handleClose = () => {
    emit('update:visible', false);
    setTimeout(() => {
        resetForm(ruleFormRef.value);
    }, 500);
};
</script>
