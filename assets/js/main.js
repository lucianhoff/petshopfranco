/* Trae los datos de la API */

let dataTipos = []
let tipo = document.querySelector(".farmacia") ? "Medicamento" : "Juguete"
let endPoint = `https://apipetshop.herokuapp.com/api/articulos`
let carritoNumero = document.querySelector('#cantidad-carrito')
let arregloProductos = [];
let cardElement = document.querySelector("#container-productos")
fetch(endPoint)
  .then((res) => res.json())
  .then((data) => {
    dataTipos = data.response
    arregloProductos = dataTipos.map((elem) => {
      let procesado = {
        id: elem._id,
        nombre: elem.nombre,
        precio: elem.precio,
        imagen: elem.imagen,
      };
      return procesado
    });

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
              cardElement.innerHTML += `<div class="col-4 p-2">
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
              cardElement.innerHTML += `<div class="col-4 p-2">
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
            </div>
        </div>`;
        }
      }
      }
        )}
  })
  .catch((err) => console.error(err))

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
  ]
  let datosGuardados = localStorage.getItem("datosGuardados")
  if(datosGuardados === null){
    localStorage.setItem("datosGuardados", JSON.stringify(data))
  }else{
    let newData = JSON.parse(datosGuardados)
    let yaEsta = false
    newData.forEach(elem => {
      elem.cantidad = parseInt(elem.cantidad)
      if (elem.id === data[0].id) {
        yaEsta = true
        elem.cantidad += data[0].cantidad 
        elem.stock -= data[0].cantidad 
      }

    })
    if (yaEsta) {
      data = newData
    } else {
      newData.forEach((elem) => data.push(elem))
    }
    localStorage.setItem("datosGuardados", JSON.stringify(data))
  }
}

if (document.title != "PetShop | Carrito") {
  cardElement.addEventListener("click", agregarAlCarrito)
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
    guardaDatos(e.target.id)
    datosTotales(dataStorage)
    imprimirCantidad()
  }


}

function traerDatos(key) {
  let datos = localStorage.getItem(key);
  return JSON.parse(datos)
}

let dataStorage = traerDatos("datosGuardados")
let cantidadTotal
let dataStorage = traerDatos("datosGuardados") || []

function agregarDatos(id) {
  let tablaArticulos = document.querySelector(`#${id}`)
  if (tablaArticulos) {
    dataStorage.forEach((elem) => {
      tablaArticulos.innerHTML += `<tr>
                                      <td class="product__cart__item">
                                          <div class="product__cart__item__pic">
                                          <a type="button" id="${elem.id}" class="btn btn-danger eliminar">X</a>
                                          </div>
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
                                              <input id="cantidad-${elem._id}" class="text-center" type="number" name="cantidad-id"
                                              min="1" max="${elem.stock}" step="1" value="${elem.cantidad}">
                                                              </div>
                                          </div>
                                      </td>
                                      <td id="ccu-total" class="cart__price">$ ${elem.precio}</td>
                                   </tr>`
    })
  }

}
agregarDatos("tabla_articulos")

function imprimirDatos(array, id) {
  let tablaArticulos = document.querySelector(`#${id} tbody`)
  tablaArticulos.innerHTML = " "
  if(array.length != 0){
    array.forEach((elem) => {
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
                                             <input id="cantidad-${elem._id}" class="text-center" type="number" name="cantidad-id"
                                             min="1" max="${elem.stock}" step="1" value="${elem.cantidad}">
                                                             </div>
                                         </div>
                                     </td>
                                     <td id="ccu-total" class="cart__price">$ ${elem.precio}</td>
                                      <td>
                                         <a type="button" id="${elem.id}" class="badge bg-danger rounded-pill fs-6 text-decoration-none eliminar">&times;</a>
                                      </td>
  

                                     </tr>`
   })
  }else{
    tablaArticulos.innerHTML = `<h2>No existen articulos en el carrito....</h2>`
  }
}
imprimirDatos(dataStorage,"tabla_articulos")

let tabla_articulos = document.querySelector('#tabla_articulos')
tabla_articulos.addEventListener('click', eliminarArticulos)



if (document.title === 'PetShop | Carrito') {
  tabla_articulos.addEventListener('click', eliminarArticulos)

  let comprar = document.querySelector('#comprar')

  comprar.addEventListener('click', () => {
    Swal.fire(
      'Compra finalizada!',
      'Gracias por su compra!',
      'success'
    )

    tabla_articulos = ""

  })

  // contar()

  imprimirCantidad()
}

function eliminarArticulos(e) {
  if (e.target.classList.contains("eliminar")) {
    let index = dataStorage.findIndex(el=> el.id == e.target.id)
    dataStorage.splice(index, 1)
    localStorage.setItem("datosGuardados", JSON.stringify(dataStorage))
    imprimirDatos(dataStorage, "tabla_articulos")
    // spam.innerText = ""    
    datosTotales(dataStorage)
  }

}

function datosTotales(){
  let datos = localStorage.getItem("datosGuardados") 
  cantidadTotal = 0
  if(datos){
    let data = JSON.parse(datos)
    data.forEach(elem => {
      cantidadTotal += parseInt(elem.cantidad) * parseInt(elem.precio)
// console.log(cantidadTotal)      
    })
  }
  let spam = document.querySelector('#subtotal')
  let costoEnvio = document.querySelector('#costoEnvio')
  let codigoCupon = document.querySelector('#codigoCupon')
  let total = document.querySelector('#total')
  let envio = 1000
    if(cantidadTotal != 0){
    spam.innerText = `$ ${cantidadTotal}`
    costoEnvio.innerText = `$ ${envio}`
    total.innerText = `$ ${(cantidadTotal + envio)}` 
    codigoCupon.innerText = `$ ${0}`
  }else{
    total.innerText = `$ ${0}`
    cantidadTotal = 0
    costoEnvio.innerText = `$ ${0}`
    spam.innerText = `$ ${cantidadTotal}`
  }
}
datosTotales(dataStorage)

let arrayCupon = ['franco', 'grupo5', 'mindhub']

let inputCupon = document.querySelector('#cupon')
let botonCupon = document.querySelector('.btn-cupon')

botonCupon.addEventListener('click', e => {
  e.preventDefault()
  if(arrayCupon.includes(inputCupon.value)){
    envio = 500
    // console.log(cantidadTotal)
    total.innerText = `$ ${(cantidadTotal + 500)}` 
    costoEnvio.innerText = `$ ${envio}`
    codigoCupon.innerText =  `$ ${envio}`
  }else{

  }
})

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
