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

  equalsFilter(property: Property, value: PropertyValue) {
    return this.products.filter((product) =>
      product.property_values.filter(
        (prod) => prod.property_id === property.id && prod.value === value.value
      )
    );
  }

  isGreaterThanFilter(property: Property, value: number) {
    return this.products.filter((product) =>
      product.property_values.filter(
        (prod) =>
          prod.property_id === property.id &&
          typeof prod.value === "number" &&
          prod.value > value
      )
    );
  }

  isLessThanFilter(property: Property, value: number) {
    return this.products.filter((product) =>
      product.property_values.filter(
        (prod) =>
          prod.property_id === property.id &&
          typeof prod.value === "number" &&
          prod.value < value
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
      product.property_values.filter(
        (prod) =>
          prod.property_id === property.id &&
          values.filter((val) => prod.value === val.value)
      )
    );
  }

  containsFilter(property: Property, value: PropertyValue) {
    return this.products.filter((product) =>
      product.property_values.filter(
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
