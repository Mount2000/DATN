import instance from "../axios";

export const apiLogin = (data) => instance({
    url: 'auth/login',
    method: 'post',
    data,
});
export const apiVerify2FALogin = (data) => instance({
    url: 'auth/verify2FALogin',
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

export const apiLogout = () => instance({
    url: `auth/logout`,
    method: "get",
})

export const apiAdd2FA = () => instance({
    url: `auth/add2FA`,
    method: "post",
})

export const apiVerify2FA = (data) => instance({
    url: `auth/verify2FA`,
    method: "post",
    data,
})

export const apiChangePassword = (data) => instance({
    url: `auth/changePassword`,
    method: "post",
    data,
})