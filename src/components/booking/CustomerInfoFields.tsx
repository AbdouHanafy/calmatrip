import { User } from "lucide-react";

interface CustomerInfoFieldsProps {
  customerName: string;
  onCustomerNameChange: (value: string) => void;
  customerEmail: string;
  onCustomerEmailChange: (value: string) => void;
  customerPhone: string;
  onCustomerPhoneChange: (value: string) => void;
  specialRequests: string;
  onSpecialRequestsChange: (value: string) => void;
}

export function CustomerInfoFields({
  customerName,
  onCustomerNameChange,
  customerEmail,
  onCustomerEmailChange,
  customerPhone,
  onCustomerPhoneChange,
  specialRequests,
  onSpecialRequestsChange,
}: CustomerInfoFieldsProps) {
  return (
    <div className="bg-gray-50/70 rounded-2xl p-6 space-y-4 border-2 border-gray-100/50">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
        <User className="w-4 h-4 text-[#87CEEB]" />
        Contact Information
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1.5">Full Name</label>
          <input
            required
            placeholder="John Doe"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB]/20 outline-none transition-all bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1.5">Email</label>
          <input
            required
            type="email"
            placeholder="john@example.com"
            value={customerEmail}
            onChange={(e) => onCustomerEmailChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB]/20 outline-none transition-all bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1.5">Phone</label>
          <input
            required
            type="tel"
            placeholder="+44 6 00 00 00 00"
            value={customerPhone}
            onChange={(e) => onCustomerPhoneChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB]/20 outline-none transition-all bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1.5">Special Requests</label>
          <textarea
            placeholder="Any special requests?"
            value={specialRequests}
            onChange={(e) => onSpecialRequestsChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB]/20 outline-none transition-all bg-white"
          />
        </div>
      </div>
    </div>
  );
}
