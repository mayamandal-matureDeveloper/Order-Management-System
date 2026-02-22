import { createCustomer, deleteCustomerId, getCustomerId, listByCustomer, patchCustomerId, updateCustomerId } from "../services/customer.service.js";


export async function handleGetCustomer(req, res, next) {
    try {
        const { customerId } = req.params;
        const row = await getCustomerId(customerId);
        if(!row) return res.status(404).json({ message : 'customer not found' });
        return res.json(row);
    } catch (err) {
        return next(err);
    }
}

export async function handleListCustomer(req, res, next) {
    try {
        const { limit, offset } = req.query;
        const rows = await listByCustomer({ limit, offset });
        return res.json({ count: rows.length, data: rows });
    } catch (err) {
        return next(err);
    }
}

export async function handleCreateCustomer(req, res, next) {
    try {
        const { customer_desc, customer_priority } = req.body;

        const customer = await createCustomer({
            customer_desc, 
            customer_priority
        });
        return res.status(201).json(customer);
    } catch (err) {
        return next(err);
    }
}

export async function handleDeleteCustomer(req, res, next) {
    try {
        const customerId = Number(req.params.customerId);
        const deleted = await deleteCustomerId(customerId);
        if(!deleted) {
            return res.status(404).json({ message: 'Customer not found' });   
        }
        return res.status(200).json({ message: 'customer deleted' }) ;
    } catch (err) {
        return next(err);
    }
}

export async function handleUpdateCustomer(req, res, next) {
    try {
        const customerId = Number(req.params.customerId);
        const updated = await updateCustomerId(customerId, req.body);

        if(!updated) {
            return res.status(404).json({ message: 'customer not found' });
        }
        return res.json({ message: 'Customer updated successfully' });
    } catch (err) {
        return next(err);
    }
}

export async function handlePatchCustomer(req, res, next) {
    try {
        const customerId = Number(req.params.customerId);
        const updated = await patchCustomerId(customerId, req.body);

        if(!updated) {
            return res.status(404).json({ message: 'Customer not found or no valid fields sent'});
        }
        return res.json({ message: 'Customer updated partially with the field/s given' });
    } catch (err) {
        return next(err);
    }
}