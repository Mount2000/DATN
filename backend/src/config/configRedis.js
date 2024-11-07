import { createClient } from 'redis';

    const clientRedis = createClient();
    clientRedis.on('error', err => console.log('Redis Client Error', err));
    await clientRedis.connect();


export default clientRedis