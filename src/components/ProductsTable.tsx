"use client";

import { filtersService } from "@/services/filter";
import { Operator, Product, Property, PropertyValue } from "@/types/products";
import styles from "./ProductsTable.module.css";
import { useEffect, useState } from "react";

interface ProductsTableProps {
  products: Product[];
  properties: Property[];
  operators: Operator[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  properties,
  operators,
}) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    properties[0]
  );
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>();
  const [propertyValues, setPropertyValues] = useState<
    PropertyValue[] | null
  >();
  const [availableOperators, setAvailableOperators] = useState<Operator[]>([]);

  const findProperty = (id: number) => {
    return (
      properties.find((property: Property) => property.id === id) ??
      properties[0]
    );
  };

  const findOperator = (id: string) => {
    return (
      operators.find((operator: Operator) => operator.id === id) ?? operators[0]
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

  useEffect(() => {
    setAvailableOperators(
      operators.filter((operator) =>
        operator.supportedTypes.includes(selectedProperty?.type || "")
      )
    );
  }, [selectedProperty]);

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
              defaultValue="Select a property"
            >
              <optgroup label="Properties">
                <option value="Select a property" hidden>
                  Select a property
                </option>
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
              name="operators"
              id="operators"
              onChange={(event) =>
                setSelectedOperator(findOperator(event.target.value))
              }
              defaultValue="Select an operator"
            >
              <optgroup label="Operators">
                <option value="Select an operator" hidden>
                  Select an operator
                </option>
                {availableOperators.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.text}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          {propertyValues && (
            <div className={styles["products-filters-filter"]}>
              <select name="property-values" id="property-values">
                <optgroup label="Property values">
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
