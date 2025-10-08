import { useAuth } from '@/contexts/AuthContext';
import { Chrome, Shield, TrendingUp, Zap, Sparkles, Crown } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = () => {
    // Mock sign in - just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-mesh opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10"></div>
      
      <div className="w-full max-w-lg relative z-10">
        {/* Premium logo and branding */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow animate-float">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-display font-bold text-gradient mb-4">
            Vantage
          </h1>
          <p className="text-xl text-dark-400 leading-relaxed">
            Premium betting line movement tracking
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Crown className="w-4 h-4 text-accent-amber" />
            <span className="text-sm text-accent-amber font-semibold">Elite Tier</span>
          </div>
        </div>

        {/* Premium login card */}
        <div className="card-glass p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome Back
            </h2>
            <p className="text-dark-400 leading-relaxed">
              Track line movements and gain an edge with professional-grade tools
            </p>
          </div>
          
          <button
            onClick={handleSignIn}
            className="w-full btn-primary flex items-center justify-center gap-4 py-4 text-lg"
          >
            <Chrome className="w-6 h-6" />
            Continue with Google
          </button>

          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3 text-sm text-dark-400 mb-6">
              <Shield className="w-5 h-5 text-accent-green" />
              <span>Enterprise-grade security</span>
            </div>
            <p className="text-xs text-dark-500 text-center leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy Policy. 
              Your data is protected with bank-level encryption.
            </p>
          </div>
        </div>

        {/* Premium features preview */}
        <div className="mt-12 grid grid-cols-3 gap-6">
          <div className="card-premium p-6 text-center hover:shadow-glow transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-green to-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">24/7</div>
            <div className="text-sm text-dark-400">Monitoring</div>
          </div>
          <div className="card-premium p-6 text-center hover:shadow-glow transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">Real-time</div>
            <div className="text-sm text-dark-400">Updates</div>
          </div>
          <div className="card-premium p-6 text-center hover:shadow-glow transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-amber to-brand-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">Pro</div>
            <div className="text-sm text-dark-400">Analytics</div>
          </div>
        </div>

        {/* Premium footer */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center gap-2 text-sm text-dark-500">
            <span>Trusted by professional bettors</span>
            <div className="w-1 h-1 bg-dark-500 rounded-full"></div>
            <span>Bank-level security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
