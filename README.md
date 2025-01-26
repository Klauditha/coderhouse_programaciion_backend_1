# Coderhouse Programación Backend  Avanzado 1

## Entrega 1 - Desarrollo de una API con Node.js y Express  - Entrega 1

## API de productos y carritos

### Productos

-   GET /products: Devuelve todos los productos.
-   GET /products/:pid: Devuelve un producto por su ID.
-   POST /products: Crea un nuevo producto.
-   PUT /products/:pid: Actualiza un producto existente.
-   DELETE /products/:pid: Elimina un producto existente.

### Carritos

-   GET /carts/:cid: Devuelve un carrito por su ID.
-   POST /carts: Crea un nuevo carrito.
-   POST /carts/:cid/product/:pid: Agrega un producto al carrito.

