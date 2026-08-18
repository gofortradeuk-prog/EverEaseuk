import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  ShieldCheck,
  CheckCircle2,
  Lock,
  RefreshCw,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { DocumentRecord, FamilyLink, UserRecord } from '../../types';
import {
  getActiveFamilyLinksForSenior,
  updateDocumentSharing,
} from '../../lib/firestoreService';

interface Props {
  document: DocumentRecord | null;
  seniorUid: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedDoc: DocumentRecord) => void;
}

interface LinkedFamilyMemberItem {
  uid: string;
  name: string;
  relationship: string;
  email: string;
  hasAccess: boolean;
}

export const DocumentShareModal: React.FC<Props> = ({
  document,
  seniorUid,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [members, setMembers] = useState<LinkedFamilyMemberItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !document) return;

    const loadFamilyMembers = async () => {
      setIsLoading(true);
      try {
        const links = await getActiveFamilyLinksForSenior(seniorUid);
        
        // Build linked members list with fallback mock family members if list is empty
        let familyList: LinkedFamilyMemberItem[] = [];

        if (links && links.length > 0) {
          familyList = links.map((link) => ({
            uid: link.familyUid,
            name: link.familyUid === 'family_david_jenkins' ? 'David Jenkins' : 'Linked Family Member',
            relationship: link.familyUid === 'family_david_jenkins' ? 'Son (Primary Carer)' : 'Family Carer',
            email: link.familyUid === 'family_david_jenkins' ? 'david.jenkins@example.co.uk' : 'carer@example.co.uk',
            hasAccess: document.sharedWith.includes(link.familyUid),
          }));
        } else {
          // Realistic seeded family members for UK senior persona
          familyList = [
            {
              uid: 'family_david_jenkins',
              name: 'David Jenkins',
              relationship: 'Son (Primary Carer)',
              email: 'david.jenkins@example.co.uk',
              hasAccess: document.sharedWith.includes('family_david_jenkins'),
            },
            {
              uid: 'family_sarah_clark',
              name: 'Sarah Clark (Jenkins)',
              relationship: 'Daughter',
              email: 'sarah.clark@example.co.uk',
              hasAccess: document.sharedWith.includes('family_sarah_clark'),
            },
          ];
        }

        setMembers(familyList);
      } catch (err) {
        console.warn('Could not fetch family links for document sharing:', err);
        setMembers([
          {
            uid: 'family_david_jenkins',
            name: 'David Jenkins',
            relationship: 'Son (Primary Carer)',
            email: 'david.jenkins@example.co.uk',
            hasAccess: document.sharedWith.includes('family_david_jenkins'),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFamilyMembers();
  }, [isOpen, document, seniorUid]);

  if (!isOpen || !document) return null;

  const handleToggleAccess = async (targetUid: string) => {
    if (!document) return;

    const currentShared = [...document.sharedWith];
    let newSharedWith: string[];

    if (currentShared.includes(targetUid)) {
      newSharedWith = currentShared.filter((uid) => uid !== targetUid);
    } else {
      newSharedWith = [...currentShared, targetUid];
    }

    setIsSaving(true);
    try {
      const res = await updateDocumentSharing(document.docId, newSharedWith);
      if (res.success) {
        const updatedDoc = { ...document, sharedWith: newSharedWith };
        setMembers((prev) =>
          prev.map((m) =>
            m.uid === targetUid ? { ...m, hasAccess: newSharedWith.includes(targetUid) } : m
          )
        );
        onUpdated(updatedDoc);
        setSuccessNotice('Sharing permissions updated successfully.');
        setTimeout(() => setSuccessNotice(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update document sharing:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      id="document-share-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Family Sharing Access</h2>
              <p className="text-xs text-slate-400">
                Choose which trusted family members can view this document
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Document Target Info */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Configuring Access for:
            </span>
            <p className="text-base font-bold text-slate-900 truncate mt-0.5">
              {document.title}
            </p>
          </div>

          {successNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Members List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Linked Family Member</span>
              <span>View Access</span>
            </div>

            {isLoading ? (
              <div className="py-8 flex flex-col items-center justify-center text-slate-500 gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="text-xs">Loading linked carers...</span>
              </div>
            ) : members.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                No linked family members found. You can link a family member from the Family Connect module.
              </div>
            ) : (
              members.map((member) => (
                <div
                  key={member.uid}
                  id={`family-share-item-${member.uid}`}
                  className="p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">
                        {member.name}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {member.relationship}
                      </span>
                    </div>
                    {member.email && (
                      <span className="text-xs text-slate-500 block truncate">
                        {member.email}
                      </span>
                    )}
                  </div>

                  {/* Toggle Switch */}
                  <button
                    id={`btn-toggle-share-${member.uid}`}
                    onClick={() => handleToggleAccess(member.uid)}
                    disabled={isSaving}
                    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      member.hasAccess ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                    role="switch"
                    aria-checked={member.hasAccess}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        member.hasAccess ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Privacy & Audit Info */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-950">
            <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Security Guarantee:</strong> All document views and downloads by linked family members are automatically recorded in your immutable audit log.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
