import {Device} from "@/types/device.ts";
import {User} from "@/types/user.ts";
import {Account} from "@/types/account.ts";

export type AssetCategory = 'car' | 'motorcycle' | 'truck' | 'bus' | 'van' | 'other';

export interface AssetTrackingAccount {
    account_id: number
    device: Device
    device_location: string
    installation_date: string
    installation_status: string
    created_at: string
    updated_at: string
    installation_notes?: string
    installation_photo_url?: string
    installation_video_url?: string
    installation_address?: string
    installation_agent?: User
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
    asset_tracking_accounts?: [AssetTrackingAccount]
}


