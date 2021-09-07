// 請求文件
import axios from 'axios'
import { Loading, Message } from 'element-ui';
import router from './router'

let loading;

function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '加載中...',
        background: 'rgba(0,0,0,0.7)'
    })
}

function endLoading() {
    loading.close()
}

//請求攔截
axios.interceptors.request.use(
    config => {
        // 加載動畫
        startLoading();

        if (localStorage.eleToken) {
            config.headers.Authorization = localStorage.eleToken
        }

        return config;
    },
    error => {
        return Promise.reject(error)
    }
)

//響應攔截
axios.interceptors.response.use(response => {
        // 結束加載動畫
        endLoading();
        return response;
    },
    error => {
        // 錯誤提醒
        endLoading();
        Message.error(err.response.data)

        // 如果是401，代表token失效，就要清除token
        const { status } = error.response
        if (status == 401) {
            Message.error("token失效，請重新登入!")
                // 清除token
            localStorage.removeItem('eleToken')
            router.push('./login')
        }
        return Promise.reject(error)
    })


export default axios