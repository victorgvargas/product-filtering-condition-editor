import { Product, Property, PropertyValue } from "@/types/products";
import { datastore } from "@/data/datastore";

class FiltersService {
  private readonly products: Product[];
  private properties: Property[];
  private filteredProducts: Product[];

  constructor() {
    this.products = datastore.getProducts();
    this.properties = datastore.getProperties();
    this.filteredProducts = [];
  }

  selectColumn(propertyId: number) {
    const property = this.properties.find((prop) => propertyId === prop.id);

    if (property) {
      const values = this.products.filter((product: Product) =>
        product.property_values.find(
          (propVal: PropertyValue) => propVal.property_id === property.id
        )
      );

      this.filteredProducts = [...values];
    }

    return this;
  }

  equalsFilter(products: Product[]) {
    return this.filteredProducts.filter((product) => {
      products.some((prod) => prod === product);
    });
  }
}

export const filtersService = new FiltersService();
