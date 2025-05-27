'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

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

export default function PoliciesPage() {
	const { user } = useAuth()
	return (
		<div className="container px-4 py-12 md:px-6 md:py-24">
			<div className="flex flex-col items-center space-y-4 text-center mb-12">
				<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
					Your Suite of Cybersecurity Policies
				</h1>
				<p className="text-xl text-muted-foreground max-w-[800px]">
					Comprehensive policies developed by CISOs to meet industry standards and
					regulatory requirements.
				</p>
			</div>

			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{policies.map((policy) => (
					<Card key={policy.id} className="flex flex-col">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5 text-blue-600" />
								{policy.name}
							</CardTitle>
							<CardDescription>
								NIST 2.0 and CIS 8.1 aligned
							</CardDescription>
						</CardHeader>
						<CardContent className="flex-1">
							<p className="text-sm text-muted-foreground">
								Customizable policy with flexible language to match your security
								program maturity.
							</p>
						</CardContent>
						<CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
							<Link href="/checkout" className="w-full sm:w-1/2">
								<Button
									className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition"
									variant="default"
									size="lg"
								>
									<span className="flex items-center gap-2">
										<FileText className="h-4 w-4" />
										Preview
									</span>
								</Button>
							</Link>
							{user && user.email && (
								<Link href="/checkout" className="w-full sm:w-1/2">
									<Button
										className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow hover:from-green-600 hover:to-green-800 transition"
										variant="default"
										size="lg"
									>
										<span className="flex items-center gap-2">
											<svg
												className="h-4 w-4"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M12 4v16m8-8H4"
												/>
											</svg>
											Customize
										</span>
									</Button>
								</Link>
							)}
						</CardFooter>
					</Card>
				))}
			</div>

			<div className="mt-12 flex justify-center">
				<Link href="/checkout">
					<Button size="lg">Get Started!</Button>
				</Link>
			</div>
		</div>
	)
}
