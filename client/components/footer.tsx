import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">October Security</h3>
            <p className="text-sm text-muted-foreground">
              Cybersecurity policies developed and approved by CISOs
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="https://www.rosecisogroup.com/" className="text-muted-foreground hover:underline">
                  Rose CISO Group
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Policies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/policies" className="text-muted-foreground hover:underline">
                  Policies Included
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-muted-foreground hover:underline">
                  Purchase
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:underline">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} October Security. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
