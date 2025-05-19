"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, Download, FileText, MoreHorizontal, Search, Trash } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample template data
const templates = [
  {
    id: 1,
    name: "Privacy Policy",
    type: "GDPR Compliant",
    category: "Privacy",
    status: "Published",
    lastUpdated: "May 16, 2024",
    createdAt: "Jan 10, 2024",
    usageCount: 1245,
  },
  {
    id: 2,
    name: "Terms of Service",
    type: "Standard",
    category: "Terms",
    status: "Published",
    lastUpdated: "May 15, 2024",
    createdAt: "Feb 22, 2024",
    usageCount: 987,
  },
  {
    id: 3,
    name: "Cookie Policy",
    type: "CCPA Compliant",
    category: "Privacy",
    status: "Draft",
    lastUpdated: "May 14, 2024",
    createdAt: "Mar 15, 2024",
    usageCount: 756,
  },
  {
    id: 4,
    name: "EULA",
    type: "Standard",
    category: "Terms",
    status: "Published",
    lastUpdated: "May 13, 2024",
    createdAt: "Dec 5, 2023",
    usageCount: 432,
  },
  {
    id: 5,
    name: "Return Policy",
    type: "E-commerce",
    category: "Commerce",
    status: "Review",
    lastUpdated: "May 12, 2024",
    createdAt: "May 1, 2024",
    usageCount: 321,
  },
  {
    id: 6,
    name: "Shipping Policy",
    type: "E-commerce",
    category: "Commerce",
    status: "Published",
    lastUpdated: "May 10, 2024",
    createdAt: "Nov 18, 2023",
    usageCount: 289,
  },
  {
    id: 7,
    name: "Disclaimer",
    type: "Standard",
    category: "Legal",
    status: "Published",
    lastUpdated: "May 8, 2024",
    createdAt: "Oct 7, 2023",
    usageCount: 543,
  },
  {
    id: 8,
    name: "Refund Policy",
    type: "E-commerce",
    category: "Commerce",
    status: "Draft",
    lastUpdated: "May 6, 2024",
    createdAt: "Apr 14, 2024",
    usageCount: 176,
  },
  {
    id: 9,
    name: "Privacy Policy (CCPA)",
    type: "CCPA Compliant",
    category: "Privacy",
    status: "Published",
    lastUpdated: "May 4, 2024",
    createdAt: "Sep 30, 2023",
    usageCount: 876,
  },
  {
    id: 10,
    name: "Terms of Use",
    type: "Standard",
    category: "Terms",
    status: "Review",
    lastUpdated: "May 2, 2024",
    createdAt: "May 5, 2024",
    usageCount: 432,
  },
]

