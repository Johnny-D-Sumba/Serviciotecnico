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
import { ProductoService } from "../service/ProductoService";

const Producto = () => {
    let emptyTecnico = {
        id: null,
        codigo: "",
        nombre: "",
        precioventa: "",
        stockMin: "",
        stockMax: "",
        stock: "",
        controlaStock: "",
        aplicaIva: "",
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
            }
        }

    };

    const [productos, setProductos] = useState(null);
    const [productoDialog, setProductoDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [producto, setProducto] = useState(emptyTecnico);
    const [selectedProductos, setSelectedProductos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const tecnicoService = new TecnicoService();
        tecnicoService.getTecnicos().then((data) => setProductos(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setProducto(emptyTecnico);
        setSubmitted(false);
        setProductoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductoDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (producto.nombre.trim()) {
            let _products = [...productos];
            let _product = { ...producto };
            if (producto.id) {
                const index = findIndexById(producto.id);

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

            setProductos(_products);
            setProductoDialog(false);
            setProducto(emptyTecnico);
        }
    };

    const editProduct = (product) => {
        setProducto({ ...product });
        setProductoDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProducto(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = productos.filter((val) => val.id !== producto.id);
        setProductos(_products);
        setDeleteProductDialog(false);
        setProducto(emptyTecnico);
        const producserv = new ProductoService();
        producserv.deleteProductos(producto.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Producto eliminado",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].id === id) {
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
        let _products = productos.filter((val) => !selectedProductos.includes(val));
        setProductos(_products);
        setDeleteProductsDialog(false);
        setSelectedProductos(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Productos eliminados",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...producto };
        _product["category"] = e.value;
        setProducto(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...producto };
        _product[`${name}`] = val;

        setProducto(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...producto };
        _product[`${nombre}`] = val;

        setProducto(_product);
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
    const codigoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">codigo</span>
                {rowData.codigo}
            </>
        );
    };
    const prevenBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">precioventa</span>
                {rowData.precioventa}
            </>
        );
    };
    const stockminBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">stockmin</span>
                {rowData.stockMin}
            </>
        );
    };
    const stockmaxBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">stockmax</span>
                {rowData.stockMax}
            </>
        );
    };
    const stockBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">stock</span>
                {rowData.stock}
            </>
        );
    };
    const controlstockBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">controlstock</span>
                {rowData.controlaStock}
            </>
        );
    };
    const aplicaivaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">aplicaiva</span>
                {rowData.aplicaIva}
            </>
        );
    };
    const empresaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">empresa</span>
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
            <h5 className="m-0">Productos</h5>
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
                        value={productos}
                        selection={selectedProductos}
                        onSelectionChange={(e) => setSelectedProductos(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No existen productos registrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="code" header="Id" body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="name" header="Nombre" body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="codigo" header="Codigo" body={codigoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="stockmin" header="Stock Minimo" body={stockminBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="stockmax" header="Stock Maximo" body={stockmaxBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="stock" header="Stock Total" body={stockBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="controlstock" header="Control de Stock" body={controlstockBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="aplicaiva" header="Aplica IVA" body={aplicaivaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="empresa" header="Empresa" body={empresaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productoDialog} style={{ width: "450px" }} header="Producto" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText
                                id="nombre"
                                value={producto.nombre}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !producto.nombre,
                                })}
                            />
                            {submitted && !producto.nombre && <small className="p-invalid">El nombre del producto es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Codigo</label>
                            <InputText
                                id="codigo"
                                value={producto.codigo}
                                onChange={(e) => onInputChange(e, "codigo")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !producto.codigo,
                                })}
                            />
                            {submitted && !producto.codigo && <small className="p-invalid">El código del producto es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Stock Mínimo</label>
                            <InputText
                                id="stockmin"
                                value={producto.stockMin}
                                onChange={(e) => onInputChange(e, "stockmin")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !producto.stockMin,
                                })}
                            />
                            {submitted && !producto.stockMin && <small className="p-invalid">El Stock mínimo del producto es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Stock Máximo</label>
                            <InputText
                                id="stockmax"
                                value={producto.stockMax}
                                onChange={(e) => onInputChange(e, "stockmax")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !producto.stockMax,
                                })}
                            />
                            {submitted && !producto.stockMax && <small className="p-invalid">El stock máximo del producto es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Stock Total</label>
                            <InputText
                                id="stock total"
                                value={producto.stock}
                                onChange={(e) => onInputChange(e, "stocktotal")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !producto.stock,
                                })}
                            />
                            {submitted && !producto.stock && <small className="p-invalid">El stock total del porducto es necesario.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Control de stock</label>
                            <InputText
                                id="controlstock"
                                value={producto.controlaStock}
                                onChange={(e) => onInputChange(e, "conrolstock")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !producto.controlaStock,
                                })}
                            />
                            {submitted && !producto.controlaStock && <small className="p-invalid">Es necesario confirmar el control de stock.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Empresa</label>
                            <InputText
                                id="empresa"
                                value={producto.empresa}
                                onChange={(e) => onInputChange(e, "empresa")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !producto.empresa,
                                })}
                            />
                            {submitted && !producto.empresa && <small className="p-invalid">El nombre de la empresa es necesaria.</small>}
                        </div>
                        
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Verificación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {producto && (
                                <span>
                                    Está seguro de borrar el producto <b>{producto.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Verificación" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {producto && <span>Está seguro de borrar estos productos?</span>}
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

export default React.memo(Producto, comparisonFn);
