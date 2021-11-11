let dataTipos = [];
let tipo = document.querySelector(".farmacia") ? "Medicamento" : "Juguete";
let endPoint = `https://apipetshop.herokuapp.com/api/articulos`;

let arregloProductos = [];
let varStockGlobal = 0
let cardElement = document.querySelector("#container-productos");
fetch(endPoint)
  .then((res) => res.json())
  .then((data) => {
      dataTipos = data.response;
      console.log("el arreglo es:")
      console.log(dataTipos)
      console.log("el arreglo fue.")

      let datosGuardados = localStorage.getItem("datosGuardados")

      arregloProductos = dataTipos.map(elem => {
        let newStock = parseInt(elem.stock)
        if (datosGuardados !== null) {
          let newData = JSON.parse(datosGuardados)
          newData.forEach(elemStorage => {
            if(elemStorage.id === elem._id){
              newStock = elemStorage.stock
            }
          })
        }
        let procesado = {
          _id: elem._id,
          nombre: elem.nombre,
          precio: elem.precio,
          imagen: elem.imagen,
          stock: newStock,
          tipo: elem.tipo
        };
        return procesado;
      });

      if (document.title === 'PetShop | Juguetes' || document.title === 'PetShop | Farmacia') {
        console.log("===dataTipos==")
        console.log(dataTipos)
        console.log("===arregloProductos==")
        console.log(arregloProductos)
        console.log("=====")
        arregloProductos.forEach((elem) => {
          if (elem.tipo == tipo) {
            
            if (elem.stock === 0) {
              cardElement.innerHTML += `<div class="d-flex justify-content-center us-w-100 sm-w-50 md-w-50 col-sm-12 col-md-6 col-lg-4 p-2">
                <div class="card w-100 p-6 d-flex align-items-center justify-content-evenly flex-column card-border border-2 card-size">
                    <img class="lazyloaded img-producto"
                        src="${elem.imagen}"
                        alt="${elem.nombre}">
                    <div class="d-flex flex-column justify-content-evenly">
                        <h5 class="card-title fw-bold text-center pt-3 nombre">${elem.nombre}</h5>
                        <p class="card-text text-center precio fw-bold">$ ${elem.precio}</p>
                        <div id="div-cantidad-${elem._id}" class="text-center pb-3">
                          <label for="price" class="cantidad">Cantidad: </label>
                          <label id="label-${elem._id}">SIN STOCK </label>
                        </div>
                        <div class="d-flex align-items-center justify-content-center">
                        <button id="${elem._id}" class="boton-comprar btn btn-primary bg-custom mb-3" disabled>Agregar al carrito</button>
                        </div>
                    </div>
                </div>
              </div>`;
            } else {
              
              cardElement.innerHTML += `<div class="d-flex justify-content-center us-w-100 sm-w-50 md-w-50 col-sm-12 col-md-6 col-lg-4 p-2">
                <div class="card w-100 p-6 d-flex align-items-center justify-content-evenly flex-column card-border border-2 card-size">
                    <img class="lazyloaded img-producto"
                        src="${elem.imagen}"
                        alt="${elem.nombre}">
                    <div class="d-flex flex-column justify-content-evenly">
                        <h5 class="card-title fw-bold text-center pt-3 nombre">${elem.nombre}</h5>
                        <p class="card-text text-center precio fw-bold">$ ${elem.precio}</p>
                        <div id="div-cantidad-${elem._id}" class="text-center pb-3">
                            <label for="price" class="cantidad">Cantidad: </label>
                            <input id="cantidad-${elem._id}" class="text-center" type="number" name="cantidad-id"
                                min="0" max="${elem.stock}" step="1" value="1">
                        </div>
                        <div class="d-flex align-items-center justify-content-center">
                          <button id="${elem._id}" class="boton-comprar btn btn-primary bg-custom mb-3">Agregar al carrito</button>
                        </div>
                    </div>
                </div>
              </div>`;
            }
  
          }
        });
      }
  })
  .catch((err) => console.error(err));

