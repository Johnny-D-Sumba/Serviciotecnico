import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { EmpresaService } from "../service/EmpresaService";

const FormLayoutEmpresa = () => {
    let emptyEmpresa = {
        id: null,
        ruc: "",
        nombre: "",
        direccion: "",
        ciudad: "",
        telefono: "",
        email:"",
        porcentajeIVA: ""
    };

    const [ciudades, setEmpresas] = useState(null);
    const [ciudad, setProduct] = useState(emptyEmpresa);
    const [dropdownItem, setDropdownItem] = useState(null);
    const dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];

    /*useEffect(() => {
        const empresaService = new EmpresaService();
        empresaService.getEmpresas().then((data) => setEmpresas(data));
    }, []);*/

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.nombre}
            </>
        );
    };

    return (
        <div className="grid">

            <div className="col-12">
                <div className="card">
                    <h5>Empresa</h5>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="nomepmre" body={nameBodyTemplate}>Nombre</label>
                            <InputText id="nomempre" type="text" />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="ruc">RUC</label>
                            <InputText id="ruc" type="text" />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="tele">Teléfono</label>
                            <InputText id="tele" type="text" />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="Ciudad">Ciudad</label>
                            <Dropdown id="Ciudad" value={dropdownItem} onChange={(e) => setDropdownItem(e.value)} options={dropdownItems} optionLabel="name" placeholder="Seleccionar ciudad"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="poriva">Porcentaje IVA</label>
                            <InputText id="poriva" type="text" />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="email">E-mail</label>
                            <InputText id="email" type="text" />
                        </div>
                    </div>
                    <div><Button label="Actualizar"></Button></div>
                </div>
            </div>
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(FormLayoutEmpresa, comparisonFn);