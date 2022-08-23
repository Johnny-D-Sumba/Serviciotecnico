import axios from "axios";

export class FacturaService {
    getFacturas() {
        return axios.get('http://localhost:9090/api/v1.0/factura')
            .then(res => res.data.result);
    }

    postFacturas(fact) {
        return axios.post('http://localhost:9090/api/v1.0/factura', fact)
    }
}