function guardaDatos(id) {
  
  let nombre_producto;
  let precio_producto;
  let nombre_imagen;

  let str = "cantidad-" + id
  let qty = parseInt(document.getElementById(str).value)

  arregloProductos.forEach((elem) => {
    if (elem._id === id) {
      nombre_producto = elem.nombre;
      precio_producto = elem.precio;
      nombre_imagen = elem.imagen;

      elem.stock -= qty;
      varStockGlobal = elem.stock;
    }
  });
  
  let data = [
    {
      id,
      cantidad: qty,
      nombre: nombre_producto,
      precio: precio_producto,
      imagen: nombre_imagen,
      stock: varStockGlobal
    },
  ];
  let datosGuardados = localStorage.getItem("datosGuardados");
  if (datosGuardados === null) {
    localStorage.setItem("datosGuardados", JSON.stringify(data));
  } else {
    let newData = JSON.parse(datosGuardados)
    let yaEsta = false
    newData.forEach(elem => {
      elem.cantidad = parseInt(elem.cantidad)
      if(elem.id === data[0].id){
        yaEsta = true
        elem.cantidad += data[0].cantidad 
        elem.stock -= data[0].cantidad 
      }

    })
    if(yaEsta){
      data = newData
    }else{
      newData.forEach((elem) => data.push(elem))
    } 
    localStorage.setItem("datosGuardados", JSON.stringify(data));
  }
}

if (document.title != "PetShop | Carrito") {
  cardElement.addEventListener("click", agregarAlCarrito);
}

function agregarAlCarrito(e) {
  if (e.target.classList.contains("boton-comprar")) {
    
    if (document.getElementById("cantidad-"+e.target.id))
    {
        guardaDatos(e.target.id);

        //Descuenta cantidad al max value
        let divCantidadId = "div-cantidad-"+e.target.id
        console.log(divCantidadId)
        let divCantidadProd = document.getElementById(divCantidadId)
        
        if (varStockGlobal === 0) {
          divCantidadProd.innerHTML = `
          <label for="price" class="cantidad">Cantidad: </label>
          <label id="label-${e.target.id}">SIN STOCK </label>
              `;
          document.getElementById(e.target.id).disabled = true;
        } else {
          divCantidadProd.innerHTML = `
          <label for="price" class="cantidad">Cantidad: </label>
          <input id="cantidad-${e.target.id}" class="text-center" type="number" name="cantidad-id"
              min="0" max="${varStockGlobal}" step="1" value="0">
              `;
          document.getElementById(e.target.id).disabled = false;
        }
    }
  }
}

function traerDatos(key) {
  let datos = localStorage.getItem(key);
  return JSON.parse(datos);
}

let dataStorage = traerDatos("datosGuardados");
// console.log(dataStorage)
function agregarDatos(id) {
  let tablaArticulos = document.querySelector(`#${id}`);
  dataStorage.forEach((elem) => {
    tablaArticulos.innerHTML += `<tr>
                                    <td class="product__cart__item">
                                        <div class="product__cart__item__pic">
                                            <img class="shopping__cart__table-img" src="${elem.imagen}">
                                        </div>
                                        <div class="product__cart__item__text">
                                            <h6>${elem.nombre}</h6>
                                            <h5 id="id">$ ${elem.precio}</h5>
                                        </div>
                                    </td>
                                    <td class="quantity__item">
                                        <div class="quantity">
                                            <div class="pro-qty-2">
                                                <input type="text" value="1" readonly>
                                            </div>
                                        </div>
                                    </td>
                                    <td id="ccu-total" class="cart__price">$ ${elem.precio}</td>
                                  </tr>`;
  });
}
agregarDatos("tabla_articulos");

function imprimirCantidad() {
  let datos = localStorage.getItem("datosGuardados")
  let cantidad = 0
  if (datos) {
    let data = JSON.parse(datos)
    data.forEach((elem) => {
      cantidad += parseInt(elem.cantidad)
    })
  }
  let cantidadDOM = document.querySelector('#cantidad-carrito')
  cantidadDOM.innerText = cantidad
}

imprimirCantidad()