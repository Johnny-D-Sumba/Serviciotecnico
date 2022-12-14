import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProductService } from "../service/ProductService";
import { ClienteService } from "../service/ClienteService"

const Cliente = () => {
    let emptyCliente = {
        id: null,
        nombres: "",
        apellidos:"",
        dni:"",
        direccion:"",
        telefono:"",
        celular:"",
        email:"",
        estado:""

    };

    const [clientes, setClientes] = useState(null);
    const [clienteDialog, setClienteDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [cliente, setCliente] = useState(emptyCliente);
    const [selectedClientes, setSelectedClientes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const clienteService = new ClienteService();
        clienteService.getClientes().then((data) => setClientes(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setCliente(emptyCliente);
        setSubmitted(false);
        setClienteDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setClienteDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (cliente.nombres.trim()) {
            let _products = [...clientes];
            let _product = { ...cliente };
            if (cliente.id) {
                const index = findIndexById(cliente.id);

                _products[index] = _product;

                const clientserv = new ClienteService();
                clientserv.putClientes(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Cliente actualizado",
                    life: 3000,
                });
            } else {
                const clientserv = new ClienteService();
                clientserv.postClientes(_product)
                // _product.id = createId();
                // _product.image = "product-placeholder.svg";
                // _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Cliente creado",
                    life: 3000,
                });
            }

            setClientes(_products);
            setClienteDialog(false);
            setCliente(emptyCliente);
        }
    };

    const editProduct = (product) => {
        setCliente({ ...product });
        setClienteDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setCliente(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = clientes.filter((val) => val.id !== cliente.id);
        setClientes(_products);
        setDeleteProductDialog(false);
        setCliente(emptyCliente);
        const clientserv = new ClienteService();
        clientserv.deleteCuidades(cliente.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Cliente creado",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < clientes.length; i++) {
            if (clientes[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = "";
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = clientes.filter((val) => !selectedClientes.includes(val));
        setClientes(_products);
        setDeleteProductsDialog(false);
        setSelectedClientes(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Clientes eliminados",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...cliente };
        _product["category"] = e.value;
        setCliente(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...cliente };
        _product[`${name}`] = val;

        setCliente(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...cliente };
        _product[`${nombre}`] = val;

        setCliente(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.nombres}
            </>
        );
    };
    const surnameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Surname</span>
                {rowData.apellidos}
            </>
        );
    };
    const dniBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">dni</span>
                {rowData.dni}
            </>
        );
    };
    const adressBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Adress</span>
                {rowData.direccion}
            </>
        );
    };
    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Phone</span>
                {rowData.telefono}
            </>
        );
    };
    const cellphoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cellphone</span>
                {rowData.celular}
            </>
        );
    };
    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };
    const stateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">State</span>
                {rowData.estado}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`assets/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readonly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Clientes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={clientes}
                        selection={selectedClientes}
                        onSelectionChange={(e) => setSelectedClientes(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No existen clientes registrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="code" header="Id" body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="name" header="Nombre" body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="surname" header="Apellido" body={surnameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="dni" header="Cedula" body={dniBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="adress" header="Direcci??n" body={adressBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="phone" header="Tel??fono" body={phoneBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="cellphone" header="Celular" body={cellphoneBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="email" header="E-mail" body={emailBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={clienteDialog} style={{ width: "450px" }} header="Cliente" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText
                                id="nombre"
                                value={cliente.nombres}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !cliente.nombres,
                                })}
                            />
                            {submitted && !cliente.nombres && <small className="p-invalid">El nombre del cliente es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Apellido</label>
                            <InputText
                                id="apellido"
                                value={cliente.apellidos}
                                onChange={(e) => onInputChange(e, "apellido")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !cliente.apellidos,
                                })}
                            />
                            {submitted && !cliente.apellidos && <small className="p-invalid">El apellido del cliente es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Cedula</label>
                            <InputText
                                id="cedula"
                                value={cliente.dni}
                                onChange={(e) => onInputChange(e, "cedula")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !cliente.dni,
                                })}
                            />
                            {submitted && !cliente.dni && <small className="p-invalid">El numero de cedula del cliente es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Direcci??n</label>
                            <InputText
                                id="direccion"
                                value={cliente.direccion}
                                onChange={(e) => onInputChange(e, "direccion")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !cliente.direccion,
                                })}
                            />
                            {submitted && !cliente.direccion && <small className="p-invalid">La direcci??n del cliente es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Tel??fono</label>
                            <InputText
                                id="telefono"
                                value={cliente.telefono}
                                onChange={(e) => onInputChange(e, "telefono")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !cliente.telefono,
                                })}
                            />
                            {submitted && !cliente.telefono && <small className="p-invalid">El numero de tel??fono del cliente es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Celular</label>
                            <InputText
                                id="celular"
                                value={cliente.celular}
                                onChange={(e) => onInputChange(e, "celular")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !cliente.celular,
                                })}
                            />
                            {submitted && !cliente.celular && <small className="p-invalid">El numero de celular del cliente es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">E-mail</label>
                            <InputText
                                id="email"
                                value={cliente.email}
                                onChange={(e) => onInputChange(e, "email")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !cliente.email,
                                })}
                            />
                            {submitted && !cliente.email && <small className="p-invalid">La direcci??n e-mail del cliente es necesario.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Verificaci??n" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {cliente && (
                                <span>
                                    Est?? seguro de borrar el cliente <b>{cliente.nombres}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {cliente && <span>Est?? seguro de borrar estos clientes?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Cliente, comparisonFn);
