'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Selvas Coffee</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Premium European coffee sourcing and trading.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-sm hover:text-brown-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-brown-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm hover:text-brown-600">
                  Shipping Information
                </Link>
              </li>
            </ul>
          </div>

          {/* GDPR Notice */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-2">GDPR Compliance</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We value your privacy and comply with EU GDPR regulations. By using our
              services, you agree to our data processing practices as described in our
              Privacy Policy.
            </p>
            <Link
              href="/privacy-policy"
              className="text-sm text-brown-600 hover:underline mt-2 inline-block"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Selvas Coffee. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}