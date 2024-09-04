import axios from 'axios';

const instance = axios.create({
  timeout: 50000,
  baseURL: '/api', // 确保 baseURL 以 /api 开头
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1IiwiZXhwIjoxNzI1NTAzMzA4LCJzdWIiOiJhZG1pbiIsImlhdCI6MTcyNTQxNjkwOH0.ANvgRc544e1h1C75Yc_EksnCGv0FrUbi6jtMgexx740'
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
