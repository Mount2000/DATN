import instance from "../axios";

export const apiLogin = (data) => instance({
    url: 'auth/login',
    method: 'post',
    data,
});
export const apiRegister = (data) => instance({
    url: 'auth/register',
    method: 'post',
    data,
});

export const apiRefreshToken = (data) => instance({
    url: "auth/RefreshToken",
    method: "post",
    data,
})

export const apiVerifyEmailRegister = (token) => instance({
    url: `auth/verifyEmailRegister/${token}`,
    method: "post",
})

export const apiForgotPassword = (data) => instance({
    url: `auth/forgotPassword`,
    method: "post",
    data,
})

export const apiResetPassword = (token, data) => instance({
    url: `auth/resetPassword/${token}`,
    method: "post",
    data,
})