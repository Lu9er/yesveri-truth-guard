import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getVerificationHistory, getVerificationStats, VerificationResult } from '@/lib/verification-engine';
import { formatTimestamp, truncateText } from '@/lib/utils';
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  Clock, 
  Shield, 
  Download, 
  Trash2, 
  Search,
  FileText,
  Link
} from 'lucide-react';

interface Stats {
  totalVerifications: number;
  todayCount: number;
  averageTrustScore: number;
  averageResponseTime: number;
}

export default function Admin() {
  const [stats, setStats] = useState<Stats>({
    totalVerifications: 0,
    todayCount: 0,
    averageTrustScore: 0,
    averageResponseTime: 0
  });
  const [verifications, setVerifications] = useState<VerificationResult[]>([]);
  const [filteredVerifications, setFilteredVerifications] = useState<VerificationResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Filter verifications based on search term
    const filtered = verifications.filter(v => 
      v.content_preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVerifications(filtered);
    setCurrentPage(1);
  }, [verifications, searchTerm]);

  const loadData = () => {
    const newStats = getVerificationStats();
    const newVerifications = getVerificationHistory();
    setStats(newStats);
    setVerifications(newVerifications);
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all verification data? This action cannot be undone.')) {
      localStorage.removeItem('yesveri_data');
      loadData();
    }
  };

  const exportData = () => {
    const data = {
      stats,
      verifications,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yesveri-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Pagination
  const totalPages = Math.ceil(filteredVerifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVerifications = filteredVerifications.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor verification system performance and usage</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button onClick={clearData} variant="destructive" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatsCard
                title="Total Verifications"
                value={stats.totalVerifications}
                icon={<BarChart className="w-5 h-5" />}
                description="All time"
              />
              <StatsCard
                title="Today's Verifications"
                value={stats.todayCount}
                icon={<TrendingUp className="w-5 h-5" />}
                description="Last 24 hours"
              />
              <StatsCard
                title="Average Trust Score"
                value={`${stats.averageTrustScore}%`}
                icon={<Shield className="w-5 h-5" />}
                description="All verifications"
              />
              <StatsCard
                title="Average Response Time"
                value={`${stats.averageResponseTime}ms`}
                icon={<Clock className="w-5 h-5" />}
                description="Processing speed"
              />
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest verification requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {verifications.slice(0, 5).map((verification, index) => (
                    <div key={verification.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        {verification.contentType === 'text' ? (
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Link className="w-4 h-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {truncateText(verification.content_preview, 60)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(verification.timestamp)}
                          </p>
                        </div>
                      </div>
                      <Badge className={getTrustScoreColor(verification.trustScore)}>
                        {verification.trustScore}%
                      </Badge>
                    </div>
                  ))}
                  {verifications.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No verifications yet. Start by verifying some content!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verifications">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>All Verifications</CardTitle>
                    <CardDescription>
                      Complete history of content verifications ({filteredVerifications.length} results)
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search verifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentVerifications.map((verification) => (
                    <VerificationRow key={verification.id} verification={verification} />
                  ))}
                  {filteredVerifications.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No verifications match your search.' : 'No verifications yet.'}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Trust Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { range: '80-100%', label: 'High Trust', count: verifications.filter(v => v.trustScore >= 80).length, color: 'bg-green-500' },
                      { range: '60-79%', label: 'Medium Trust', count: verifications.filter(v => v.trustScore >= 60 && v.trustScore < 80).length, color: 'bg-yellow-500' },
                      { range: '0-59%', label: 'Low Trust', count: verifications.filter(v => v.trustScore < 60).length, color: 'bg-red-500' }
                    ].map((item) => (
                      <div key={item.range} className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded ${item.color}`}></div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{item.label} ({item.range})</span>
                            <span className="text-sm text-muted-foreground">{item.count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'Text', count: verifications.filter(v => v.contentType === 'text').length, icon: <FileText className="w-4 h-4" /> },
                      { type: 'URL', count: verifications.filter(v => v.contentType === 'url').length, icon: <Link className="w-4 h-4" /> }
                    ].map((item) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <span className="font-medium">{item.type}</span>
                        </div>
                        <Badge variant="outline">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

function StatsCard({ title, value, icon, description }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function VerificationRow({ verification }: { verification: VerificationResult }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        {verification.contentType === 'text' ? (
          <FileText className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Link className="w-4 h-4 text-muted-foreground" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" title={verification.content_preview}>
            {verification.content_preview}
          </p>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-xs text-muted-foreground">
              {formatTimestamp(verification.timestamp)}
            </p>
            <Badge variant="outline" className="text-xs">
              {verification.contentType}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <Badge className={`${
            verification.trustScore >= 80 ? 'bg-green-100 text-green-800' :
            verification.trustScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {verification.trustScore}% Trust
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">
            {verification.processingTime}ms
          </p>
        </div>
      </div>
    </div>
  );
}