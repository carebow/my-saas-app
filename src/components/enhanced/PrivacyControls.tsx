import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeLocalStorage } from '../../lib/safeStorage';
import { 
  Download, 
  Trash2, 
  Shield, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Database,
  Eye,
  EyeOff,
  Settings,
  Lock,
  Unlock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../ui/use-toast';

interface ExportRequest {
  export_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  export_type: string;
  requested_at: string;
  completed_at?: string;
  expires_at?: string;
  download_count: number;
  max_downloads: number;
  file_size?: number;
  download_available: boolean;
}

interface DeletionRequest {
  deletion_id: string;
  deletion_type: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  requested_at: string;
  scheduled_at: string;
  grace_period_ends: string;
  can_cancel: boolean;
  reason?: string;
}

interface PrivacyControlsProps {
  userId: string;
}

const PrivacyControls: React.FC<PrivacyControlsProps> = ({ userId }) => {
  const { toast } = useToast();
  const [exports, setExports] = useState<ExportRequest[]>([]);
  const [deletions, setDeletions] = useState<DeletionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteType, setDeleteType] = useState('full_account');

  useEffect(() => {
    loadExportHistory();
    loadDeletionHistory();
  }, [userId]);

  const loadExportHistory = async () => {
    try {
      // In a real app, you'd have an endpoint to get export history
      // For now, we'll simulate it
      setExports([]);
    } catch (error) {
      console.error('Failed to load export history:', error);
    }
  };

  const loadDeletionHistory = async () => {
    try {
      // In a real app, you'd have an endpoint to get deletion history
      // For now, we'll simulate it
      setDeletions([]);
    } catch (error) {
      console.error('Failed to load deletion history:', error);
    }
  };

  const requestDataExport = async (exportType: string = 'full') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/enhanced-chat/export-data', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${safeLocalStorage.get('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ export_type: exportType })
      });

      const data = await response.json();
      
      toast({
        title: "Export Requested",
        description: "Your data export has been initiated. You'll receive an email when ready.",
      });

      // Add to exports list
      setExports(prev => [{
        export_id: data.export_id,
        status: 'pending',
        export_type: exportType,
        requested_at: new Date().toISOString(),
        download_count: 0,
        max_downloads: 3,
        download_available: false
      }, ...prev]);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request data export",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestAccountDeletion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/enhanced-chat/delete-account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${safeLocalStorage.get('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          reason: deleteReason,
          deletion_type: deleteType
        })
      });

      const data = await response.json();
      
      toast({
        title: "Deletion Requested",
        description: "Your account deletion has been requested. You have 7 days to cancel.",
        variant: "destructive"
      });

      // Add to deletions list
      setDeletions(prev => [{
        deletion_id: data.deletion_id,
        deletion_type: deleteType,
        status: 'pending',
        requested_at: new Date().toISOString(),
        scheduled_at: data.scheduled_at,
        grace_period_ends: data.grace_period_ends,
        can_cancel: true,
        reason: deleteReason
      }, ...prev]);

      setShowDeleteDialog(false);
      setDeleteReason('');

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request account deletion",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDeletion = async (deletionId: string) => {
    try {
      const response = await fetch(`/api/v1/enhanced-chat/delete-account/${deletionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${safeLocalStorage.get('access_token')}`
        }
      });

      if (response.ok) {
        toast({
          title: "Deletion Cancelled",
          description: "Your account deletion has been cancelled.",
        });

        setDeletions(prev => 
          prev.map(d => d.deletion_id === deletionId ? { ...d, status: 'cancelled' } : d)
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel deletion",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Data Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Download className="w-4 h-4 text-carebow-primary" />
            Data Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Download all your health data, conversations, and memories. Your data is encrypted and secure.
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={() => requestDataExport('full')}
              disabled={isLoading}
              className="bg-gradient-to-r from-carebow-primary to-carebow-secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
            <Button
              onClick={() => requestDataExport('conversations_only')}
              disabled={isLoading}
              variant="outline"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Conversations Only
            </Button>
          </div>

          {/* Export History */}
          {exports.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recent Exports</h4>
              {exports.slice(0, 3).map((exportReq) => (
                <div key={exportReq.export_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(exportReq.status)}
                    <div>
                      <p className="text-sm font-medium">
                        {exportReq.export_type.replace('_', ' ')} Export
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(exportReq.requested_at)}
                        {exportReq.file_size && ` • ${formatFileSize(exportReq.file_size)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(exportReq.status)}>
                      {exportReq.status}
                    </Badge>
                    {exportReq.download_available && (
                      <Button size="sm" variant="outline">
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Deletion Section */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-red-600">
            <Trash2 className="w-4 h-4" />
            Account Deletion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-1">
                  Permanent Account Deletion
                </h4>
                <p className="text-xs text-red-700">
                  This will permanently delete all your data, conversations, and memories. 
                  This action cannot be undone. You have 7 days to cancel after requesting.
                </p>
              </div>
            </div>
          </div>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Request Account Deletion
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Account Deletion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    <strong>Warning:</strong> This will permanently delete all your data including:
                  </p>
                  <ul className="text-xs text-red-700 mt-2 space-y-1">
                    <li>• All chat conversations and memories</li>
                    <li>• Health profile and preferences</li>
                    <li>• Personalized remedies and feedback</li>
                    <li>• Account settings and history</li>
                  </ul>
                </div>

                <div>
                  <label className="text-sm font-medium">Deletion Type</label>
                  <select
                    value={deleteType}
                    onChange={(e) => setDeleteType(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="full_account">Full Account (Recommended)</option>
                    <option value="conversations_only">Conversations Only</option>
                    <option value="specific_data">Specific Data</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Reason (Optional)</label>
                  <textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    placeholder="Help us improve by telling us why you're leaving..."
                    className="w-full mt-1 p-2 border rounded-md h-20 resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={requestAccountDeletion}
                    disabled={isLoading}
                    variant="destructive"
                    className="flex-1"
                  >
                    {isLoading ? 'Processing...' : 'Confirm Deletion'}
                  </Button>
                  <Button
                    onClick={() => setShowDeleteDialog(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Deletion History */}
          {deletions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Deletion Requests</h4>
              {deletions.map((deletion) => (
                <div key={deletion.deletion_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(deletion.status)}
                    <div>
                      <p className="text-sm font-medium">
                        {deletion.deletion_type.replace('_', ' ')} Deletion
                      </p>
                      <p className="text-xs text-gray-500">
                        Requested: {formatDate(deletion.requested_at)}
                        {deletion.status === 'pending' && (
                          <span className="text-red-600 ml-2">
                            • Scheduled: {formatDate(deletion.scheduled_at)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(deletion.status)}>
                      {deletion.status}
                    </Badge>
                    {deletion.status === 'pending' && deletion.can_cancel && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelDeletion(deletion.deletion_id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-carebow-primary" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Lock className="w-4 h-4 text-green-500" />
            <span>All data is encrypted and HIPAA compliant</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Database className="w-4 h-4 text-blue-500" />
            <span>Data stored securely on AWS infrastructure</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-purple-500" />
            <span>You control your data - export or delete anytime</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyControls;
