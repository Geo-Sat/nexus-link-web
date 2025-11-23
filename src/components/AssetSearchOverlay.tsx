import React, { useState, useMemo } from 'react';
import {Search, Filter, MapPin, Clock, User, UserCircle, TagIcon} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types/vehicle';
import { cn } from '@/lib/utils';
import { Account } from '@/types/account';
import {Asset, AssetTrackingDeviceStatusInfo} from "@/types/asset.ts";

interface AssetSearchOverlayProps {
  assets: Asset[];
  selectedAssetIds: string[];
  onAssetSelect: (assetId: string, isSelected: boolean) => void;
  onShowHistory: (assetIds: string[]) => void;
  showingHistory: boolean;
}

export const AssetSearchOverlay: React.FC<AssetSearchOverlayProps> = ({assets, selectedAssetIds,
  onAssetSelect,
  onShowHistory,
  showingHistory
}) => {

    const [searchTerm, setSearchTerm] = useState('');
    const filteredAssets = useMemo(() => {
        return assets.filter(asset => {
          return asset.registration.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [assets, searchTerm]);

    const determineSpeedStatus = (asset: Asset) => {
        const trackingAccount = (asset.tracking_accounts.length > 0) ? asset.tracking_accounts[0] : null;
        const deviceStatus = (trackingAccount !== null) ? trackingAccount.devices_status : null;
        if (deviceStatus !== null){
            let status = 'offline';
            // status is determined based on time difference between last update and current time
            const currentTime = new Date();
            const lastUpdate = deviceStatus.timestamp;
            if (lastUpdate) {
                const timeDifference = 0;
                // const timeDifference = currentTime.getTime() - lastUpdate.getTime();
                const minutesAgo = Math.floor(timeDifference / (1000 * 60));
                if (minutesAgo < 1) {
                    status = 'online';
                } else if (minutesAgo < 5) {
                    status = 'warning';
                } else {
                    status = 'offline';
                }
            }
            // update the status in the tracking account device status object
            deviceStatus.status = status;
            // if status is offline, set speed to 0
            deviceStatus.speed = status === 'offline' ? 0 : deviceStatus.speed;
            return deviceStatus;
        }
        return {
            'status': 'offline',
            'speed': 0,
            'timestamp': new Date()
        };
    }
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'online': return 'default';
            case 'offline': return 'destructive';
            default: return 'outline';
        }
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'text-vehicle-active';
            case 'offline': return 'text-vehicle-inactive';
            default: return 'text-muted-foreground';
        }
    };
    const formatLastUpdate = (date: Date) => {
        // const diff = Date.now() - date.getTime();
        // const minutes = Math.floor(diff / (1000 * 60));
        // if (minutes < 1) return 'Just now';
        // if (minutes < 60) return `${minutes}m ago`;
        // const hours = Math.floor(minutes / 60);
        // return `${hours}h ago`;
        return '1h ago';
    };


    return (
        <div className="space-y-1">
            {/* Header */}
            <div className="flex items-center justify-between">
              {/* <h2 className="text-lg font-semibold text-foreground text-sm">Vehicle Search</h2> */}
              <Badge variant="outline" className="text-xs">
                {filteredAssets.length} vehicles
              </Badge>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by registration, account name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card/50 border-border/50"
              />
            </div>

            {/* Status Filters */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                Status Filter
              </div>
            </div>

            {/* Selected Asset Actions */}
            {selectedAssetIds.length > 0 && (
              <div className="p-1 bg-primary/5 rounded-sm border border-primary/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-primary">
                    {selectedAssetIds.length} selected
                  </span>
                  <Button
                    size="sm"
                    onClick={() => onShowHistory(selectedAssetIds)}
                    disabled={showingHistory}
                    className="text-xs"
                    variant={showingHistory ? 'secondary' : 'default'}
                  >
                    {showingHistory ? 'Showing History' : 'Show History'}
                  </Button>
                </div>
              </div>
            )}

            {/* Asset List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredAssets.map(asset => (
                <div
                  key={asset.code}
                  className={cn(
                    "p-1 border transition-all duration-200 cursor-pointer",
                      selectedAssetIds.includes(asset.code)
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card/30 hover:bg-card/50"
                  )}
                  onClick={() => onAssetSelect(asset.code, !selectedAssetIds.includes(asset.code))}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedAssetIds.includes(asset.code)}
                        onChange={() => {}}
                        className="mt-1"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-xs text-foreground">
                            {asset.registration}
                          </h3>
                          <Badge
                            variant={getStatusBadgeVariant(determineSpeedStatus(asset).status)}
                            className="text-xs"
                          >
                            {determineSpeedStatus(asset).status}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-[0.65rem] text-muted-foreground">
                          {/* <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {vehicle.driverName || 'Unassigned'}
                          </div> */}
                          {/* <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {vehicle.make} {vehicle.model} ({vehicle.year})
                          </div> */}
                          {/* <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {vehicle.placeName}
                          </div> */}
                          <div className="flex items-center gap-1">
                            <TagIcon className="h-3 w-3" />
                            {(asset.asset_category) ? asset.asset_category : 'No Account'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {(asset?.tracking_accounts.length > 0) ? formatLastUpdate(asset?.tracking_accounts[0]?.devices_status.timestamp) : 'No Data' }
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                        <div className={((asset?.tracking_accounts.length > 0)) ? getStatusColor(determineSpeedStatus(asset).status) : 'text-muted-foreground'}>
                          {determineSpeedStatus(asset).speed } km/h
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAssets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No assets found</p>
              </div>
            )}
          </div>
    );
};