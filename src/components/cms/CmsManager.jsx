// 'use client';

// import { useEffect, useState } from "react";
// import { parseCookies, destroyCookie } from "nookies";
// import { useRouter } from "next/navigation";
// import Button from "../ui/button/Button";
// import { Editor } from "primereact/editor";

// // Define the available languages and their corresponding database fields
// const LANGUAGES = [
//   { key: 'en', label: 'English (Default)', field: 'CmsText_en' },
//   { key: 'es', label: 'Spanish', field: 'CmsText_es' },
//   { key: 'fr', label: 'French', field: 'CmsText_fr' },
//   { key: 'de', label: 'German', field: 'CmsText_de' },
//   { key: 'zh', label: 'Chinese', field: 'CmsText_zh' },
// ];


// const formatPageName = (name) => {
//   if (!name) return '';
//   // 1. Insert a space before any uppercase letter that is not at the start
//   const spaced = name.replace(/([A-Z])/g, ' $1').trim();
//   // 2. Capitalize the first letter and ensure the rest is consistent
//   return spaced.charAt(0).toUpperCase() + spaced.slice(1);
// };

// export default function CmsManager() {
//   const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
//   const router = useRouter();

//   const [cmsPages, setCmsPages] = useState([]);
//   const [selectedPage, setSelectedPage] = useState("");

//   // NEW: State to hold all language content for the selected page
//   const [langContents, setLangContents] = useState({}); 
//   // NEW: State to track the currently selected language for editing
//   const [currentLang, setCurrentLang] = useState(LANGUAGES[0].key); // Default to 'en'

//   const [status, setStatus] = useState("");
//   const [isFetchingContent, setIsFetchingContent] = useState(false);
//   const [isUpdatingContent, setIsUpdatingContent] = useState(false);

//   const [pageError, setPageError] = useState("");
//   const [contentError, setContentError] = useState("");

//   const { authToken } = parseCookies();

//   // Helper to get the field name (e.g., 'CmsText_en') based on the current language key
//   const currentLangField = LANGUAGES.find(l => l.key === currentLang)?.field;

//   // Derived state: The content currently in the editor for the selected language
//   const content = langContents[currentLangField] || "";
  
//   // Custom setter for content that updates the langContents state
//   const setContentForCurrentLang = (newHtmlContent) => {
//     setLangContents(prev => ({
//       ...prev,
//       [currentLangField]: newHtmlContent,
//     }));
//   };

//   const handleAuthError = () => {
//     destroyCookie(null, "authToken");
//     destroyCookie(null, "isAdmin");
//     router.push("/admin/login");
//   };

//   // 1. Fetch ALL CMS Pages with ALL language data (assuming /api/cms/ returns all fields)
//   const fetchCmsPages = async () => {
//     setIsFetchingContent(true);
//     try {
//       // NOTE: This now fetches all pages, each containing all CmsText_xx fields
//       const res = await fetch(`${backendUrl}/api/cms`, { 
//         headers: { "x-auth-token": authToken || "" },
//       });
//       if (res.status === 401) {
//         handleAuthError();
//         return [];
//       }
//       if (!res.ok) throw new Error(`Failed to fetch CMS pages: ${res.status}`);
      
//       const data = await res.json();
//       setCmsPages(data);
//       return data;
//     } catch (err) {
//       setStatus(`Error fetching pages: ${err.message}`);
//       console.error('Fetch CMS pages error:', err.message);
//       return [];
//     } finally {
//       setIsFetchingContent(false);
//     }
//   };


//   // 2. Load Content for Selected Page (Triggered by dropdown change)
//   useEffect(() => {
//     if (selectedPage && cmsPages.length > 0) {
//       const selectedPageData = cmsPages.find(p => p.CmsPageName === selectedPage);

//       if (selectedPageData) {
//           // Extract all language fields into langContents state
//           const newLangContents = {};
//           LANGUAGES.forEach(lang => {
//               newLangContents[lang.field] = selectedPageData[lang.field] || '';
//           });
//           setLangContents(newLangContents);
//           // Reset language selector to English
//           setCurrentLang(LANGUAGES[0].key);
//           setStatus('');
//           setContentError('');

//       } else {
//           setLangContents({});
//           setStatus('CMS content not found for this page.');
//       }
//     } else {
//         setLangContents({});
//     }
//     setPageError(''); // Clear page error on selection change
//   }, [selectedPage, cmsPages]);


//   useEffect(() => {
//     fetchCmsPages();
//   }, []); // Run only on component mount

