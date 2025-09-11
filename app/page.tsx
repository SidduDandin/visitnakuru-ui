'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Database, Server, Globe } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        setName('');
        setEmail('');
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Globe className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Full-Stack Application
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern Next.js frontend connected to a Node.js backend with Prisma ORM
          </p>
        </div>

        {/* Architecture Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Frontend</CardTitle>
              <CardDescription>Next.js 14 with TypeScript</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">React 18</Badge>
              <Badge variant="secondary" className="ml-2">Tailwind CSS</Badge>
              <Badge variant="secondary" className="ml-2">shadcn/ui</Badge>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
                <Server className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Backend</CardTitle>
              <CardDescription>Node.js with Express</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary" className="ml-2">Express.js</Badge>
              <Badge variant="secondary" className="ml-2">CORS</Badge>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto p-3 bg-purple-100 rounded-full w-fit">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Database</CardTitle>
              <CardDescription>Prisma ORM with PostgreSQL</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Prisma</Badge>
              <Badge variant="secondary" className="ml-2">PostgreSQL</Badge>
              <Badge variant="secondary" className="ml-2">Migrations</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="demo" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="api">API Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Create and view users through the full-stack application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createUser} className="space-y-4 mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Creating...' : 'Create User'}
                  </Button>
                </form>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Users ({users.length})</h3>
                  {users.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No users yet. Create your first user above!
                    </p>
                  ) : (
                    <div className="grid gap-3">
                      {users.map((user) => (
                        <Card key={user.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{user.name}</h4>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <Badge variant="outline">
                              ID: {user.id}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>
                  Available REST API endpoints for this application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Badge className="bg-green-600">GET</Badge>
                    <code className="font-mono">/api/users</code>
                    <span className="text-sm text-gray-600">Fetch all users</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Badge className="bg-blue-600">POST</Badge>
                    <code className="font-mono">/api/users</code>
                    <span className="text-sm text-gray-600">Create new user</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Badge className="bg-orange-600">GET</Badge>
                    <code className="font-mono">/api/health</code>
                    <span className="text-sm text-gray-600">Health check</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Example Request Body (POST /api/users):</h4>
                  <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
{`{
  "name": "John Doe",
  "email": "john@example.com"
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}