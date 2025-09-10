import React, { useState } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { SlideOver } from '@/components/shared/SlideOver';
import { Button } from '@/components/ui/button';
import { PlusCircle, Building2, Check, X } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const mockAccounts = [
  {
    id: '1',
    name: 'ABC Transport',
    logo: '/placeholder.svg',
    email: 'info@abctransport.com',
    status: 'active',
    devices: 5,
    createdAt: new Date('2023-01-01'),
  },
  // Add more mock data...
];

const columns = [
  {
    accessorKey: "name",
    header: "Company",
    cell: ({ row }) => {
      const account = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <img src={account.logo} alt={account.name} />
          </Avatar>
          <div>
            <div className="font-medium">{account.name}</div>
            <div className="text-sm text-muted-foreground">{account.email}</div>
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
          {status === "active" ? (
            <Check className="h-3 w-3 mr-1" />
          ) : (
            <X className="h-3 w-3 mr-1" />
          )}
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "devices",
    header: "Devices",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      return formatDistanceToNow(row.getValue("createdAt"), { addSuffix: true });
    },
  },
];

export default function AccountsPage() {
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Account Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all client accounts
          </p>
        </div>
        <Button onClick={() => setIsAddingAccount(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={mockAccounts}
        title="Accounts"
      />

      <SlideOver
        isOpen={isAddingAccount}
        onClose={() => setIsAddingAccount(false)}
        title="Add New Account"
      >
        {/* Add account form will go here */}
        <div className="space-y-4">
          {/* Form components will go here */}
        </div>
      </SlideOver>
    </div>
  );
}
