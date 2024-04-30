const ProductModel = require("../models/product.model.js");

class ProductRepository {
    async agregarProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const existeProduct = await ProductModel.findOne({ code: code });

            if (existeProduct) {
                console.log("El código debe ser único!");
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();

            return newProduct;

        } catch (error) {
            throw new Error("Error");
        }
    }

    async obtenerProduct(limit = 10, page = 1, sort, query) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const product = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);
            
            const totalPages = Math.ceil(totalProducts / limit);
            
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            

            return {
                docs: product,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            throw new Error("Error");
        }
    }

    async obtenerProductoPorId(id) {
        try {
            const product = await ProductModel.findById(id);

            if (!product) {
                console.log("Producto no encontrado");
                return null;
            }

            console.log("Producto encontrado");
            return product;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async actualizarProduct(id, productoActualizado) {
        try {
            const actualizado = await ProductModel.findByIdAndUpdate(id, productoActualizado);
            if (!actualizado) {
                console.log("No se encuentra el producto");
                return null;
            }

            console.log("Producto actualizado con exito!");
            return actualizado;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async eliminarProduct(id) {
        try {
            const deleteado = await ProductModel.findByIdAndDelete(id);

            if (!deleteado) {
                console.log("No se encuentra producto");
                return null;
            }

            console.log("Producto eliminado correctamente!");
            return deleteado;
        } catch (error) {
            throw new Error("Error");
        }
    }
}

module.exports = ProductRepository;