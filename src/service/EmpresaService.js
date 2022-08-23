import axios from "axios";

export class EmpresaService {
    getEmpresas() {
        return axios.get('http://localhost:9090/api/v1.0/empresa')
            .then(res => res.data.result);
    }

    postEmpresas(emp) {
        return axios.post('http://localhost:9090/api/v1.0/empresa', emp)
    }

    putEmpresas(empres) {
        return axios.put('http://localhost:9090/api/v1.0/empresa', empres)
    }
}