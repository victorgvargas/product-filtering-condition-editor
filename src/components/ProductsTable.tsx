"use client";

import { filtersService } from "@/services/filter";
import { Product, Property } from "@/types/products";
import styles from "./ProductsTable.module.css";

interface ProductsTableProps {
  products: Product[];
  properties: Property[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  properties,
}) => {
  return (
    <section className={styles["products"]}>
      <div className={styles["products-filters"]}>
        <div className={styles["products-filters-filter"]}>
          <label htmlFor="properties">Select a property</label>
          <select name="properties" id="properties"></select>
        </div>

        <div className={styles["products-filters-filter"]}>
          <label htmlFor="operators">Select an operator</label>
          <select name="operators" id="operators"></select>
        </div>
      </div>

      <table className={styles["products-table"]}>
        <thead>
          <tr>
            {properties.map((property) => {
              return (
                <th
                  key={property.id}
                  className={styles["products-table-header"]}
                >
                  {property.name.charAt(0).toUpperCase() +
                    property.name.slice(1)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            return (
              <tr key={product.id}>
                {product.property_values.map((val) => {
                  return (
                    <td
                      key={val.property_id}
                      className={styles["products-table-data"]}
                    >
                      {val.value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default ProductsTable;
