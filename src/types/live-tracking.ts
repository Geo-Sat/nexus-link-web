export interface LiveTrackingData {
    imei: string;
    latitude: number;
    longitude: number;
    speed: number;
    course: string;
    timestamp: number;
    gps_located: boolean;
    mcc: number | null;
    mnc: number | null;
    lac: number | null;
    cell_id: number | null;
    type: string;
}
