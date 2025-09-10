import { useState, useMemo, useEffect } from 'react'
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
  GaugeIcon,
  CalendarIcon,
  DownloadIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ArrowUpDownIcon
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { fetchVehicles } from '@/data/mockVehicles';
import { Vehicle } from '@/types/vehicle'


export function TrackingPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortField, setSortField] = useState<string>('registrationNumber')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load initial vehicle and driver data
    useEffect(() => {
      const loadData = async () => {
        try {
          const [vehicleData] = await Promise.all([
            fetchVehicles(),
          ]);
          setVehicles(vehicleData);
          setLoading(false);
          toast({
            title: "Data Loaded",
            description: `${vehicleData.length} vehicles loaded`,
          });
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
  
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(
      (vehicle) =>
        vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.make.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vehicle.account && vehicle.account.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [vehicles, searchTerm])

  // Sorting logic
  const sortedVehicles = useMemo(() => {
    return [...filteredVehicles].sort((a, b) => {
      let aValue: any = a[sortField as keyof Vehicle]
      let bValue: any = b[sortField as keyof Vehicle]

      // Handle nested properties if needed
      if (sortField === 'make_model') {
        aValue = `${a.model.make.name} ${a.model.name}`
        bValue = `${b.model.make.name} ${b.model.name}`
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredVehicles, sortField, sortDirection])

  // Pagination logic
  const totalPages = Math.ceil(sortedVehicles.length / itemsPerPage)
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedVehicles.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedVehicles, currentPage, itemsPerPage])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsSidePanelOpen(true)
    setIsEditing(false)
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsSidePanelOpen(true)
    setIsEditing(true)
  }

  const handleDeleteVehicle = (id: number) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id))
      if (selectedVehicle?.id === id) {
        setSelectedVehicle(null)
        setIsSidePanelOpen(false)
      }
      // Reset to first page if current page would be empty
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  }

  const handleSaveVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(vehicles.map(vehicle =>
      vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
    ))
    setSelectedVehicle(updatedVehicle)
    setIsEditing(false)
  }

  const handleCloseSidePanel = () => {
    setIsSidePanelOpen(false)
    setSelectedVehicle(null)
    setIsEditing(false)
  }

  const handleShareVehicle = (vehicle: Vehicle) => {
    alert(`Sharing vehicle ${vehicle.registrationNumber} with others...`)
  }

  const exportToCSV = () => {
    const headers = ['Registration', 'Make', 'Model', 'Year', 'Customer', 'Phone', 'Status', 'Fuel Type', 'Color', 'Mileage', 'Last Ping']
    const csvData = sortedVehicles.map(vehicle => [
      vehicle.registrationNumber,
      vehicle.model.make.name,
      vehicle.model.name,
      vehicle.year,
      vehicle.account.name || 'N/A',
      vehicle.account.phone || 'N/A',
      vehicle.status,
      vehicle.fuelType,
      vehicle.color,
      `${vehicle.mileage.toLocaleString()} km`,
      new Date(vehicle.lastUpdate).toLocaleString()
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `vehicles_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800'
      case 'offline': return 'bg-yellow-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vehicle Management</h1>
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
            <DownloadIcon className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-8 text-xs">
                <PlusIcon className="mr-1 h-4 w-4" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
              </DialogHeader>
              {/* Add form content here */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <Input
          placeholder="Search vehicles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm text-sm h-8"
        />
        <div className="text-sm text-muted-foreground">
          {sortedVehicles.length} vehicle{sortedVehicles.length !== 1 ? 's' : ''} found
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
                      <TableHead
                        className="py-2 text-xs cursor-pointer hover:bg-accent"
                        onClick={() => handleSort('registrationNumber')}
                      >
                        <div className="flex items-center">
                          Registration
                          <ArrowUpDownIcon className={`ml-1 h-3 w-3 ${sortField === 'registrationNumber' ? 'opacity-100' : 'opacity-40'}`} />
                        </div>
                      </TableHead>
                      <TableHead
                        className="py-2 text-xs cursor-pointer hover:bg-accent"
                        onClick={() => handleSort('make_model')}
                      >
                        <div className="flex items-center">
                          Make & Model
                          <ArrowUpDownIcon className={`ml-1 h-3 w-3 ${sortField === 'make_model' ? 'opacity-100' : 'opacity-40'}`} />
                        </div>
                      </TableHead>
                      <TableHead
                        className="py-2 text-xs cursor-pointer hover:bg-accent"
                        onClick={() => handleSort('year')}
                      >
                        <div className="flex items-center">
                          Year
                          <ArrowUpDownIcon className={`ml-1 h-3 w-3 ${sortField === 'year' ? 'opacity-100' : 'opacity-40'}`} />
                        </div>
                      </TableHead>
                      <TableHead
                        className="py-2 text-xs cursor-pointer hover:bg-accent"
                        onClick={() => handleSort('customer')}
                      >
                        <div className="flex items-center">
                          Customer
                          <ArrowUpDownIcon className={`ml-1 h-3 w-3 ${sortField === 'customer' ? 'opacity-100' : 'opacity-40'}`} />
                        </div>
                      </TableHead>
                      <TableHead
                        className="py-2 text-xs cursor-pointer hover:bg-accent"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center">
                          Status
                          <ArrowUpDownIcon className={`ml-1 h-3 w-3 ${sortField === 'status' ? 'opacity-100' : 'opacity-40'}`} />
                        </div>
                      </TableHead>
                      <TableHead
                        className="py-2 text-xs cursor-pointer hover:bg-accent"
                        onClick={() => handleSort('lastPing')}
                      >
                        <div className="flex items-center">
                          Last Ping
                          <ArrowUpDownIcon className={`ml-1 h-3 w-3 ${sortField === 'lastPing' ? 'opacity-100' : 'opacity-40'}`} />
                        </div>
                      </TableHead>
                      <TableHead className="py-2 text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((vehicle) => (
                      <TableRow key={vehicle.id} className="text-xs">
                        <TableCell className="font-medium py-2">{vehicle.registrationNumber}</TableCell>
                        <TableCell className="py-2">{vehicle.model.make.name} {vehicle.model.name}</TableCell>
                        <TableCell className="py-2">{vehicle.year}</TableCell>
                        <TableCell className="py-2">{vehicle.account.name || 'N/A'}</TableCell>
                        <TableCell className="py-2">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold ${getStatusColor(vehicle.status)}`}
                          >
                            {vehicle.status}
                          </span>
                        </TableCell>
                        <TableCell className="py-2">{new Date(vehicle.lastUpdate).toLocaleString()}</TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleViewVehicle(vehicle)} className="h-7 w-7">
                              <EyeIcon className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditVehicle(vehicle)} className="h-7 w-7">
                              <EditIcon className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteVehicle(vehicle.id)} className="h-7 w-7">
                              <TrashIcon className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleShareVehicle(vehicle)} className="h-7 w-7">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentItems.map((vehicle) => (
                <Card key={vehicle.id} className="overflow-hidden text-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-sm">{vehicle.registrationNumber}</CardTitle>
                        <CardDescription className="text-xs">{vehicle.model.make.name} {vehicle.model.name} ({vehicle.year})</CardDescription>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(vehicle.status)}`}>{vehicle.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center">
                        <MapPinIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>Last updated: {new Date(vehicle.lastUpdate).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center">
                        <GaugeIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>{0} km</span>
                      </div>
                      {vehicle.account.name && (
                        <div className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{vehicle.account.name}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t text-xs">
                    <Button variant="outline" size="sm" onClick={() => handleViewVehicle(vehicle)} className="h-7 text-xs">
                      View
                    </Button>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditVehicle(vehicle)} className="h-7 w-7">
                        <EditIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteVehicle(vehicle.id)} className="h-7 w-7">
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleShareVehicle(vehicle)} className="h-7 w-7">
                        <ShareIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {sortedVehicles.length > 0 && (
            <div className="flex items-center justify-between mt-4 text-xs">
              <div className="text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedVehicles.length)} of {sortedVehicles.length} vehicles
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

        {isSidePanelOpen && selectedVehicle && (
          <div className="w-1/3 border-l">
            <div className="sticky top-0 h-screen overflow-y-auto p-6 text-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {isEditing ? 'Edit Vehicle' : 'Vehicle Details'}
                </h2>
                <Button variant="ghost" size="icon" onClick={handleCloseSidePanel} className="h-7 w-7">
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>

              {isEditing ? (
                <VehicleEditForm
                  vehicle={selectedVehicle}
                  onSave={handleSaveVehicle}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <VehicleDetailView vehicle={selectedVehicle} onEdit={() => setIsEditing(true)} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function VehicleDetailView({ vehicle, onEdit }: { vehicle: Vehicle; onEdit: () => void }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">{vehicle.registrationNumber}</h3>
          <p className="text-muted-foreground text-xs">{vehicle.model.make.name} {vehicle.model.name} ({vehicle.year})</p>
        </div>
        <Badge className={`text-xs ${getStatusColor(vehicle.status)}`}>{vehicle.status}</Badge>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-3 text-xs h-8">
          <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
          <TabsTrigger value="location" className="text-xs">Location</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-3 pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-muted-foreground text-xs">Color</Label>
              <p className="font-medium text-sm">{vehicle.color}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Fuel Type</Label>
              <p className="font-medium text-sm">{vehicle.fuelType}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Mileage</Label>
              <p className="font-medium text-sm">{vehicle.mileage.toLocaleString()} km</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Last Ping</Label>
              <p className="font-medium text-sm">{new Date(vehicle.lastUpdate).toLocaleString()}</p>
            </div>
          </div>

          {vehicle.account && (
            <>
              <Separator />
              <div>
                <Label className="text-muted-foreground text-xs">Customer</Label>
                <p className="font-medium text-sm">{vehicle.account.name}</p>
                {vehicle.account.phone && <p className="text-xs text-muted-foreground">{vehicle.account.phone}</p>}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="location" className="pt-3">
          <div className="h-48 bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground text-xs">Map view would be displayed here</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <Label className="text-muted-foreground text-xs">Latitude</Label>
              <p className="font-medium text-sm">{vehicle.coordinates[0]}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Longitude</Label>
              <p className="font-medium text-sm">{vehicle.coordinates[1]}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="pt-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Trip to Nairobi CBD</p>
                <p className="text-xs text-muted-foreground">Today, 08:30 - 09:15</p>
              </div>
              <Badge variant="outline" className="text-xs">45 km</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Maintenance Service</p>
                <p className="text-xs text-muted-foreground">Yesterday, 14:00</p>
              </div>
              <Badge variant="outline" className="text-xs">Completed</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Trip to Thika</p>
                <p className="text-xs text-muted-foreground">Sep 3, 10:00 - 11:30</p>
              </div>
              <Badge variant="outline" className="text-xs">65 km</Badge>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 pt-4 text-xs">
        <Button onClick={onEdit} className="flex-1 h-8 text-xs">
          <EditIcon className="h-3 w-3 mr-1" />
          Edit Vehicle
        </Button>
        <Button variant="outline" className="flex-1 h-8 text-xs">
          <ShareIcon className="h-3 w-3 mr-1" />
          Share
        </Button>
      </div>
    </div>
  )
}

function VehicleEditForm({ vehicle, onSave, onCancel }: {
  vehicle: Vehicle;
  onSave: (vehicle: Vehicle) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(vehicle)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof Vehicle, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div className="space-y-1">
        <Label htmlFor="registrationNumber" className="text-xs">Registration Number</Label>
        <Input
          id="registrationNumber"
          value={formData.registrationNumber}
          onChange={(e) => handleChange('registrationNumber', e.target.value)}
          required
          className="text-xs h-8"
        />
      </div>

      {/* <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="make" className="text-xs">Make</Label>
          <Input
            id="make"
            value={formData.model.make}
            onChange={(e) => handleChange('make', e.target.value)}
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
      </div> */}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="year" className="text-xs">Year</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => handleChange('year', parseInt(e.target.value))}
            required
            className="text-xs h-8"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="color" className="text-xs">Color</Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
            required
            className="text-xs h-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="mileage" className="text-xs">Mileage (km)</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage}
            onChange={(e) => handleChange('mileage', parseInt(e.target.value))}
            required
            className="text-xs h-8"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="fuelType" className="text-xs">Fuel Type</Label>
          <select
            id="fuelType"
            value={formData.fuelType}
            onChange={(e) => handleChange('fuelType', e.target.value)}
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
          </select>
        </div>
      </div>

      {/* <div className="space-y-1">
        <Label htmlFor="customer" className="text-xs">Client</Label>
        <Input
          id="customer"
          value={formData.account.name || ''}
          onChange={(e) => handleChange('customer', e.target.value)}
          className="text-xs h-8"
        />
      </div> */}

      {/* <div className="space-y-1">
        <Label htmlFor="phone" className="text-xs">Phone</Label>
        <Input
          id="phone"
          value={formData.account.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="text-xs h-8"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="status"
          checked={formData.status === 'active'}
          onCheckedChange={(checked) => handleChange('status', checked ? 'active' : 'inactive')}
        />
        <Label htmlFor="status" className="text-xs">Active</Label>
      </div> */}

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