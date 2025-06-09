'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ArrowLeft, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function DeleteMockPage() {
  const params = useParams();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mockExists, setMockExists] = useState<boolean | null>(null);
  
  const id = params.id as string;

  useEffect(() => {
    // Check if mock endpoint exists
    const checkMockExists = async () => {
      try {
        const response = await fetch(`/api/mock/${id}`, { method: 'HEAD' });
        setMockExists(response.ok);      } catch {
        setMockExists(false);
      }
    };

    if (id) {
      checkMockExists();
    }
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/mock/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete mock endpoint');
      }

      setDeleted(true);
      
      // Redirect to home after a short delay
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (mockExists === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Checking mock endpoint...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Generator
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Delete Mock Endpoint
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Permanently remove this mock API endpoint
          </p>
        </div>

        {deleted ? (
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Successfully Deleted!
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                The mock endpoint has been permanently removed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-green-700 dark:text-green-300 mb-4">
                  Endpoint ID: <code className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-sm">{id}</code>
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Redirecting to home page in a few seconds...
                </p>
              </div>
            </CardContent>
          </Card>
        ) : !mockExists ? (
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Mock Endpoint Not Found
              </CardTitle>
              <CardDescription className="text-yellow-700 dark:text-yellow-300">
                This endpoint may have already been deleted or expired
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-yellow-700 dark:text-yellow-300">
                  The mock endpoint with ID <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded text-sm">{id}</code> could not be found.
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Possible reasons:
                </p>
                <ul className="text-sm text-yellow-600 dark:text-yellow-400 list-disc list-inside space-y-1">
                  <li>The endpoint has already been deleted</li>
                  <li>The endpoint has expired (after 7 days)</li>
                  <li>The endpoint ID is incorrect</li>
                </ul>
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => router.push('/')} className="flex-1">
                    Create New Mock
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-200 flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Confirm Deletion
                <Badge variant="destructive" className="ml-auto">
                  <Clock className="h-3 w-3 mr-1" />
                  Permanent
                </Badge>
              </CardTitle>
              <CardDescription className="text-red-700 dark:text-red-300">
                This action cannot be undone. The endpoint will be permanently removed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Endpoint Details:</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Endpoint ID:</span>
                    <code className="ml-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{id}</code>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">URL:</span>
                    <code className="ml-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {typeof window !== 'undefined' ? `${window.location.origin}/api/mock/${id}` : `/api/mock/${id}`}
                    </code>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-red-800 dark:text-red-200 font-medium">Error</span>
                  </div>
                  <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
                </div>
              )}

              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h5 className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">Warning</h5>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                      Once deleted, this mock endpoint will no longer be accessible. Any applications or services 
                      using this endpoint will receive 404 errors.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="flex-1"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Permanently
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
