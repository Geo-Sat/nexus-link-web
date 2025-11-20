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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { useToast } from '@/hooks/use-toast.ts';
import {LoadingView} from "@/components/shared/LoadingView.tsx";
import apiClient from '@/lib/api'
import { Asset } from "@/types/asset.ts";

export function AssetsPage() {
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [rows, setRows] = useState<Asset[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
    const [selectedRow, setSelectedRow] = useState<Asset | null>(null)
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortField, setSortField] = useState<keyof Asset>('created_at')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await apiClient.get('assets/assets');
                const apiData = response.data.results;
                setRows(apiData);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load assets', error);
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

    const filteredRows = useMemo(() => {
    const result = rows.filter(
      (row) =>
        row.registration.toLowerCase().includes(searchTerm.toLowerCase())
    )

    result.sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]
      
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
  }, [rows, searchTerm, sortField, sortDirection])

    const totalPages = Math.ceil(filteredRows.length / itemsPerPage)
    const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredRows.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredRows, currentPage, itemsPerPage])

  const handleSort = (field: keyof Asset) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleViewRow = (row: Asset) => {
    setSelectedRow(row)
    setIsSidePanelOpen(true)
    setIsEditing(false)
  }

  const handleEditRow = (row: Asset) => {
    setSelectedRow(row)
    setIsSidePanelOpen(true)
    setIsEditing(true)
  }

  const handleDeleteRow = (code: string) => {
    if (window.confirm('Are you sure you want to delete this row?')) {
      setRows(rows.filter(row => row.code !== code))
      if (selectedRow?.code === code) {
        setSelectedRow(null)
        setIsSidePanelOpen(false)
      }
      // Reset to first page if current page would be empty
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  }

  const handleSaveRow = (updatedRow: Asset) => {
    setRows(rows.map(row =>
        row.code === updatedRow.code ? updatedRow : row
    ))
    setSelectedRow(updatedRow)
    setIsEditing(false)
  }

  const handleCloseSidePanel = () => {
    setIsSidePanelOpen(false)
    setSelectedRow(null)
    setIsEditing(false)
  }

  const handleShareRow = (row: Asset) => {
    alert(`Sharing ${row.registration}`)
  }

  const exportToCSV = () => {
      const headers = [
          'Registration', 'Created at'
      ]
      const csvData = filteredRows.map(row => [
          row.registration,
          row.created_at,
      ]);

    // const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    // const link = document.createElement('a')
    // const url = URL.createObjectURL(blob)
    //
    // link.setAttribute('href', url)
    // link.setAttribute('download', `accounts_export_${new Date().toISOString().split('T')[0]}.csv`)
    // link.style.visibility = 'hidden'
    //
    // document.body.appendChild(link)
    // link.click()
    // document.body.removeChild(link)
  }

  const getStatusColor = (is_active: boolean) => {
      return (is_active) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  if (loading) {
      return (<LoadingView headline={`Assets`} subline={`Loading, please wait...`} />)
  }
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assets Management</h1>
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
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
              </DialogHeader>
              {/* Add form content here */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <Input
          placeholder="Search partners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm text-sm h-8"
        />
        <div className="text-sm text-muted-foreground">
          {filteredRows.length} account{filteredRows.length !== 1 ? 's' : ''} found
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
                        <Button variant="ghost" onClick={() => handleSort('registration')} className="p-0 font-medium">
                            Registration
                          <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-2 text-xs cursor-pointer hover:bg-accent">
                        <Button variant="ghost" onClick={() => handleSort('asset_category')} className="p-0 font-medium">
                          Category
                          <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                        <TableHead className="py-2 text-xs cursor-pointer hover:bg-accent">
                            <Button variant="ghost"  className="p-0 font-medium">
                                No of installations
                            </Button>
                        </TableHead>
                        <TableHead className="py-2 text-xs cursor-pointer hover:bg-accent">
                            <Button variant="ghost" className="p-0 font-medium">
                                Account Name
                            </Button>
                        </TableHead>
                        <TableHead className="py-2 text-xs cursor-pointer hover:bg-accent">
                            <Button variant="ghost" className="p-0 font-medium">
                                Phone
                            </Button>
                        </TableHead>

                      <TableHead className="py-2 text-xs cursor-pointer hover:bg-accent">
                        <Button variant="ghost" onClick={() => handleSort('created_at')} className="p-0 font-medium">
                          Created
                          <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-2 text-xs cursor-pointer hover:bg-accent">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((row) => (
                      <TableRow key={row.code} className="text-xs">
                        <TableCell className="font-medium py-2">{row.registration}</TableCell>
                          <TableCell className="font-medium py-2">{row.asset_category.toUpperCase()}</TableCell>
                          <TableCell className="font-medium py-2">{row?.account_name?.toUpperCase()}</TableCell>
                          <TableCell className="font-medium py-2">{row?.account_phone}</TableCell>
                          <TableCell className="font-medium py-2">{row?.asset_tracking_accounts?.length}</TableCell>
                        <TableCell className="py-2">{new Date(row.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleViewRow(row)} className="h-7 w-7">
                              <EyeIcon className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditRow(row)} className="h-7 w-7">
                              <EditIcon className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteRow(row.code)} className="h-7 w-7">
                              <TrashIcon className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleShareRow(row)} className="h-7 w-7">
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
              {currentItems.map((row) => (
                <Card key={row.code} className="overflow-hidden text-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-sm">{row.registration}</CardTitle>
                        <CardDescription className="text-xs">{row.created_at}</CardDescription>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(row.account.is_active)}`}>{row.account.is_active}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-1 text-xs">

                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>Create {new Date(row.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t text-xs">
                    <Button variant="outline" size="sm" onClick={() => handleViewRow(row)} className="h-7 text-xs">
                      View
                    </Button>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditRow(row)} className="h-7 w-7">
                        <EditIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRow(row.code)} className="h-7 w-7">
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleShareRow(row)} className="h-7 w-7">
                        <ShareIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredRows.length > 0 && (
            <div className="flex items-center justify-between mt-4 text-xs">
              <div className="text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRows.length)} of {filteredRows.length} accounts
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

        {isSidePanelOpen && selectedRow && (
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
                  <div></div>
                // <AccountEditForm
                //   account={selectedAccount}
                //   onSave={handleSaveAccount}
                //   onCancel={() => setIsEditing(false)}
                // />
              ) : (
                  <div></div>
                  // <AccountDetailView account={selectedAccount} onEdit={() => setIsEditing(true)} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// function AccountDetailView({ account, onEdit }: { account: Account; onEdit: () => void }) {
//       return (
//         <div className="space-y-4 text-sm">
//           <div className="flex justify-between items-center">
//             <div>
//               <h3 className="text-lg font-bold">{account.name}</h3>
//               <p className="text-muted-foreground text-xs">{account.owner_type}</p>
//             </div>
//             <Badge className={`text-xs ${getStatusColor((account.is_active) ? 'true' : 'false')}`}>{account.is_active}</Badge>
//           </div>
//
//           <Tabs defaultValue="details">
//             <TabsList className="grid w-full grid-cols-2 text-xs h-8">
//               <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
//               <TabsTrigger value="billing" className="text-xs">Billing</TabsTrigger>
//             </TabsList>
//
//             <TabsContent value="details" className="space-y-3 pt-3">
//               <div className="space-y-3">
//                 <div>
//                   <Label className="text-muted-foreground text-xs">Email</Label>
//                   <p className="font-medium text-sm">{account.email}</p>
//                 </div>
//                 {account.phone && (
//                   <div>
//                     <Label className="text-muted-foreground text-xs">Phone</Label>
//                     <p className="font-medium text-sm">{account.phone}</p>
//                   </div>
//                 )}
//
//                 <Separator />
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <Label className="text-muted-foreground text-xs">Devices</Label>
//                     <p className="font-medium text-sm">{account.assets_count}/{account.assets_count}</p>
//                   </div>
//
//                 </div>
//                 <Separator />
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <Label className="text-muted-foreground text-xs">Created</Label>
//                     <p className="font-medium text-sm">{new Date(account.created_at).toLocaleDateString()}</p>
//                   </div>
//
//                 </div>
//               </div>
//             </TabsContent>
//               {/*
//             <TabsContent value="billing" className="pt-3">
//               <div className="space-y-3">
//                 <div className="p-3 border rounded-lg text-xs">
//                   <h4 className="font-medium mb-1">Current Plan</h4>
//                   <div className="flex justify-between items-center">
//                     <span className="capitalize">{account.subscription} Plan</span>
//                     <Badge className={getSubscriptionColor(account.subscription)}>
//                       {account.subscription}
//                     </Badge>
//                   </div>
//                 </div>
//                 <div className="p-3 border rounded-lg text-xs">
//                   <h4 className="font-medium mb-1">Billing Information</h4>
//                   <p className="text-sm text-muted-foreground">Next billing date: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}</p>
//                 </div>
//               </div>
//             </TabsContent>
//                */}
//           </Tabs>
//           <div className="flex gap-2 pt-4 text-xs">
//             <Button onClick={onEdit} className="flex-1 h-8 text-xs">
//               <EditIcon className="h-3 w-3 mr-1" />
//               Edit Account
//             </Button>
//             <Button variant="outline" className="flex-1 h-8 text-xs">
//               <ShareIcon className="h-3 w-3 mr-1" />
//               Share
//             </Button>
//           </div>
//         </div>
//       )
// }
//
// function AccountEditForm({ account, onSave, onCancel }: {
//   account: Account;
//   onSave: (account: Account) => void;
//   onCancel: () => void;
// }) {
//     const [formData, setFormData] = useState(account)

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     onSave(formData)
//   }
//
//   const handleChange = (field: keyof Account, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }))
//   }
//
//   return (
//     <form onSubmit={handleSubmit} className="space-y-3 text-sm">
//       <div className="space-y-1">
//         <Label htmlFor="name" className="text-xs">Account Name</Label>
//         <Input
//           id="name"
//           value={formData.name}
//           onChange={(e) => handleChange('name', e.target.value)}
//           required
//           className="text-xs h-8"
//         />
//       </div>
//
//       <div className="space-y-1">
//         <Label htmlFor="email" className="text-xs">Email</Label>
//         <Input
//           id="email"
//           type="email"
//           value={formData.email}
//           onChange={(e) => handleChange('email', e.target.value)}
//           required
//           className="text-xs h-8"
//         />
//       </div>
//
//       <div className="grid grid-cols-2 gap-3">
//         <div className="space-y-1">
//           <Label htmlFor="phone" className="text-xs">Phone</Label>
//           <Input
//             id="phone"
//             value={formData.phone || ''}
//             onChange={(e) => handleChange('phone', e.target.value)}
//             className="text-xs h-8"
//           />
//         </div>
//
//       </div>
//
//       <div className="space-y-1">
//         <Label htmlFor="status" className="text-xs">Status</Label>
//         <select
//             id="status"
//             value={(formData.is_active) ? 'true' : 'false'}
//             onChange={(e) => handleChange('is_active', e.target.value)}
//             className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <option value="true">Active</option>
//             <option value="false">Inactive</option>
//           </select>
//       </div>
//
//       <div className="flex gap-2 pt-3 text-xs">
//         <Button type="submit" className="flex-1 h-8 text-xs">
//           Save Changes
//         </Button>
//         <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-8 text-xs">
//           Cancel
//         </Button>
//       </div>
//     </form>
//   )
// }

// Helper function to get status color classes
function getStatusColor(status: string) {
  switch (status) {
    case 'true': return 'bg-green-100 text-green-800'
    case 'false': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}