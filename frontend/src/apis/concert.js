import instance from "../axios";

export const apiGetAllConcerts = () => instance({
    url: 'concertManager',
    method: 'get',
});

export const apiGetConcertDetail = (concertId) => instance({
    url: `concertManager/detail/` + concertId,
    method: 'get',
});

export const apiSearchConcert = (data) => instance({
    url: 'concertManager/search',
    method: 'get',
    data,
});

export const apiCreateConcert = (data) => instance({
    url: 'concertManager/new',
    method: 'post',
    data,
});

export const apiBuyTicket = (concertId, data) => instance({
    url: 'concertManager/buy/' + concertId,
    method: 'post',
    data,
});