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
  mode = "admin",
}) {
  const isAdmin = mode === "admin";
  const isEdit = Boolean(editingEvent);

  const [saving, setSaving] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorKey, setEditorKey] = useState("editor-new");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /* FORM */
  const [form, setForm] = useState({
    title: "",
    shortDesc: "",
    description: "",
    venue: "",
    bookingLink: "",
    startDate: null,
    endDate: null,
  });

  /* IMAGE STATE */
  const [existingImages, setExistingImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [errors, setErrors] = useState({});

  /* ================= LOAD EDIT MODE ================= */
  useEffect(() => {
    if (!editingEvent) {
      setEditorLoaded(true);
      return;
    }

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
    });

    setExistingImages(editingEvent.images || []);
    setRemovedImageIds([]);
    setNewImages([]);

    setEditorKey(`editor-${editingEvent.EventID}`);
    setEditorLoaded(true);
  }, [editingEvent]);

  /* ================= VALIDATION ================= */
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

    if (form.startDate && form.endDate < form.startDate) {
      e.endDate = "End date cannot be before start date";
    }

    if (!isEdit && newImages.length === 0) {
      e.images = "At least one image is required";
    }

    return e;
  };

  /* ================= IMAGE HANDLERS ================= */
  const addNewImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (img) => {
    setExistingImages((prev) =>
      prev.filter((i) => i.ImageID !== img.ImageID)
    );
    setRemovedImageIds((prev) => [...prev, img.ImageID]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SAVE ================= */
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
      fd.append("StartDate", form.startDate.toISOString());
      fd.append("EndDate", form.endDate.toISOString());

      if (isAdmin) fd.append("IsSignature", "true");

      /* 🔥 IMPORTANT: correct array key */
      removedImageIds.forEach((id) =>
        fd.append("removedImageIds[]", id)
      );

      newImages.forEach((img) => fd.append("images", img));

      /* 🔥 FIXED API SWITCH */
      let url = "";
      let method = "";

      if (isEdit) {
        url = isAdmin
          ? `${backendUrl}/api/events/admin/${editingEvent.EventID}`
          : `${backendUrl}/api/events/partner/${editingEvent.EventID}`;
        method = "PUT";
      } else {
        url = isAdmin
          ? `${backendUrl}/api/events/admin/signature`
          : `${backendUrl}/api/events/partner`;
        method = "POST";
      }

      const res = await fetch(url, {
        method,
        headers: { "x-auth-token": authToken },
        body: fd,
      });

      if (res.status === 401 && handleAuthError) return handleAuthError();
      if (!res.ok) throw new Error(await res.text());

      window.location.href = isAdmin
        ? `/admin/events?${isEdit ? "updated=1" : "added=1"}`
        : `/events?${isEdit ? "updated=1" : "added=1"}`;
    } catch (err) {
      alert(err.message);
    }

    setSaving(false);
  };

  if (!editorLoaded) return null;

  return (
    <div className="bg-white p-6 rounded shadow max-w-5xl">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit Event" : "Add New Event"}
      </h2>

      {/* TITLE */}
      <label className="font-medium">Title <span className="text-red-500">*</span></label>
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
        onChange={(e) =>
          setForm({ ...form, shortDesc: e.target.value })
        }
      />
      {errors.shortDesc && (
        <p className="text-red-500">{errors.shortDesc}</p>
      )}

      {/* IMAGES */}
      <label className="font-medium mt-3 block">Images <span className="text-red-500">*</span></label>
      <input
        type="file"
        multiple
        accept="image/*"
        className="border p-2 w-full rounded"
        onChange={addNewImages}
      />
      {errors.images && (
        <p className="text-red-500">{errors.images}</p>
      )}

      <div className="flex flex-wrap gap-4 mt-4">
        {existingImages.map((img) => (
          <div key={img.ImageID} className="relative">
            <img
              src={`${backendUrl}/images/events/${img.FilePath}`}
              className="h-28 w-40 object-cover rounded border"
            />
            <button
              onClick={() => removeExistingImage(img)}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2"
            >
              ×
            </button>
          </div>
        ))}

        {newImages.map((file, i) => (
          <div key={i} className="relative">
            <img
              src={URL.createObjectURL(file)}
              className="h-28 w-40 object-cover rounded border"
            />
            <button
              onClick={() => removeNewImage(i)}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* DESCRIPTION */}
      <label className="font-medium mt-4 block">Full Description <span className="text-red-500">*</span></label>
      <Editor
        key={editorKey}
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
            onChange={(e) =>
              setForm({ ...form, venue: e.target.value })
            }
          />
           {errors.venue && (
        <p className="text-red-500">{errors.venue}</p>
      )}
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
            setForm({ ...form, startDate: e.value })
          }
          showIcon
          minDate={today}
          className="w-full"
          
        />
        {errors.startDate && ( <p className="text-red-500">{errors.startDate}</p> )}
      </div>
      <div> <label className="font-medium">End Date <span className="text-red-500">*</span></label>
        <Calendar
          value={form.endDate}
          onChange={(e) =>
            setForm({ ...form, endDate: e.value })
          }
          showIcon
          minDate={form.startDate || today}
          className="w-full"
        />
         {errors.endDate && ( <p className="text-red-500">{errors.endDate}</p> )}
        </div>
      </div>

      {/* ACTIONS */}
     <div className="flex gap-3 mt-6">
        {isAdmin &&
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
       }
        { !isAdmin &&
          <button
          onClick={handleSave}
          className="btn btn-primary text-white font-semibold py-3 rounded transition"
        >
          {saving
            ? "Saving…"
            : editingEvent
            ? "Update Event"
            : "Add Event"}
            </button>
        }
        <button className="border px-6 py-3 rounded" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
