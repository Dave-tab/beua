import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#faf9f5] border border-[#d2cbba] w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative text-[#191c1b] max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#636c66] hover:text-[#191c1b] p-1.5 rounded-full hover:bg-[#eae5d8] cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'privacy' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#16382c] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>BEUA Legal & Compliance Office</span>
            </div>
            <h3 className="font-serif text-3xl text-[#14231e]">
              Privacy & Non-Disclosure Protocol
            </h3>
            <p className="text-xs font-mono text-[#717b75]">
              Document Version: BEUA-PRV-4.2 • Jurisdiction: England & Wales
            </p>

            <div className="space-y-3 text-xs text-[#4d5751] font-sans leading-relaxed pt-2">
              <p>
                <strong>1. Mutual Non-Disclosure Doctrine:</strong> All client engagements, preliminary consultation notes, residential addresses, travel manifests, financial reconciliations, and third-party vendor arrangements are handled under strict bilateral confidentiality. Information is disclosed solely on a need-to-know basis to fulfill assigned operational mandates.
              </p>
              <p>
                <strong>2. Zero Multi-Client Cross Exposure:</strong> BEUA enforces segregated coordinator silos. Client records, itineraries, and credentials are protected with 256-bit AES encryption at rest and in transit. No client data is ever processed for marketing, profiling, or algorithmic model training.
              </p>
              <p>
                <strong>3. Digital Vaults & Retention:</strong> Client credentials (such as airline frequent flier accounts, private club memberships, and estate gate codes) are secured in dedicated hardware-encrypted vaults. Records may be purged immediately upon client request or termination of the retainer agreement.
              </p>
              <p>
                <strong>4. Direct Liaison & Escalation:</strong> For inquiries regarding regulatory data rights or custom non-disclosure instruments, contact the Private Office Directorate at <span className="font-mono text-[#16382c]">compliance@beua-support.com</span>.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#16382c] font-semibold">
              <FileText className="w-4 h-4" />
              <span>BEUA Commercial Practice</span>
            </div>
            <h3 className="font-serif text-3xl text-[#14231e]">
              Terms of Engagement & Retainers
            </h3>
            <p className="text-xs font-mono text-[#717b75]">
              Standard Advisory Framework • Mayfair & St James's London W1
            </p>

            <div className="space-y-3 text-xs text-[#4d5751] font-sans leading-relaxed pt-2">
              <p>
                <strong>1. Retainer Allocations & Capacity:</strong> BEUA guarantees an advisor-to-principal ratio of no more than 1:4. Retainer allocations represent dedicated monthly hours reserved for the client's continuous oversight.
              </p>
              <p>
                <strong>2. Rollover & Flexibility:</strong> Up to 25% of unused monthly retainer hours may roll over to the subsequent consecutive billing cycle. Retainers operate on flexible monthly agreements and may be adjusted or paused with 14 calendar days' notice.
              </p>
              <p>
                <strong>3. Vendor Management & Direct Expenses:</strong> Out-of-pocket disbursements, contractor invoices, flights, and procurement costs remain direct obligations of the principal or are managed via pre-approved dedicated corporate charge cards. BEUA accepts zero hidden vendor rebates or commissions.
              </p>
              <p>
                <strong>4. Governing Law:</strong> These terms and all individual client service briefs are governed exclusively by the laws of England and Wales.
              </p>
            </div>
          </div>
        )}

        <div className="pt-6 mt-6 border-t border-[#e2ddd0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#16382c] text-white text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#1f483b] cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
