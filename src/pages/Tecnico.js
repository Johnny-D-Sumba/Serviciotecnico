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
import { TecnicoService } from "../service/TecnicoService";

const Tecnico = () => {
    let emptyTecnico = {
        id: null,
        cedula: "",
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        ciudad: {
            id: null,
            nombre: "",
            provincia: {
                id: null,
                nombre: ""
            }
        },
        empresa: {
            id: null,
            ruc: "",
            nombre: "",
            direccion: "",
            ciudad: {
                id: null,
                nombre: "",
                provincia: {
                    id: null,
                    nombre: ""
                }
            },
            telefono: "",
            email: "",
            porcentajeIVA: ""
        }

    };

    const [tecnicos, setTecnicos] = useState(null);
    const [tecnicoDialog, setTecnicoDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [tecnico, setTecnico] = useState(emptyTecnico);
    const [selectedTecnicos, setSelectedTecnicos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const tecnicoService = new TecnicoService();
        tecnicoService.getTecnicos().then((data) => setTecnicos(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setTecnico(emptyTecnico);
        setSubmitted(false);
        setTecnicoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTecnicoDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (tecnico.nombre.trim()) {
            let _products = [...tecnicos];
            let _product = { ...tecnico };
            if (tecnico.id) {
                const index = findIndexById(tecnico.id);

                _products[index] = _product;

                const tecniserv = new TecnicoService();
                tecniserv.putTecnicos(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Técnico actualizado",
                    life: 3000,
                });
            } else {
                const tecniserv = new TecnicoService();
                tecniserv.postTecnicos(_product)
                // _product.id = createId();
                // _product.image = "product-placeholder.svg";
                // _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Técnico creado",
                    life: 3000,
                });
            }

            setTecnicos(_products);
            setTecnicoDialog(false);
            setTecnico(emptyTecnico);
        }
    };

    const editProduct = (product) => {
        setTecnico({ ...product });
        setTecnicoDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setTecnico(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = tecnicos.filter((val) => val.id !== tecnico.id);
        setTecnicos(_products);
        setDeleteProductDialog(false);
        setTecnico(emptyTecnico);
        const tecniserv = new TecnicoService();
        tecniserv.deleteTecnicos(tecnico.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "técnico eliminado",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < tecnicos.length; i++) {
            if (tecnicos[i].id === id) {
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
        let _products = tecnicos.filter((val) => !selectedTecnicos.includes(val));
        setTecnicos(_products);
        setDeleteProductsDialog(false);
        setSelectedTecnicos(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Técnicos eliminados",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...tecnico };
        _product["category"] = e.value;
        setTecnico(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...tecnico };
        _product[`${name}`] = val;

        setTecnico(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...tecnico };
        _product[`${nombre}`] = val;

        setTecnico(_product);
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
                {rowData.nombre}
            </>
        );
    };
    const surnameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Surname</span>
                {rowData.apellido}
            </>
        );
    };
    const cedulaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cedula</span>
                {rowData.cedula}
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
    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Phone</span>
                {rowData.telefono}
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
    const cityBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">City</span>
                {rowData.ciudad}
            </>
        );
    };
    const empresaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Empresa</span>
                {rowData.empresa}
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
            <h5 className="m-0">Técnicos</h5>
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
                        value={tecnicos}
                        selection={selectedTecnicos}
                        onSelectionChange={(e) => setSelectedTecnicos(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No existen técnicos registrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="code" header="Id" body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="name" header="Nombre" body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="surname" header="Apellido" body={surnameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="cedula" header="Nº Cedula" body={cedulaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="phone" header="Teléfono" body={phoneBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="adress" header="Dirección" body={adressBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="email" header="E-mail" body={emailBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="city" header="Ciudad" body={cityBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="empresa" header="Empresa" body={empresaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={tecnicoDialog} style={{ width: "450px" }} header="Técnico" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText
                                id="nombre"
                                value={tecnico.nombre}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tecnico.nombre,
                                })}
                            />
                            {submitted && !tecnico.nombre && <small className="p-invalid">El nombre del técnico es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Apellido</label>
                            <InputText
                                id="apellido"
                                value={tecnico.apellido}
                                onChange={(e) => onInputChange(e, "apellido")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tecnico.apellido,
                                })}
                            />
                            {submitted && !tecnico.apellido && <small className="p-invalid">El apellido del técnico es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Cedula</label>
                            <InputText
                                id="cedula"
                                value={tecnico.cedula}
                                onChange={(e) => onInputChange(e, "cedula")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tecnico.cedula,
                                })}
                            />
                            {submitted && !tecnico.cedula && <small className="p-invalid">El numero de cedula del técnico es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Teléfono</label>
                            <InputText
                                id="telefono"
                                value={tecnico.telefono}
                                onChange={(e) => onInputChange(e, "telefono")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tecnico.telefono,
                                })}
                            />
                            {submitted && !tecnico.telefono && <small className="p-invalid">El numero de teléfono del técnico es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Dirección</label>
                            <InputText
                                id="direccion"
                                value={tecnico.direccion}
                                onChange={(e) => onInputChange(e, "direccion")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tecnico.direccion,
                                })}
                            />
                            {submitted && !tecnico.direccion && <small className="p-invalid">La dirección del técnico es necesaria.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">E-mail</label>
                            <InputText
                                id="email"
                                value={tecnico.email}
                                onChange={(e) => onInputChange(e, "email")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tecnico.email,
                                })}
                            />
                            {submitted && !tecnico.email && <small className="p-invalid">La dirección e-mail del técnico es necesaria.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Ciudad</label>
                            <InputText
                                id="ciudad"
                                value={tecnico.nombre}
                                onChange={(e) => onInputChange(e, "ciudad")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tecnico.nombre,
                                })}
                            />
                            {submitted && !tecnico.nombre && <small className="p-invalid">La cuidad del técnico es necesaria.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Empresa</label>
                            <InputText
                                id="nombre"
                                value={tecnico.nombre}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tecnico.nombre,
                                })}
                            />
                            {submitted && !tecnico.nombre && <small className="p-invalid">El nombre del técnico es necesario.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Verificación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tecnico && (
                                <span>
                                    Está seguro de borrar el técnico <b>{tecnico.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tecnico && <span>Está seguro de borrar estos técnicos?</span>}
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

export default React.memo(Tecnico, comparisonFn);
