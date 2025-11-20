import PartnerDetailsPage from "@/components/bpartner/PartnerDetailsPage";
import { notFound } from "next/navigation";


interface PartnerDetailsProps {
  params: Promise<{
    slug: string;
  }>;
}

export const metadata = {
  title: "Partner Verification Details | VisitNakuru",
  description: "Detailed review page for a specific business partner.",
};


export default async function PartnerDetailsRoute({ params }: PartnerDetailsProps) {
  
  
  const { slug } = await params;
  const partnerId = parseInt(slug, 10);

  if (isNaN(partnerId)) {
    notFound();
  }

  return (
    <PartnerDetailsPage partnerId={partnerId} />
  );
}