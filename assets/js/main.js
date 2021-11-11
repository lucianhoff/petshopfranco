let dataTipos = []
let tipo = document.querySelector(".farmacia") ? "Medicamento" : "Juguete"
let endPoint = `https://apipetshop.herokuapp.com/api/articulos`
let carritoNumero = document.querySelector('#cantidad-carrito')
let arregloProductos = [];
let cardElement = document.querySelector("#container-productos")
fetch(endPoint)
  .then((res) => res.json())
  .then((data) => {
    dataTipos = data.response;
    dataTipos.forEach((elem) => {
      if (elem.tipo == tipo) {

        cardElement.innerHTML += `<div class="col-6 p-2 d-flex justify-content-center align-items-center">
        <div class="card w-100 border border-primary d-flex align-items-center justify-content-evenly flex-column card-size">
            <img class="lazyloaded img-producto img-fluid"
                src="${elem.imagen}"
                alt="${elem.nombre}">
            <div class="d-flex flex-column justify-content-evenly">
                <h5 class="card-title fw-bold text-center nombre">${elem.nombre}</h5>
                <p class="card-text text-center precio fw-bold">$ ${elem.precio}</p>
                <div class="text-center pb-3">
                    <label for="price" class="cantidad">Cantidad: </label>
                    <input id="cantidad-${elem._id}" class="text-center" type="number" name="cantidad-id"
                        min="1" max="${elem.stock}" step="1" value="1">
                </div>
                <div class="d-flex align-items-center justify-content-center">
                  <a id="${elem._id}" class="boton-comprar btn btn-primary bg-custom mb-3">Agregar al carrito</a>
                </div>
            </div>
        </div>
    </div>`;
      }
    }
    );

    function guardaDatos(id) {
      let nombre_producto
      let precio_producto
      let nombre_imagen
      arregloProductos.forEach((elem) => {
        if (elem.id === id) {
          nombre_producto = elem.nombre
          precio_producto = elem.precio
          nombre_imagen = elem.imagen
        }
      });

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
          stock: varStockGlobal,
          cantidad: parseInt(document.getElementById("cantidad-" + id).value),
        },
      ]
      let datosGuardados = localStorage.getItem("datosGuardados")

      if (datosGuardados === null) {
        localStorage.setItem("datosGuardados", JSON.stringify(data))
      } else {
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
        guardaDatos(e.target.id)
        imprimirCantidad()

        if (document.getElementById("cantidad-" + e.target.id)) {
          guardaDatos(e.target.id);

          //Descuenta cantidad al max value
          let divCantidadId = "div-cantidad-" + e.target.id
          console.log(divCantidadId)
          let divCantidadProd = document.getElementById(divCantidadId)

          if (varStockGlobal === 0) {
            divCantidadProd.innerHTML = `
          <label for="price" class="cantidad">Cantidad: </label>
          <label id="label-${e.target.id}">SIN STOCK </label>
              `;
          } else {
            divCantidadProd.innerHTML = `
          <label for="price" class="cantidad">Cantidad: </label>
          <input id="cantidad-${e.target.id}" class="text-center" type="number" name="cantidad-id"
              min="0" max="${varStockGlobal}" step="1" value="0">
              `;
          }
        }
      }


    }

    function traerDatos(key) {
      let datos = localStorage.getItem(key);
      return JSON.parse(datos)
    }

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

    console.log(dataStorage)

    let tabla_articulos = document.querySelector('#tabla_articulos')




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
        console.log(e.target)
      }
    }

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