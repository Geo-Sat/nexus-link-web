import {Device} from "@/types/device.ts";
import {User} from "@/types/user.ts";
import {Account} from "@/types/account.ts";

export type AssetCategory = 'car' | 'motorcycle' | 'truck' | 'bus' | 'van' | 'other';

export interface AssetTrackingAccount {
    id: number
    device: Device
    coordinates: string
    speed: number
    heading: number
    last_update_time: Date
    battery_level: number
    is_active: boolean
    created_at: string
    updated_at: string
    installation_date?: string
    installation_status?: "pending" | "approved" | "rejected" | "expired"
    installation_notes?: string
    installation_photo_url?: string
    installation_video_url?: string
    installation_address?: string
    installation_agent?: User
    device_installation_location?: string
    asset?: Asset
    status?: "online" | "offline"
}

export interface Asset {
    code: string
    asset_id?: string
    registration: string
    asset_category: AssetCategory
    asset_type?: string
    asset_sub_type?: string
    asset_make?: string
    asset_model?: number
    asset_yom?: number
    description: string
    created_at: string
    updated_at: string
    account: Account
    account_name?: string
    account_phone?: number
    isSelected?: boolean
    status?: string
    last_update_time?: Date
    speed?: number
    tracking_accounts?: [AssetTrackingAccount]
}


