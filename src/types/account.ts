import {Partner} from "@/types/partner.ts";
import {UserProfile} from "@/types/user.ts";

export interface Account {
    id: number
    owner_type: string
    name: string
    email: string
    phone: string
    is_active: boolean
    created_at: string
    updated_at: string
    assets_count: number
    partner: Partner
    owner: UserProfile
}