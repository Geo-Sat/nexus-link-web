import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Account } from '@/types/account';
import { Vehicle } from '@/types/vehicle';

interface AccountSearchOverlayProps {
  accounts: Account[];
  vehicles: Vehicle[];
  selectedAccounts: number[];
  onAccountSelect: (accountId: number, isSelected: boolean) => void;
}

export const AccountSearchOverlay: React.FC<AccountSearchOverlayProps> = ({
  accounts,
  vehicles,
  selectedAccounts,
  onAccountSelect,
}) => {
  const [driverSearchTerm, setDriverSearchTerm] = useState('');

  const toggleDriverSelection = (driverId: number) => {
    onAccountSelect(driverId, !selectedAccounts.includes(driverId));
  };

  const selectAllDrivers = () => {
    if (selectedAccounts.length === accounts.length) {
      accounts.forEach(account => onAccountSelect(account.id, false));
    } else {
      accounts.forEach(account => onAccountSelect(account.id, true));
    }
  };

  const filteredDrivers = accounts.filter(account =>
    account.name.toLowerCase().includes(driverSearchTerm.toLowerCase()) ||
    account.id.toString().toLowerCase().includes(driverSearchTerm.toLowerCase())
  );

  return (
      <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-foreground text-sm">Account Search</h2>
        <Badge variant="outline" className="text-xs">
          {filteredDrivers.length} accounts
        </Badge>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search account..."
          value={driverSearchTerm}
          onChange={(e) => setDriverSearchTerm(e.target.value)}
          className="pl-10 bg-card/50 border-border/50"
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {/* Selected Accounts Actions */}
        {/* {selectedAccounts.length > 0 && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 mb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                {selectedAccounts.length} selected
              </span>
              <Button
                size="sm"
                onClick={selectAllDrivers}
                className="text-xs"
                variant={selectedAccounts.length === accounts.length ? 'secondary' : 'default'}
              >
                {selectedAccounts.length === accounts.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
        )} */}

        {/* Account List */}
        <div className="space-y-1">
          {filteredDrivers.length > 0 ? (
            filteredDrivers.map(driver => (
              <div
                key={driver.id}
                className={cn(
                  "p-2 rounded-lg border transition-all duration-200 cursor-pointer",
                  selectedAccounts.includes(driver.id)
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card/30 hover:bg-card/50"
                )}
                onClick={() => toggleDriverSelection(driver.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedAccounts.includes(driver.id)}
                    // Prevent the checkbox from interfering with the parent div's click event
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-xs text-foreground">{driver.name}</h3>
                    </div>
                    <div className="space-y-1 text-[0.65rem] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {vehicles.filter(v => v.account.id === driver.id).length} vehicles
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No accounts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};