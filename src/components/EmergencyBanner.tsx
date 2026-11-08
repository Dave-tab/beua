import React from 'react';
import { Zap, ArrowRight, ShieldAlert, Phone } from 'lucide-react';
import { Page } from '../types';

interface EmergencyBannerProps {
  onNavigate: (page: Page) => void;
  onOpenEmergencyModal: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  onNavigate,
  onOpenEmergencyModal
}) => {
  return (
    <section className="bg-[#122b22] text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-[#1e4436]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#9fc4b2] font-semibold">
            <Zap className="w-3.5 h-3.5 text-[#e5dfc9]" />
            <span>Immediate Assistance</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal tracking-wide">
            Need emergency flight changes or same-day coordination?
          </h3>
          <p className="text-sm text-[#c0d4ca] font-sans leading-relaxed">
            For active members and urgent lifestyle logistics requiring immediate intervention within 24–48 hours, contact the priority desk directly or summon the on-duty concierge.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={onOpenEmergencyModal}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#122b22] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#f3eee0] transition-colors cursor-pointer shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 text-[#122b22]" />
            <span>Emergency Concierge Desk</span>
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="flex items-center justify-center gap-2 px-5 py-3 border border-[#3b6855] text-white text-xs font-medium uppercase tracking-wider rounded-sm hover:bg-[#1a3d31] transition-colors cursor-pointer"
          >
            <span>Direct Inquiries Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
