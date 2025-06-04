'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import api from '@/lib/api'
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

type Template = {
	_id: string;
	title: string;
	description: string;
	type: number;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	docx: string;
}

export default function PoliciesPage() {
	const { user } = useAuth()
	const logined = user && user.email
	const [templates, setTemplates] = useState<Template[]>([])
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	const [isCreating, setIsCreating] = useState<Record<string, boolean>>({})

	useEffect(() => {
		const fetchTemplates = async () => {
			try {
				const response = await api.get('/api/templates')
				// Filter templates where type is 1
				const filteredTemplates = response.data.filter((template: Template) => template.type === 0) // replace 1
				setTemplates(filteredTemplates)
			} catch (error) {
				console.error('Error fetching templates:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchTemplates()
	}, [])

	const handleCreatePolicy = async (templateId: string) => {
		try {
			setIsCreating(prev => ({ ...prev, [templateId]: true }))
			const response = await api.post('/api/policies', { template_id: templateId })
			toast.success("Successfully created Policy")
			router.push(`/policies/${response.data._id}`)
		} catch (error) {
			console.error('Error creating policy:', error)
			toast.error("Failed to create policy")
		} finally {
			setIsCreating(prev => ({ ...prev, [templateId]: false }))
		}
	}

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

			<Toaster />

			{loading ? (
				<div className="flex justify-center items-center min-h-[200px]">
					<p className="text-lg text-muted-foreground">Loading templates...</p>
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{templates.map((template) => (
						<Card key={template._id} className="flex flex-col">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<FileText className="h-5 w-5 text-blue-600" />
									{template.title}
								</CardTitle>
								<CardDescription>
									NIST 2.0 and CIS 8.1 aligned
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-sm text-muted-foreground">
									{template.description}
								</p>
							</CardContent>
							<CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
								<Link href={`/policies/${template._id}`} className="w-full sm:w-1/2">
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
								{logined && (
									<div className="w-full sm:w-1/2">
										<Button
											className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow hover:from-green-600 hover:to-green-800 transition"
											variant="default"
											size="lg"
											onClick={() => handleCreatePolicy(template._id)}
											disabled={isCreating[template._id]}
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
												{isCreating[template._id] ? 'Creating...' : 'Customize'}
											</span>
										</Button>
									</div>
								)}
							</CardFooter>
						</Card>
					))}
				</div>
			)}

			<div className="mt-12 flex justify-center">
				<Link href={user && user.email ? "/checkout" : '/auth/signin'}>
					<Button size="lg">Get Started!</Button>
				</Link>
			</div>
		</div>
	)
}
