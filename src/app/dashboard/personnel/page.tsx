'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { 
  IconUserPlus, 
  IconSearch, 
  IconBuilding, 
  IconEdit, 
  IconTrash, 
  IconArchive, 
  IconArrowLeft,
  IconUserCheck,
  IconUsers,
  IconAward
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { personnelService } from "@/services/personnel";
import { Personnel } from "@/types";
import Image from "next/image";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useWoreda } from "@/providers/woreda-provider";

function getRegionRank(regionStr?: string): number {
  if (!regionStr) return 999;
  const str = regionStr.trim();
  if (str.includes('ወረዳ 1') && !str.includes('ወረዳ 10') && !str.includes('ወረዳ 12') && !str.includes('ወረዳ 13') && !str.includes('ልዩ')) return 1;
  if (str.includes('ወረዳ 2') && !str.includes('ልዩ')) return 2;
  if (str.includes('ወረዳ 3') && !str.includes('ልዩ')) return 3;
  if (str.includes('ወረዳ 4') && !str.includes('ልዩ')) return 4;
  if (str.includes('ወረዳ 5') && !str.includes('ልዩ')) return 5;
  if (str.includes('ወረዳ 6')) return 6;
  if (str.includes('ወረዳ 7')) return 7;
  if (str.includes('ወረዳ 8')) return 8;
  if (str.includes('ወረዳ 9')) return 9;
  if (str.includes('ወረዳ 10')) return 10;
  if (str.includes('ወረዳ 12')) return 11;
  if (str.includes('ወረዳ 13')) return 12;
  if (str.includes('ልዩ ወረዳ')) return 13;
  return 999;
}

function getLeadershipRank(nameStr?: string): number {
  if (!nameStr) return 999;
  const str = nameStr.trim();
  if (str.includes('ፈይሳ')) return 1;
  if (str.includes('የሺ')) return 2;
  if (str.includes('አህመድ')) return 3;
  if (str.includes('ሀብለወርቅ')) return 4;
  return 999;
}

function getCommissionMemberRank(nameStr?: string): number {
  if (!nameStr) return 999;
  const str = nameStr.trim();
  if (str.includes('ፈይሳ')) return 1;
  if (str.includes('የሺ')) return 2;
  if (str.includes('አህመድ')) return 3;
  if (str.includes('መስታወት')) return 4;
  if (str.includes('በየነ')) return 5;
  if (str.includes('ብሩክ')) return 6;
  if (str.includes('ተመስገን')) return 7;
  if (str.includes('ደረጄ')) return 8;
  if (str.includes('ሰላማዊት')) return 9;
  return 999;
}

type CategoryTab = 'all' | 'deputy-chairperson' | 'chairperson-secretary' | 'leadership-members' | 'committee-members';

