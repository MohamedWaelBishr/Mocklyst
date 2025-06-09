import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, Zap, Shield, Trash2 } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
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
            Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to know about using Mocklyst
          </p>
        </div>

        <div className="space-y-8">
          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Start
              </CardTitle>
              <CardDescription>
                Get your first mock API endpoint in under 30 seconds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {" "}
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Choose your response type (Object, Array, or Primitive)</li>
                <li>Define your schema fields and types</li>
                <li>Click &ldquo;Generate Mock Endpoint&rdquo;</li>
                <li>Copy the endpoint URL and use it in your application</li>
              </ol>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <Zap className="h-8 w-8 mx-auto text-blue-500" />
                  <h3 className="font-semibold">Zero Friction</h3>
                  <p className="text-sm text-muted-foreground">
                    No signup, no login, no complexity
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Clock className="h-8 w-8 mx-auto text-green-500" />
                  <h3 className="font-semibold">Auto-Expiry</h3>
                  <p className="text-sm text-muted-foreground">
                    All endpoints auto-delete after 7 days
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Shield className="h-8 w-8 mx-auto text-purple-500" />
                  <h3 className="font-semibold">CORS Enabled</h3>
                  <p className="text-sm text-muted-foreground">
                    Ready for cross-origin requests
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Types */}
          <Card>
            <CardHeader>
              <CardTitle>Response Types</CardTitle>
              <CardDescription>
                Choose the right response type for your use case
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  Object
                  <Badge variant="secondary">Most Common</Badge>
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Returns a single JSON object with your defined fields.
                </p>
                <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-xs overflow-x-auto">
                  {`{
  "id": 1,
  "name": "string_value",
  "active": true
}`}
                </pre>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Array</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Returns an array of objects with your defined length and
                  fields.
                </p>
                <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-xs overflow-x-auto">
                  {`[
  { "id": 1, "name": "string_1" },
  { "id": 2, "name": "string_2" },
  { "id": 3, "name": "string_3" }
]`}
                </pre>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Primitive</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Returns a single value (string, number, or boolean).
                </p>
                <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-xs overflow-x-auto">
                  {`"Hello World"`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* API Usage */}
          <Card>
            <CardHeader>
              <CardTitle>API Usage Examples</CardTitle>
              <CardDescription>
                How to use your mock endpoints in different environments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">cURL</h3>
                <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-sm overflow-x-auto">
                  {`curl https://mocklyst.com/api/mock/abc123`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">JavaScript Fetch</h3>
                <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-sm overflow-x-auto">
                  {`fetch('https://mocklyst.com/api/mock/abc123')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Axios</h3>
                <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-sm overflow-x-auto">
                  {`import axios from 'axios';

const data = await axios.get('https://mocklyst.com/api/mock/abc123');
console.log(data.data);`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">React Hook</h3>
                <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-sm overflow-x-auto">
                  {`import { useState, useEffect } from 'react';

function useData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://mocklyst.com/api/mock/abc123')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Limitations */}
          <Card>
            <CardHeader>
              <CardTitle>Limitations & Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">
                    Time
                  </Badge>
                  <span className="text-sm">
                    All endpoints auto-expire after 7 days
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">
                    Method
                  </Badge>
                  <span className="text-sm">
                    Only GET requests are supported
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">
                    Size
                  </Badge>
                  <span className="text-sm">
                    Maximum 100 items for array responses
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">
                    Rate
                  </Badge>
                  <span className="text-sm">
                    Reasonable usage expected (no abuse)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {" "}
              <div>
                <h3 className="font-semibold mb-1">
                  Can I extend an endpoint&apos;s expiry?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Currently, all endpoints have a fixed 7-day expiry. Just
                  create a new one when needed.
                </p>
              </div>
              <Separator />{" "}
              <div>
                <h3 className="font-semibold mb-1">
                  Are endpoints publicly accessible?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yes, anyone with the endpoint URL can access it. Don&apos;t
                  include sensitive data.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-1">
                  Can I use this in production?
                </h3>
                <p className="text-sm text-muted-foreground">
                  This is designed for development and testing. Use proper APIs
                  for production applications.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Endpoint Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Endpoint Management
              </CardTitle>
              <CardDescription>
                How to manage and delete your mock endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Manual Deletion</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You can manually delete any mock endpoint before its expiry by
                  visiting the deletion URL.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-3">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-2">
                    🔗 Delete URL Format:
                  </h4>
                  <code className="text-blue-800 dark:text-blue-200 text-sm">
                    https://mocklyst.com/mock/[endpoint-id]/delete
                  </code>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 text-xs mt-1">✓</span>
                    <span>Immediate deletion with confirmation page</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 text-xs mt-1">✓</span>
                    <span>Useful for cleaning up sensitive test data</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 text-xs mt-1">✓</span>
                    <span>
                      Safe confirmation process prevents accidental deletion
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Auto-Expiry</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  All endpoints automatically expire and get deleted after 7
                  days.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span>
                      Exact expiry time is shown when endpoint is created
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span>Expired endpoints return 410 Gone status</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span>
                      Automatic cleanup keeps the service fast and secure
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Deletion Examples</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Direct Browser Access:
                    </h4>
                    <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-sm overflow-x-auto">
                      {`# Visit this URL in your browser for endpoint abc123
https://mocklyst.com/mock/abc123/delete`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      API Deletion (DELETE method):
                    </h4>
                    <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-sm overflow-x-auto">
                      {`# Delete via API call
curl -X DELETE https://mocklyst.com/api/mock/abc123

# Response
{
  "success": true,
  "message": "Mock endpoint deleted successfully",
  "id": "abc123"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
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
