const sockets = io.connect()

function addProduct(e) {
    const product = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
        description: document.getElementById("description").value,
        thumbnail: document.getElementById("thumbnail").value
    }
    sockets.emit("new-product", product);
    return false
}

function render(data) {
    try {
        if(data.length > 0) {
            const html = data.map((elem, index) => {
                return(`<tr>
                <td>${elem.name}</td>
                <td>$ ${elem.price}</td>
                <td>${elem.description}</td>
                <td>${elem.stock}</td>
                <td><img src="${elem.thumbnail}" height="50px"></img></td>
                <td>${elem.id}</td></tr>`)
            }).join(" ")
            document.getElementById("product").innerHTML = html
        } else {
            const htmlErr = `<h3 class="prod__error">No se encontraron productos :/</h3>`
            document.getElementById('product').innerHTML = htmlErr
        }
    } catch (error) {
        console.error(error)
    }
}

sockets.on("product", function(data) {render(data)})


///


function addMessage(a) {
    let date = new Date();
    const message = {
        author: document.getElementById("username").value,
        message: document.getElementById("text").value,
        fecha: date.toLocaleDateString(),
        hora: date.toLocaleTimeString(),
    }
    sockets.emit("new-message", message);
    return false
}

function renders(dato) {
    try {
        if(dato.length > 0){
            const html2 = dato.map((element, index) => {
                return(`<div class="container__mensajes">
                    <div class="text__mensaje">
                        <h3 class="nombre">${element.author}</h3>
                        <p class="texto">: ${element.message}</p>
                    </div>
                    <div class="fecha">
                        <p class="date">[ ${element.fecha} - ${element.hora} ]</p>
                    </div>
                </div>`)
            }).join(" ")
        
            document.getElementById("messages").innerHTML = html2
        } else {
            const errHtml = `<p class="chat__err">Aún no hay mensajes :( ¡Sé el primero en enviar uno!</p>`
            
            document.getElementById("messages").innerHTML = errHtml
        }
        
    } catch (err) {
        console.log(err)
    }
}

sockets.on("messages", function(dato) {renders(dato)})