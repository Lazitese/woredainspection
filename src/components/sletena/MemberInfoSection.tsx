'use client';

import React, { useEffect } from 'react';
import { MembershipLevel } from '@/types/sletena';
import { useWoreda } from '@/providers/woreda-provider';
import { IconUserCheck, IconId, IconPhone, IconUser, IconBuildingStore, IconMapPin } from '@tabler/icons-react';

interface MemberInfoSectionProps {
  memberId: string;
  memberName: string;
  contact: string;
  membershipLevel: MembershipLevel;
  region: string;
  zone: string;
  woreda?: string;
  maxWoredas?: number;
  onChange: (fields: Partial<{
    memberId: string;
    memberName: string;
    contact: string;
    membershipLevel: MembershipLevel;
    region: string;
    zone: string;
    woreda: string;
  }>) => void;
}

const MEMBERSHIP_LEVEL_OPTIONS: { label: string; value: MembershipLevel }[] = [
  { label: 'አባል', value: 'Abal' },
  { label: 'የቤተሰብ አመራር', value: 'Yebeteseb_Amerar' },
  { label: 'የህብረት አመራር', value: 'Yehbret_Amerar' },
  { label: 'የበታች አመራር', value: 'Yebatach_Amerar' },
  { label: 'መካከለኛ አመራር', value: 'Mekakelegna_Amerar' },
  { label: 'ከፍተኛ አመራር', value: 'Keftegna_Amerar' },
];

export const MemberInfoSection: React.FC<MemberInfoSectionProps> = ({
  memberId,
  memberName,
  contact,
  membershipLevel,
  region,
  zone,
  woreda = '',
  onChange,
}) => {
  const { woreda: activeWoreda } = useWoreda();

  useEffect(() => {
    if (!region || region !== activeWoreda.name) {
      onChange({ region: activeWoreda.name });
    }
  }, [activeWoreda.name, region, onChange]);

  return (
    <div className="bg-surface-primary border border-border/50 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/40">
        <IconUserCheck className="text-brand-blue" size={20} />
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
          1. ጥሬ ሃቅ
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Member ID */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1 flex items-center gap-1.5">
            <IconId size={15} className="text-text-muted" /> የመለያ ቁጥር (Member ID)
          </label>
          <input
            type="text"
            placeholder="ምሳሌ: MEM-9021"
            value={memberId}
            onChange={(e) => onChange({ memberId: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-surface-secondary/50 border border-border/50 rounded-xl text-text-primary focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1 flex items-center gap-1.5">
            <IconUser size={15} className="text-text-muted" /> ሙሉ ስም
          </label>
          <input
            type="text"
            placeholder="ምሳሌ: ዳዊት አበበ"
            value={memberName}
            onChange={(e) => onChange({ memberName: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-surface-secondary/50 border border-border/50 rounded-xl text-text-primary focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1 flex items-center gap-1.5">
            <IconPhone size={15} className="text-text-muted" /> ስልክ ቁጥር
          </label>
          <input
            type="text"
            placeholder="ምሳሌ: 0911223344"
            value={contact}
            onChange={(e) => onChange({ contact: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-surface-secondary/50 border border-border/50 rounded-xl text-text-primary focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Membership Level */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">
            ሀላፊነት ደረጃ
          </label>
          <select
            value={membershipLevel}
            onChange={(e) => onChange({ membershipLevel: e.target.value as MembershipLevel })}
            className="w-full px-3 py-2 text-xs bg-surface-secondary/50 border border-border/50 rounded-xl text-text-primary focus:outline-none focus:border-brand-blue"
          >
            {MEMBERSHIP_LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Locked Woreda */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-text-secondary mb-1 flex items-center gap-1.5">
            <IconBuildingStore size={15} className="text-text-muted" /> ወረዳ
          </label>
          <div className="flex items-center justify-between px-3.5 py-2 text-xs bg-amber-50/70 border border-amber-200/80 rounded-xl text-slate-900 font-semibold">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-500" />
              <span>{activeWoreda.organizationName}</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
              {activeWoreda.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
