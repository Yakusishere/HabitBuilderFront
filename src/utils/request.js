import axios from 'axios';

const instance = axios.create({
  timeout: 5000,
  baseURL: '/api', // 确保 baseURL 以 /api 开头
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  validateStatus(status) {
    return status === 200;
  },
});

instance.interceptors.request.use(
  (config) => config,
  (error) => {
    console.error('Request Error:', error); // 打印请求错误
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    const res = response.data;
    return Promise.resolve(res);
  },
  (error) => {
    console.error('Response Error:', error.response ? error.response.data : error.message); // 打印响应错误详细信息
    const msg = {
      message: 'no data',
      data: 'none',
    };
    return Promise.reject(msg);
  }
);

export default instance;
