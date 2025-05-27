import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Shield, FileText, RefreshCw, Edit, Check, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Generate Custom Cybersecurity Policies
              </h1>
              <p className="text-xl text-muted-foreground md:text-2xl">Online and in Minutes</p>
            </div>
            <div className="space-y-4 max-w-[600px]">
              <p className="text-muted-foreground">
                Developed, Reviewed, and Approved by Chief Information Security Officers (CISO)
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/policies">
                  <Button size="lg">See Included Policies</Button>
                </Link>
                <Link href="/checkout">
                  <Button size="lg" variant="outline">
                    Buy Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-3 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-[800px]">
              Create customized cybersecurity policies in four simple steps
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-100 rounded-lg transform rotate-3"></div>
                <div className="relative bg-blue-600 rounded-lg w-40 h-24 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold">Choose Your Policy to Get Started</h3>
              <p className="text-muted-foreground">
                From our comprehensive suite of CISO-developed cybersecurity policies
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-100 rounded-lg transform rotate-3"></div>
                <div className="relative bg-blue-600 rounded-lg w-40 h-24 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold">Answer Simple Questions</h3>
              <p className="text-muted-foreground">
                Our policy creator will turn your responses into custom entries in the policy
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-100 rounded-lg transform rotate-3"></div>
                <div className="relative bg-blue-600 rounded-lg w-40 h-24 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold">Download & Implement</h3>
              <p className="text-muted-foreground">
                Save, print, ad share your policies with your organization. Come back and edit for a full year for free
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customization Preview Section - Modernized */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="flex flex-col space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Customizable Policies
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Represent your Security Program with <span className="text-blue-600">Confidence</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Create a full suite of CISO-developed and approved Cybersecurity policies,  designed to meet you where you are at with your Security Program.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-green-100 p-1.5 mt-1">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Customized Verbs</h3>
                        <p className="text-sm text-muted-foreground">Choose the most applicable to represent the state of your cybersecurity program</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-green-100 p-1.5 mt-1">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">NIST 2.0 & CIS 8.1 Aligned</h3>
                        <p className="text-sm text-muted-foreground">Policies are aligned with industry standards to help you meet compliance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-green-100 p-1.5 mt-1">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Clear Language</h3>
                        <p className="text-sm text-muted-foreground">Easy to understand policies, each with key things to remember for readers ... and no "all or nothing" terminology</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-green-100 p-1.5 mt-1">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Come Back and Update</h3>
                        <p className="text-sm text-muted-foreground">Three months access included for you to finalize</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-4">
                <Link href="/policies">
                  <Button size="lg" className="group">
                    See Included Policies
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-3xl"></div>

              {/* Main image with modern styling */}
              <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 z-0"></div>
                <Image
                  src="/placeholder.svg?height=600&width=1200"
                  alt="Policy customization interface"
                  width={1200}
                  height={600}
                  className="w-full relative z-10"
                />

                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                  <p className="text-sm font-medium">
                    Intuitive interface with questions on the left and real-time policy preview on the right
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-20 rotate-3">
                <span className="text-sm font-bold">CISO Approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">About Us</h2>
              <p className="text-muted-foreground">
                Rose CISO Group (DBA October Security) is a boutique Cybersecurity Board Communications and Strategy
                advisory services firm for F1000 organizations.
              </p>
              <p className="text-muted-foreground">
                The founder and lead CISO, Olivia Rose, is an award-winning, two-time Chief Information Security Officer
                (CISO) with over 23 years of experience in Cybersecurity. Olivia innately understands the pressures the
                CISO is under and has tailored these policies to effectively support Cybersecurity leaders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="https://www.linkedin.com/in/oliviarosecybersecurity/">
                  <Button variant="outline">LinkedIn</Button>
                </Link>
                <Link href="https://www.rosecisogroup.com/">
                  <Button>Find Out More About Us</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Olivia Rose, CISO"
                width={400}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter">Have Questions? Reach Out!</h2>
            <p className="text-xl text-muted-foreground">We will be back in touch within 24 hours.</p>
            <div className="w-full max-w-md space-y-4">
              <form className="space-y-4">
                <Input placeholder="Name" required />
                <Input type="email" placeholder="Email" required />
                <Input placeholder="Company" required />
                <Input placeholder="Subject" required />
                <Textarea placeholder="Message" className="min-h-[120px]" />
                <Button type="submit" className="w-full">
                  Contact Us
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