//   // 3. Update Content Submission
//   const updateCmsContent = async () => {
//     if (!selectedPage) {
//       setPageError('Please select a CMS page first.');
//       return;
//     }
    
//     // Validate English content, as it is the required default
//     if (!langContents.CmsText_en || langContents.CmsText_en === "<p><br></p>") {
//       setStatus("English (Default) content is required and cannot be empty.");
//       return;
//     }

//     setIsUpdatingContent(true);
//     setStatus("");
//     setPageError("");
//     setContentError("");

//     try {
//       // Prepare the data to send to the backend
//       // Send the page name and ALL collected language content
//       const dataToSend = {
//           CmsPageName: selectedPage,
//           ...langContents // This spreads all CmsText_xx fields
//       };

//       const res = await fetch(`${backendUrl}/api/cms`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "x-auth-token": authToken || "",
//         },
//         body: JSON.stringify(dataToSend),
//       });

//       if (res.status === 401) {
//         handleAuthError();
//         return;
//       }

//       const result = await res.json();
//       if (!res.ok) {
//         throw new Error(result.msg || `Failed to update CMS content: ${res.status}`);
//       }

//       setStatus("CMS content updated successfully!");
//       // Optionally re-fetch all pages to update the list and content store
//       await fetchCmsPages();
//     } catch (err) {
//       console.error('Update failed:', err.message);
//       setStatus(`Update failed: ${err.message}`);
//     } finally {
//       setIsUpdatingContent(false);
//     }
//   };


//     // ... (rest of the component structure)
//     // Removed old editorHeader definition and put it outside the function if it was not already, or just keep it simple
//     const editorHeader = (
//       <span className="ql-formats">
//         <select className="ql-header" defaultValue="0">
//           <option value="1">Heading 1</option>
//           <option value="2">Heading 2</option>
//           <option value="3">Heading 3</option>
//           <option value="0">Normal</option>
//         </select>
//         <select className="ql-font" defaultValue="sans-serif">
//           <option value="sans-serif">Sans Serif</option>
//           <option value="serif">Serif</option>
//           <option value="monospace">Monospace</option>
//         </select>
//         <button className="ql-bold" aria-label="Bold"></button>
//         <button className="ql-italic" aria-label="Italic"></button>
//         <button className="ql-underline" aria-label="Underline"></button>
//         <button className="ql-strike" aria-label="Strikethrough"></button>
//         <button className="ql-link" aria-label="Insert Link"></button>
//         <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
//         <button className="ql-list" value="bullet" aria-label="Unordered List"></button>
//         <button className="ql-blockquote" aria-label="Blockquote"></button>
//       </span>
//     );
  
//   const isEditorDisabled = isUpdatingContent || !selectedPage || isFetchingContent;

//   return (
//     <div className="max-w-7xl mx-auto p-4 bg-white shadow-xl rounded-lg dark:bg-gray-800">
      
//       {/* Status Message */}
//       {status && (
//         <div
//           className={`p-3 mb-4 text-sm rounded-lg ${
//             status.includes("successfully")
//               ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
//               : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
//           }`}
//         >
//           {status}
//         </div>
//       )}

//       {/* Page Selector */}
//       <div className="mb-4">
//         <label htmlFor="cms-page-select" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//           Select CMS Page to Edit
//         </label>
//         <select
//           id="cms-page-select"
//           value={selectedPage}
//           onChange={(e) => setSelectedPage(e.target.value)}
//           className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//           disabled={isUpdatingContent || isFetchingContent}
//         >
//           <option value="">-- Select a CMS Page --</option>
//           {cmsPages.map((page) => (
//             <option key={page.CmsId} value={page.CmsPageName}>
//               {/* {page.CmsPageName} */}
//              {formatPageName(page.CmsPageName)}
//             </option>
//           ))}
//         </select>
//         {pageError && (
//           <p className="mt-2 text-sm text-red-500">{pageError}</p>
//         )}
//       </div>
      
//       {/* NEW LANGUAGE SELECTOR */}
//       <div className="mb-4">
//         <label htmlFor="lang-select" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//           Select Language to Edit
//         </label>
//         <select
//           id="lang-select"
//           value={currentLang}
//           onChange={(e) => setCurrentLang(e.target.value)}
//           className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//           disabled={isFetchingContent || !selectedPage || isUpdatingContent}
//         >
//           {LANGUAGES.map(lang => (
//             <option key={lang.key} value={lang.key}>
//               {lang.label}
//             </option>
//           ))}
//         </select>
//       </div>
//       {/* END NEW LANGUAGE SELECTOR */}


