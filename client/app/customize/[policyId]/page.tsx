import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, Printer, Download } from "lucide-react"

export default function PolicyCustomizationPage({ params }: { params: { policyId: string } }) {
  // This would be fetched from an API in a real application
  const policyName =
    params.policyId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") + " Policy"

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/customize">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Policies
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{policyName}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Guidance Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guidance</CardTitle>
              <CardDescription>Select the appropriate terms based on your security program maturity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Term to Select</h3>
                  <div className="space-y-4 text-sm">
                    <div className="space-y-1">
                      <p className="font-semibold">MUST, SHALL, WILL or MUST NOT, SHALL NOT, WILL NOT</p>
                      <p className="text-muted-foreground">
                        The control is in place and absolutely required to be met as written; and with no deviations
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">SHOULD or SHOULD NOT</p>
                      <p className="text-muted-foreground">
                        The control may be in place and is required to be met as written; although deviations are
                        permitted when exceptions are approved
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">MAY, OPTIONAL or MAY NOT</p>
                      <p className="text-muted-foreground">
                        The control is not fully in place and not required to be met as written; and deviations are
                        permitted without approved exceptions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">1. Asset Inventory Requirements</h3>
                <RadioGroup defaultValue="should">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="must" id="q1-must" />
                    <Label htmlFor="q1-must">MUST</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="should" id="q1-should" />
                    <Label htmlFor="q1-should">SHOULD</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="may" id="q1-may" />
                    <Label htmlFor="q1-may">MAY</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">2. Asset Classification</h3>
                <RadioGroup defaultValue="should">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="must" id="q2-must" />
                    <Label htmlFor="q2-must">MUST</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="should" id="q2-should" />
                    <Label htmlFor="q2-should">SHOULD</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="may" id="q2-may" />
                    <Label htmlFor="q2-may">MAY</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">3. Asset Ownership</h3>
                <RadioGroup defaultValue="must">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="must" id="q3-must" />
                    <Label htmlFor="q3-must">MUST</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="should" id="q3-should" />
                    <Label htmlFor="q3-should">SHOULD</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="may" id="q3-may" />
                    <Label htmlFor="q3-may">MAY</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policy Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Preview</CardTitle>
            <CardDescription>See how your policy will look with your customizations</CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>{policyName}</h2>
            <p>
              <strong>Version:</strong> 1.0
            </p>
            <p>
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <h3>1. Purpose</h3>
            <p>
              This policy establishes the requirements for managing assets within the organization to ensure proper
              protection of the organization's information.
            </p>

            <h3>2. Scope</h3>
            <p>
              This policy applies to all information assets owned, leased, or otherwise provided to the organization,
              including but not limited to hardware, software, data, and facilities.
            </p>

            <h3>3. Policy Statements</h3>
            <h4>3.1 Asset Inventory</h4>
            <p>
              The organization <strong>SHOULD</strong> maintain an inventory of all information assets. This inventory{" "}
              <strong>SHOULD</strong> include, at minimum, the asset type, location, owner, and classification.
            </p>

            <h4>3.2 Asset Classification</h4>
            <p>
              Information assets <strong>SHOULD</strong> be classified according to their sensitivity and criticality to
              the organization. Classification levels <strong>SHOULD</strong> include Confidential, Internal, and
              Public.
            </p>

            <h4>3.3 Asset Ownership</h4>
            <p>
              Each information asset <strong>MUST</strong> have a designated owner who is responsible for ensuring
              appropriate protection of the asset. Asset owners <strong>MUST</strong> review access rights to their
              assets periodically.
            </p>

            <h3>4. Key Things to Remember</h3>
            <ul>
              <li>All assets must be inventoried and classified appropriately</li>
              <li>Asset owners are responsible for ensuring proper protection of their assets</li>
              <li>Regular reviews of asset inventory and classification should be conducted</li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button>Save & Finalize</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
