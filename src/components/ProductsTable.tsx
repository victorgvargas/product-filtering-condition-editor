"use client";

import { filtersService } from "@/services/filter";
import { Operator, Product, Property, PropertyValue } from "@/types/products";
import styles from "./ProductsTable.module.css";
import { useEffect, useState } from "react";

interface ProductsTableProps {
  products: Product[];
  properties: Property[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  properties,
}) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>();
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>();
  const [propertyValues, setPropertyValues] = useState<
    PropertyValue[] | null
  >();

  const findProperty = (id: number) => {
    return (
      properties.find((property: Property) => property.id === id) ??
      properties[0]
    );
  };

  const findOperator = (id: string) => {
    return (
      filtersService.operators.find(
        (operator: Operator) => operator.id === id
      ) ?? filtersService.operators[0]
    );
  };

  const findPropertyValues = (id: number): PropertyValue[] => {
    return products
      .filter((product) =>
        product.property_values.find(
          (propertyValue) => propertyValue.property_id === id
        )
      )
      .map((product) => product.property_values)
      .flat();
  };

  const clearFilters = () => {
    setSelectedOperator(null);
    setSelectedProperty(null);
    setPropertyValues(null);
  };

  useEffect(() => {
    if (selectedProperty && selectedOperator) {
      setPropertyValues(findPropertyValues(selectedProperty.id));
    }
  }, [selectedProperty, selectedOperator]);

  return (
    <section className={styles["products"]}>
      <div className={styles["products-filters"]}>
        <div className={styles["products-filters-container"]}>
          <div className={styles["products-filters-filter"]}>
            <select
              name="properties"
              id="properties"
              onChange={(event) =>
                setSelectedProperty(findProperty(Number(event.target.value)))
              }
            >
              <optgroup label="Properties">
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className={styles["products-filters-filter"]}>
            <select
              name="property-values"
              id="property-values"
              onChange={(event) =>
                setSelectedOperator(findOperator(event.target.value))
              }
            >
              <optgroup label="Property Values">
                {filtersService.operators.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.text}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          {propertyValues && (
            <div className={styles["products-filters-filter"]}>
              <select
                name="operators"
                id="operators"
                onChange={(event) =>
                  setSelectedOperator(findOperator(event.target.value))
                }
              >
                <optgroup label="Operators">
                  {propertyValues.map((propVal, index) => (
                    <option key={index} value={propVal.property_id}>
                      {propVal.value}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}
        </div>

        <button
          className={styles["products-filters-clear"]}
          onClick={clearFilters}
        >
          Clear filters
        </button>
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
          {filteredProducts.map((product) => {
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
