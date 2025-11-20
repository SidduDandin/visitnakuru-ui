import PartnerVerificationList from "@/components/bpartner/PartnerVerificationList"; 

export const metadata = {
  title: "Onboarding Business Partners | VisitNakuru",
  description: "Manage onboarding and document verification for business partners.",
};

export default function PartnerVerificationPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Onboarding Business Partners
      </h2>
      <PartnerVerificationList />
    </div>
  );
}