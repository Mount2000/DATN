import instance from "../axios";

export const apiGetUser = () => instance({
    url: "user/getUser",
    method: "get",
})

export const apiGetBoughtTickets = () => instance({
    url: "user/bought",
    method: "get",
})
export const apiGetBoughtConcert = (concertId) => instance({
    url: "user/boughtConcert/" + concertId,
    method: "get",
})

export const apiGetCreatedConcert = () => instance({
    url: "user/created",
    method: "get",
})

export const apiWithdrawConcert = (concertId) => instance({
    url: "user/withdrawConcert/" + concertId,
    method: "post",
})

export const apiWithdrawAccount = (data) => instance({
    url: "user/withdrawAccount",
    method: "post",
    data,
})

export const apiListTicket = (data) => instance({
    url: "user/list",
    method: "post",
    data,
})

export const apiUnlistTicket = (data) => instance({
    url: "user/unlist",
    method: "post",
    data,
})

export const apiActiveTicket = (data) => instance({
    url: "user/active",
    method: "post",
    data,
})