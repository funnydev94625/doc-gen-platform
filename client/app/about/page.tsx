import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About October Security</h1>
        <p className="text-xl text-muted-foreground max-w-[800px]">
          CISO-developed cybersecurity policies for organizations of all sizes
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2 lg:gap-16 items-center">
        <div>
          <Image
            src="/placeholder.svg?height=600&width=600"
            alt="Olivia Rose, CISO"
            width={600}
            height={600}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-lg text-muted-foreground">
            The founder and lead CISO of Rose CISO Group, Olivia Rose, is an award-winning, two-time Chief Information Security Officer(CISO) with over 23 years of experience in Cybersecurity. Olivia innately understands the pressures the CISO is under and has tailored these policies to effectively support Cybersecurity leaders.
          </p>
          <p className="text-lg text-muted-foreground">
            Rose CISO Group (DBA October Security) is a boutique Cybersecurity Board Communications and Strategy advisory services firm for F1000 organizations.
          </p>
          <p className="text-lg text-muted-foreground">
            Our cybersecurity policy suite was developed to address a critical gap in the market: the need for customizable, clear, and effective security policies that can adapt to an organization's security maturity level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="https://www.linkedin.com/in/oliviarosecybersecurity/">
              <Button variant="outline">LinkedIn</Button>
            </Link>
            <Link href="https://www.rosecisogroup.com/">
              <Button>Visit Rose CISO Group</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-24 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Our Approach</h2>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
            We believe cybersecurity policies should be clear, adaptable, and effective
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Industry Standards</h3>
            <p className="text-muted-foreground">
              All policies are aligned with NIST 2.0 and CIS 8.1 frameworks to ensure comprehensive coverage of security
              controls.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Customizable Language</h3>
            <p className="text-muted-foreground">
              Our unique approach to policy language allows organizations to accurately reflect their security program
              maturity.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Practical Implementation</h3>
            <p className="text-muted-foreground">
              Policies include practical guidance and "Key Things to Remember" sections to help with real-world
              implementation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