export default function TemplateManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openAddTemplate, setOpenAddTemplate] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof templates)[0] | null>(null)
  const [openEditTemplate, setOpenEditTemplate] = useState(false)
  const [openDeleteTemplate, setOpenDeleteTemplate] = useState(false)

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Management</h1>
          <p className="text-muted-foreground">Manage policy templates and content</p>
        </div>
        <Button onClick={() => setOpenAddTemplate(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Add Template
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Templates</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search templates..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                  <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.type}</TableCell>
                  <TableCell>{template.category}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        template.status === "Published"
                          ? "bg-green-100 text-green-800"
                          : template.status === "Draft"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {template.status}
                    </span>
                  </TableCell>
                  <TableCell>{template.usageCount.toLocaleString()}</TableCell>
                  <TableCell>{template.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedTemplate(template)
                            setOpenEditTemplate(true)
                          }}
                        >
                          Edit template
                        </DropdownMenuItem>
                        <DropdownMenuItem>View usage stats</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedTemplate(template)
                            setOpenDeleteTemplate(true)
                          }}
                        >
                          Delete template
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Template Dialog */}
      <Dialog open={openAddTemplate} onOpenChange={setOpenAddTemplate}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add New Template</DialogTitle>
            <DialogDescription>Create a new policy template for users to generate from.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Template Content</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Template Name
                </Label>
                <Input id="name" className="col-span-3" placeholder="e.g. Privacy Policy" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="gdpr">GDPR Compliant</SelectItem>
                    <SelectItem value="ccpa">CCPA Compliant</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="privacy">Privacy</SelectItem>
                    <SelectItem value="terms">Terms</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  placeholder="Brief description of this template"
                  rows={3}
                />
              </div>
            </TabsContent>
            <TabsContent value="content" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="template-content">Template Content</Label>
                <Textarea
                  id="template-content"
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Enter template content with variables like {{company_name}}, {{website_url}}, etc."
                />
                <p className="text-sm text-muted-foreground">
                  Use variables in double curly braces that will be replaced when users generate policies.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="options" className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="variables" className="text-right">
                  Available Variables
                </Label>
                <Textarea
                  id="variables"
                  className="col-span-3"
                  placeholder="company_name, website_url, contact_email"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="applicable-laws" className="text-right">
                  Applicable Laws
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select applicable laws" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gdpr">GDPR</SelectItem>
                    <SelectItem value="ccpa">CCPA</SelectItem>
                    <SelectItem value="cpra">CPRA</SelectItem>
                    <SelectItem value="multiple">Multiple Laws</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddTemplate(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={openEditTemplate} onOpenChange={setOpenEditTemplate}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Update template information and content.</DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Template Content</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Template Name
                  </Label>
                  <Input id="edit-name" defaultValue={selectedTemplate.name} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-type" className="text-right">
                    Type
                  </Label>
                  <Select defaultValue={selectedTemplate.type.toLowerCase().replace(" ", "-")}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="gdpr-compliant">GDPR Compliant</SelectItem>
                      <SelectItem value="ccpa-compliant">CCPA Compliant</SelectItem>
                      <SelectItem value="e-commerce">E-commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    Category
                  </Label>
                  <Select defaultValue={selectedTemplate.category.toLowerCase()}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="privacy">Privacy</SelectItem>
                      <SelectItem value="terms">Terms</SelectItem>
                      <SelectItem value="commerce">Commerce</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select defaultValue={selectedTemplate.status.toLowerCase()}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="content" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-template-content">Template Content</Label>
                  <Textarea
                    id="edit-template-content"
                    className="min-h-[300px] font-mono text-sm"
                    defaultValue={`This is a sample ${selectedTemplate.name} template content with variables like {{company_name}}, {{website_url}}, etc.`}
                  />
                </div>
              </TabsContent>
              <TabsContent value="options" className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-variables" className="text-right">
                    Available Variables
                  </Label>
                  <Textarea
                    id="edit-variables"
                    className="col-span-3"
                    defaultValue="company_name, website_url, contact_email"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-applicable-laws" className="text-right">
                    Applicable Laws
                  </Label>
                  <Select
                    defaultValue={
                      selectedTemplate.type.includes("GDPR")
                        ? "gdpr"
                        : selectedTemplate.type.includes("CCPA")
                          ? "ccpa"
                          : "multiple"
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gdpr">GDPR</SelectItem>
                      <SelectItem value="ccpa">CCPA</SelectItem>
                      <SelectItem value="cpra">CPRA</SelectItem>
                      <SelectItem value="multiple">Multiple Laws</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditTemplate(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Template Dialog */}
      <Dialog open={openDeleteTemplate} onOpenChange={setOpenDeleteTemplate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="py-4">
              <p className="mb-2">You are about to delete:</p>
              <div className="rounded-md bg-muted p-4">
                <p className="font-medium">{selectedTemplate.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedTemplate.type} - {selectedTemplate.category}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Used {selectedTemplate.usageCount} times</p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-red-500">
                  Warning: Deleting this template will affect users who have generated policies based on it.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteTemplate(false)}>
              Cancel
            </Button>
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
