import axios from 'axios'

export class TecnicoService {

    getTecnicos() {
        return axios.get('http://localhost:9090/api/v1.0/tecnico')
            .then(res => res.data.result);
    }

    postTecnicos(tec) {
        return axios.post('http://localhost:9090/api/v1.0/tecnico', tec)
    }

    putTecnicos(tecni) {
        return axios.put('http://localhost:9090/api/v1.0/tecnico', tecni)
    }

    deleteTecnicos(id){
        return axios.delete('http://localhost:9090/api/v1.0/tecnico/' + id)
    }
}