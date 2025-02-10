const socket = io();

//Despliegue de productos
socket.on('products', (products) => {
  despliegueProductos(products);
});

//Agregar producto
const productForm = document.getElementById('productForm');

productForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(productForm);
  console.log(formData);
  const product = Object.fromEntries(formData);
  socket.emit('newProduct', product);
  const productsContainer = document.getElementById('listProducts');
  productsContainer.innerHTML = '';
});


//Eliminar producto

//Eliminar producto
/*
socket.on('deleteProduct', (productId) => {
  console.log(productId);
});
*/
const despliegueProductos = (products) => {
  const productsContainer = document.getElementById('listProducts');
  productsContainer.innerHTML = '';
  products.forEach((product) => {
    const productElement = document.createElement('tr');
    productElement.innerHTML = `
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.code}</td>
        <td>${product.price}</td>
        <td>${product.status}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        <td>${product.thumbnail ? product.thumbnail : 'No hay imagen'}</td>
        <td>
          <button class='btn btn-danger' onclick='eliminarProducto(${
            product.id
          })'>Eliminar</button>
        </td>
  
      `;
    productsContainer.appendChild(productElement);
  });
};

const eliminarProducto = (productId) => {
  socket.emit('deleteProduct', productId);
  const productsContainer = document.getElementById('listProducts');
  productsContainer.innerHTML = '';
};
