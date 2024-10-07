import Decimal from 'decimal.js';

export interface User {
    user_type: string;
    first_name: string;
    middle_name?: string; // Optional fields
    last_name: string;
    email_address: string;
    employee_number?: string;
    employee_suffix?: string;
    phone?: string;
    department?: string;
    employee_role?: string;
}

export interface File {
    file_id: number;
    file_type: string;
    settings: string;
    created_at: string;
    updated_at: string;
}

export type FileSettings = {
    file_name: string;
    file_name_with_extension: string;
    user: string;
    fodls: object;
    monthYear: number;
    material_ids: object;
    bom_ids: object;
}

export interface FodlPair {
    fodl_id: number;
    fg_code: string;
}

interface RowData {
    id: string | number;
    [key: string]: any;
}


export interface FodlRecord extends Record<string, unknown> {
    id: number;
    itemCode: string;
    itemDescription: string;
    unit: string;
    factoryOverhead: number;
    directLabor: number;
}

export interface MaterialRecord extends Record<string, unknown> {
    id: number;
    itemCode: string;
    itemDescription: string;
    unit: string;
    materialCost: number;
}

export interface FormulationRecord extends Record<string, unknown> {
    id?: number;
    rowType?: string;
    track_id?: number;
    formula: string | null;
    level: string | null;
    itemCode: string | null;
    description: string;
    formulation: string | null;
    batchQty: number | null;
    unit: string;
}

export interface BOM {
    bom_id: number;
    bomName: string;
    formulations: FormulationRecord[];
}

export interface RemovedId {
    id: number;
    track_id:number;
    rowType: string;
  }