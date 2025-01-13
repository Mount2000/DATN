import instance from "../axios";

export const apiGetListedConcerts = () => instance({
    url: 'marketplace/getListedConcerts',
    method: 'get',
});

export const apiGetListedTicket = (concertId) => instance({
    url: 'marketplace/getListedTicket/' + concertId,
    method: 'get',
});

export const apiBuyListTicket = (data) => instance({
    url: 'marketplace/buyListTicket/',
    method: 'post',
    data,
});