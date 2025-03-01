const socket = io();

//Despliegue de productos
socket.on('products', (data) => {
  despliegueProductos(data.data);
});

//Agregar producto
const productForm = document.getElementById('productForm');
productForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(productForm);
  const status = formData.get('status');
  const statusValue = status === 'on' ? true : false;
  formData.set('status', statusValue);
  const product = Object.fromEntries(formData);
  /*Captar la respuesta del servidor*/
  socket.on('newProductResponse', (response) => {
    if (response && response.status == 'success') {
      Swal.fire({
        title: response.message,
        icon: 'success',
      });
    } else {
      Swal.fire({
        title: response.message,
        icon: 'error',
      });
    }
  });
  const productsContainer = document.getElementById('listProducts');
  productsContainer.innerHTML = '';
});

const despliegueProductos = (products) => {
  const productsContainer = document.getElementById('listProducts');
  productsContainer.innerHTML = '';
  products.forEach((product) => {
    const productElement = document.createElement('tr');
    productElement.innerHTML = `
        <td>${product._id}</td>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.code}</td>
        <td>${product.price}</td>
        <td>${product.status ? 'Activo' : 'Inactivo'}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        <td>${product.thumbnail ? product.thumbnail : 'No hay imagen'}</td>
        <td>
          <button class='btn btn-danger' onclick='eliminarProducto("${
            product._id.toString()
          }")'>Eliminar</button>
        </td>
  
      `;
    productsContainer.appendChild(productElement);
  });
};

const eliminarProducto = (productId) => {
  console.log(productId);
  socket.emit('deleteProduct', productId);
  /*Capturar la respuesta del servidor*/
  socket.on('deleteProductResponse', (response) => {
    if (response && response.status == 'success') {
      Swal.fire({
        title: response.message,
        icon: 'success',
      });
    } else {
      Swal.fire({
        title: response.message,
        icon: 'error',
      });
    }
  });
};
