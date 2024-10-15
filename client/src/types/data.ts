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