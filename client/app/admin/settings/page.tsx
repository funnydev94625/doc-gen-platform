import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="site-name" className="text-right pt-2">
                    Site Name
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input id="site-name" defaultValue="Termly" />
                    <p className="text-sm text-muted-foreground">The name of your application</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="site-url" className="text-right pt-2">
                    Site URL
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input id="site-url" defaultValue="https://termly.io" />
                    <p className="text-sm text-muted-foreground">The URL of your application</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="admin-email" className="text-right pt-2">
                    Admin Email
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input id="admin-email" type="email" defaultValue="admin@termly.io" />
                    <p className="text-sm text-muted-foreground">The primary admin contact email</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="timezone" className="text-right pt-2">
                    Timezone
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time (ET)</SelectItem>
                        <SelectItem value="cst">Central Time (CT)</SelectItem>
                        <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">The default timezone for your application</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="date-format" className="text-right pt-2">
                    Date Format
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Select defaultValue="mdy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">The default date format for your application</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="primary-color" className="text-right pt-2">
                    Primary Color
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <Input id="primary-color" defaultValue="#4169e1" />
                      <div className="h-10 w-10 rounded-md bg-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">The primary brand color</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="logo-upload" className="text-right pt-2">
                    Logo
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input id="logo-upload" type="file" />
                    <p className="text-sm text-muted-foreground">
                      Upload your company logo (recommended size: 200x50px)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="favicon-upload" className="text-right pt-2">
                    Favicon
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input id="favicon-upload" type="file" />
                    <p className="text-sm text-muted-foreground">Upload your favicon (recommended size: 32x32px)</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Dark Mode</Label>
                  <div className="col-span-3 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Switch id="dark-mode" />
                      <Label htmlFor="dark-mode">Enable dark mode option</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Allow users to switch between light and dark mode</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="custom-css" className="text-right pt-2">
                    Custom CSS
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Textarea
                      id="custom-css"
                      className="font-mono text-sm"
                      placeholder="Enter custom CSS here"
                      rows={5}
                    />
                    <p className="text-sm text-muted-foreground">Add custom CSS to override default styles</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email settings and templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="smtp-host" className="text-right pt-2">
                    SMTP Host
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input id="smtp-host" defaultValue="smtp.example.com" />
                    <p className="text-sm text-muted-foreground">Your SMTP server hostname</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="smtp-port" className="text-right pt-2">
                    SMTP Port
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input id="smtp-port" defaultValue="587" />
                    <p className="text-sm text-muted-foreground">Your SMTP server port</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="smtp-username" className="text-right pt-2">
                    SMTP Username
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input id="smtp-username" defaultValue="noreply@termly.io" />
                    <p className="text-sm text-muted-foreground">Your SMTP server username</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="smtp-password" className="text-right pt-2">
                    SMTP Password
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input id="smtp-password" type="password" defaultValue="••••••••••••" />
                    <p className="text-sm text-muted-foreground">Your SMTP server password</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="from-email" className="text-right pt-2">
                    From Email
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input id="from-email" defaultValue="noreply@termly.io" />
                    <p className="text-sm text-muted-foreground">
                      The email address that will appear in the From field
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="from-name" className="text-right pt-2">
                    From Name
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input id="from-name" defaultValue="Termly" />
                    <p className="text-sm text-muted-foreground">The name that will appear in the From field</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Maintenance Mode</Label>
                  <div className="col-span-3 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Switch id="maintenance-mode" />
                      <Label htmlFor="maintenance-mode">Enable maintenance mode</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Put the site in maintenance mode to prevent user access
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="maintenance-message" className="text-right pt-2">
                    Maintenance Message
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Textarea
                      id="maintenance-message"
                      defaultValue="We're currently performing maintenance. Please check back soon."
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">Message to display during maintenance mode</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Debug Mode</Label>
                  <div className="col-span-3 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Switch id="debug-mode" />
                      <Label htmlFor="debug-mode">Enable debug mode</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Enable detailed error messages and logging</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">API Access</Label>
                  <div className="col-span-3 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Switch id="api-access" defaultChecked />
                      <Label htmlFor="api-access">Enable API access</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Allow external applications to access your API</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="api-key" className="text-right pt-2">
                    API Key
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <Input id="api-key" defaultValue="sk_live_51HG8s7JK9iPLCCQZfBNZsT7GjJ" readOnly />
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Your API key for external integrations</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
