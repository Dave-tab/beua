import React from 'react';
import { X, AlertTriangle, Phone, Mail, ShieldAlert, Clock, ArrowRight } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToBooking: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onNavigateToBooking
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fbfaf5] border border-[#d2cbba] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative text-[#191c1b]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#636c66] hover:text-[#191c1b] p-1.5 rounded-full hover:bg-[#eae5d8] cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#943a29] mb-2 font-semibold">
          <ShieldAlert className="w-4 h-4" />
          <span>Priority Desk • Critical Interventions</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl text-[#14231e] mb-3">
          Immediate Concierge Assistance
        </h3>

        <p className="text-xs text-[#525d57] leading-relaxed mb-6 font-sans">
          This dispatch desk is reserved for active principals, urgent itinerary disruptions (delayed private aviation, stranded ground transport, immediate venue re-allocation), or time-sensitive residential emergencies requiring resolution under 24–48 hours.
        </p>

        <div className="space-y-3 mb-6">
          <a
            href="tel:+442079460188"
            className="flex items-center justify-between p-4 bg-white border border-[#cfc8b8] rounded-2xl hover:border-[#16382c] transition-all group shadow-xs hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#16382c] text-white flex items-center justify-center shadow-xs">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#14231e]">
                  Priority Switchboard (London Desk)
                </p>
                <p className="text-sm font-mono text-[#16382c] font-semibold">
                  +44 (0) 20 7946 0188
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-[#16382c] group-hover:translate-x-0.5 transition-transform">
              Call Now ➔
            </span>
          </a>

          <a
            href="mailto:priority@beua-support.com?subject=URGENT%20CONCIERGE%20INTERVENTION"
            className="flex items-center justify-between p-4 bg-white border border-[#cfc8b8] rounded-2xl hover:border-[#16382c] transition-all group shadow-xs hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#efebe0] text-[#16382c] flex items-center justify-center shadow-xs">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#14231e]">
                  Priority Dispatch Inbox
                </p>
                <p className="text-sm font-mono text-[#4e5852]">
                  priority@beua-support.com
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-[#16382c] group-hover:translate-x-0.5 transition-transform">
              Send Alert ➔
            </span>
          </a>
        </div>

        <div className="p-4 bg-[#f3efe6] rounded-2xl text-xs text-[#525d57] flex items-start gap-3 mb-6">
          <Clock className="w-4 h-4 text-[#16382c] shrink-0 mt-0.5" />
          <p>
            Standard emergency response latency is <span className="font-semibold text-[#14231e]">under 30 minutes</span> for roster members. Non-members will be connected to the on-duty concierge manager for rapid scoping.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              onNavigateToBooking();
            }}
            className="flex-1 py-3.5 text-center bg-[#16382c] text-white text-xs uppercase tracking-wider font-semibold rounded-full hover:bg-[#1f483b] transition-colors cursor-pointer shadow-md"
          >
            Schedule Discovery Consultation
          </button>
          <button
            onClick={onClose}
            className="py-3.5 px-6 border border-[#cfc8b8] text-xs uppercase tracking-wider text-[#3d4641] hover:bg-[#efebe1] rounded-full font-medium transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
