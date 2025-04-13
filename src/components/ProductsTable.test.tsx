import ProductsTable from "./ProductsTable";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { Product, Property, Operator } from "@/types/products";
import "@testing-library/jest-dom";

const mockProducts: Product[] = [
  {
    id: 1,
    property_values: [
      { property_id: 1, value: "Red" },
      { property_id: 2, value: 10 },
    ],
  },
  {
    id: 2,
    property_values: [
      { property_id: 1, value: "Blue" },
      { property_id: 2, value: 20 },
    ],
  },
];

const mockProperties: Property[] = [
  { id: 1, name: "Color", type: "string" },
  { id: 2, name: "Size", type: "number" },
];

const mockOperators: Operator[] = [
  { id: "equals", text: "Equals", supportedTypes: ["string", "number"] },
  { id: "in", text: "In", supportedTypes: ["string"] },
];

describe("ProductsTable", () => {
  it("renders the table with products", () => {
    render(
      <ProductsTable
        products={mockProducts}
        properties={mockProperties}
        operators={mockOperators}
      />
    );

    expect(screen.getByLabelText("Color")).toBeInTheDocument();
    expect(screen.getByLabelText("Size")).toBeInTheDocument();
    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("Blue")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("shows filtered results after selection", async () => {
    render(
      <ProductsTable
        products={mockProducts}
        properties={mockProperties}
        operators={mockOperators}
      />
    );

    fireEvent.change(screen.getByLabelText("Properties"), {
      target: { value: "1" },
    });

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText("Operators"), {
        target: { value: "equals" },
      });
    });

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText("Property values"), {
        target: { value: "Blue" },
      });
    });

    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);
      expect(screen.getByText("Blue")).toBeInTheDocument();
      expect(screen.queryByText("Red")).not.toBeInTheDocument();
    });
  });

  it("clears filters when 'Clear filters' button is clicked", () => {
    render(
      <ProductsTable
        products={mockProducts}
        properties={mockProperties}
        operators={mockOperators}
      />
    );

    const clearFiltersButton = screen.getByRole("button", {
      name: "Clear filters",
    });
    fireEvent.click(clearFiltersButton);

    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("Blue")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("updates available operators when a property is selected", () => {
    render(
      <ProductsTable
        products={mockProducts}
        properties={mockProperties}
        operators={mockOperators}
      />
    );

    const propertySelect = screen.getByLabelText("Properties");
    fireEvent.change(propertySelect, { target: { value: "1" } });

    const operatorSelect = screen.getByLabelText("Operators");
    expect(operatorSelect).toHaveTextContent("Equals");
    expect(operatorSelect).toHaveTextContent("In");
  });
});
