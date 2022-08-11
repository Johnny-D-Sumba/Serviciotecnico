import axios from 'axios'

export class ProvinciaService {

    getProvincias() {
        return axios.get('http://localhost:9090/api/v1.0/provincia')
            .then(res => res.data.result);
    }

    postProvincias(provi) {
        return axios.post('http://localhost:9090/api/v1.0/provincia', provi)
    }

    putProvincias(provn) {
        return axios.put('http://localhost:9090/api/v1.0/provincia', provn)
    }

    deleteProvincias(id){
        return axios.delete('http://localhost:9090/api/v1.0/provincia/' + id)
    }
}