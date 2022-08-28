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
import { ProvinciaService } from "../service/ProvinciaService"
import { FacturaService } from "../service/FacturaService"

const FacturaList = () => {
    let emptyFactura = {
        id: null,
        numero: "",
        numeroEstablecimiento: "",
        numeroPuntoEmision: "",
        numeroSecuencial: "",
        codigoAcceso: "",
        empresa: {
            id: 1,
            ruc: "",
            nombre: "",
            direccion: "",
            ciudad: {
                id: 2,
                nombre: "",
                provincia: {
                    id: 2,
                    nombre: ""
                }
            },
            telefono: "",
            email: "",
            porcentajeIVA: ""
        },
        cliente: {
            id: 1,
            nombres: "",
            apellidos: "",
            dni: "",
            direccion: "",
            telefono: "",
            celular:"",
            email: "",
            estado: ""
        },
        fechaEmision: "",
        guiaRemision: "",
        subtotalIVA: "",
        subtotalSinIVA: "",
        descuento: "",
        valorIVA: "",
        total: "",
        ordenServicio: {
            id: 1,
            numero_orden: "",
            empresa: {
                id: 1,
                ruc: "",
                nombre: "",
                direccion: "",
                ciudad: {
                    id: 2,
                    nombre: "",
                    provincia: {
                        id: 2,
                        nombre: ""
                    }
                },
                telefono: "",
                email: "",
                porcentajeIVA: ""
            },
            cliente: {
                id: 1,
                nombres: "",
                apellidos: "",
                dni: "",
                direccion: "",
                telefono: "",
                celular:"",
                email: "",
                estado: ""
            },
            fecha_emision: "",
            estado_orden_servicio: {
                id: 1,
                state: "",
                empresa: {
                    id: 1,
                    ruc: "",
                    nombre: "",
                    direccion: "",
                    ciudad: {
                        id: 2,
                        nombre: "",
                        provincia: {
                            id: 2,
                            nombre: ""
                        }
                    },
                    telefono: "",
                    email: "",
                    porcentajeIVA: ""
                },
            },
            sub_total_con_IVA: "",
            sub_total_sin_IVA: "",
            tecnico: {
                id: 1,
                cedula: "",
                nombre: "",
                apellido: "",
                email: "",
                telefono: "",
                direccion: "",
                empresa: {
                    id: 1,
                    ruc: "",
                    nombre: "",
                    direccion: "",
                    ciudad: {
                        id: 2,
                        nombre: "",
                        provincia: {
                            id: 2,
                            nombre: ""
                        }
                    },
                    telefono: "",
                    email: "",
                    porcentajeIVA: ""
                }
            },
            descuento: "",
            valor_IVA: "",
            total: "",
            observaciones: ""
        }
    };

    const [facturas, setFacturas] = useState(null);
    const [provinciaDialog, setProvinciaDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [provincia, setProvincia] = useState(emptyFactura);
    const [selectedProvincias, setSelectedProvincias] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const provinciaService = new ProvinciaService();
        provinciaService.getProvincias().then((data) => setFacturas(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setProvincia(emptyFactura);
        setSubmitted(false);
        setProvinciaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProvinciaDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (provincia.nombre.trim()) {
            let _products = [...facturas];
            let _product = { ...provincia };
            if (provincia.id) {
                const index = findIndexById(provincia.id);

                _products[index] = _product;

                const provserv = new ProvinciaService();
                provserv.putProvincias(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Provincia actualizada",
                    life: 3000,
                });
            } else {
                const provserv = new ProvinciaService();
                provserv.postProvincias(_product)
                // _product.id = createId();
                // _product.image = "product-placeholder.svg";
                // _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Provincia creada",
                    life: 3000,
                });
            }

            setFacturas(_products);
            setProvinciaDialog(false);
            setProvincia(emptyFactura);
        }
    };

    const editProduct = (product) => {
        setProvincia({ ...product });
        setProvinciaDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProvincia(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = facturas.filter((val) => val.id !== provincia.id);
        setFacturas(_products);
        setDeleteProductDialog(false);
        setProvincia(emptyFactura);
        const provserv = new ProvinciaService();
        provserv.deleteProvincias(provincia.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Provincia eliminada",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < facturas.length; i++) {
            if (facturas[i].id === id) {
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
        let _products = facturas.filter((val) => !selectedProvincias.includes(val));
        setFacturas(_products);
        setDeleteProductsDialog(false);
        setSelectedProvincias(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Provincias eliminadas",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...provincia };
        _product["category"] = e.value;
        setProvincia(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...provincia };
        _product[`${name}`] = val;

        setProvincia(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...provincia };
        _product[`${nombre}`] = val;

        setProvincia(_product);
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
                <Button icon="pi pi-search" className="p-button-rounded p-button-success mr-2 " onClick={() => editProduct(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Facturas</h5>
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

                    <DataTable
                        ref={dt}
                        value={facturas}
                        selection={selectedProvincias}
                        onSelectionChange={(e) => setSelectedProvincias(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No existen provincias registradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="code" header="Nº Factura" body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="name" header="Cliente" body={nameBodyTemplate} headerStyle={{ width: "17%", minWidth: "10rem" }}></Column>
                        <Column field="date" header="Fecha de emisión" body={nameBodyTemplate} headerStyle={{ width: "18%", minWidth: "10rem" }}></Column>
                        <Column field="service" header="Nº Orden de servicio" body={nameBodyTemplate} headerStyle={{ width: "18%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={provinciaDialog} style={{ width: "450px" }} header="Provincia" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText
                                id="nombre"
                                value={provincia.nombre}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !provincia.nombre,
                                })}
                            />
                            {submitted && !provincia.nombre && <small className="p-invalid">El nombre de la provincia es necesario.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {provincia && (
                                <span>
                                    Está seguro de borrar la provincia <b>{provincia.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {provincia && <span>Está seguro de borrar estas provincias?</span>}
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

export default React.memo(FacturaList, comparisonFn);
