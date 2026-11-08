import React, { useState } from 'react';
import { X, Lock, Shield, ArrowRight, CheckCircle2, Phone, Mail, Key } from 'lucide-react';

interface ClientAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAdmin?: () => void;
}

export const ClientAccessModal: React.FC<ClientAccessModalProps> = ({ isOpen, onClose, onNavigateToAdmin }) => {
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setErrorMsg('Please provide your client dossier PIN or reference ID.');
      return;
    }
    // Simulation for demo: any 4-digit code works, or default demo
    setIsAuthenticated(true);
    setErrorMsg('');
  };

  const handleReset = () => {
    setIsAuthenticated(false);
    setAccessCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#faf8f3] border border-[#dcd6c6] w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative text-[#191c1b]">
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 text-[#636c66] hover:text-[#191c1b] p-1.5 rounded-full hover:bg-[#eae5d8] cursor-pointer transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#16382c] mb-2 font-semibold">
              <Shield className="w-4 h-4" />
              <span>Private Client Access</span>
            </div>
            <h3 className="font-serif text-2xl text-[#14231e] mb-2 font-medium">
              Encrypted Liaison Desk
            </h3>
            <p className="text-xs text-[#525d57] leading-relaxed mb-6 font-sans">
              Enter your allocated 6-character member reference ID or secure PIN to view ongoing itineraries, live expense logs, and direct line credentials.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#434c47] mb-1.5">
                  Member Access Token / PIN
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-[#79847d]" />
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="e.g. BEUA-7749 or 2025"
                    className="w-full pl-10 pr-4 py-3 text-xs bg-white border border-[#cfc8b8] rounded-xl focus:outline-none focus:border-[#16382c] text-[#191c1b]"
                  />
                </div>
                {errorMsg && (
                  <p className="text-xs text-red-700 mt-1 font-medium">{errorMsg}</p>
                )}
                <p className="text-[11px] text-[#717b75] mt-1.5">
                  Demo hint: enter any test code (e.g. <span className="font-mono text-[#16382c]">BEUA-2025</span>)
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#16382c] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#1f483b] transition-colors cursor-pointer shadow-md"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Verify & Open Vault</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#e5dfd2] text-center space-y-2">
              <p className="text-xs text-[#636c66]">
                Lost credentials or need immediate concierge authorization?
              </p>
              <a
                href="mailto:concierge@beua-support.com"
                className="inline-block text-xs text-[#16382c] underline font-medium"
              >
                Contact Duty Coordinator
              </a>

              {onNavigateToAdmin && (
                <div className="pt-3 border-t border-[#e8e2d4] flex items-center justify-between text-xs">
                  <span className="text-[#646e68]">BEUA Coordinator?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToAdmin();
                    }}
                    className="text-[#16382c] font-semibold hover:underline cursor-pointer"
                  >
                    Directorate Admin Portal →
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-2 space-y-4 animate-in fade-in">
            <div className="w-14 h-14 bg-[#e2ede7] text-[#16382c] rounded-full mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl text-[#14231e]">
              Authenticated Session
            </h3>
            <div className="bg-white p-5 rounded-2xl border border-[#cfc8b8] text-left text-xs space-y-2 font-mono shadow-xs">
              <div className="flex justify-between border-b border-[#f0ede6] pb-1.5">
                <span className="text-[#646e68]">Principal Dossier:</span>
                <span className="font-semibold text-[#14231e]">BEUA-PRV-9810</span>
              </div>
              <div className="flex justify-between border-b border-[#f0ece2] pb-1.5">
                <span className="text-[#646e68]">Assigned Coordinator:</span>
                <span className="font-semibold text-[#16382c]">Eleanor Vance (London W1)</span>
              </div>
              <div className="flex justify-between border-b border-[#f0ece2] pb-1.5">
                <span className="text-[#646e68]">Current Retainer Status:</span>
                <span className="text-emerald-700 font-bold">Active • Priority 24/7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#646e68]">Encrypted Signal Line:</span>
                <span className="text-[#14231e] font-semibold">+44 (0) 7946 908 112</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <a
                href="tel:+442079460188"
                className="flex items-center justify-center gap-2 py-3 bg-[#16382c] text-white text-xs uppercase tracking-wider rounded-full font-semibold hover:bg-[#1f483b] shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Private Line</span>
              </a>
              <button
                onClick={handleReset}
                className="py-3 border border-[#cfc8b8] text-xs text-[#333d37] hover:bg-[#efebe1] rounded-full font-medium uppercase tracking-wider cursor-pointer"
              >
                Close Vault Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
