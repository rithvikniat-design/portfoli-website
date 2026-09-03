"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="animate-pulse h-64 bg-charcoal-800 rounded-xl" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-white">Messages</h1>
          <p className="text-charcoal-400 text-sm mt-1">{messages.length} submissions</p>
        </div>
      </div>

      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="admin-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-white">{msg.name}</h3>
                  <a href={`mailto:${msg.email}`} className="text-sm text-gold-400 hover:underline">{msg.email}</a>
                </div>
                <span className="text-xs text-charcoal-400">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </span>
              </div>
              {msg.subject && <h4 className="text-sm font-medium text-white mb-2">Subject: {msg.subject}</h4>}
              <div className="text-sm text-charcoal-300 bg-charcoal-900/50 p-4 rounded-lg whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card text-center py-16 text-charcoal-400">No messages received yet.</div>
      )}
    </div>
  );
}
