import axios from 'axios';

export class ProductService {

    getProductsSmall() {
        return axios.get('assets/demo/data/products-small.json').then(res => res.data.data);
    }

    getProducts() {
        return axios.get('http://localhost:9090/api/v1.0/provincia').then(res => res.data.result);
    }

    getProductsWithOrdersSmall() {
        return axios.get('assets/demo/data/products-orders-small.json').then(res => res.data.data);
    }
}