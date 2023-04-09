<template>
    <el-dialog
        :title="$t('Add User')"
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
                    :placeholder="$t(`User's Identity`)"
                    style="width: 100%"
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
                    :placeholder="$t(`User's Name`)"
                />
            </el-form-item>
            <el-form-item prop="psw">
                <el-input
                    v-model="form.psw"
                    type="password"
                    clearable
                    :placeholder="$t('Password')"
                    show-password
                />
            </el-form-item>
            <el-form-item prop="pswAgain">
                <el-input
                    v-model="form.pswAgain"
                    type="password"
                    clearable
                    :placeholder="$t('Password Again')"
                    show-password
                />
            </el-form-item>
            <el-form-item prop="phone">
                <el-input
                    v-model.number="form.phone"
                    clearable
                    :placeholder="$t('Phone (optional)')"
                />
            </el-form-item>
            <el-form-item prop="email">
                <el-input
                    v-model="form.email"
                    clearable
                    :placeholder="$t('Email (optional)')"
                />
            </el-form-item>
            <el-form-item
                prop="college"
                v-if="form.identity === '1' || form.identity === '2'"
            >
                <el-select
                    v-model="form.college"
                    clearable
                    :placeholder="$t('College')"
                    style="width: 100%"
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
                    :placeholder="$t('Major')"
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
                    :placeholder="$t('Class')"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose()">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    {{ $t('Confirm') }}
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { useMetaDataStore } from '@/store/modules/metaData';
import { watch, ref, reactive } from 'vue';
import { MetaData } from '@/common/interfaces';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import ajax from '@/utils/ajax';
import { UserInfo } from '../utils/interfaces';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
    visible: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:visible', newVal: boolean): void;
    (e: 'initUserList'): void;
}>();

const ruleFormRef = ref<FormInstance>(); // 表单实例

// 表单数据
const form = reactive<UserInfo>({
    identity: '',
    name: '',
    psw: '',
    pswAgain: '',
    phone: '',
    email: '',
    college: '',
    major: '',
    class: '',
});

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

const majors = ref<MetaData[]>([]); // 专业信息
// 监听学院信息变化, 更新专业信息
watch(
    () => form.college,
    async (newVal) => {
        // 发送请求获取专业信息
        const major: MetaData[] = await ajax.get('/major', {
            params: { collegeId: newVal },
        });
        form.major = ''; // 清空专业信息
        majors.value = major; // 更新专业信息
    },
);

// 表单验证规则
const rules = reactive<FormRules>({
    identity: {
        required: true,
        message: t('Please input {subject}', { subject: t('identity') }),
        trigger: 'change',
    },
    name: [
        {
            required: true,
            message: t('Please input {subject}', { subject: t('name') }),
            trigger: 'blur',
        },
        {
            min: 1,
            max: 30,
            message: t('Length should be {start} to {end}', {
                start: 1,
                end: 30,
            }),
            trigger: 'blur',
        },
    ],
    psw: [
        {
            required: true,
            message: t('Please input {subject}', { subject: t('password') }),
            trigger: 'blur',
        },
        {
            min: 1,
            max: 20,
            message: t('Length should be {start} to {end}', {
                start: 1,
                end: 20,
            }),
            trigger: 'blur',
        },
    ],
    pswAgain: [
        {
            validator: (_: any, value: string, callback: any) => {
                if (value !== form.psw) {
                    callback(new Error(t("Passwords don't match")));
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
                    callback(new Error(t('Phone number must be 11 digits')));
                }
            },
            trigger: 'blur',
        },
        {
            type: 'number',
            message: t('{item} must be a number', {
                item: t('Phone'),
            }),
        },
    ],
    email: {},
    college: {
        required: true,
        message: t('Please input {subject}', { subject: t('college') }),
        trigger: 'change',
    },
    major: {
        required: true,
        message: t('Please input {subject}', { subject: t('major') }),
        trigger: 'change',
    },
    class: [
        {
            required: true,
            message: t('Please input {subject}', { subject: t('class') }),
            trigger: 'blur',
        },
        {
            type: 'number',
            message: t('{item} must be a number', {
                item: t('Class'),
            }),
        },
    ],
});

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        // 校验通过, 发送请求新增用户
        if (valid) {
            addUser();
        } else {
            console.log('error submit!', fields);
        }
    });
};

// 发送请求新增用户
const addUser = async () => {
    const res = await ajax.post('/user', {
        identity: form.identity,
        name: form.name,
        password: form.psw,
        phone: form.phone,
        email: form.email,
        college: form.college,
        major: form.major,
        class: form.class,
    });

    // 新增成功, 弹窗提示, 关闭弹窗, 刷新列表数据
    if (res.status === 201) {
        ElMessage({
            message: t('Add Successfully'),
            type: 'success',
        });
        handleClose();
        emit('initUserList');
    } else {
        // 新增失败, 弹窗提示
        ElMessage({
            message: t('Add Failed'),
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
