export interface User {
    user_id: number;
    user_type: string;
    password: string;
    first_name: string;
    middle_name?: string; // Optional fields
    last_name: string;
    email_address: string;
    employee_number?: string;
    employee_suffix?: string;
    phone_number?: string;
    department?: string;
    position?: string;
    display_picture?: string;
    sys_role: number[];
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

export interface Formulation {
    formulation_id: number;
    fg_id: string;
    formula_code: string;
    finishedGood: FinishedGood;
}

export interface FinishedGood {
    fg_id: number;
    fodl_id: number;
    fg_code: string;
    fg_desc: string;
    total_cost: number | null;
    total_batch_qty: string;
    rm_cost: number | null;
    unit: string;
    formulation_no: number;
    is_least_cost: boolean;
    monthYear: number; 
}

export interface FormulationRecord extends Record<string, unknown> {
    id?: number;
    rowType?: string;
    track_id?: number;
    formula: string | null;
    level: string | null;
    itemCode: string | null;
    description: string | null;
    formulation: string | null;
    batchQty: number | null;
    unit: string | null;
    isLeastCost?: number;
    cost?: number | null;
}

export interface BOM {
    bom_id: number;
    bomName?: string;
    bom_name?: string;
    formulations: FormulationRecord[];
}

export interface Bom {
    bom_id: number;
    bom_name: string;
    fg_name?:string;
    formulations: string;
    created_at: string;
    updated_at: string;
}

export interface RemovedId {
    id: number;
    track_id: number;
    rowType: string;
}

export interface TransactionRecord {
    id?: number;
    year: number;
    month: number;
    date: string;
    journal: string;
    entryNumber: string;
    description: string;
    project: string;
    glAccount: string;
    glDescription: string;
    warehouse: string;
    itemCode: string;
    itemDescription: string;
    quantity: number;
    amount: number;
    unitCode: string;
}

export interface InventoryType {
    inventory_id: number;
    material_id: number;
    material_code: string;
    material_desc: string;
    unit: string;
    material_category: string;
    stock_status: string;
    purchased_qty: number;
    usage_qty: number;
    total_qty: number;
    month_year: string;
}

export interface ReleaseNote {
    note_id: number;
    title: string;
    version: string;
    content: string;
    user_id: number;
    created_at: string;
}

export interface ReleaseNoteContent {
    note_type: string;
    note: string;
}

