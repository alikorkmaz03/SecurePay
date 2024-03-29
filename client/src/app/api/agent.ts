import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { PaginatedResponse } from "../models/pagination";
import { router } from "../router/Routes";
import { store } from "../store/configureStore";
 
 

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;
//Arrow Function ile kullanım
const responseBody = (response: AxiosResponse) => response.data;
//axios interceptors
axios.interceptors.request.use(config => {
  const token = store.getState().account.user?.token; // kullanıcının token'ını al
  config.headers = config.headers || {}; // headers nesnesini kontrol et ve nesne olarak ekle
  if (token) config.headers.Authorization = `Bearer ${token}`; // token headerına ekle
  
  return config;
});


axios.interceptors.response.use(async response => {
    if (process.env.NODE_ENV === 'development') await sleep();
    const pagination = response.headers['pagination'];
    if (pagination) {
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response;
    }
    return response
}, (error: AxiosError) => {    
    const { data, status } = error.response as any;//Kodunuzun içerisinde yazarken bazı kısımları eksik bıraktığınızda bunları JS olduğu gibi any kodu ile çağırabilir
    switch (status) {
        case 400:
            if (data.errors) {
                const modelStateErrors: string[] = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;

        case 401:
            toast.error(data.title);
            break;

        case 500:
            router.navigate('/server-error', { state: { error: data } })
            break;

        default:
            break;
    }
    return Promise.reject(error.response);

})

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),

}
const Payments={
    createPaymenIntent : ()=>requests.post('payments',{})
}

const Catalog =
{
    list: (params: URLSearchParams) => requests.get('products', params),
    details: (id: number) => requests.get(`products/${id}`),
    fetchFilters: () => requests.get('products/filters'),
}
const TestErrors = {
    get400Error: () => requests.get('buggy/bad-requests'),
    get401Error: () => requests.get('buggy/unauthorised'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),
}

const Basket = {
    get: () => requests.get('basket'),
    // Hata senaryosu için addItem:(productId:number,quantity=1)=>requests.post(`basket?productId=100&quantity=${quantity}`,{}),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),

}
const Account = {
    login: (values: any) => requests.post('account/login', values),
    register: (values: any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/currentUser'),
    fetchAddres: ()=>requests.get('account/savedAddress')
}
const CustomerPayments={
    list: (params: URLSearchParams) => requests.get('payments/customerpayments', params),    
    fetchFilters: () => requests.get('payments/filters'),
  
}

const Orders = {
    list: () => requests.get('orders'),
    fetch: (id: number) => requests.get(`orders/${id}`),
    create: (values:any)=>requests.post('orders',values)
}

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders,
    Payments,
    CustomerPayments
}

export default agent;
