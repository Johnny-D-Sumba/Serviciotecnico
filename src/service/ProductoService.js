import axios from 'axios'

export class ProductoService {

    getProductos() {
        return axios.get('http://localhost:9090/api/v1.0/producto')
            .then(res => res.data.result);
    }

    postProductos(prod) {
        return axios.post('http://localhost:9090/api/v1.0/producto', prod)
    }

    putProductos(produ) {
        return axios.put('http://localhost:9090/api/v1.0/producto', produ)
    }

    deleteProductos(id){
        return axios.delete('http://localhost:9090/api/v1.0/producto/' + id)
    }
}