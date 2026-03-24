'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [waitingFor, setWaitingFor] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isYes = (msg: string): boolean => {
    const y = msg.toLowerCase().trim();
    return ['yes', 'yeah', 'yep', 'ys', 'y', 'sure', 'ok', 'okay', 'interested', 'want', 'please', 'start', 'go', 'tell'].includes(y);
  };

  const getReply = (input: string): { text: string; products?: any[]; next?: string } => {
    const msg = input.toLowerCase().trim();

    if (waitingFor === 'prime' && isYes(msg)) {
      return { text: "🎉 Great! Visit etprime.com to start your 30-day free trial. Want to explore other products?", products: [{ name: 'ET Markets', price: 'Free', icon: '📈' }, { name: 'Stock Market Masterclass', price: '₹3,999', icon: '🎓' }] };
    }
    if (waitingFor === 'prime' && msg === 'no') {
      return { text: "No problem! Here are other products you might like:", products: [{ name: 'ET Markets', price: 'Free', icon: '📈' }, { name: 'Stock Market Masterclass', price: '₹3,999', icon: '🎓' }] };
    }
    
    if (waitingFor === 'markets' && isYes(msg)) {
      return { text: "✅ ET Markets is free! Start at etmarkets.com. Want to learn more?", products: [{ name: 'Stock Market Masterclass', price: '₹3,999', icon: '🎓' }] };
    }
    if (waitingFor === 'markets' && msg === 'no') {
      return { text: "Sure! Here's something else:", products: [{ name: 'Stock Market Masterclass', price: '₹3,999', icon: '🎓' }, { name: 'ET Prime', price: '₹1,999/year', icon: '📰' }] };
    }
    
    if (waitingFor === 'masterclass' && isYes(msg)) {
      return { text: "📚 Excellent! The course starts April 1st. Early bird ₹2,999. Want to know about ET Prime?", products: [{ name: 'ET Prime', price: '₹1,999/year', icon: '📰' }] };
    }
    if (waitingFor === 'masterclass' && msg === 'no') {
      return { text: "No worries! Check out these:", products: [{ name: 'ET Prime', price: '₹1,999/year', icon: '📰' }, { name: 'ET Markets', price: 'Free', icon: '📈' }] };
    }

    if (msg.includes('prime')) {
      return { text: "📰 ET Prime (₹1,999/year)\n\n✓ Exclusive articles\n✓ Deep-dive analysis\n✓ Ad-free experience\n\nWant to start a free 30-day trial?", products: [{ name: 'ET Prime', price: '₹1,999/year', icon: '📰' }], next: 'prime' };
    }
    if (msg.includes('markets')) {
      return { text: "📈 ET Markets (Free)\n\n✓ Live NSE/BSE quotes\n✓ Advanced charts\n✓ Portfolio tracking\n\nReady to start tracking?", products: [{ name: 'ET Markets', price: 'Free', icon: '📈' }], next: 'markets' };
    }
    if (msg.includes('masterclass') || msg.includes('course')) {
      return { text: "🎓 Stock Market Masterclass (₹3,999)\n\n✓ 8-week program\n✓ Expert sessions\n✓ Certificate\n\nInterested in enrolling?", products: [{ name: 'Stock Market Masterclass', price: '₹3,999', icon: '🎓' }], next: 'masterclass' };
    }
    if (msg.includes('card') || msg.includes('credit')) {
      return { text: "💳 ET Smart Credit Card (Free)\n\n✓ 5% cashback on dining\n✓ 4 lounge accesses\n✓ 0% forex markup\n\nApply in 5 minutes!", products: [{ name: 'ET Smart Credit Card', price: 'Free', icon: '💳' }] };
    }
    if (msg.includes('insurance') || msg.includes('term')) {
      return { text: "🛡️ ET Term Insurance (From ₹500/month)\n\n✓ Coverage up to ₹5Cr\n✓ Compare 20+ insurers\n✓ Tax benefits\n\nWant a free quote?", products: [{ name: 'ET Term Insurance', price: 'From ₹500/month', icon: '🛡️' }] };
    }
    if (msg.includes('event') || msg.includes('summit')) {
      return { text: "🎯 Upcoming Events:\n\nET Wealth Summit - March 28-29, Mumbai (₹7,999 early bird)\nET Startup Awards - April 15, Mumbai (₹4,999)\n\nInterested?", products: [{ name: 'ET Wealth Summit', price: '₹7,999', icon: '🎯' }] };
    }
    if (msg.includes('invest') || msg.includes('stock')) {
      return { text: "For investing, I recommend:\n\n📈 ET Markets (Free)\n🎓 Stock Market Masterclass (₹3,999)\n📰 ET Prime (₹1,999/year)\n\nWhich interests you?", products: [{ name: 'ET Markets', price: 'Free', icon: '📈' }, { name: 'Stock Market Masterclass', price: '₹3,999', icon: '🎓' }, { name: 'ET Prime', price: '₹1,999/year', icon: '📰' }] };
    }
    if (msg.includes('learn')) {
      return { text: "For learning, check out:\n\n🎓 Stock Market Masterclass\n📰 ET Prime for daily insights\n\nWhich one?", products: [{ name: 'Stock Market Masterclass', price: '₹3,999', icon: '🎓' }, { name: 'ET Prime', price: '₹1,999/year', icon: '📰' }] };
    }

    return { text: "✨ Hi! I'm your ET Concierge. I can help you with:\n\n📈 Investing\n🎓 Learning\n💳 Credit Cards\n🛡️ Insurance\n🎯 Events\n\nWhat are you interested in?" };
  };

  const sendMessage = async (text: string = input) => {
    if (!text.trim() || loading) return;

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const res = getReply(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: res.text, products: res.products }]);
      setWaitingFor(res.next || null);
      setLoading(false);
    }, 200);
  };

  const quickQuestions = [
    '📈 I want to invest',
    '🎓 I want to learn',
    '💳 Best credit card',
    '🛡️ Term insurance',
    '🎯 Upcoming events'
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ width: 280, background: 'white', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 24, borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#0B4F6C', margin: 0 }}>ET Concierge</h1>
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Your personal guide to ET</p>
        </div>
        <div style={{ flex: 1, padding: 16 }}>
          <button onClick={() => { setMessages([]); setWaitingFor(null); }} style={{ fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>Clear Chat</button>
        </div>
        <div style={{ padding: 16, borderTop: '1px solid #e5e7eb', fontSize: 10, color: '#9ca3af', textAlign: 'center' }}>
          AI guidance • Consult SEBI advisor
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f9fafb' }}>
        <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>ET Concierge</h2>
          <p style={{ fontSize: 11, color: '#10b981', margin: 0 }}>● Online</p>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          <div style={{ maxWidth: 672, margin: '0 auto' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: 48 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Welcome to ET Concierge</h3>
                <p style={{ color: '#6b7280', marginBottom: 24 }}>Ask me about investing, learning, credit cards, insurance, or events</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                  {quickQuestions.map(q => (
                    <button key={q} onClick={() => sendMessage(q)} style={{ padding: '8px 16px', background: 'white', border: '1px solid #e5e7eb', borderRadius: 999, fontSize: 13, cursor: 'pointer' }}>{q}</button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
                <div style={{ maxWidth: '75%', background: msg.role === 'user' ? '#0B4F6C' : 'white', color: msg.role === 'user' ? 'white' : '#1f2937', borderRadius: 20, padding: '12px 16px', border: msg.role === 'assistant' ? '1px solid #e5e7eb' : 'none' }}>
                  <div style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                  {msg.products && (
                    <div style={{ marginTop: 12 }}>
                      {msg.products.map((p, i) => (
                        <div key={i} onClick={() => sendMessage(p.name)} style={{ padding: 12, background: '#f9fafb', borderRadius: 12, marginTop: 8, cursor: 'pointer', border: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 24 }}>{p.icon}</span>
                            <div>
                              <div style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: '#6b7280' }}>{p.price}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
                <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 4 }}><span style={{ width: 6, height: 6, background: '#9ca3af', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1s infinite' }}></span><span style={{ width: 6, height: 6, background: '#9ca3af', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1s infinite 0.2s' }}></span><span style={{ width: 6, height: 6, background: '#9ca3af', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1s infinite 0.4s' }}></span></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e5e7eb', background: 'white', padding: 16 }}>
          <div style={{ maxWidth: 672, margin: '0 auto', display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder="Ask about ET products..." style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 999, padding: '10px 16px', outline: 'none' }} disabled={loading} />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ background: '#0B4F6C', color: 'white', border: 'none', borderRadius: 999, padding: '10px 24px', cursor: 'pointer', fontWeight: 500 }}>Send</button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
