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