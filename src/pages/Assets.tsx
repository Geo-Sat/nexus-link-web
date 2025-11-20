import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  ShareIcon, 
  EyeIcon, 
  XIcon,
  ListIcon,
  GridIcon,
  MapPinIcon,
  SignalIcon,
  CalendarIcon,
  CpuIcon,
  DownloadIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Asset {
  id: string
  imei: string
  model: string
  simNumber: string
  firmware: string
  status: 'active' | 'inactive' | 'maintenance'
  lastPing: string
  vehicle?: string
  batteryLevel: number
  signalStrength: number
  installedDate: string
}

const mockAssets: Asset[] = [
  {
    id: '1',
    imei: '123456789012345',
    model: 'GT06N',
    simNumber: '+254712345678',
    firmware: 'v2.3.4',
    status: 'active',
    lastPing: '2025-09-04T10:00:00Z',
    vehicle: 'KCA 001A',
    batteryLevel: 85,
    signalStrength: 4,
    installedDate: '2025-01-15T00:00:00Z'
  },
  {
    id: '2',
    imei: '234567890123456',
    model: 'TK103',
    simNumber: '+254723456789',
    firmware: 'v1.8.2',
    status: 'active',
    lastPing: '2025-09-04T09:45:00Z',
    vehicle: 'KBZ 205B',
    batteryLevel: 92,
    signalStrength: 5,
    installedDate: '2025-02-20T00:00:00Z'
  },
  {
    id: '3',
    imei: '345678901234567',
    model: 'VT300',
    simNumber: '+254734567890',
    firmware: 'v3.1.0',
    status: 'maintenance',
    lastPing: '2025-09-03T16:30:00Z',
    batteryLevel: 45,
    signalStrength: 2,
    installedDate: '2024-11-10T00:00:00Z'
  },
  // Add more mock data for pagination testing
  ...Array.from({ length: 27 }, (_, i) => ({
    id: `${i + 4}`,
    imei: `${456789012345678 + i}`,
    model: ['GT06N', 'TK103', 'VT300', 'TT18'][i % 4],
    simNumber: `+2547${34567890 + i}`,
    firmware: `v${(i % 3) + 1}.${(i % 5)}.${(i % 4)}`,
    status: ['active', 'inactive', 'maintenance'][i % 3] as 'active' | 'inactive' | 'maintenance',
    lastPing: new Date(Date.now() - (i * 3600000)).toISOString(),
    vehicle: i % 5 === 0 ? undefined : `K${['A', 'B', 'C'][i % 3]} ${100 + i}A`,
    batteryLevel: 100 - (i * 3) % 100,
    signalStrength: (i % 5) + 1,
    installedDate: new Date(Date.now() - (i * 86400000 * 30)).toISOString()
  }))
]

