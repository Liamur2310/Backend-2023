//instanciamos socket del lado del cliente
const socketClient = io();


// recibimos evento desde el servidor
socketClient.on("realTimeProducts", (products) =>{
    console.log(products);
})


socketClient.on("updateProductsList", (product) => {

    console.log(product)

    var tbody = document.getElementById("productsTable").getElementsByTagName('tbody')[0];
    var row = tbody.insertRow(0);
    
    var title = row.insertCell(0);
    var description = row.insertCell(1);
    var code = row.insertCell(2);
    var price = row.insertCell(3);
    var state = row.insertCell(4);
    var stock = row.insertCell(5);
    var category = row.insertCell(6);
    var thumbnails = row.insertCell(7);
    
    title.innerHTML = product.title;
    description.innerHTML = product.description;
    code.innerHTML = product.code;
    price.innerHTML = product.price;
    state.innerHTML = product.state;
    stock.innerHTML = product.stock;
    category.innerHTML = product.category;
    thumbnails.innerHTML = product.thumbnails;
});

const button = document.querySelector("#addProductButton");

button.addEventListener("click", (e) => {
    
    e.preventDefault();

    const title = document.querySelector("#productTitle");
    const description = document.querySelector("#productDescription");
    const code = document.querySelector("#productCode");
    const price = document.querySelector("#productPrice");
    const stock = document.querySelector("#productStock");
    const state = document.querySelector("#productState");
    const category = document.querySelector("#productCategory");

    const product = {
        title: title.value,
        description: description.value,
        code: code.value,
        price: price.value,
        stock: stock.value,
        state: state.value,
        category: category.value,
    };

    socketClient.emit("createProduct", product);
})

