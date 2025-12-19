"use client";

import React, { useEffect, useState } from "react";
import { Editor } from "primereact/editor";
import { Calendar } from "primereact/calendar";

export default function EventForm({
  backendUrl,
  authToken,
  editingEvent,
  onCancel,
  handleAuthError,
}) {
  const [saving, setSaving] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorKey, setEditorKey] = useState("editor-new");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [form, setForm] = useState({
    title: "",
    shortDesc: "",
    description: "",
    venue: "",
    bookingLink: "",
    startDate: null,
    endDate: null,
    images: [],
    isSignature: true, // ADMIN → ALWAYS TRUE
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});

  // ======================================================
  // LOAD EDIT MODE
  // ======================================================
  useEffect(() => {
    if (editingEvent) {
      setForm({
        title: editingEvent.Title || "",
        shortDesc: editingEvent.ShortDesc || "",
        description: editingEvent.Description || "",
        venue: editingEvent.Venue || "",
        bookingLink: editingEvent.BookingLink || "",
        startDate: editingEvent.StartDate
          ? new Date(editingEvent.StartDate)
          : null,
        endDate: editingEvent.EndDate
          ? new Date(editingEvent.EndDate)
          : null,
        images: [],
        isSignature: true,
      });

      if (editingEvent.images?.length) {
        setPreviewImages(
          editingEvent.images.map(
            (img) => `${backendUrl}/images/events/${img.FilePath}`
          )
        );
      }

      setEditorKey(`editor-${editingEvent.EventID}`);
    }

    setEditorLoaded(false);
    setTimeout(() => setEditorLoaded(true), 50);
  }, [editingEvent]);

  // ======================================================
  // VALIDATION
  // ======================================================
  const validate = () => {
    const e = {};

    if (!form.title.trim()) e.title = "Title is required";
    if (!form.shortDesc.trim()) e.shortDesc = "Short description is required";

    const plain = form.description.replace(/<[^>]*>/g, "").trim();
    if (!plain) e.description = "Full description is required";

    if (!form.venue.trim()) e.venue = "Venue is required";
    if (!form.bookingLink.trim()) e.bookingLink = "Booking link is required";

    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.endDate) e.endDate = "End date is required";

    if (
      form.startDate &&
      form.endDate &&
      form.endDate < form.startDate
    ) {
      e.endDate = "End date cannot be before start date";
    }

    if (!editingEvent && previewImages.length === 0) {
      e.images = "At least one image is required";
    }

    return e;
  };

  // ======================================================
  // IMAGE UPLOAD
  // ======================================================
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setForm((prev) => ({ ...prev, images: files }));
    setPreviewImages(files.map((f) => URL.createObjectURL(f)));
  };

  // ======================================================
  // SAVE
  // ======================================================
  const handleSave = async () => {
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("Title", form.title);
      fd.append("ShortDesc", form.shortDesc);
      fd.append("Description", form.description);
      fd.append("Venue", form.venue);
      fd.append("BookingLink", form.bookingLink);
      fd.append("IsSignature", "true");
      fd.append("StartDate", form.startDate.toISOString());
      fd.append("EndDate", form.endDate.toISOString());

      form.images.forEach((img) => fd.append("images", img));

      const url = editingEvent
        ? `${backendUrl}/api/events/admin/${editingEvent.EventID}`
        : `${backendUrl}/api/events/admin/signature`;

      const res = await fetch(url, {
        method: editingEvent ? "PUT" : "POST",
        headers: { "x-auth-token": authToken },
        body: fd,
      });

      if (res.status === 401) return handleAuthError();
      if (!res.ok) throw new Error(await res.text());

      window.location.href = `/admin/events?${
        editingEvent ? "updated=1" : "added=1"
      }`;
    } catch (err) {
      alert(err.message);
    }

    setSaving(false);
  };

  // ======================================================
  // EDITOR TOOLBAR
  // ======================================================
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
        <select className="ql-color"></select>
        <select className="ql-background"></select>
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
        <select className="ql-align"></select>
        <button className="ql-link"></button>
        <button className="ql-image"></button>
        <button className="ql-clean"></button>
    </span>
  );

  if (!editorLoaded) return <p>Loading editor…</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-5xl">
      <h2 className="text-xl font-semibold mb-4">
        {editingEvent ? "Edit Event" : "Add New Event"}
      </h2>

      {/* TITLE */}
      <label className="font-medium">Title 
        <span className="text-red-500">*</span>
      </label>
      <input
        className="border p-2 w-full rounded"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      {errors.title && <p className="text-red-500">{errors.title}</p>}

      {/* SHORT DESC */}
      <label className="font-medium mt-3 block">Short Description <span className="text-red-500">*</span></label>
      <textarea
        className="border p-2 w-full rounded"
        rows={3}
        value={form.shortDesc}
        onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
      />
      {errors.shortDesc && <p className="text-red-500">{errors.shortDesc}</p>}

      {/* IMAGES */}
      <label className="font-medium mt-3 block">Images <span className="text-red-500">*</span></label>
      <input
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp"
        className="block w-full rounded border p-2 text-sm"
        onChange={handleImageSelect}
      />
      {errors.images && <p className="text-red-500">{errors.images}</p>}

      <div className="flex gap-3 mt-3 flex-wrap">
        {previewImages.map((img, i) => (
          <img
            key={i}
            src={img}
            className="h-28 w-40 object-cover rounded border"
          />
        ))}
      </div>

      {/* DESCRIPTION */}
      <label className="font-medium mt-4 block">Full Description <span className="text-red-500">*</span></label>
      <Editor
        key={editorKey}
        headerTemplate={editorHeader}
        value={form.description}
        onTextChange={(e) =>
          setForm({ ...form, description: e.htmlValue || "" })
        }
        style={{ height: 260 }}
      />
      {errors.description && (
        <p className="text-red-500">{errors.description}</p>
      )}

      {/* VENUE + BOOKING */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="font-medium">Venue <span className="text-red-500">*</span></label>
          <input
            className="border p-2 w-full rounded"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
          />
          {errors.venue && <p className="text-red-500">{errors.venue}</p>}
        </div>

        <div>
          <label className="font-medium">Booking Link <span className="text-red-500">*</span></label>
          <input
            className="border p-2 w-full rounded"
            value={form.bookingLink}
            onChange={(e) =>
              setForm({ ...form, bookingLink: e.target.value })
            }
          />
          {errors.bookingLink && (
            <p className="text-red-500">{errors.bookingLink}</p>
          )}
        </div>
      </div>

      {/* DATES */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="font-medium">Start Date <span className="text-red-500">*</span></label>
          <Calendar
            value={form.startDate}
            onChange={(e) =>
              setForm({
                ...form,
                startDate: e.value,
                endDate:
                  form.endDate && e.value && form.endDate < e.value
                    ? null
                    : form.endDate,
              })
            }
            showIcon
            className="w-full"
            dateFormat="dd M yy"
            minDate={today}
            monthNavigator
            yearNavigator
            yearRange="2024:2035"
          />
          {errors.startDate && (
            <p className="text-red-500">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label className="font-medium">End Date <span className="text-red-500">*</span></label>
          <Calendar
            value={form.endDate}
            onChange={(e) =>
              setForm({ ...form, endDate: e.value })
            }
            showIcon
            className="w-full"
            dateFormat="dd M yy"
            minDate={form.startDate || today}
            monthNavigator
            yearNavigator
            yearRange="2024:2035"
          />
          {errors.endDate && (
            <p className="text-red-500">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          className="bg-brand-500 text-white px-6 py-3 rounded"
        >
          {saving
            ? "Saving…"
            : editingEvent
            ? "Update Event"
            : "Add Event"}
        </button>

        <button className="border px-6 py-3 rounded" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
