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
    const uniqueValues = new Map<string, PropertyValue>();
    products.forEach((product) => {
      const propertyValue = product.property_values.find(
        (propertyValue) =>
          propertyValue.property_id === id &&
          selectedOperator?.supportedTypes.includes(typeof propertyValue.value)
      );
      if (propertyValue && !uniqueValues.has(String(propertyValue.value))) {
        uniqueValues.set(String(propertyValue.value), propertyValue);
      }
    });
    return Array.from(uniqueValues.values());
  };

  const clearFilters = () => {
    setSelectedOperator(null);
    setSelectedProperty(null);
    setPropertyValues(null);
    setFilteredProducts(products);
  };

  useEffect(() => {
    if (selectedProperty && selectedOperator) {
      if (selectedOperator.id === "any" || selectedOperator.id === "none") {
        const filtered = filtersService.filterProducts(
          selectedProperty as Property,
          propertyValues as PropertyValue[],
          selectedOperator
        );
        setFilteredProducts(filtered ?? []);
        setPropertyValues(null);
      } else {
        setPropertyValues(findPropertyValues(selectedProperty.id));
      }
    }
  }, [selectedProperty, selectedOperator]);

  useEffect(() => {
    setAvailableOperators(
      operators.filter((operator) =>
        operator.supportedTypes.includes(selectedProperty?.type ?? "")
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
              aria-label="Properties"
              onChange={(event) =>
                setSelectedProperty(findProperty(Number(event.target.value)))
              }
              value={
                selectedProperty ? selectedProperty.id : "Select a property"
              }
            >
              <optgroup label="Properties">
                <option value="Select a property" hidden>
                  Select a property
                </option>
                {properties.map((property) => (
                  <option
                    key={property.id}
                    value={property.id}
                    aria-label={property.name}
                  >
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
              aria-label="Operators"
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
              <select
                name="property-values"
                id="property-values"
                aria-label="Property values"
                multiple={selectedOperator?.id === "in"}
                defaultValue={
                  selectedOperator?.id === "in"
                    ? ["Select a value"]
                    : "Select a value"
                }
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  if (propertyValues && selectedOperator) {
                    if (selectedOperator.id === "in") {
                      const selectedValues = Array.from(
                        event.target.selectedOptions
                      )
                        .map((option) =>
                          propertyValues.find(
                            (propVal) => String(propVal.value) === option.value
                          )
                        )
                        .filter(
                          (value): value is PropertyValue => value !== undefined
                        );

                      const filtered =
                        filtersService.filterProducts(
                          selectedProperty as Property,
                          selectedValues,
                          selectedOperator
                        ) ?? [];
                      setFilteredProducts(filtered);
                    } else {
                      const selectedValue = propertyValues.find(
                        (propVal) =>
                          String(propVal.value) === event.target.value
                      );
                      if (selectedValue) {
                        const filtered =
                          filtersService.filterProducts(
                            selectedProperty as Property,
                            selectedValue,
                            selectedOperator
                          ) ?? [];
                        setFilteredProducts(filtered);
                      }
                    }
                  }
                }}
              >
                <optgroup label="Property values">
                  <option value="Select a value" hidden>
                    Select a value
                  </option>
                  {propertyValues?.map((propVal, index) => (
                    <option key={index} value={String(propVal.value)}>
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
          {filteredProducts.map((product, rowIndex) => {
            return (
              <tr key={product.id}>
                {properties.map((property) => {
                  const val = product.property_values.find(
                    (propVal) => propVal.property_id === property.id
                  );
                  return (
                    <td
                      key={property.id}
                      className={styles["products-table-data"]}
                    >
                      {val?.value ?? ""}
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
