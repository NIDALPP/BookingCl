import { Router } from 'express';
import bookingService from '../controller/bookingController';

import { authUser } from '../helpers/userAuth';
import catService from '../controller/catController';
const catController = new catService();
const bookingController = new bookingService()
export default (router: Router): void => {
    router.post('/addToCart', authUser, bookingController.addToCart)
    router.post('/placeOrder', authUser, bookingController.placeOrder)
    router.post('/ShowCategories', catController.showAllCat)
    router.post('/ShowProducts', catController.showAllProduct)
}