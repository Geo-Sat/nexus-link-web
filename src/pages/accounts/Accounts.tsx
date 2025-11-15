import {useState, useMemo, useEffect} from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.tsx'
import { 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  ShareIcon, 
  EyeIcon, 
  XIcon,
  ListIcon,
  GridIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  CalendarIcon,
  DownloadIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ArrowUpDownIcon
} from 'lucide-react'
import { Badge } from '@/components/ui/badge.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { useToast } from '@/hooks/use-toast.ts';
import {LoadingView} from "@/components/shared/LoadingView.tsx";
import axios from 'axios';
import { Account } from '@/types/account.ts';

export function AccountsPage() {
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [accounts, setAccounts] = useState<Account[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortField, setSortField] = useState<keyof Account>('created_at')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
    const NEXT_PUBLIC_API_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYzMjMzNTc2LCJpYXQiOjE3NjMyMzE3NzYsImp0aSI6IjljN2QwMTBiZjQ5YzRlNWU5NWRmOTBlN2UyMWI2NDllIiwidXNlcl9pZCI6IjEifQ.WvWOT0BbLRoemRs4YKGYubHXc7yS0Fr6_NTJgzTJoWM"
    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/accounts/accounts/', {
                    headers: {
                        'Authorization': `Bearer ${NEXT_PUBLIC_API_TOKEN}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                // Extract the accounts data from the results array
                const accountsData = response.data.results;

                // Process your data here - set accounts data to state
                setAccounts(accountsData);

                toast({
                    title: "Data Loaded",
                    description: `Loaded ${accountsData.length} accounts`,
                });
                setLoading(false);
            } catch (error) {
                console.error('Failed to load data:', error);
                toast({
                    title: "Error",
                    description: "Failed to load data",
                    variant: "destructive",
                });
                setLoading(false);
            }
        };

        loadData();
    }, [toast]);

  const filteredAccounts = useMemo(() => {
    let result = accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (account.company && account.company.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // Sorting
    result.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }
      
      return 0
    })

    return result
  }, [accounts, searchTerm, sortField, sortDirection])

  // Pagination logic
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage)
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAccounts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAccounts, currentPage, itemsPerPage])

  const handleSort = (field: keyof Account) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleViewAccount = (account: Account) => {
    setSelectedAccount(account)
    setIsSidePanelOpen(true)
    setIsEditing(false)
  }

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account)
    setIsSidePanelOpen(true)
    setIsEditing(true)
  }

  const handleDeleteAccount = (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter(account => account.id !== id))
      if (selectedAccount?.id === id) {
        setSelectedAccount(null)
        setIsSidePanelOpen(false)
      }
      // Reset to first page if current page would be empty
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  }

  const handleSaveAccount = (updatedAccount: Account) => {
    setAccounts(accounts.map(account => 
      account.id === updatedAccount.id ? updatedAccount : account
    ))
    setSelectedAccount(updatedAccount)
    setIsEditing(false)
  }

  const handleCloseSidePanel = () => {
    setIsSidePanelOpen(false)
    setSelectedAccount(null)
    setIsEditing(false)
  }

  const handleShareAccount = (account: Account) => {
    alert(`Sharing account ${account.name} with others...`)
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Company', 'Phone', 'Devices', 'Max Devices', 'Status', 'Subscription', 'Created At', 'Last Login', 'Address']
    const csvData = filteredAccounts.map(account => [
      account.name,
      account.email,
      account.company || 'N/A',
      account.phone || 'N/A',
      account.devices.toString(),
      account.maxDevices.toString(),
      account.status,
      account.subscription,
      new Date(account.createdAt).toLocaleDateString(),
      account.lastLogin ? new Date(account.lastLogin).toLocaleDateString() : 'N/A',
      account.address || 'N/A'
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `accounts_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (is_active: boolean) => {
      return (is_active) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getSubscriptionColor = (subscription: Account['subscription']) => {
    switch (subscription) {
      case 'basic': return 'bg-blue-100 text-blue-800'
      case 'pro': return 'bg-purple-100 text-purple-800'
      case 'enterprise': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
    if (loading) {
        return (<LoadingView headline={`Accounts`} subline={`Loading, please wait...`} />)
    }
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Account Management</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
            className="h-8 w-8"
          >
            <ListIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8"
          >
            <GridIcon className="h-4 w-4" />
          </Button>
          <Button onClick={exportToCSV} variant="outline" className="h-8 text-xs">
            <DownloadIcon className="h-3 w-3 mr-1" />
            Export CSV
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-8 text-xs">
                <PlusIcon className="mr-1 h-3 w-3" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Account</DialogTitle>
              </DialogHeader>
              {/* Add form content here */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <Input
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm text-sm h-8"
        />
        <div className="text-sm text-muted-foreground">
          {filteredAccounts.length} account{filteredAccounts.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="flex gap-6">
        <div className={`${isSidePanelOpen ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
          {viewMode === 'table' ? (
            <div className="rounded-md border text-sm">
              <div className="overflow-auto max-h-[calc(100vh-12rem)]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="py-2 text-xs cursor-pointer hover:bg-accent">
                        <Button variant="ghost" onClick={() => handleSort('name')} className="p-0 font-medium">
                          Account Name
                          <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-2 text-xs cursor-pointer hover:bg-accent">
                        <Button variant="ghost" onClick={() => handleSort('email')} className="p-0 font-medium">
                          Email
                          <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-2 text-xs cursor-pointer hover:bg-accent">
                        <Button variant="ghost" onClick={() => handleSort('company')} className="p-0 font-medium">
                          Company
                          <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-2 text-xs cursor-pointer hover:bg-accent">
                        <Button variant="ghost" onClick={() => handleSort('devices')} className="p-0 font-medium">
                          Assets
                          <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-2 text-xs cursor-pointer hover:bg-accent">
                        <Button variant="ghost" onClick={() => handleSort('subscription')} className="p-0 font-medium">
                          Subscription
                          <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-2 text-xs cursor-pointer hover:bg-accent">
                        <Button variant="ghost" onClick={() => handleSort('status')} className="p-0 font-medium">
                          Status
                          <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-2 text-xs cursor-pointer hover:bg-accent">
                        <Button variant="ghost" onClick={() => handleSort('createdAt')} className="p-0 font-medium">
                          Created
                          <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-2 text-xs cursor-pointer hover:bg-accent">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((account) => (
                      <TableRow key={account.id} className="text-xs">
                        <TableCell className="font-medium py-2">{account.name}</TableCell>
                        <TableCell className="py-2">{account.email}</TableCell>
                        <TableCell className="py-2">{account.company || 'N/A'}</TableCell>
                        <TableCell className="py-2">{account.assets_count}</TableCell>
                        <TableCell className="py-2">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold ${getSubscriptionColor(account.subscription)}`}
                          >
                            {account.subscription}
                          </span>
                        </TableCell>
                        <TableCell className="py-2">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold ${getStatusColor(account.is_active)}`}
                          >
                            {(account.is_active) ? 'Active': 'In-active'}
                          </span>
                        </TableCell>
                        <TableCell className="py-2">{new Date(account.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleViewAccount(account)} className="h-7 w-7">
                              <EyeIcon className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditAccount(account)} className="h-7 w-7">
                              <EditIcon className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(account.id)} className="h-7 w-7">
                              <TrashIcon className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleShareAccount(account)} className="h-7 w-7">
                              <ShareIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentItems.map((account) => (
                <Card key={account.id} className="overflow-hidden text-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-sm">{account.name}</CardTitle>
                        <CardDescription className="text-xs">{account.company || 'Individual Account'}</CardDescription>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(account.status)}`}>{account.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center">
                        <MailIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>{account.email}</span>
                      </div>
                      {account.phone && (
                        <div className="flex items-center">
                          <PhoneIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{account.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <UserIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>{account.devices}/{account.maxDevices} devices</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>Joined {new Date(account.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t text-xs">
                    <Button variant="outline" size="sm" onClick={() => handleViewAccount(account)} className="h-7 text-xs">
                      View
                    </Button>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditAccount(account)} className="h-7 w-7">
                        <EditIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(account.id)} className="h-7 w-7">
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleShareAccount(account)} className="h-7 w-7">
                        <ShareIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredAccounts.length > 0 && (
            <div className="flex items-center justify-between mt-4 text-xs">
              <div className="text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length} accounts
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span>Rows per page:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="h-7 w-16 text-xs">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="h-7 w-7"
                  >
                    <ChevronsLeftIcon className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-7 w-7"
                  >
                    <ChevronLeftIcon className="h-3 w-3" />
                  </Button>
                  
                  <span className="px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-7 w-7"
                  >
                    <ChevronRightIcon className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="h-7 w-7"
                  >
                    <ChevronsRightIcon className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {isSidePanelOpen && selectedAccount && (
          <div className="w-1/3 border-l">
            <div className="sticky top-0 h-screen overflow-y-auto p-6 text-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {isEditing ? 'Edit Account' : 'Account Details'}
                </h2>
                <Button variant="ghost" size="icon" onClick={handleCloseSidePanel} className="h-7 w-7">
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>

              {isEditing ? (
                <AccountEditForm 
                  account={selectedAccount} 
                  onSave={handleSaveAccount} 
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <AccountDetailView account={selectedAccount} onEdit={() => setIsEditing(true)} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AccountDetailView({ account, onEdit }: { account: Account; onEdit: () => void }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">{account.name}</h3>
          <p className="text-muted-foreground text-xs">{account.company || 'Individual Account'}</p>
        </div>
        <Badge className={`text-xs ${getStatusColor(account.status)}`}>{account.status}</Badge>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-2 text-xs h-8">
          <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
          <TabsTrigger value="billing" className="text-xs">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-3 pt-3">
          <div className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">Email</Label>
              <p className="font-medium text-sm">{account.email}</p>
            </div>
            {account.phone && (
              <div>
                <Label className="text-muted-foreground text-xs">Phone</Label>
                <p className="font-medium text-sm">{account.phone}</p>
              </div>
            )}
            {account.address && (
              <div>
                <Label className="text-muted-foreground text-xs">Address</Label>
                <p className="font-medium text-sm">{account.address}</p>
              </div>
            )}
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground text-xs">Devices</Label>
                <p className="font-medium text-sm">{account.devices}/{account.maxDevices}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Subscription</Label>
                <p className="font-medium text-sm capitalize">{account.subscription}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground text-xs">Created</Label>
                <p className="font-medium text-sm">{new Date(account.createdAt).toLocaleDateString()}</p>
              </div>
              {account.lastLogin && (
                <div>
                  <Label className="text-muted-foreground text-xs">Last Login</Label>
                  <p className="font-medium text-sm">{new Date(account.lastLogin).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="pt-3">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg text-xs">
              <h4 className="font-medium mb-1">Current Plan</h4>
              <div className="flex justify-between items-center">
                <span className="capitalize">{account.subscription} Plan</span>
                <Badge className={getSubscriptionColor(account.subscription)}>
                  {account.subscription}
                </Badge>
              </div>
            </div>
            <div className="p-3 border rounded-lg text-xs">
              <h4 className="font-medium mb-1">Billing Information</h4>
              <p className="text-sm text-muted-foreground">Next billing date: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 pt-4 text-xs">
        <Button onClick={onEdit} className="flex-1 h-8 text-xs">
          <EditIcon className="h-3 w-3 mr-1" />
          Edit Account
        </Button>
        <Button variant="outline" className="flex-1 h-8 text-xs">
          <ShareIcon className="h-3 w-3 mr-1" />
          Share
        </Button>
      </div>
    </div>
  )
}

function AccountEditForm({ account, onSave, onCancel }: { 
  account: Account; 
  onSave: (account: Account) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(account)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof Account, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div className="space-y-1">
        <Label htmlFor="name" className="text-xs">Account Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          className="text-xs h-8"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email" className="text-xs">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
          className="text-xs h-8"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="phone" className="text-xs">Phone</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="text-xs h-8"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="company" className="text-xs">Company</Label>
          <Input
            id="company"
            value={formData.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            className="text-xs h-8"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="address" className="text-xs">Address</Label>
        <Input
          id="address"
          value={formData.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          className="text-xs h-8"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="maxDevices" className="text-xs">Max Devices</Label>
          <Input
            id="maxDevices"
            type="number"
            value={formData.maxDevices}
            onChange={(e) => handleChange('maxDevices', parseInt(e.target.value))}
            required
            className="text-xs h-8"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="subscription" className="text-xs">Subscription</Label>
          <select
            id="subscription"
            value={formData.subscription}
            onChange={(e) => handleChange('subscription', e.target.value)}
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="status" className="text-xs">Status</Label>
        <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
      </div>

      <div className="flex gap-2 pt-3 text-xs">
        <Button type="submit" className="flex-1 h-8 text-xs">
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-8 text-xs">
          Cancel
        </Button>
      </div>
    </form>
  )
}

// Helper function to get status color classes
function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'inactive': return 'bg-gray-100 text-gray-800'
    case 'suspended': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getSubscriptionColor(subscription: string) {
  switch (subscription) {
    case 'basic': return 'bg-blue-100 text-blue-800'
    case 'pro': return 'bg-purple-100 text-purple-800'
    case 'enterprise': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}