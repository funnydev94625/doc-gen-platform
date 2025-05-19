import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content starts here - no duplicate navigation */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Complete <span className="text-purple-500">Compliance</span>{" "}
                <span className="text-blue-500">Toolkit</span>
              </h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Need just one policy or cookie consent? Start free! Upgrade anytime to unlock our full set of powerful compliance tools for growing businesses.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/privacy-policy-generator">
                <Button className="bg-teal-400 hover:bg-teal-500 text-white">Get Started</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline">View Pricing</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-teal-500"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Privacy Policy Generator</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Create a comprehensive privacy policy tailored to your business needs and compliant with global
                  regulations.
                </p>
              </div>
              <Link href="/privacy-policy-generator">
                <Button variant="outline">Generate Policy</Button>
              </Link>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-blue-500"
                >
                  <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Cookie Consent Banner</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Implement a customizable cookie consent banner that helps you comply with GDPR, CCPA, and other
                  privacy laws.
                </p>
              </div>
              <Link href="/cookie-consent">
                <Button variant="outline">Get Banner</Button>
              </Link>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-purple-500"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Terms of Service Generator</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Create legally binding terms of service that protect your business and inform your users of their
                  rights and responsibilities.
                </p>
              </div>
              <Link href="/terms-of-service-generator">
                <Button variant="outline">Generate Terms</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
