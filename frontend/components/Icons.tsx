import React from 'react';
import { 
  UploadCloud, FileSpreadsheet, BarChart3, MessageSquare, 
  History, Settings, Plus, Download, ChevronRight, Search,
  LogOut, CheckCircle2, AlertCircle
} from 'lucide-react';

export const IconUpload = () => <UploadCloud className="w-12 h-12 text-slate-400" />;
export const IconFile = ({ className = "w-5 h-5" }) => <FileSpreadsheet className={className} />;
export const IconChart = ({ className = "w-5 h-5" }) => <BarChart3 className={className} />;
export const IconChat = ({ className = "w-5 h-5" }) => <MessageSquare className={className} />;
export const IconHistory = ({ className = "w-5 h-5" }) => <History className={className} />;
export const IconSettings = ({ className = "w-5 h-5" }) => <Settings className={className} />;
export const IconPlus = ({ className = "w-4 h-4" }) => <Plus className={className} />;
export const IconDownload = ({ className = "w-4 h-4" }) => <Download className={className} />;
export const IconChevronRight = ({ className = "w-4 h-4" }) => <ChevronRight className={className} />;
export const IconSearch = ({ className = "w-4 h-4" }) => <Search className={className} />;
export const IconLogOut = ({ className = "w-4 h-4" }) => <LogOut className={className} />;
export const IconCheck = ({ className = "w-5 h-5 text-green-500" }) => <CheckCircle2 className={className} />;
export const IconAlert = ({ className = "w-5 h-5 text-amber-500" }) => <AlertCircle className={className} />;
