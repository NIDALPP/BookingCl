import controllerService from "../utils/connectors";
import { Request, Response } from "express";
const connectors = new controllerService()
interface IreqBody {
    productId: string,
    userId: string,
    quantity: number,
    address: string,
}
interface Iitem {
    productId: string,
    quantity: number,
    price: number,

}

let { find, updateOne, findOne, create } = connectors


class bookingService {
    constructor() {
        this.placeOrder = this.placeOrder.bind(this)
        this.addToCart = this.addToCart.bind(this)
    }
    async addToCart(req: Request, res: Response): Promise<void> {

        try {

            let data: IreqBody = req.body
            data.userId = req.userId

            const quantity = parseInt(req.body.quantity as unknown as string, 10)

            if (!data.userId) {
                res.status(401).json({ message: "User not authenticated." });
            }
            if (!data.productId || !quantity) {
                res.status(400).json({ message: "Product ID and quantity are required." });
            }
            const [productResponse, userResponse] = await Promise.all([
                findOne("Product", { productId: data.productId }),
                findOne("User", { userId: data.userId })
            ])
            const product = productResponse?.data;
            const user = userResponse?.data;
            if (!product) {
                res.status(404).json({ message: "Product not found." });
            }
            if (!user) {
                res.status(404).json({ message: "User not found." });
            }
            if (product.stock < quantity) {
                res.status(400).json({ message: "Insufficient stock." });
            }
            let cartResponse = await findOne("Cart", { userId: data.userId })
            let cart = cartResponse?.data
            if (!cart) {
                const newCart = await create("Cart", { userId: data.userId, items: [] })
                cart = newCart?.data
            }
            const existingItem = cart.items.find((item: Iitem) => item.productId === data.productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId: data.productId, quantity: quantity, price: product.price })
            };
            product.stock -= quantity
            await updateOne("Product", { productId: data.productId }, { stock: product.stock });

            const updateResponse = await updateOne("Cart", { userId: data.userId }, { items: cart.items })

            if (!updateResponse) {
                res.status(500).json({ message: "Failed to update cart." });

            }
            const cartData = await findOne("Cart", { userId: data.userId })
            const cartItems = {
                cartId: cartData?.data.cartId,
                userId: cartData?.data.userId,
                items: cartData?.data.items
            }
            res.status(200).json({ message: "product added to cart successfully", data: cartItems })
        } catch (error: any) {

            console.error("Error in addToCart:", error.message || error)
            res.status(500).json({ message: "An error occurred while adding product to cart." })
        }
    }
    async placeOrder(req: Request, res: Response): Promise<void> {
        try {
            let data: IreqBody = req.body
            data.userId = req.userId


            if (!data.userId) {
                res.status(401).json({ message: "Unauthorized" });
                return
            }

            const userResponse = await findOne("User", { userId: data.userId })
            const user = userResponse?.data
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return
            }
            const cartResponse = await findOne("Cart", { userId: data.userId })
            const cart = cartResponse?.data
            if (!cart || cart.items.length === 0) {
                res.status(404).json({ message: "Cart not found.or cart is empty." });
                return
            }
            let totalAmount = 0
            for (const item of cart.items) {
                const productResponse = await findOne("Product", { productId: item.productId })
                const product = productResponse?.data
                if (!product) {
                    res.status(404).json({ message: `Product not found. ${item.productId}` });
                    return
                }
                totalAmount += item.quantity * product.price
            }

            const orderResponse = await create("order", {
                userId: data.userId,
                address: data.userId,
                totalAmount,
                items: cart.items,
                status: "order placed successfully"
            })
            console.log(orderResponse);

            const order = orderResponse?.data
            if (!orderResponse) {
                res.status(500).json({ message: "An error occurred while placing order." });
                return
            }
            await updateOne("Cart", { userId: data.userId }, { items: [] })
            res.status(200).json({ message: "order placed successfully", order })
        } catch (error: any) {
            console.error("Error in placeOrder:", error.message || error)
            res.status(500).json({ message: "An error occurred while placing order." });

        }
    }

}

export default bookingService



