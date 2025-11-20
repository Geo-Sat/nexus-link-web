import {User} from "@/types/user.ts";

export interface Partner {
    id: number
    name: string
    phone: string
    email: string
    website: string
    address: string
    created_at: string
    updated_at: string
    is_active: boolean
    admin: User
}