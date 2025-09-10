import React, { useState } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { SlideOver } from '@/components/shared/SlideOver';
import { Button } from '@/components/ui/button';
import { PlusCircle, Car, CircleDot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const mockAssets = [
  {
    id: '1',
    name: 'KBZ 111A',
    type: 'Vehicle',
    status: 'active',
    lastSeen: new Date(),
    model: 'Toyota Hilux',
    year: '2022',
    assignedTo: 'John Doe',
  },
  // Add more mock data...
];

const columns = [
  {
    accessorKey: "name",
    header: "Asset ID",
    cell: ({ row }) => {
      const asset = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Car className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{asset.name}</div>
            <div className="text-sm text-muted-foreground">{asset.model}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className="capitalize"
        >
          <CircleDot className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
  },
  {
    accessorKey: "lastSeen",
    header: "Last Seen",
    cell: ({ row }) => {
      return formatDistanceToNow(row.getValue("lastSeen"), { addSuffix: true });
    },
  },
];

export default function AssetsPage() {
  const [isAddingAsset, setIsAddingAsset] = useState(false);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Assets Information</h1>
          <p className="text-muted-foreground">
            Track and manage your fleet assets
          </p>
        </div>
        <Button onClick={() => setIsAddingAsset(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={mockAssets}
        title="Assets"
      />

      <SlideOver
        isOpen={isAddingAsset}
        onClose={() => setIsAddingAsset(false)}
        title="Add New Asset"
      >
        {/* Add asset form will go here */}
        <div className="space-y-4">
          {/* Form components will go here */}
        </div>
      </SlideOver>
    </div>
  );
}
