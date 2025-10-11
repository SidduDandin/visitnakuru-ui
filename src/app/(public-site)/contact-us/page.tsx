"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

type ContactFormInputs = {
  ContactName: string;
  ContactEmail: string;
  ContactPhoneNumber: string;
  ContactSubject: string;
  ContactMessage: string;
};

type NewsletterFormInputs = {
  EmailAddress: string;
};

type ApiResponse = {
  msg?: string;
  [key: string]: unknown;
};

export default function ContactPage() {
  const router = useRouter();
  // Initialize the translation function 't' and access 'i18n' for language change
  const { t, i18n } = useTranslation();

  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const [contactLoading, setContactLoading] = useState(false);

  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const {
    register: registerContact,
    handleSubmit: handleSubmitContact,
    formState: { errors: contactErrors },
    reset: resetContact,
    trigger: triggerContact, 
  } = useForm<ContactFormInputs>();

  const {
    register: registerNewsletter,
    handleSubmit: handleSubmitNewsletter,
    formState: { errors: newsletterErrors },
    reset: resetNewsletter,
    trigger: triggerNewsletter, 
  } = useForm<NewsletterFormInputs>();

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;


  useEffect(() => {
    if (contactStatus) {
      const timer = setTimeout(() => setContactStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [contactStatus]);


  useEffect(() => {
    if (newsletterStatus) {
      const timer = setTimeout(() => setNewsletterStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [newsletterStatus]);

  // EFFECT TO HANDLE LANGUAGE CHANGE AND RE-VALIDATION
  useEffect(() => {
    // If there are any contact form errors, force re-validation to update message language
    if (Object.keys(contactErrors).length > 0) {
      triggerContact();
    }

    // If there are any newsletter form errors, force re-validation to update message language
    if (Object.keys(newsletterErrors).length > 0) {
      triggerNewsletter();
    }

  // Re-run this effect whenever the language changes or error objects/triggers change
  }, [i18n.language, triggerContact, contactErrors, triggerNewsletter, newsletterErrors]);


  const onSubmitContact: SubmitHandler<ContactFormInputs> = async (data) => {
    setContactLoading(true);
    setContactStatus(null);

    try {
      const contacturl = `${baseUrl}/api/contacts`;
      const res = await fetch(contacturl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 404) {
        router.push("/error-404");
        return;
      }

      if (res.status >= 500) {
        router.push("/error-505");
        return;
      }

      const text = await res.text();
      let responseData: ApiResponse = {};
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { msg: text };
        console.warn("Response is not JSON:", text);
      }

      if (res.ok) {
        setContactStatus(t("contactPage.successMessage") || "Message sent successfully!");
        resetContact();
      } else {
        setContactStatus(responseData?.msg || t("contactPage.failureMessage") || "Failed to send message.");
      }
    } catch (err) {
      console.error(err);
        router.push("/error-505");
      setContactStatus(t("contactPage.serverError") || "Server error. Please try again.");
    } finally {
      setContactLoading(false);
    }
  };

const onSubmitNewsletter: SubmitHandler<NewsletterFormInputs> = async (
  data
) => {
  setNewsletterLoading(true);
  setNewsletterStatus(null);

  try {
    const letterurl = `${baseUrl}/api/newslettersubscriber`;
    const res = await fetch(letterurl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });


    if (res.status === 404) {
        router.push("/error-404");
        return;
      }

      if (res.status >= 500) {
        router.push("/error-505");
        return;
      }

    const text = await res.text();
    let responseData: ApiResponse = {};
    try {
      responseData = JSON.parse(text);
    } catch {
      responseData = { msg: text };
      console.warn("Response is not JSON:", text);
    }

    if (res.ok) {
      setNewsletterStatus(t("newsletter.successMessage") || "Subscribed successfully!");
      resetNewsletter(); 
    } else {
      const alreadySubscribedApiMsg = "This email is already subscribed to the newsletter.";

      
      if (responseData?.msg === alreadySubscribedApiMsg) {
        setNewsletterStatus(t("newsletter.alreadySubscribed") || alreadySubscribedApiMsg);
      } else {
        setNewsletterStatus(responseData?.msg || t("newsletter.failureMessage") || "Failed to subscribe.");
      }

      resetNewsletter();
    }
  } catch (err) {
    console.error(err);
    setNewsletterStatus(t("newsletter.serverError") || "Server error. Please try again.");
    resetNewsletter(); 
  } finally {
    setNewsletterLoading(false);
  }
};


  return (
    <>

      <section className="bg-gray-100 text-gray-800 py-11">
        <div className="container mx-auto text-center px-4">
       
          <h1 className="text-4xl font-bold mb-4">{t("mobileNav.contactUs") || "Contact Us"}</h1>
          <p className="text-lg max-w-2xl mx-auto">
           
            {t("contactPage.introText") || "We're here to help. Reach out to us with your questions or to start your investment journey."}
          </p>
        </div>
      </section>


      <div className="md:py-[90px] py-[60px] bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <form
              className="contact-form grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
              onSubmit={handleSubmitContact(onSubmitContact)}
            >

              <div className="form-group">
                <label htmlFor="ContactName" className="form-label">
                 
                  {t("contactPage.form.fullName") || "Full Name"}
                </label>
                <input
                  type="text"
                  id="ContactName"
                  className="input-field"
                  placeholder={t("contactPage.form.fullNamePlaceholder") || "John Doe"}
                  {...registerContact("ContactName", {
            
                    required: t("contactPage.form.validation.nameRequired") || "Please enter full name.",
                  })}
                />
                {contactErrors.ContactName && (
                  <p className="text-red-600 mt-1">
                    {contactErrors.ContactName.message}
                  </p>
                )}
              </div>


              <div className="form-group">
                <label htmlFor="ContactEmail" className="form-label">
   
                  {t("contactPage.form.email") || "Email Address"}
                </label>
                <input
                  type="email"
                  id="ContactEmail"
                  className="input-field"
                  placeholder={t("contactPage.form.emailPlaceholder") || "you@example.com"}
                  {...registerContact("ContactEmail", {
                
                    required: t("contactPage.form.validation.emailRequired") || "Please enter email address.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    
                      message: t("contactPage.form.validation.emailInvalid") || "Invalid email address",
                    },
                  })}
                />
                {contactErrors.ContactEmail && (
                  <p className="text-red-600 mt-1">
                    {contactErrors.ContactEmail.message}
                  </p>
                )}
              </div>


              <div className="form-group">
                <label htmlFor="ContactPhoneNumber" className="form-label">
               
                  {t("contactPage.form.phone") || "Phone Number"}
                </label>
                <input
                  type="tel"
                  id="ContactPhoneNumber"
                  className="input-field"
                  placeholder={t("contactPage.form.phonePlaceholder") || "0712000000"}
                  {...registerContact("ContactPhoneNumber", {
               
                    required: t("contactPage.form.validation.phoneRequired") || "Please enter phone number",
                    pattern: {
                      value: /^[0-9]{10}$/,
                    
                      message: t("contactPage.form.validation.phoneInvalid") || "Phone number must be exactly 10 digits",
                    },
                  })}
                />
                {contactErrors.ContactPhoneNumber && (
                  <p className="text-red-600 mt-1">
                    {contactErrors.ContactPhoneNumber.message}
                  </p>
                )}
              </div>

          
              <div className="form-group">
                <label htmlFor="ContactSubject" className="form-label">
                
                  {t("contactPage.form.subject") || "Subject"}
                </label>
                <input
                  type="text"
                  id="ContactSubject"
                  className="input-field"
                  placeholder={t("contactPage.form.subjectPlaceholder") || "Visit Inquiry"}
                  {...registerContact("ContactSubject", {
                 
                    required: t("contactPage.form.validation.subjectRequired") || "Please enter subject.",
                  })}
                />
                {contactErrors.ContactSubject && (
                  <p className="text-red-600 mt-1">
                    {contactErrors.ContactSubject.message}
                  </p>
                )}
              </div>

              <div className="form-group md:col-span-2">
                <label htmlFor="ContactMessage" className="form-label">
                  {t("contactPage.form.message") || "Message"}
                </label>
                <textarea
                  id="ContactMessage"
                  rows={5}
                  className="input-field"
                  placeholder={t("contactPage.form.messagePlaceholder") || "Tell us more about your needs..."}
                  {...registerContact("ContactMessage", {
                    required: t("contactPage.form.validation.messageRequired") || "Please enter message.",
                  })}
                ></textarea>
                {contactErrors.ContactMessage && (
                  <p className="text-red-600 mt-1">
                    {contactErrors.ContactMessage.message}
                  </p>
                )}
              </div>

              <div className="text-center md:col-span-2 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary px-12 py-4 text-lg"
                  disabled={contactLoading}
                >
                  {contactLoading ? (t("contactPage.form.sending") || "Sending...") : (t("contactPage.form.submit") || "Submit Message")}
                </button>
                {contactStatus && (
                  <p className="mt-2 text-green-600">{contactStatus}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="py-16 bg-secondary text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
             <h2 className="mb-4 text-2xl font-bold">{t("newsletter.title") || "Stay Updated"}</h2>
              <p className="mb-8">
               {t("newsletter.description") || "Subscribe to our newsletter for the latest investment news, project updates, and events in Nakuru County."}
             </p>
            <form
              className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto"
              onSubmit={handleSubmitNewsletter(onSubmitNewsletter)}
            >
              <input
                type="email"
                placeholder={t("newsletter.placeholder") || "Enter your email address"}
                className="input-field flex-grow"
                {...registerNewsletter("EmailAddress", {
                   required: t("contactPage.form.validation.emailRequired") || "Please enter email address.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("contactPage.form.validation.emailInvalid") || "Invalid email address",
                  },
                })}
              />
              <button
                type="submit"
                className="btn btn-primary px-8"
                disabled={newsletterLoading}
              >
                {newsletterLoading ? (t("newsletter.subscribing") || "Subscribing...") : (t("newsletter.subscribe") || "Subscribe")}
              </button>
            </form>
            {newsletterErrors.EmailAddress && (
              <p className="text-red-200 mt-2">
                {newsletterErrors.EmailAddress.message}
              </p>
            )}
            {newsletterStatus && (
              <p className="mt-2 text-green-200">{newsletterStatus}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}