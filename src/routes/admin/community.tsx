import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { InteractionsService } from '@/services/api/interactions.service';
import { CommunityNote } from '@/types/thikana';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { KHULNA_LOCATIONS } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquareQuote,
  Plus,
  Trash2,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/community')({
  component: AdminCommunityNotesPage,
});

function AdminCommunityNotesPage() {
  const { t, language } = useLanguage();

  const [notes, setNotes] = useState<CommunityNote[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('sonadanga');
  const [contentBn, setContentBn] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const list = await InteractionsService.getCommunityNotes(selectedLocation);
      setNotes(list);
    } catch (err) {
      console.error('Failed to load community notes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [selectedLocation]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentBn.trim()) return;

    await InteractionsService.addCommunityNote({
      locationId: selectedLocation,
      contentBn,
      contentEn: contentEn || contentBn,
      author: 'কমিউনিটি মডারেটর (Community Moderator)',
      date: new Date().toISOString().split('T')[0],
    });

    toast.success(
      language === 'bn' ? 'কমিউনিটি নোট সফলভাবে যুক্ত হয়েছে!' : 'Community insight published!'
    );
    setContentBn('');
    setContentEn('');
    loadNotes();
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
              <MessageSquareQuote className="h-3.5 w-3.5" />
              <span>{language === 'bn' ? 'স্থানীয় জ্ঞানভাণ্ডার' : 'Khulna Local Insights'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'bn' ? 'কমিউনিটি নোট ও এলাকাভিত্তিক তথ্য' : 'Community Notes Moderation'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'খুলনার বিভিন্ন এলাকার পানি, বিদ্যুৎ, নিরাপত্তা ও যাতায়াত সংক্রান্ত গুরুত্বপূর্ণ টিপস পরিচালনা করুন।'
                : 'Manage local utility and neighborhood insights displayed on property detail pages.'}
            </p>
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-slate-50 font-semibold"
            >
              {KHULNA_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.nameBn} ({loc.nameEn})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Note Form */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-600" />
              <span>{language === 'bn' ? 'নতুন কমিউনিটি তথ্য যুক্ত করুন' : 'Publish Local Tip'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'তথ্য (বাংলায়) *' : 'Insight Content (Bangla) *'}
                  </Label>
                  <textarea
                    rows={2}
                    required
                    placeholder="যেমন: বর্ষায় মেইন রোডে পানি উঠলেও আবাসিক লেনগুলো উঁচু..."
                    value={contentBn}
                    onChange={(e) => setContentBn(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'তথ্য (ইংরেজিতে)' : 'Insight Content (English)'}
                  </Label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Electricity backup is reliable; close to main bus route..."
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  <span>{language === 'bn' ? 'টিপ প্রকাশ করুন' : 'Publish Tip'}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Notes List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">
            {language === 'bn' ? 'প্রকাশিত নোটসমূহ' : 'Published Community Notes'}
          </h3>

          {loading ? (
            <div className="h-28 bg-slate-100 rounded-xl animate-pulse" />
          ) : notes.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="p-8 text-center text-xs text-slate-400">
                {language === 'bn'
                  ? 'এই এলাকার জন্য এখনো কোনো কমিউনিটি নোট যুক্ত করা হয়নি।'
                  : 'No community notes found for this area.'}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <Card key={note.id} className="border-amber-200 bg-amber-50/30 shadow-xs">
                  <CardContent className="p-4 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-800">{note.contentBn}</p>
                      {note.contentEn && <p className="text-slate-500 italic">{note.contentEn}</p>}
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                        <span>Author: {note.author}</span>
                        <span>•</span>
                        <span>{note.date}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
