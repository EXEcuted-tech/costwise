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