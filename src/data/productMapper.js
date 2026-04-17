function toProductModel(row) {
  return {
    id: row.product_id,
    name: row.product_name,
    price: Number(row.unit_price || 0),
    quantityPerUnit: row.quantity_per_unit || '',
    stock: Number(row.units_in_stock || 0),
    discontinued: Number(row.discontinued || 0),
  }
}

export { toProductModel }
