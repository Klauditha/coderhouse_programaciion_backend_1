const multer = require('multer');
const path = require('path');
const { fileURLToPath } = require('url');

// Configurar __dirname manualmente para ESM
//let __filename = fileURLToPath(import.meta.url);/
//const __dirname = path.dirname(__filename);

// Configuración de almacenamiento con Multer
const storage = multer.diskStorage({
    // Ruta de destino donde se almacenarán los archivos
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/img')); // Usa path.join para construir la ruta
    },
    // Configuración del nombre del archivo almacenado
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const originalName = file.originalname;
        const fileName = `${timestamp}-${originalName}`;
        cb(null, fileName); // Guardar con timestamp y nombre original
    }
});

// Exportar configuración de Multer
const uploader = multer({ storage });

module.exports = { uploader };


