let productosAgregar = [];
document.getElementById('addCart').addEventListener('click', () => {
    if(productosAgregar.length > 0) {
        console.log(productosAgregar);
    } else {
        Swal.fire({
            title: 'Selecciona al menos un producto',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
    }
});

document.getElementById('listProducts').addEventListener('click', (event) => {
    if (event.target.classList.contains('form-check-input')) {
        if (event.target.checked) {
            productosAgregar.push(event.target.value);
        } else {
            productosAgregar = productosAgregar.filter(id => id !== event.target.value);
        }
    }    
});

