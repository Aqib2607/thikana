import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { LandlordLayout } from '@/components/layout/LandlordLayout';
import { InteractionsService, type ChatMessage } from '@/services/api/interactions.service';
import { Conversation } from '@/types/thikana';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, CheckCheck } from 'lucide-react';

export const Route = createFileRoute('/landlord/messages')({
  component: LandlordMessagesPage,
});

function LandlordMessagesPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadThreads() {
      setLoading(true);
      try {
        const list = await InteractionsService.getLandlordConversations(user?.id || 'landlord-1');
        setConversations(list);
        if (list.length > 0 && list[0]) {
          setSelectedConvId(list[0].id);
        }
      } catch (err) {
        console.error('Failed to load landlord conversations', err);
      } finally {
        setLoading(false);
      }
    }

    loadThreads();
  }, [user]);

  useEffect(() => {
    if (selectedConvId) {
      InteractionsService.getConversationMessages(selectedConvId).then(setMessages);
    }
  }, [selectedConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConvId) return;

    const newMsg = await InteractionsService.sendMessage(
      selectedConvId,
      user?.id || 'landlord-1',
      user?.name || 'Hasan Mahmud',
      inputMessage.trim()
    );

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
  };

  const activeThread = conversations.find((c) => c.id === selectedConvId);

  return (
    <LandlordLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'ভাড়াটিয়ার সাথে কথোপকথন' : 'Tenant Messages'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'মেসেজ ইনবক্স' : 'Landlord Messages Inbox'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'আগ্রহী ভাড়াটিয়াদের সাথে সরাসরি মেসেজিং যোগাযোগ করুন।'
              : 'Chat directly with potential tenants inquiring about your flats.'}
          </p>
        </div>

        {/* Messaging Interface */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
          {/* Threads Sidebar */}
          <div className="border-r border-slate-200 divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2].map((i) => (
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
                      isSelected ? 'bg-blue-50/80 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm shrink-0">
                      {conv.tenantName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{conv.tenantName}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-[11px] text-blue-700 font-medium truncate mt-0.5">
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
                <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                      {activeThread.tenantName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{activeThread.tenantName}</h3>
                      <p className="text-xs text-slate-500 truncate">{activeThread.propertyTitle}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200">
                    Prospective Tenant
                  </Badge>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === (user?.id || 'landlord-1');
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-tr-none'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <div
                            className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                              isMe ? 'text-blue-100' : 'text-slate-400'
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
                    className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-3"
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
    </LandlordLayout>
  );
}
