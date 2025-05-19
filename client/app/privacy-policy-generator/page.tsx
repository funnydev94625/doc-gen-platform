"use client"

import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

export default function PrivacyPolicyGenerator() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <Link href="/" className="flex items-center text-sm text-blue-500 hover:text-blue-700">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="mt-4 text-3xl font-bold">Privacy Policy Generator</h1>
            <p className="mt-2 text-gray-500">Create a comprehensive privacy policy tailored to your business needs</p>
          </div>

          <Tabs defaultValue="basic-info" className="w-full">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4">
                <div className="sticky top-8">
                  <TabsList className="flex flex-col w-full h-auto bg-transparent space-y-1">
                    <TabsTrigger
                      value="basic-info"
                      className="w-full justify-start px-4 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 mr-3">
                          <Check className="h-4 w-4" />
                        </div>
                        <span>Basic Information</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="data-collection"
                      className="w-full justify-start px-4 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 mr-3">
                          2
                        </div>
                        <span>Data Collection</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="data-usage"
                      className="w-full justify-start px-4 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 mr-3">
                          3
                        </div>
                        <span>Data Usage</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="user-rights"
                      className="w-full justify-start px-4 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 mr-3">
                          4
                        </div>
                        <span>User Rights</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="compliance"
                      className="w-full justify-start px-4 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 mr-3">
                          5
                        </div>
                        <span>Compliance</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="review"
                      className="w-full justify-start px-4 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 mr-3">
                          6
                        </div>
                        <span>Review & Generate</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="md:w-3/4">
                <TabsContent value="basic-info" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>
                        Let&apos;s start with some basic information about your business
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="company-name">Company Name</Label>
                          <Input id="company-name" placeholder="Enter your company name" />
                        </div>

                        <div>
                          <Label htmlFor="website-url">Website URL</Label>
                          <Input id="website-url" placeholder="https://example.com" />
                        </div>

                        <div>
                          <Label htmlFor="business-type">Business Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ecommerce">E-commerce</SelectItem>
                              <SelectItem value="blog">Blog</SelectItem>
                              <SelectItem value="saas">SaaS</SelectItem>
                              <SelectItem value="marketplace">Marketplace</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="contact-email">Contact Email</Label>
                          <Input id="contact-email" type="email" placeholder="contact@example.com" />
                          <p className="mt-1 text-sm text-gray-500">
                            This email will be displayed in your privacy policy for users to contact you
                          </p>
                        </div>

                        <div>
                          <Label className="mb-2 block">Do you collect personal information?</Label>
                          <div className="flex items-center space-x-2">
                            <RadioGroup defaultValue="yes" className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="collect-yes" />
                                <Label htmlFor="collect-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="collect-no" />
                                <Label htmlFor="collect-no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2 block">Applicable Privacy Laws</Label>
                          <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <Checkbox id="gdpr" />
                              <div>
                                <Label htmlFor="gdpr" className="font-medium">
                                  GDPR (General Data Protection Regulation)
                                </Label>
                                <p className="text-sm text-gray-500">European Union privacy law</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Checkbox id="ccpa" />
                              <div>
                                <Label htmlFor="ccpa" className="font-medium">
                                  CCPA (California Consumer Privacy Act)
                                </Label>
                                <p className="text-sm text-gray-500">California privacy law</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Checkbox id="cpra" />
                              <div>
                                <Label htmlFor="cpra" className="font-medium">
                                  CPRA (California Privacy Rights Act)
                                </Label>
                                <p className="text-sm text-gray-500">Updated California privacy law</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" disabled>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      <Button>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="data-collection" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Collection</CardTitle>
                      <CardDescription>Specify what data you collect from users</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <Label className="mb-2 block">What personal information do you collect?</Label>
                          <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <Checkbox id="collect-name" />
                              <Label htmlFor="collect-name">Name</Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Checkbox id="collect-email" />
                              <Label htmlFor="collect-email">Email Address</Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Checkbox id="collect-phone" />
                              <Label htmlFor="collect-phone">Phone Number</Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Checkbox id="collect-address" />
                              <Label htmlFor="collect-address">Mailing Address</Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Checkbox id="collect-payment" />
                              <Label htmlFor="collect-payment">Payment Information</Label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2 block">What non-personal information do you collect?</Label>
                          <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <Checkbox id="collect-ip" />
                              <Label htmlFor="collect-ip">IP Address</Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Checkbox id="collect-browser" />
                              <Label htmlFor="collect-browser">Browser Type</Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Checkbox id="collect-device" />
                              <Label htmlFor="collect-device">Device Information</Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Checkbox id="collect-cookies" />
                              <Label htmlFor="collect-cookies">Cookies and Similar Technologies</Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Checkbox id="collect-usage" />
                              <Label htmlFor="collect-usage">Usage Data</Label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="collection-methods">How do you collect this information?</Label>
                          <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <Checkbox id="method-direct" />
                              <Label htmlFor="method-direct">Directly from users (forms, registrations)</Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Checkbox id="method-automated" />
                              <Label htmlFor="method-automated">Automatically (cookies, analytics)</Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Checkbox id="method-third-party" />
                              <Label htmlFor="method-third-party">From third parties</Label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="additional-collection">Additional collection methods (optional)</Label>
                          <Textarea
                            id="additional-collection"
                            placeholder="Describe any additional ways you collect user data"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      <Button>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="data-usage" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Usage</CardTitle>
                      <CardDescription>Explain how you use the collected data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-6">
                        This section will be completed in the next step of the wizard.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      <Button>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="user-rights" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Rights</CardTitle>
                      <CardDescription>Define what rights users have regarding their data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-6">
                        This section will be completed in the next step of the wizard.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      <Button>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="compliance" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Compliance</CardTitle>
                      <CardDescription>Ensure your policy complies with relevant regulations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-6">
                        This section will be completed in the next step of the wizard.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      <Button>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="review" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Review & Generate</CardTitle>
                      <CardDescription>Review your policy before generating the final document</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-6">
                        This section will be completed in the next step of the wizard.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      <Button>
                        Generate Policy
                        <Check className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center md:gap-6">
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline">
              Terms Of Use
            </Link>
            <Link href="#" className="hover:underline">
              Disclaimer
            </Link>
            <Link href="#" className="hover:underline">
              Cookie Policy
            </Link>
            <Link href="#" className="hover:underline">
              Consent Preferences
            </Link>
          </div>
          <p className="text-sm text-gray-500">© 2024 Termly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