//       {/* PrimeReact Editor */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//           Content ({LANGUAGES.find(l => l.key === currentLang)?.label})
//         </label>
//         {isFetchingContent ? (
//           <div className="text-center text-gray-500 dark:text-gray-400">Loading content...</div>
//         ) : (
//           <Editor
//             headerTemplate={editorHeader}
//             key={selectedPage + currentLang} // Forces a re-render when the page OR lang changes
//             value={content}
//             onTextChange={(e) => setContentForCurrentLang(e.htmlValue)} // Use custom setter
//             style={{ height: "320px" }}
//             readOnly={isEditorDisabled}
//           />
//         )}
//         {contentError && (
//           <p className="mt-2 text-sm text-red-500">{contentError}</p>
//         )}
//       </div>

//       {/* Button */}
//       <Button
//         className="mt-2 w-full"
//         size="sm"
//         type="button"
//         onClick={updateCmsContent}
//         disabled={isEditorDisabled}
//       >
//         {isUpdatingContent ? "Updating Content..." : "Update CMS Content"}
//       </Button>
//     </div>
//   );
// }

'use client';

import { useEffect, useState, useCallback } from "react";
import { parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import Button from "../ui/button/Button";
import { Editor } from "primereact/editor";

const LANGUAGES = [
  { key: 'en', label: 'English (Default)', field: 'CmsText_en' },
  { key: 'es', label: 'Spanish', field: 'CmsText_es' },
  { key: 'fr', label: 'French', field: 'CmsText_fr' },
  { key: 'de', label: 'German', field: 'CmsText_de' },
  { key: 'zh', label: 'Chinese', field: 'CmsText_zh' },
];

const formatPageName = (name) => {
  if (!name) return '';
  const spaced = name.replace(/([A-Z])/g, ' $1').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export default function CmsManager() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const router = useRouter();

  const [cmsPages, setCmsPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [langContents, setLangContents] = useState({});
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0].key);
  const [status, setStatus] = useState("");
  const [isStatusVisible, setIsStatusVisible] = useState(false);
  const [isFetchingContent, setIsFetchingContent] = useState(false);
  const [isUpdatingContent, setIsUpdatingContent] = useState(false);
  const [pageError, setPageError] = useState("");
  const [contentError, setContentError] = useState("");
  const { authToken } = parseCookies();

  const currentLangField = LANGUAGES.find(l => l.key === currentLang)?.field;
  const content = langContents[currentLangField] || "";

  const setContentForCurrentLang = useCallback((newHtmlContent) => {
    setLangContents(prev => ({
      ...prev,
      [currentLangField]: newHtmlContent,
    }));

    if (currentLang === 'en') {
      const isContentEmpty = !newHtmlContent || newHtmlContent.replace(/(<([^>]+)>|&nbsp;|\s)/ig, '').length === 0;
      if (!isContentEmpty) {
        setContentError("");
      }
    }
  }, [currentLang, currentLangField]);

  // ✅ Fixed showStatusWithTimeout
  const showStatusWithTimeout = (message) => {
    setStatus(message);

    // Ensure it renders before visibility change
    setTimeout(() => setIsStatusVisible(true), 50);

    // Fade out after 4s
    setTimeout(() => setIsStatusVisible(false), 4000);

    // Remove message after fade completes
    setTimeout(() => setStatus(""), 5000);
  };

  const handleAuthError = () => {
    destroyCookie(null, "authToken");
    destroyCookie(null, "isAdmin");
    router.push("/admin/login");
  };

  const fetchCmsPages = async () => {
    setIsFetchingContent(true);
    setStatus("");
    setIsStatusVisible(false);
    try {
      const res = await fetch(`${backendUrl}/api/cms`, {
        headers: { "x-auth-token": authToken || "" },
      });
      if (res.status === 401) {
        handleAuthError();
        return [];
      }
      if (!res.ok) throw new Error(`Failed to fetch CMS pages: ${res.statusText}`);
      const data = await res.json();
      setCmsPages(data);
      return data;
    } catch (err) {
      showStatusWithTimeout(`Error fetching pages: ${err.message}`);
      console.error('Fetch CMS pages error:', err.message);
      return [];
    } finally {
      setIsFetchingContent(false);
    }
  };

  useEffect(() => {
    if (selectedPage && cmsPages.length > 0) {
      const selectedPageData = cmsPages.find(p => p.CmsPageName === selectedPage);
      if (selectedPageData) {
        const newLangContents = {};
        LANGUAGES.forEach(lang => {
          newLangContents[lang.field] = selectedPageData[lang.field] || '';
        });
        setLangContents(newLangContents);
        setCurrentLang(LANGUAGES[0].key);
        setStatus('');
        setIsStatusVisible(false);
        setContentError('');
      } else {
        setLangContents({});
        showStatusWithTimeout('CMS content not found for this page.');
      }
    } else {
      setLangContents({});
    }
    setPageError('');
  }, [selectedPage, cmsPages]);

  useEffect(() => {
    fetchCmsPages();
  }, []);

  const updateCmsContent = async () => {
    setStatus("");
    setIsStatusVisible(false);
    setPageError("");
    setContentError("");

    let isValid = true;
    if (!selectedPage) {
      setPageError('Please select a CMS page first.');
      isValid = false;
    }

    const enContent = langContents.CmsText_en;
    const isContentEmpty = !enContent || enContent.replace(/(<([^>]+)>|&nbsp;|\s)/ig, '').length === 0;

    if (isContentEmpty) {
      setContentError("English (Default) content is required and cannot be empty. Please update the content.");
      isValid = false;
    }

    if (!isValid) return;

    setIsUpdatingContent(true);

    try {
      const dataToSend = {
        CmsPageName: selectedPage,
        ...langContents
      };

      const res = await fetch(`${backendUrl}/api/cms`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": authToken || "",
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.status === 401) {
        handleAuthError();
        return;
      }

      const result = await res.json();
      if (!res.ok) throw new Error(result.msg || `Failed to update CMS content: ${res.statusText}`);

      showStatusWithTimeout("CMS content updated successfully!");
      await fetchCmsPages();
    } catch (err) {
      console.error('Update failed:', err.message);
      showStatusWithTimeout(`Update failed: ${err.message}`);
    } finally {
      setIsUpdatingContent(false);
    }
  };

  const editorHeader = (
    <span className="ql-formats">
      <select className="ql-header" defaultValue="0">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="0">Normal</option>
      </select>
      <select className="ql-font" defaultValue="sans-serif">
        <option value="sans-serif">Sans Serif</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
      </select>
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-underline"></button>
      <button className="ql-strike"></button>
      <button className="ql-link"></button>
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
      <button className="ql-blockquote"></button>
    </span>
  );

  const isEditorDisabled = isUpdatingContent || !selectedPage || isFetchingContent;

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white shadow-xl rounded-lg dark:bg-gray-800">

      {/* ✅ Fixed Fading Status Message */}
      {status && (
        <div
          className={`p-3 mb-4 text-sm rounded-lg transition-all duration-1000 ease-in-out
            ${isStatusVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
            ${
              status.includes("successfully") || status.includes("✅")
                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
            }`}
        >
          {status}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); updateCmsContent(); }}>
        <div className="mb-4">
          <label htmlFor="cms-page-select" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Select CMS Page
          </label>
          <select
            id="cms-page-select"
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={isUpdatingContent || isFetchingContent}
          >
            <option value="">-- Select a CMS Page --</option>
            {cmsPages.map((page) => (
              <option key={page.CmsId} value={page.CmsPageName}>
                {formatPageName(page.CmsPageName)}
              </option>
            ))}
          </select>
          {pageError && <p className="mt-2 text-sm text-red-500">{pageError}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="lang-select" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Select Language
          </label>
          <select
            id="lang-select"
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={isFetchingContent || !selectedPage || isUpdatingContent}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.key} value={lang.key}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Content ({LANGUAGES.find(l => l.key === currentLang)?.label})
            {currentLang === 'en' && <span className="text-red-500">*</span>}
          </label>

          {isFetchingContent ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading content...</div>
          ) : (
            <Editor
              headerTemplate={editorHeader}
              key={selectedPage + currentLang}
              value={content}
              onTextChange={(e) => setContentForCurrentLang(e.htmlValue)}
              style={{ height: "320px" }}
              readOnly={isEditorDisabled}
            />
          )}

          {contentError && currentLang === 'en' && (
            <p className="mt-2 text-sm text-red-500">{contentError}</p>
          )}
        </div>

        <Button
          className="mt-2 w-full"
          size="sm"
          type="submit"
          disabled={isEditorDisabled}
        >
          {isUpdatingContent ? "Updating Content..." : "Update CMS Content"}
        </Button>
      </form>
    </div>
  );
}
