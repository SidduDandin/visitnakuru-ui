import ContactList from "@/components/contact/ContactList";

export const metadata = {
  title: "Contacts Received | Invest In Nakuru",
  description: "Admin contact us messages",
};

export default function ContactPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Contacts Received
      </h2>
      <ContactList />
    </div>
  );
}
