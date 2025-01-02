import instance from "../axios";

export const apiRequestNewEvent = (data) => instance({
    url: 'concertManager/pending',
    method: 'get',
    data,
});
export const apiSetApproveConcert = (data) => instance({
    url: 'concertManager/approve',
    method: 'post',
    data,
});