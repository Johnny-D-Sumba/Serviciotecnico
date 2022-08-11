import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";

const FormLayoutFactura = () => {
    const [dropdownItem, setDropdownItem] = useState(null);
    const [calendarValue, setCalendarValue] = useState(null);
    const [customers3, setCustomers3] = useState([]);
    const dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];
    const toast = useRef(null);
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Agregar producto" icon="pi pi-plus" className="p-button-success mr-2" />
                </div>
            </React.Fragment>
        );
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Datos de la factura</h5>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="cliente">Cliente</label>
                            <InputText id="cliente" type="text" />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="codacces">Código de accceso</label>
                            <InputText id="codacces" type="text" />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="guiarem">Guía de remisión</label>
                            <InputText id="guiarem" type="text" />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="guiarem">Fecha de emisión</label>
                            <Calendar showIcon showButtonBar value={calendarValue} onChange={(e) => setCalendarValue(e.value)}></Calendar>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="oserv">Orden de servicio</label>
                            <InputText id="oserv" type="text" />
                        </div>
                        <div className="field col-12">
                            <label htmlFor="address">Detalle de Factura</label>
                            <Toast ref={toast} />
                            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                            <DataTable value={customers3} rowGroupMode="subheader" groupRowsBy="representative.name"
                                sortMode="single" sortField="representative.name" sortOrder={1} scrollable scrollHeight="400px" responsiveLayout="scroll">
                                <Column field="codigo" header="Código" style={{ minWidth: '200px' }}></Column>
                                <Column field="cantidad" header="Cantidad" style={{ minWidth: '200px' }}></Column>
                                <Column field="descripcion" header="Descripción" style={{ minWidth: '200px' }}></Column>
                                <Column field="preciouni" header="Precio unitario" style={{ minWidth: '200px' }}></Column>
                                <Column field="porcentajeiva" header="Porcentaje IVA" style={{ minWidth: '200px' }}></Column>
                                <Column field="valiva" header="Valor con IVA" style={{ minWidth: '200px' }}></Column>
                                <Column field="total" header="Total" style={{ minWidth: '200px' }}></Column>
                            </DataTable>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="subtot">Subtotal</label>
                            <InputText id="subtot" type="text" />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="valiva">Valor IVA</label>
                            <InputText id="valiva" type="text" />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="subiva">Subtotal con IVA</label>
                            <InputText id="subiva" type="text" />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="desc">Descuento</label>
                            <InputText id="desc" type="text" />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="total">Total</label>
                            <InputText id="total" type="text" />
                        </div>
                    </div>
                    <div><Button label="Generar factura"></Button></div>
                </div>
            </div>
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(FormLayoutFactura, comparisonFn);