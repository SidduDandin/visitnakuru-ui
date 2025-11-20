import PartnerVerifiedList from "@/components/bpartner/activepartner"; 

export const metadata = {
  title: "Verified Business Partners | VisitNakuru",
  description: "Manage verified business partners.",
};

export default function PartnerVerificationPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Verified Business Partners
      </h2>
      <PartnerVerifiedList />
    </div>
  );
}