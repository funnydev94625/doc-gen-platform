import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

// This is a placeholder for the actual policy list
const policies = [
  { id: "asset-management", name: "Asset Management Policy" },
  { id: "access-control", name: "Access Control Policy" },
  { id: "data-protection", name: "Data Protection Policy" },
  { id: "incident-response", name: "Incident Response Policy" },
  { id: "business-continuity", name: "Business Continuity Policy" },
  { id: "acceptable-use", name: "Acceptable Use Policy" },
  { id: "password", name: "Password Policy" },
  { id: "remote-work", name: "Remote Work Policy" },
  { id: "vendor-management", name: "Vendor Management Policy" },
  { id: "physical-security", name: "Physical Security Policy" },
  { id: "network-security", name: "Network Security Policy" },
  { id: "cloud-security", name: "Cloud Security Policy" },
]

export default function CustomizePage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Select a Policy to Customize</h1>
        <p className="text-xl text-muted-foreground max-w-[800px]">
          Choose a policy from your suite to begin the customization process.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {policies.map((policy) => (
          <Card key={policy.id} className="flex flex-col hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                {policy.name}
              </CardTitle>
              <CardDescription>Click to customize</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Tailor this policy to match your organization's security maturity level.
              </p>
            </CardContent>
            <Link href={`/customize/${policy.id}`} className="p-6 pt-0">
              <Button className="w-full">Customize</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
