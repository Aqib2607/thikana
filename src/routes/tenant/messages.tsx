import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { TenantLayout } from '@/components/layout/TenantLayout';
import { InteractionsService } from '@/services/api/interactions.service';
import { Conversation, Message } from '@/types/thikana';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  MessageSquare,
  Send,
  User,
  Building,
  Clock,
  CheckCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/tenant/messages')({
  component: TenantMessagesPage,
});

function TenantMessagesPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadThreads() {
      setLoading(true);
      try {
        const list = await InteractionsService.getTenantConversations(user?.id || 'tenant-1');
        setConversations(list as any);
        if (list.length > 0 && list[0]) {
          setSelectedConvId(list[0].id);
        }
      } catch (err) {
        console.error('Failed to load conversations', err);
      } finally {
        setLoading(false);
      }
    }

    loadThreads();
  }, [user]);

  // Load messages when selected thread changes
  useEffect(() => {
    if (selectedConvId) {
      InteractionsService.getConversationMessages(selectedConvId).then((data) => {
        setMessages(data);
      });
    }
  }, [selectedConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConvId) return;

    const newMsg = await InteractionsService.sendMessage(
      selectedConvId,
      user?.id || 'tenant-1',
      user?.name || 'Tanvir Ahmed',
      inputMessage.trim()
    );

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
  };

  const activeThread = conversations.find((c) => c.id === selectedConvId);

  return (
    <TenantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'সরাসরি যোগাযোগ' : 'Direct Messaging'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'বাড়িওয়ালাদের সাথে মেসেজ' : 'Inquiries & Messages'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'বাড়িওয়ালার সাথে সরাসরি যোগাযোগ করুন কোনো দালাল বা গোপন নম্বর ছাড়াই।'
              : 'Communicate with landlords directly without middleman friction.'}
          </p>
        </div>

        {/* Messaging Interface */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
          {/* Threads List Sidebar */}
          <div className="border-r border-slate-200 divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {language === 'bn' ? 'কোনো মেসেজ থ্রেড নেই' : 'No active conversations'}
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
                      isSelected ? 'bg-emerald-50/80 border-l-4 border-l-emerald-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                      {conv.landlordName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{conv.landlordName}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-medium truncate mt-0.5">
                        {conv.propertyTitle}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-1">{conv.lastMessage}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Active Chat Window */}
          <div className="md:col-span-2 flex flex-col h-[550px] bg-slate-50/40">
            {activeThread ? (
              <>
                {/* Chat Top Header */}
                <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {activeThread.landlordName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{activeThread.landlordName}</h3>
                      <p className="text-xs text-slate-500 truncate">{activeThread.propertyTitle}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200">
                    Khulna Landlord
                  </Badge>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === (user?.id || 'tenant-1');
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                            isMe
                              ? 'bg-emerald-600 text-white rounded-tr-none'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.content || msg.message}</p>
                          <div
                            className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                              isMe ? 'text-emerald-100' : 'text-slate-400'
                            }`}
                          >
                            <span>{msg.timestamp}</span>
                            {isMe && <CheckCheck className="h-3 w-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder={language === 'bn' ? 'বার্তা লিখুন...' : 'Type your message...'}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 text-xs bg-slate-50 border-slate-200"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!inputMessage.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-3"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                {language === 'bn' ? 'একটি থ্রেড নির্বাচন করুন' : 'Select a conversation'}
              </div>
            )}
          </div>
        </div>
      </div>
    </TenantLayout>
  );
}
