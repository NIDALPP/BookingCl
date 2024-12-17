import controllerService from "../utils/connectors";
import { Request, Response } from "express";
const connectors = new controllerService()
let { aggregate } = connectors

interface reqBody {
    categoryId: string,
    category: string
}

class catService {
    async showAllCat(req: Request, res: Response): Promise<void> {
        try {
            let data: reqBody = req.body

            const agg = [
                {
                    $match: { categoryId: data.categoryId }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "categoryId",
                        foreignField: "parentId",
                        as: "subcategories"
                    }
                },
                {
                    $match: {
                        subcategories: { $ne: [] }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        categoryId: 1,
                        categoryName: "$name",
                        subcategories: {
                            $map: {
                                input: "$subcategories",
                                as: "subcategory",
                                in: {
                                    subcategoryName: "$$subcategory.name"
                                }
                            }
                        }
                    }
                }
            ]
            const categories = await aggregate("Category", agg)
            if (!categories || categories.length === 0) {
                res.status(404).json({ message: "No categories found." });
            }
            res.status(200).json({ categories })
        } catch (error: any) {
            console.error(error)
            res.status(500).json({ message: "Error finding categories" })
        }
    }
    async showAllProduct(req: Request, res: Response): Promise<void> {
        try {
            let data: reqBody = req.body


            const agg = [
                {
                    $match: { category: data.category }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "categoryId",
                        as: "category"
                    }
                },
                {
                    $unwind: {
                        path: "$category",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 0,
                        productId: 1,
                        productName: "$name",
                        image_url: 1,
                        price: 1,
                        categoryName: "$category.name",
                        categoryId: "$category.categoryId",
                    }
                }

            ]
            const response = await aggregate("Product", agg)
            res.status(200).json({ response })
        } catch (error: any) {
            console.error(error)
            res.status(500).json({ message: "Error finding products" })

        }
    }
}
export default catService