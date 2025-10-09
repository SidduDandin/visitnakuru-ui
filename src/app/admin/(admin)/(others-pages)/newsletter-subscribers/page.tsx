import NewsletterList from "@/components/newslettersubscriber/newsletter";

export const metadata = {
  title: "Newsletter Subscribers | Invest In Nakuru",
  description: "Admin newsletter subscribers",
};


export default function NewslettersubscriberPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Newsletter Subscribers
      </h2>
      <NewsletterList />
    </div>
  );
}
