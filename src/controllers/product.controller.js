import { createItem, deleteItemId, getItemId, listItem, patchItemId, updateItemId } from "../services/product.service.js";

export async function handleCreateItem(req, res, next) {
  try {
    const { item_desc, item_qty, price } = req.body;

    if (!item_desc || item_qty == null || price == null) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const item = await createItem({
      item_desc,
      item_qty,
      price
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}


export async function handleGetItem(req, res, next) {
    try {
        const { itemId } = req.params ;
        const row = await getItemId(itemId);
        if(!row) return res.status(404).json({ message : 'Item not found' });
        return res.json(row) ;
    } catch (err) {
        return next(err);
    }
}

export async function handleListItem(req, res, next) {
    try {
        const { limit, offset } = req.query;
        const rows = await listItem({ limit, offset });
        return res.json({ count: rows.length, data: rows });
    } catch (err) {
        return next(err);
    }
}

export async function handlePatchItem(req, res, next) {
    try {
        const itemId = Number(req.params.itemId);
        const updated = await patchItemId(itemId, req.body);
        
        if (!updated) {
            return res
            .status(404)
            .json({ message: 'Item not found or no valid fields sent' });
        }
        
        return res.json({ message: 'Item updated partially with the field/s given' });
    } catch (err) {
        return next(err);
    }
}

export async function handleDeleteItem(req, res, next) {
  try {
    const itemId = Number(req.params.itemId);
    const deleted = await deleteItemId(itemId);

    if (!deleted) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json({ message: 'Item deleted successfully' });

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function handleUpdateItem(req, res, next) {
    try {
        const itemId = Number(req.params.itemId);
        const updated = await updateItemId(itemId, req.body);

        if(!updated) {
            return res.status(404).json({ message: 'Item not found' });
        }

        return res.json({ message: 'Item updated successfully' });
    } catch (err) {
        return next(err);
    }
}