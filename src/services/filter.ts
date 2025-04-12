import { Operator, Product, Property, PropertyValue } from "@/types/products";
import { datastore } from "@/data/datastore";

class FiltersService {
  private readonly products: Product[];
  readonly operators: Operator[];
  readonly properties: Property[];

  constructor() {
    this.products = datastore.getProducts();
    this.operators = datastore.getOperators();
    this.properties = datastore.getProperties();
  }

  filterProducts(
    property: Property,
    value: PropertyValue | PropertyValue[],
    operator: Operator
  ) {
    switch (operator.id) {
      case "equals":
        return this.equalsFilter(property, value as PropertyValue);
      case "greater_than":
        return this.isGreaterThanFilter(property, value as PropertyValue);
      case "less_than":
        return this.isLessThanFilter(property, value as PropertyValue);
      case "any":
        return this.hasAnyValueFilter(property);
      case "none":
        return this.hasNoValueFilter(property);
      case "in":
        return this.isAnyOfFilter(property, value as PropertyValue[]);
      case "contains":
        return this.containsFilter(property, value as PropertyValue);
    }
  }

  equalsFilter(property: Property, value: PropertyValue) {
    return this.products.filter((product) =>
      product.property_values.some((prod) => {
        return prod.property_id === property.id && prod.value === value.value;
      })
    );
  }

  isGreaterThanFilter(property: Property, value: PropertyValue) {
    return this.products.filter((product) =>
      product.property_values.some(
        (prod) =>
          prod.property_id === property.id &&
          typeof prod.value === "number" &&
          typeof value.value === "number" &&
          prod.value > value.value
      )
    );
  }

  isLessThanFilter(property: Property, value: PropertyValue) {
    return this.products.filter((product) =>
      product.property_values.some(
        (prod) =>
          prod.property_id === property.id &&
          typeof prod.value === "number" &&
          typeof value.value === "number" &&
          prod.value < value.value
      )
    );
  }

  hasAnyValueFilter(property: Property) {
    return this.products.filter((product) =>
      product.property_values.some((prod) => prod.property_id === property.id)
    );
  }

  hasNoValueFilter(property: Property) {
    return this.products.filter(
      (product) =>
        !product.property_values.some(
          (prod) => prod.property_id === property.id
        )
    );
  }

  isAnyOfFilter(property: Property, values: PropertyValue[]) {
    return this.products.filter((product) =>
      product.property_values.some(
        (prod) =>
          prod.property_id === property.id &&
          values.some((val) => prod.value === val.value)
      )
    );
  }

  containsFilter(property: Property, value: PropertyValue) {
    return this.products.filter((product) =>
      product.property_values.some(
        (prod) =>
          prod.property_id === property.id &&
          typeof prod.value === "string" &&
          typeof value.value === "string" &&
          prod.value.includes(value.value)
      )
    );
  }
}

export const filtersService = new FiltersService();
