import { Router } from 'express';
import  bookingService from '../controller/bookingController';
const addToCart=bookingService
import { catService } from '../controller/catController';
const {showAllCat,showAllProduct}=catService
import {authUser} from '../helpers/userAuth';
const bookingController=new bookingService()
export default(router:Router): void =>{
    // router.post('/findProducts',bookingService.findAll()
    router.post('/addToCart',authUser,bookingController.addToCart.bind(bookingController))
    // router.post('/placeOrder',authUser,booki)
    router.post('/ShowCategories',showAllCat)
    router.post('/ShowProducts',showAllProduct)
}