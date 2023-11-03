const { unlinkSync, existsSync } = require('fs');
const db = require('../../database/models')

module.exports = (req, res) => {


    const id = req.params.id;
    const { name, brand, description, category, section, price, discount, stock } = req.body;

    db.Product.findByPk(id, {
        include: ['images']
    })
        .then(product => {

            req.files.image && (existsSync(`./public/images/products/${product.image}`) && unlinkSync(`./public/images/products/${product.image}`))


            db.Product.update(
                {
                    name: name.trim(),
                    price,
                    discount,
                    categoryId: category,
                    brandId: brand,
                    sectionId: section,
                    description: description.trim(),
                    image: req.files.image ? req.files.image[0].filename : product.image,

                },
                {
                    where: {
                        id
                    }
                }
            ).then(() => {
                if (req.files.images) {

                    product.images.forEach(image => {
                        (existsSync(`./public/images/products/${image.file}`) &&
                            unlinkSync(`./public/images/products/${image.file}`))

                    });

                    db.Image.destroy({
                        where: {
                            productId: id
                        }
                    }).then(() => {
                        const images = req.files.images.map((file) => {
                            return {
                                file: file.filename,
                                main: false,
                                productId: product.id,
                            }
                        })
                        db.Image.bulkCreate(images, {
                            validate : true
                        }).then(response => {
                            return res.redirect('/admin');
                        })

                    })


                }else {
                    return res.redirect('/admin')
                }
            })
        }).catch(error => console.log(error))

}