export interface PropertyValue {
    property_id: number;
    value: string | number;
}

export interface Product {
    id: number;
    property_values: PropertyValue[];
}

export interface Property {
    id: number;
    name: string;
    type: string;
    values?: string[];
}

export interface Operator {
    text: string;
    id: string;
}