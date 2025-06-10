import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Scale, Shield, Clock, AlertTriangle, Trash2, Globe } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Generator
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms and Conditions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Terms of service for using Mocklyst
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Last Updated: June 10, 2025
            </Badge>
          </div>
        </div>

        <div className="space-y-8">
          {/* Service Overview */}
          <Card className="dark:bg-slate-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Service Overview
              </CardTitle>
              <CardDescription>
                Understanding what Mocklyst provides
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Mocklyst is a free, no-registration mock API generation service that allows developers to create temporary API endpoints for testing and development purposes. By using this service, you agree to these terms and conditions.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Key Service Features:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li>Instant mock API endpoint generation</li>
                  <li>No user registration or authentication required</li>
                  <li>Automatic 7-day expiration of all endpoints</li>
                  <li>JSON response generation based on user-defined schemas</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention & Privacy */}
          <Card className="dark:bg-slate-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data Retention & Privacy
              </CardTitle>
              <CardDescription>
                How we handle your data and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Automatic Data Deletion</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    All mock configurations and generated endpoints are automatically deleted after 7 days. This policy cannot be extended or modified.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">No Personal Data Collection</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We do not collect, store, or process any personal information. No registration, email addresses, or identification is required.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Minimal Technical Data</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We only store the mock schema configurations and generated endpoint IDs temporarily for service functionality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Restrictions */}
          <Card className="dark:bg-slate-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Usage Restrictions & Rate Limits
              </CardTitle>
              <CardDescription>
                Rules and limitations for using our service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Rate Limiting</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside ml-4">
                    <li>Maximum 100 requests per hour per endpoint</li>
                    <li>Excessive usage may result in temporary IP blocking</li>
                    <li>Commercial usage requiring higher limits is not supported</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Prohibited Content</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    You may not create mock data containing:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside ml-4">
                    <li>Personal data of real individuals</li>
                    <li>Copyrighted content</li>
                    <li>Malicious code or scripts</li>
                    <li>Illegal, offensive, or harmful content</li>
                    <li>Content that violates third-party rights</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Intended Use</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    This service is intended for development and testing purposes only. It should not be used for production applications or storing real data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card className="dark:bg-slate-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Service Availability & Reliability
              </CardTitle>
              <CardDescription>
                Understanding service limitations and availability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">No Service Guarantees</h4>
                <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1 list-disc list-inside">
                  <li>Service provided &ldquo;as-is&rdquo; without warranties</li>
                  <li>No guarantee of uptime or availability</li>
                  <li>Endpoints may become unavailable before the 7-day expiry</li>
                  <li>Service may be modified or discontinued at any time</li>
                </ul>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Maintenance & Updates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We reserve the right to perform maintenance, updates, or modifications that may temporarily affect service availability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liability & Disclaimers */}
          <Card className="dark:bg-slate-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Liability & Disclaimers
              </CardTitle>
              <CardDescription>
                Important legal disclaimers and limitations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Limitation of Liability</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Mocklyst and its developers shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this service.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">No Data Accuracy Guarantee</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Generated mock data is for testing purposes only. We make no guarantees about the accuracy, completeness, or reliability of generated data.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">User Responsibility</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Users are solely responsible for their use of the service and any consequences arising from their mock data configurations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="dark:bg-slate-800/50">
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
              <CardDescription>
                Rights and ownership of content and service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Service Ownership</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Mocklyst service, including its design, code, and documentation, is owned by its developers. All rights reserved.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">User Content</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    You retain ownership of any mock data schemas you create. By using the service, you grant us a temporary license to store and process your configurations for service provision.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="dark:bg-slate-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Termination & Service Changes
              </CardTitle>
              <CardDescription>
                How service usage can be terminated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Automatic Termination</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    All mock endpoints automatically terminate and are deleted after 7 days from creation.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Service Termination Rights</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We reserve the right to terminate or suspend access to the service for violations of these terms, abuse, or any other reason.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Service Discontinuation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We may discontinue the service at any time without prior notice. We recommend not relying on this service for critical applications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="dark:bg-slate-800/50">
            <CardHeader>
              <CardTitle>Governing Law & Jurisdiction</CardTitle>
              <CardDescription>
                Legal framework governing these terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Applicable Law</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    These terms are governed by and construed in accordance with applicable international laws and best practices for web services.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Dispute Resolution</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Any disputes arising from the use of this service should be resolved through direct communication. Given the free and temporary nature of the service, formal legal proceedings are not expected.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="dark:bg-slate-800/50">
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
              <CardDescription>
                How these terms may be updated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We reserve the right to update these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of any updated terms.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Recommendation:</strong> Check this page periodically for updates. Given the temporary nature of endpoints (7-day expiry), significant changes will primarily affect new endpoint creation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="dark:bg-slate-800/50">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How to reach us regarding these terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                For questions about these terms or the service, you can refer to our documentation or the developer information provided in the service footer.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/docs"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  View Documentation →
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  Back to Service →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Developed by{" "}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              Eng. Mohamed Wael Bishr
            </span>
          </p>
          <p>
            <Link
              href="/"
              className="hover:text-gray-700 dark:hover:text-gray-200 underline"
            >
              ← Back to Mocklyst Generator
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
