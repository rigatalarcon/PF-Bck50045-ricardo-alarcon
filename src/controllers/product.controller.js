const ProductRepository = require("../repositories/products.repository.js");
const productRepository = new ProductRepository();

class ProductController {

    async addProduct(req, res) {
        const nuevoProducto = req.body;
        try {
            const resultado = await productRepository.agregarProduct(nuevoProducto);
            res.status(200).json(resultado);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;

            const productos = await productRepository.obtenerProduct(limit, page, sort, query);

            res.status(200).json(productos);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const buscado = await productRepository.obtenerProductoPorId(id);
            if (!buscado) {
                return res.json({
                    error: "Producto no encontrado"
                });
            }
            res.json(buscado);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const productoActualizado = req.body;

            const resultado = await productRepository.actualizarProduct(id, productoActualizado);
            res.json(resultado);
        } catch (error) {
            res.status(500).send("Error al actualizar el producto");
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        try {
            let respuesta = await productRepository.eliminarProduct(id);

            res.json(respuesta);
        } catch (error) {
            res.status(500).send("Error al eliminar el producto");
        }
    }
}

module.exports = ProductController; 