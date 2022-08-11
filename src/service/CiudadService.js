import axios from 'axios'

export class CiudadService {

    getCiudades() {
        return axios.get('http://localhost:9090/api/v1.0/ciudad')
            .then(res => res.data.result);
    }

    postCiudades(ciud) {
        return axios.post('http://localhost:9090/api/v1.0/ciudad', ciud)
    }

    putCiudades(ciuda) {
        return axios.put('http://localhost:9090/api/v1.0/ciudad', ciuda)
    }

    deleteCiudades(id){
        return axios.delete('http://localhost:9090/api/v1.0/ciudad/' + id)
    }
}