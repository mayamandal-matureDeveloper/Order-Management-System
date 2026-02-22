import { Router } from "express";
import { handleCreateItem, handleDeleteItem, handleGetItem, handleListItem, handlePatchItem, handleUpdateItem } from "../controllers/product.controller.js";
import { handleCreateCustomer, handleDeleteCustomer, handleGetCustomer, handleListCustomer, handlePatchCustomer, handleUpdateCustomer } from "../controllers/customer.controller.js";
const router = Router();

import * as orderController from '../controllers/order.controller.js';

import { handleSignup, handleLogin } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.use(verifyToken);


router.get('/order', orderController.handleGetAllOrders);
router.get('/order/:id', orderController.handleGetOrderById);
router.post('/order', orderController.handleCreateOrder);
router.put('/order/:id', orderController.handleUpdateOrder);
router.delete('/order/:id', orderController.handleDeleteOrder);


router.get('/customer', handleListCustomer);
router.get('/customer/:customerId', handleGetCustomer);
router.post('/customer', handleCreateCustomer);
router.put('/customer/:customerId', handleUpdateCustomer);
router.patch('/customer/:customerId', handlePatchCustomer);
router.delete('/customer/:customerId', handleDeleteCustomer);


router.get('/', handleListItem);
router.get('/:itemId', handleGetItem);
router.post('/', handleCreateItem);
router.put('/:itemId', handleUpdateItem);
router.patch('/:itemId', handlePatchItem);
router.delete('/:itemId', handleDeleteItem) ;

export default router ;