export default function PersonnelPage() {
  const { activeWoreda, createWoredaUrl } = useWoreda();
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    idToDelete: string | null;
  }>({ isOpen: false, idToDelete: null });

  const fetchPersonnel = async () => {
    setLoading(true);
    try {
      const data = await personnelService.getPersonnel();
      setPersonnel(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const handleDelete = (id: string) => {
    setConfirmDialog({ isOpen: true, idToDelete: id });
  };

  const confirmDelete = async () => {
    if (confirmDialog.idToDelete) {
      await personnelService.deletePersonnel(confirmDialog.idToDelete);
      setConfirmDialog({ isOpen: false, idToDelete: null });
      fetchPersonnel();
    }
  };

  const matchesSearch = (p: Personnel) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    return (
      (p.nameAm || '').toLowerCase().includes(q) ||
      (p.name || '').toLowerCase().includes(q) ||
      (p.positionAm || '').toLowerCase().includes(q) ||
      (p.position || '').toLowerCase().includes(q) ||
      (p.region || '').toLowerCase().includes(q) ||
      (p.phone || '').includes(q)
    );
  };

  const activePersonnel = personnel.filter(p => p.status !== 'Archived' && matchesSearch(p));
  const archivedPersonnel = personnel.filter(p => p.status === 'Archived' && matchesSearch(p));

  // 1. ም/ሰብሳቢ (Deputy Chairperson)
  const deputyChairperson = activePersonnel.filter(p =>
    p.officeCategory?.includes('deputy-chairperson') || 
    p.officeCategoryAm === 'ም/ሰብሳቢ' || 
    p.positionAm?.includes('ም/ሰብሳቢ') || 
    p.positionAm?.includes('ምክትል ሰብሳቢ')
  );

  // 2. ሰብሳቢና ፀሀፊ (Chairperson & Secretary)
  const chairpersonSecretary = activePersonnel.filter(p =>
    p.officeCategory?.includes('chairperson-secretary') || 
    p.officeCategoryAm === 'ሰብሳቢና ፀሀፊ' || 
    p.positionAm?.includes('ሰብሳቢና ፀሀፊ') || 
    p.positionAm?.includes('ሰብሳቢ ፀሀፊ')
  );

  // 3. አመራር አባላት (Leadership Members)
  const leadershipMembers = activePersonnel
    .filter(p =>
      p.officeCategory?.includes('leadership-members') || 
      p.officeCategoryAm?.includes('አመራር') ||
      p.positionAm?.includes('አመራር')
    )
    .sort((a, b) => getLeadershipRank(a.nameAm || a.name) - getLeadershipRank(b.nameAm || b.name));

  // 4. ኮሚቴ አባላት (Committee Members)
  const committeeMembers = activePersonnel
    .filter(p =>
      p.officeCategory?.includes('committee-members') || 
      p.officeCategoryAm?.includes('ኮሚቴ') || 
      p.positionAm?.includes('ኮሚቴ')
    )
    .sort((a, b) => getCommissionMemberRank(a.nameAm || a.name) - getCommissionMemberRank(b.nameAm || b.name));

  const CATEGORY_TABS: { id: CategoryTab; label: string; count: number }[] = [
    { id: 'all', label: 'ሁሉም', count: activePersonnel.length },
    { id: 'deputy-chairperson', label: 'ም/ሰብሳቢ', count: deputyChairperson.length },
    { id: 'chairperson-secretary', label: 'ሰብሳቢና ፀሀፊ', count: chairpersonSecretary.length },
    { id: 'leadership-members', label: 'አመራር አባላት', count: leadershipMembers.length },
    { id: 'committee-members', label: 'ኮሚቴ አባላት', count: committeeMembers.length },
  ];

  const PersonnelCard = ({ person }: { person: Personnel }) => (
    <div className="bg-surface-primary/50 border border-border/30 rounded-2xl p-6 flex flex-col gap-4 hover:border-brand-blue/30 transition-colors shadow-sm relative group">
      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-100 transition-opacity">
        <Link href={createWoredaUrl(`/dashboard/personnel/${person.id}`)} className="p-2 bg-surface-primary text-text-muted hover:text-brand-blue border border-border/50 rounded-lg shadow-sm transition-colors" title="አስተካክል">
          <IconEdit size={16} />
        </Link>
        <button onClick={() => handleDelete(person.id)} className="p-2 bg-surface-primary text-text-muted hover:text-danger border border-border/50 rounded-lg shadow-sm transition-colors" title="አጥፋ">
          <IconTrash size={16} />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          {person.photo ? (
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-[3px] border-surface-primary shadow-lg relative ring-1 ring-border/20">
              <Image src={person.photo} alt={person.nameAm || person.name} fill className="object-cover object-top" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-surface-secondary to-surface-primary border-2 border-border/30 flex items-center justify-center font-bold text-text-primary text-3xl shadow-sm">
              {(person.nameAm || person.name).charAt(0)}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 pr-16">
          <h3 className="font-bold text-text-primary text-lg line-clamp-1">{person.nameAm || person.name}</h3>
          <p className="text-sm text-brand-blue font-semibold">
            {person.region && !person.positionAm?.includes(person.region)
              ? `የ${person.region} ኮሚሽን ቅ/ጽ/ቤት ኃላፊ`
              : person.positionAm || person.position}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-border/20"></div>

      <div className="flex flex-col gap-2 text-xs text-text-secondary">
        <div className="flex justify-between">
          <span className="text-text-muted">መምሪያ/ክፍል:</span>
          <span className="font-medium text-text-primary truncate max-w-[170px] text-right">{person.department || '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">ስልክ:</span>
          <span className="font-medium text-text-primary">{person.phone || '-'}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-text-muted">ሁኔታ:</span>
          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${person.status === 'Active' ? 'bg-success/10 text-success' : person.status === 'Archived' ? 'bg-slate-100 text-slate-500' : 'bg-warning/10 text-warning'}`}>
            {person.status === 'Active' ? 'ገቢር' : person.status === 'Archived' ? 'መዝገብ (Archived)' : person.status}
          </span>
        </div>
        {person.status === 'Archived' && person.archived_at && (
          <div className="flex justify-between mt-1">
            <span className="text-text-muted">የተመዘገበበት ቀን:</span>
            <span className="font-medium text-text-primary text-[10px]">{new Date(person.archived_at).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 h-full max-w-7xl mx-auto pb-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-light text-text-primary tracking-tight">የአመራር አካላት</h1>
            <p className="text-sm text-text-muted mt-1">የአመራር እና የኮሚቴ አባላት መረጃ አስተዳደር በየምድቡ</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <IconSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="በስም ወይም በወረዳ ፈልግ..." 
                className="w-full bg-surface-primary/50 border border-border/30 rounded-full pl-11 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-blue/50 transition-colors backdrop-blur-sm" 
              />
            </div>
            {activeTab === 'active' ? (
              <button onClick={() => setActiveTab('archived')} className="flex items-center gap-2 bg-surface-primary hover:bg-surface-secondary text-text-secondary border border-border/30 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm shrink-0">
                <IconArchive size={18} />
                መዝገብ
              </button>
            ) : (
              <button onClick={() => setActiveTab('active')} className="flex items-center gap-2 bg-surface-primary hover:bg-surface-secondary text-text-secondary border border-border/30 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm shrink-0">
                <IconArrowLeft size={18} />
                ተመለስ
              </button>
            )}
            <Link href={createWoredaUrl('/dashboard/personnel/create')} className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm shrink-0">
              <IconUserPlus size={18} />
              አዲስ አባል
            </Link>
          </div>
        </div>

        {/* Category Pills (Active view only) */}
        {activeTab === 'active' && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border/20 pb-4">
            {CATEGORY_TABS.map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-brand-blue text-white shadow-sm"
                      : "bg-surface-primary/70 text-text-secondary border border-border/30 hover:bg-surface-secondary"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 text-[11px] rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-surface-secondary text-text-muted'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center h-48 text-text-muted text-sm">በማምጣት ላይ...</div>
        ) : activeTab === 'active' ? (
          <div className="flex flex-col gap-8">
            {/* 1. ም/ሰብሳቢ */}
            {(selectedCategory === 'all' || selectedCategory === 'deputy-chairperson') && (
              <div className="bg-surface-primary/30 rounded-[2rem] border border-border/20 p-8 backdrop-blur-md flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                    <IconAward size={18} className="text-brand-blue" />
                    ም/ሰብሳቢ (Deputy Chairperson)
                  </h2>
                  <span className="text-xs font-semibold text-text-muted bg-surface-secondary px-3 py-1 rounded-full">
                    {deputyChairperson.length} አባል
                  </span>
                </div>
                <div className="w-full h-[1px] bg-border/20"></div>
                {deputyChairperson.length === 0 ? (
                  <div className="text-sm text-text-muted py-6 text-center">ምንም መረጃ አልተገኘም</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deputyChairperson.map(p => <PersonnelCard key={p.id} person={p} />)}
                  </div>
                )}
              </div>
            )}

            {/* 2. ሰብሳቢና ፀሀፊ */}
            {(selectedCategory === 'all' || selectedCategory === 'chairperson-secretary') && (
              <div className="bg-surface-primary/30 rounded-[2rem] border border-border/20 p-8 backdrop-blur-md flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                    <IconUserCheck size={18} className="text-brand-blue" />
                    ሰብሳቢና ፀሀፊ (Chairperson & Secretary)
                  </h2>
                  <span className="text-xs font-semibold text-text-muted bg-surface-secondary px-3 py-1 rounded-full">
                    {chairpersonSecretary.length} አባል
                  </span>
                </div>
                <div className="w-full h-[1px] bg-border/20"></div>
                {chairpersonSecretary.length === 0 ? (
                  <div className="text-sm text-text-muted py-6 text-center">ምንም መረጃ አልተገኘም</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chairpersonSecretary.map(p => <PersonnelCard key={p.id} person={p} />)}
                  </div>
                )}
              </div>
            )}

            {/* 3. አመራር አባላት */}
            {(selectedCategory === 'all' || selectedCategory === 'leadership-members') && (
              <div className="bg-surface-primary/30 rounded-[2rem] border border-border/20 p-8 backdrop-blur-md flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                    <IconUsers size={18} className="text-brand-blue" />
                    አመራር አባላት (Leadership Members)
                  </h2>
                  <span className="text-xs font-semibold text-text-muted bg-surface-secondary px-3 py-1 rounded-full">
                    {leadershipMembers.length} አባላት
                  </span>
                </div>
                <div className="w-full h-[1px] bg-border/20"></div>
                {leadershipMembers.length === 0 ? (
                  <div className="text-sm text-text-muted py-6 text-center">ምንም መረጃ አልተገኘም</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leadershipMembers.map(p => <PersonnelCard key={p.id} person={p} />)}
                  </div>
                )}
              </div>
            )}

            {/* 4. ኮሚቴ አባላት */}
            {(selectedCategory === 'all' || selectedCategory === 'committee-members') && (
              <div className="bg-surface-primary/30 rounded-[2rem] border border-border/20 p-8 backdrop-blur-md flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                    <IconUsers size={18} className="text-brand-blue" />
                    ኮሚቴ አባላት (Committee Members)
                  </h2>
                  <span className="text-xs font-semibold text-text-muted bg-surface-secondary px-3 py-1 rounded-full">
                    {committeeMembers.length} አባላት
                  </span>
                </div>
                <div className="w-full h-[1px] bg-border/20"></div>
                {committeeMembers.length === 0 ? (
                  <div className="text-sm text-text-muted py-6 text-center">ምንም መረጃ አልተገኘም</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {committeeMembers.map(p => <PersonnelCard key={p.id} person={p} />)}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="bg-surface-primary/30 rounded-[2rem] border border-border/20 p-8 backdrop-blur-md flex flex-col gap-6">
              <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                <IconBuilding size={16} />
                የቀድሞ አመራሮች (Archived Leaders)
              </h2>
              <div className="w-full h-[1px] bg-border/20"></div>
              {archivedPersonnel.length === 0 ? (
                <div className="text-sm text-text-muted py-8 text-center">ምንም መዝገብ አልተገኘም</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {archivedPersonnel.map(p => <PersonnelCard key={p.id} person={p} />)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title="መረጃ ማጥፋት"
        message="እርግጠኛ ነዎት ይህን መረጃ ማጥፋት ይፈልጋሉ?"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, idToDelete: null })}
      />
    </DashboardLayout>
  );
}
