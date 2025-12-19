"use client";

import React, { useEffect, useState } from "react";
import { Editor } from "primereact/editor";

export default function ExploreForm({
  backendUrl,
  authToken,
  editingExplore,
  onExploreAdded,
  onExploreUpdated,
  onError,
  onCancel,
  handleAuthError,
  router
}) {
  const [saving, setSaving] = useState(false);
  const [editorKey, setEditorKey] = useState("editor-new");
  const [editorLoaded, setEditorLoaded] = useState(false);

  const [form, setForm] = useState({
    title: "",
    shortDesc: "",
    content: "",
    bannerImage: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  // ======================================================
  // LOAD DATA FOR EDIT MODE
  // ======================================================
  useEffect(() => {
    if (editingExplore) {
      setForm({
        title: editingExplore.title || "",
        shortDesc: editingExplore.shortDesc || "",
        content: editingExplore.content || "",
        bannerImage: null,
      });

      setEditorLoaded(false);
      setEditorKey(`editor-${editingExplore.id}`);

      setTimeout(() => setEditorLoaded(true), 50);

      if (editingExplore.bannerImage) {
        const src = editingExplore.bannerImage.startsWith("/images")
          ? `${backendUrl}${editingExplore.bannerImage}`
          : `${backendUrl}/images/Explore/${editingExplore.bannerImage}`;

        setPreviewImage(src);
      }
    } else {
      setForm({ title: "", shortDesc: "", content: "", bannerImage: null });
      setPreviewImage(null);
      setEditorKey("editor-new");

      setTimeout(() => setEditorLoaded(true), 50);
    }
  }, [editingExplore]);

  // VALIDATE
  const validate = () => {
    const e = {};

    if (!form.title.trim()) e.title = "Title is required";
    if (!form.shortDesc.trim()) e.shortDesc = "Short description is required";

    const plain = form.content.replace(/<[^>]*>/g, "").trim();
    if (!plain) e.content = "Full description is required";

    if (!editingExplore && !previewImage)
      e.bannerImage = "Image is required";

    return e;
  };

  // IMAGE PREVIEW
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, bannerImage: file }));

    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  // UPLOAD IMAGE
  const uploadImage = async (file) => {
    if (!file) return null;

    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch(`${backendUrl}/api/explore/upload-image`, {
      method: "POST",
      headers: { "x-auth-token": authToken },
      body: fd,
    });

    const data = await res.json();
    return data.fileName || data.filename || data.url?.split("/").pop();
  };

  // ======================================================
  // SAVE HANDLER
  // ======================================================
  const handleSave = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSaving(true);

    try {
      let uploadedImage = editingExplore?.bannerImage || null;

      if (form.bannerImage instanceof File) {
        uploadedImage = await uploadImage(form.bannerImage);
      }

      const slug = form.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const payload = {
        title: form.title,
        slug,
        shortDesc: form.shortDesc,
        content: form.content,
        bannerImage: uploadedImage,
      };

      const url = editingExplore
        ? `${backendUrl}/api/explore/${editingExplore.id}`
        : `${backendUrl}/api/explore`;

      const res = await fetch(url, {
        method: editingExplore ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": authToken,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      // SUCCESS → Redirect with flag
      if (editingExplore) {
        window.location.href = "/admin/explore?updated=1";
      } else {
        window.location.href = "/admin/explore?added=1";
      }

    } catch (err) {
      onError(err.message);
    }

    setSaving(false);
  };

  // TOOLBAR
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
    <div className="bg-white p-6 rounded shadow-md">

      <h2 className="text-xl font-semibold mb-1">
        {editingExplore ? "Edit Explore Nakuru" : "Add New Explore Nakuru"}
      </h2>

      {/* Title */}
      <label className="block font-medium mb-2">Title  <span className="text-red-500">*</span></label>
      <input
        className="border p-2 w-full rounded"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      {errors.title && <p className="text-red-500">{errors.title}</p>}

      {/* Short Description */}
      <label className="block font-medium mb-2 mt-3">Short Description  <span className="text-red-500">*</span></label>
      <textarea
        rows={3}
        className="border p-2 w-full rounded"
        value={form.shortDesc}
        onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
      />
      {errors.shortDesc && <p className="text-red-500">{errors.shortDesc}</p>}

      {/* Image */}
      <label className="block font-medium mb-2 mt-3">Image  <span className="text-red-500">*</span></label>

      <input
        id="image"
        type="file"
        accept=".jpeg, .png, .jpg, .webp"
        className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm"
        onChange={handleImageSelect}
      />

      {previewImage && (
        <img
          src={previewImage}
          className="h-40 rounded mt-3 mb-3 object-cover border"
        />
      )}

      {errors.bannerImage && <p className="text-red-500">{errors.bannerImage}</p>}

      {/* Full Description */}
      <label className="block font-medium mb-2 mt-3">Full Description  <span className="text-red-500">*</span></label>

      <Editor
        key={editorKey}
        headerTemplate={editorHeader}
        value={form.content}
        onTextChange={(e) =>
          setForm({ ...form, content: e.htmlValue || "" })
        }
        style={{ height: "300px" }}
      />

      {errors.content && <p className="text-red-500">{errors.content}</p>}

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          className="px-5 py-3 bg-brand-500 text-white rounded"
          onClick={handleSave}
        >
          {saving ? "Saving…" : editingExplore ? "Update Explore Nakuru" : "Add Explore Nakuru"}
        </button>

        <button className="px-5 py-3 border rounded" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
