import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import {
  useGetAdminMe,
  useGetAdminStats,
  useListAdminAssessments,
  useDeleteAdminAssessment,
  useAdminLogout,
  getListAdminAssessmentsQueryKey
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { 
  Download, LogOut, Search, Trash2, Users, Target, Activity, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['hsl(106, 19%, 46%)', 'hsl(35, 60%, 55%)', 'hsl(150, 25%, 25%)', 'hsl(20, 40%, 60%)'];

export function AdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Auth Guard
  const { data: me, isLoading: meLoading, isError: meError } = useGetAdminMe({
    query: { queryKey: ['adminMe'], retry: false }
  });

  useEffect(() => {
    if ((me && !me.authenticated) || meError) {
      setLocation('/admin/login');
    }
  }, [me, meError, setLocation]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: stats } = useGetAdminStats({
    query: { enabled: !!me?.authenticated, queryKey: ['adminStats'] }
  });

  const { data: assessmentsData, isLoading: listLoading } = useListAdminAssessments(
    { search: debouncedSearch || undefined },
    { query: { enabled: !!me?.authenticated, queryKey: ['adminList', debouncedSearch] } }
  );

  const deleteMutation = useDeleteAdminAssessment();
  const logoutMutation = useAdminLogout();

  if (meLoading || !me?.authenticated) {
    return <div className="min-h-screen bg-muted/20 flex items-center justify-center">Loading...</div>;
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['adminList'] });
        queryClient.invalidateQueries({ queryKey: ['adminStats'] });
        toast({ title: "Assessment deleted" });
      }
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        setLocation('/admin/login');
      }
    });
  };

  const handleExport = (format: 'csv' | 'xlsx') => {
    window.location.href = `/api/admin/assessments/export?format=${format}`;
  };

  return (
    <div className="min-h-screen bg-muted/10 font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-serif text-xl font-medium">Pure Botanica Admin</div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-foreground/60 hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-foreground/60 mb-1">Total Assessments</p>
                <h3 className="text-3xl font-serif">{stats?.totalAssessments || 0}</h3>
              </div>
              <div className="p-3 bg-primary/10 text-primary rounded-xl"><Users className="w-6 h-6" /></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-foreground/60 mb-1">Focus Recommendations</p>
                <h3 className="text-3xl font-serif">{stats?.focusCount || 0}</h3>
              </div>
              <div className="p-3 bg-primary/10 text-primary rounded-xl"><Target className="w-6 h-6" /></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-foreground/60 mb-1">Mineral Recommendations</p>
                <h3 className="text-3xl font-serif">{stats?.mineralCount || 0}</h3>
              </div>
              <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><Activity className="w-6 h-6" /></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-foreground/60 mb-1">Both Recommended</p>
                <h3 className="text-3xl font-serif">{stats?.bothCount || 0}</h3>
              </div>
              <div className="p-3 bg-foreground/5 text-foreground rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-lg font-serif mb-6">Age Distribution</h3>
            <div className="h-64">
              {stats?.ageDistribution && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.ageDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="age" tickFormatter={(v) => `${v} yrs`} tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="count" fill="hsl(106, 19%, 46%)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-lg font-serif mb-6">Recommendation Breakdown</h3>
            <div className="h-64">
              {stats?.recommendationDistribution && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.recommendationDistribution.map(d => ({
                        name: d.recommendation.charAt(0).toUpperCase() + d.recommendation.slice(1),
                        value: d.count
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.recommendationDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl font-serif">Assessment Records</h3>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <Input 
                  placeholder="Search names or email..." 
                  className="pl-9 h-10 bg-muted/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('csv')} className="h-10">
                  <Download className="w-4 h-4 mr-2" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('xlsx')} className="h-10">
                  <Download className="w-4 h-4 mr-2" /> Excel
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Date</TableHead>
                  <TableHead>Child</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : assessmentsData?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                        <p>No assessments found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  assessmentsData?.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(item.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{item.childName}</span>
                        <span className="text-xs text-muted-foreground ml-2">({item.age} {item.gender.charAt(0).toUpperCase()})</span>
                      </TableCell>
                      <TableCell>{item.parentName}</TableCell>
                      <TableCell className="text-muted-foreground">{item.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider
                          ${item.recommendation === 'focus' ? 'bg-primary/10 text-primary' : 
                            item.recommendation === 'mineral' ? 'bg-secondary/10 text-secondary' : 
                            'bg-foreground/5 text-foreground'}`}
                        >
                          {item.recommendation}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete assessment?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the assessment record for {item.childName}. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(item.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination summary */}
          {assessmentsData && (
            <div className="p-4 border-t border-border bg-muted/10 text-sm text-muted-foreground text-center">
              Showing {assessmentsData.data.length} of {assessmentsData.total} assessments
            </div>
          )}
        </div>
      </main>
    </div>
  );
}