export function AssetsPage1() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredAssets = assets.filter(
    (asset) =>
      asset.imei.includes(searchTerm) || 
      asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.vehicle && asset.vehicle.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage)
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAssets.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAssets, currentPage, itemsPerPage])

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset)
    setIsSidePanelOpen(true)
    setIsEditing(false)
  }

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset)
    setIsSidePanelOpen(true)
    setIsEditing(true)
  }

  const handleDeleteAsset = (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setAssets(assets.filter(asset => asset.id !== id))
      if (selectedAsset?.id === id) {
        setSelectedAsset(null)
        setIsSidePanelOpen(false)
      }
      // Reset to first page if current page would be empty
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  }

  const handleSaveAsset = (updatedAsset: Asset) => {
    setAssets(assets.map(asset => 
      asset.id === updatedAsset.id ? updatedAsset : asset
    ))
    setSelectedAsset(updatedAsset)
    setIsEditing(false)
  }

  const handleCloseSidePanel = () => {
    setIsSidePanelOpen(false)
    setSelectedAsset(null)
    setIsEditing(false)
  }

  const handleShareAsset = (asset: Asset) => {
    alert(`Sharing asset ${asset.imei} with others...`)
  }

  const exportToCSV = () => {
    const headers = ['IMEI', 'Model', 'Vehicle', 'SIM Number', 'Firmware', 'Status', 'Battery Level', 'Signal Strength', 'Last Ping', 'Installed Date']
    const csvData = filteredAssets.map(asset => [
      asset.imei,
      asset.model,
      asset.vehicle || 'Unassigned',
      asset.simNumber,
      asset.firmware,
      asset.status,
      `${asset.batteryLevel}%`,
      `${asset.signalStrength}/5`,
      new Date(asset.lastPing).toLocaleString(),
      new Date(asset.installedDate).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `assets_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: Asset['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 70) return 'bg-green-100 text-green-800'
    if (level > 30) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getSignalColor = (strength: number) => {
    if (strength > 3) return 'bg-green-100 text-green-800'
    if (strength > 1) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Asset Management</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <GridIcon className="h-4 w-4" />
          </Button>
          <Button onClick={exportToCSV} variant="outline" className="text-xs">
            <DownloadIcon className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-xs">
                <PlusIcon className="mr-1 h-4 w-4" />
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
          placeholder="Search assets by IMEI, model, or vehicle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm text-sm"
        />
        <div className="text-sm text-muted-foreground">
          {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="flex gap-6">
        <div className={`${isSidePanelOpen ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
          {viewMode === 'table' ? (
            <div className="rounded-md border text-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-2 text-xs">IMEI</TableHead>
                    <TableHead className="py-2 text-xs">Model</TableHead>
                    <TableHead className="py-2 text-xs">Vehicle</TableHead>
                    <TableHead className="py-2 text-xs">Battery</TableHead>
                    <TableHead className="py-2 text-xs">Signal</TableHead>
                    <TableHead className="py-2 text-xs">Status</TableHead>
                    <TableHead className="py-2 text-xs">Last Ping</TableHead>
                    <TableHead className="py-2 text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((asset) => (
                    <TableRow key={asset.id} className="text-xs">
                      <TableCell className="font-medium py-2">{asset.imei}</TableCell>
                      <TableCell className="py-2">{asset.model}</TableCell>
                      <TableCell className="py-2">{asset.vehicle || 'Unassigned'}</TableCell>
                      <TableCell className="py-2">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold ${getBatteryColor(asset.batteryLevel)}`}
                        >
                          {asset.batteryLevel}%
                        </span>
                      </TableCell>
                      <TableCell className="py-2">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold ${getSignalColor(asset.signalStrength)}`}
                        >
                          {asset.signalStrength}/5
                        </span>
                      </TableCell>
                      <TableCell className="py-2">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold ${getStatusColor(asset.status)}`}
                        >
                          {asset.status}
                        </span>
                      </TableCell>
                      <TableCell className="py-2">{new Date(asset.lastPing).toLocaleString()}</TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleViewAsset(asset)} className="h-7 w-7">
                            <EyeIcon className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditAsset(asset)} className="h-7 w-7">
                            <EditIcon className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteAsset(asset.id)} className="h-7 w-7">
                            <TrashIcon className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleShareAsset(asset)} className="h-7 w-7">
                            <ShareIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentItems.map((asset) => (
                <Card key={asset.id} className="overflow-hidden text-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-sm">{asset.model}</CardTitle>
                        <CardDescription className="text-xs">{asset.imei}</CardDescription>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(asset.status)}`}>{asset.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center">
                        <MapPinIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>{asset.vehicle || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center">
                        <CpuIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>Firmware: {asset.firmware}</span>
                      </div>
                      <div className="flex items-center">
                        <SignalIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>Signal: {asset.signalStrength}/5</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>Last ping: {new Date(asset.lastPing).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t text-xs">
                    <Button variant="outline" size="sm" onClick={() => handleViewAsset(asset)} className="h-7 text-xs">
                      View
                    </Button>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditAsset(asset)} className="h-7 w-7">
                        <EditIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteAsset(asset.id)} className="h-7 w-7">
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleShareAsset(asset)} className="h-7 w-7">
                        <ShareIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredAssets.length > 0 && (
            <div className="flex items-center justify-between mt-4 text-xs">
              <div className="text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAssets.length)} of {filteredAssets.length} assets
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

        {isSidePanelOpen && selectedAsset && (
          <div className="w-1/3 border-l">
            <div className="sticky top-0 h-screen overflow-y-auto p-6 text-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {isEditing ? 'Edit Asset' : 'Asset Details'}
                </h2>
                <Button variant="ghost" size="icon" onClick={handleCloseSidePanel} className="h-7 w-7">
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>

              {isEditing ? (
                <AssetEditForm 
                  asset={selectedAsset} 
                  onSave={handleSaveAsset} 
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <AssetDetailView asset={selectedAsset} onEdit={() => setIsEditing(true)} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AssetDetailView({ asset, onEdit }: { asset: Asset; onEdit: () => void }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">{asset.model}</h3>
          <p className="text-muted-foreground text-xs">{asset.imei}</p>
        </div>
        <Badge className={`text-xs ${getStatusColor(asset.status)}`}>{asset.status}</Badge>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-2 text-xs h-8">
          <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
          <TabsTrigger value="technical" className="text-xs">Technical</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-3 pt-3">
          <div className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">IMEI</Label>
              <p className="font-medium text-sm">{asset.imei}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">SIM Number</Label>
              <p className="font-medium text-sm">{asset.simNumber}</p>
            </div>
            {asset.vehicle && (
              <div>
                <Label className="text-muted-foreground text-xs">Assigned Vehicle</Label>
                <p className="font-medium text-sm">{asset.vehicle}</p>
              </div>
            )}
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground text-xs">Battery Level</Label>
                <p className="font-medium text-sm">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${getBatteryColor(asset.batteryLevel)}`}>
                    {asset.batteryLevel}%
                  </span>
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Signal Strength</Label>
                <p className="font-medium text-sm">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${getSignalColor(asset.signalStrength)}`}>
                    {asset.signalStrength}/5
                  </span>
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <Label className="text-muted-foreground text-xs">Last Ping</Label>
              <p className="font-medium text-sm">{new Date(asset.lastPing).toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Installed Date</Label>
              <p className="font-medium text-sm">{new Date(asset.installedDate).toLocaleDateString()}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="pt-3">
          <div className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">Firmware Version</Label>
              <p className="font-medium text-sm">{asset.firmware}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Model</Label>
              <p className="font-medium text-sm">{asset.model}</p>
            </div>
            <div className="p-3 border rounded-lg text-xs">
              <h4 className="font-medium mb-1">Device Health</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Battery Health</span>
                  <span className={asset.batteryLevel > 70 ? 'text-green-600' : asset.batteryLevel > 30 ? 'text-yellow-600' : 'text-red-600'}>
                    {asset.batteryLevel > 70 ? 'Good' : asset.batteryLevel > 30 ? 'Fair' : 'Poor'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Connection Stability</span>
                  <span className={asset.signalStrength > 3 ? 'text-green-600' : asset.signalStrength > 1 ? 'text-yellow-600' : 'text-red-600'}>
                    {asset.signalStrength > 3 ? 'Strong' : asset.signalStrength > 1 ? 'Moderate' : 'Weak'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 pt-4 text-xs">
        <Button onClick={onEdit} className="flex-1 h-8 text-xs">
          <EditIcon className="h-3 w-3 mr-1" />
          Edit Asset
        </Button>
        <Button variant="outline" className="flex-1 h-8 text-xs">
          <ShareIcon className="h-3 w-3 mr-1" />
          Share
        </Button>
      </div>
    </div>
  )
}

function AssetEditForm({ asset, onSave, onCancel }: { 
  asset: Asset; 
  onSave: (asset: Asset) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(asset)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof Asset, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div className="space-y-1">
        <Label htmlFor="imei" className="text-xs">IMEI</Label>
        <Input
          id="imei"
          value={formData.imei}
          onChange={(e) => handleChange('imei', e.target.value)}
          required
          className="text-xs h-8"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="model" className="text-xs">Model</Label>
        <Input
          id="model"
          value={formData.model}
          onChange={(e) => handleChange('model', e.target.value)}
          required
          className="text-xs h-8"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="simNumber" className="text-xs">SIM Number</Label>
        <Input
          id="simNumber"
          value={formData.simNumber}
          onChange={(e) => handleChange('simNumber', e.target.value)}
          required
          className="text-xs h-8"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="firmware" className="text-xs">Firmware Version</Label>
        <Input
          id="firmware"
          value={formData.firmware}
          onChange={(e) => handleChange('firmware', e.target.value)}
          required
          className="text-xs h-8"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="vehicle" className="text-xs">Assigned Vehicle</Label>
        <Input
          id="vehicle"
          value={formData.vehicle || ''}
          onChange={(e) => handleChange('vehicle', e.target.value)}
          className="text-xs h-8"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="batteryLevel" className="text-xs">Battery Level (%)</Label>
          <Input
            id="batteryLevel"
            type="number"
            min="0"
            max="100"
            value={formData.batteryLevel}
            onChange={(e) => handleChange('batteryLevel', parseInt(e.target.value))}
            required
            className="text-xs h-8"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="signalStrength" className="text-xs">Signal Strength (1-5)</Label>
          <Input
            id="signalStrength"
            type="number"
            min="1"
            max="5"
            value={formData.signalStrength}
            onChange={(e) => handleChange('signalStrength', parseInt(e.target.value))}
            required
            className="text-xs h-8"
          />
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
          <option value="maintenance">Maintenance</option>
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
    case 'maintenance': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getBatteryColor(level: number) {
  if (level > 70) return 'bg-green-100 text-green-800'
  if (level > 30) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

function getSignalColor(strength: number) {
  if (strength > 3) return 'bg-green-100 text-green-800'
  if (strength > 1) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}