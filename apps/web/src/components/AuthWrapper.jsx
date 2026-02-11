import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-[#0a0a0f] items-center justify-center p-16">
        <div className="max-w-lg">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-10 shadow-2xl shadow-violet-500/40">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Welcome to<br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Atlas AI</span>
          </h1>
          <p className="text-xl text-white/50 leading-relaxed mb-12">
            Your intelligent support assistant powered by AI. Get instant help with orders, billing, and more.
          </p>
          
          <div className="space-y-6">
            {[
              { icon: '📦', title: 'Order Tracking', desc: 'Real-time updates on your deliveries' },
              { icon: '💳', title: 'Billing Support', desc: 'Manage payments and refunds easily' },
              { icon: '🤖', title: 'AI-Powered', desc: 'Smart routing to specialized agents' },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center text-2xl shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-white/40 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-12">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-violet-500/30">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Atlas AI</h1>
            <p className="text-white/40">Your intelligent support assistant</p>
          </div>

          <div className="bg-[#14141c] border border-white/[0.08] rounded-3xl p-10 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-white mb-3">Sign in to continue</h2>
              <p className="text-white/40">Get instant help from our AI agents</p>
            </div>

            <SignInButton mode="modal">
              <button className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-4 shadow-xl shadow-violet-600/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Sign In with Clerk
              </button>
            </SignInButton>

            <div className="flex items-center gap-6 my-10">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-white/25 text-xs uppercase tracking-widest font-medium">Features</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '🚀', label: 'Fast' },
                { icon: '🔒', label: 'Secure' },
                { icon: '💬', label: '24/7' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3 py-5 px-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-white/50 text-xs font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-white/20 text-sm mt-10 leading-relaxed">
            By signing in, you agree to our<br />
            <span className="text-white/30 hover:text-violet-400 cursor-pointer transition-colors">Terms of Service</span> and <span className="text-white/30 hover:text-violet-400 cursor-pointer transition-colors">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthProvider({ children }) {
  if (!PUBLISHABLE_KEY) {
    console.warn('Clerk publishable key not found. Running without authentication.');
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SignedOut>
        <SignInPage />
      </SignedOut>
      <SignedIn>
        {children}
      </SignedIn>
    </ClerkProvider>
  );
}

export function UserProfile() {
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-[12px] font-bold text-white shadow-lg shadow-emerald-500/20">
        U
      </div>
    );
  }

  return (
    <UserButton 
      appearance={{
        elements: {
          avatarBox: 'w-9 h-9',
          userButtonPopoverCard: 'bg-[#1e1e2e] border border-white/10',
          userButtonPopoverActionButton: 'text-white/70 hover:text-white hover:bg-white/5',
          userButtonPopoverActionButtonText: 'text-white/70',
          userButtonPopoverFooter: 'hidden',
        },
      }}
    />
  );
}
