import React, { useState, useEffect, useRef } from 'react';
import { GoogleTrackingMap } from '@/components/GoogleTrackingMap.tsx';
import { AssetSearchOverlay } from '@/components/AssetSearchOverlay.tsx';
import { SelectedVehiclesTable } from '@/components/SelectedVehiclesTable.tsx';
import { useToast } from '@/hooks/use-toast.ts';
import '@/styles/overlays.css';
import { X, ChevronDown, Search, Check, ChevronUp, Car } from 'lucide-react';
import { Account } from '@/types/account.ts';
import { useNavigate } from 'react-router-dom';
import {LoadingView} from "@/components/shared/LoadingView.tsx";
import apiClient from "@/lib/api.ts";
import {MapsData} from "@/types/pages/maps.ts";
import {Asset} from "@/types/asset.ts";

export function MapsPage() {
    const [loading, setLoading] = useState(true);
    const [mapsData, setMapsData] = useState<MapsData>(null);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<Asset>(null);
    const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>([]);
    const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
    const [showDriverPopup, setShowDriverPopup] = useState(false);
    const [accountSearchTerm, setAccountSearchTerm] = useState('');
    const { toast } = useToast();
    const [isAssetSearchOpen, setIsAssetSearchOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      const loadData = async () => {
            try {
                const response = await apiClient.get('core/maps/data');
                const apiData:MapsData = response.data;
                setMapsData(apiData);
                setAssets(apiData.accounts.flatMap(account => account.assets));
                setLoading(false);
            } catch (error) {
                console.error('Failed to load map data', error);
                toast({
                    title: "Server Error",
                    description: "No data to show.",
                    variant: "destructive",
                });
                setLoading(false);
            }
      };

      loadData().then().catch().finally();
  }, [toast]);
    const filteredAccounts: Account[] = mapsData?.accounts?.filter(account =>
        account.name.toLowerCase().includes(accountSearchTerm.toLowerCase()) ||
        account.phone.toString().toLowerCase().includes(accountSearchTerm.toLowerCase())
    );
    const filteredAssets = selectedAccountIds.length > 0
        ? assets.filter(asset => selectedAccountIds.includes(asset.account.id))
        : assets;
    const handleSelectAllAccounts = () => {
      if (selectedAccountIds.length === mapsData.accounts.length) {
          setSelectedAccountIds([]);
      } else {
          setSelectedAccountIds(mapsData.accounts.map(d => d.id));
      }
    };
    const handleAssetSelect = (assetId: string, isSelected: boolean) => {
        setSelectedAssetIds(prev =>
            isSelected
                ? [...prev, assetId]
                : prev.filter(id => id !== assetId)
        );

        setAssets(prev =>
            prev.map(asset =>
                asset.code === assetId
                    ? {...asset, isSelected}
                    : asset
            )
        );
        setSelectedAsset(assets.find(asset => asset.code === assetId));
    }
    const toggleAccountSelection = (accountId: number) => {
        setSelectedAccountIds(prev =>
            prev.includes(accountId)
                ? prev.filter(id => id !== accountId)
                : [...prev, accountId]
        );
        console.log(selectedAccountIds);
    };
    const clearAccountFilters = () => {
        setSelectedAccountIds([]);
        setShowDriverPopup(false);
    };
    const applyAccountFilters = () => {
        setShowDriverPopup(false);
        toast({
            title: "Filters Applied",
            description: selectedAccountIds.length > 0
                ? `Showing assets for ${selectedAccountIds.length} accounts(s)`
                : "Showing all assets",
        });
    };

    if (loading) {
        return (<LoadingView headline={`Loading`} subline={`Initializing map...`}/>);
    }
    return (
        <div className="relative flex-1 bg-background h-[calc(100vh-5rem)]">
          {/* Map container */}
          <GoogleTrackingMap
            asset={selectedAsset}
            showingHistory={null}
          />

          {/* Search Overlay */}
          <div className="search-overlay glass-overlay p-0.5">
            <div
              className="flex items-center justify-between p-2 cursor-pointer"
              onClick={() => setIsAssetSearchOpen(!isAssetSearchOpen)}
            >
              <h4 className="text-md font-semibold text-foreground">Vehicle Search</h4>

              {isAssetSearchOpen ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronUp size={20} />
              )}
            </div>

            {isAssetSearchOpen && (
              <>
                <div className="driver-filter-container mb-3 px-2">
                  <button
                    className="driver-filter-button flex items-center gap-2 px-3 py-2 bg-background/80 rounded-md border border-border hover:bg-accent transition-colors w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDriverPopup(true);
                    }}
                  >
                    <span className="float-right text-sm text-foreground w-full">
                      {selectedAccountIds.length === 0
                        ? 'All Accounts'
                        : selectedAccountIds.length === 1
                          ? "1 Account Selected"
                          : `${selectedAccountIds.length} Accounts Selected`}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                </div>

                <AssetSearchOverlay
                  assets={filteredAssets}
                  selectedAssetIds={selectedAssetIds}
                  onAssetSelect={handleAssetSelect}
                  onShowHistory={null}
                  showingHistory={null}
                />
              </>
            )}
          </div>

          {/* Driver Selection Popup */}
          {showDriverPopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="font-semibold">Select Accounts</h3>
                  <button
                    onClick={() => setShowDriverPopup(false)}
                    className="p-1 rounded-full hover:bg-accent"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      placeholder="Search account..."
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
                      value={accountSearchTerm}
                      onChange={(e) => setAccountSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="p-2 border-b border-border sticky top-0 bg-background z-10">
                    <button
                      onClick={handleSelectAllAccounts}
                      className="text-sm text-primary hover:underline"
                    >
                      { (selectedAccountIds.length === mapsData.accounts.length) ? "Deselect All" : (mapsData.accounts.length > 0 ? "Select All" : "No Accounts Found")}
                    </button>
                  </div>

                  <div className="divide-y divide-border">
                      { (filteredAccounts.length > 0) ? (
                              filteredAccounts.map(account => (
                                  <div
                                      key={account.id}
                                      className="p-3 flex items-center gap-3 cursor-pointer hover:bg-accent/30 transition-colors"
                                      onClick={() => toggleAccountSelection(account.id)}
                                  >
                                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedAccountIds.includes(account.id)
                                          ? 'bg-primary border-primary'
                                          : 'border-border'
                                      }`}>
                                          {selectedAccountIds.includes(account.id) && (
                                              <Check size={14} className="text-primary-foreground" />
                                          )}
                                      </div>
                                      <div className="flex-1">
                                          <div className="font-medium">{account.name}</div>
                                          <div className="text-xs text-muted-foreground">
                                              {account.assets_count} assets
                                          </div>
                                      </div>
                                  </div>
                              ))
                          ) :
                          (
                              <div className="p-4 text-center text-muted-foreground">
                                No Accounts found
                              </div>
                          )
                      }
                  </div>
                </div>

                <div className="flex justify-between p-4 border-t border-border">
                  <button
                    onClick={clearAccountFilters}
                    className="px-4 py-2 text-foreground/70 hover:text-foreground"
                  >
                    Clear
                  </button>
                  <button
                    onClick={applyAccountFilters}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
    </div>
  );
}