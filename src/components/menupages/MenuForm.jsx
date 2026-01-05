"use client";

import { useEffect, useState } from "react";
import { Editor } from "primereact/editor";

const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

export default function MenuForm({
  backendUrl,
  authToken,
  menu,
  onCancel,
  handleAuthError,
}) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [existingImage, setExistingImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [errors, setErrors] = useState({});

  /* LOAD */
  useEffect(() => {
    if (!menu) return;

    setForm({
      title: menu.Title || "",
      description: menu.Description || "",
    });

    setExistingImage(menu.HeroImage || null);
  }, [menu]);

  /* VALIDATION */
  const validate = () => {
    const e = {};

    if (!form.title.trim()) e.title = "Title is required";

    const plain = form.description.replace(/<[^>]*>/g, "").trim();
    if (!plain) e.description = "Description is required";

    if (!existingImage && !newImage) {
      e.heroImage = "Hero image is required";
    }

    return e;
  };

  /* IMAGE SELECT */
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG and PNG images are allowed");
      return;
    }

    setNewImage(file);
    setRemoveImage(false);
  };

  /* SAVE */
  const handleSave = async () => {
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("Title", form.title);
      fd.append("Description", form.description);

      if (removeImage) fd.append("removeImage", "true");
      if (newImage) fd.append("heroImage", newImage);

      const res = await fetch(
        `${backendUrl}/api/admin/menu-pages/${menu.MenuID}`,
        {
          method: "PUT",
          headers: { "x-auth-token": authToken },
          body: fd,
        }
      );

      if (res.status === 401 && handleAuthError) return handleAuthError();
      if (!res.ok) throw new Error(await res.text());

      window.location.href = "/admin/menu-pages?updated=1";
    } catch (err) {
      alert(err.message);
    }

    setSaving(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-1">Edit Menu Page</h2>
      <p className="text-sm text-gray-500 mb-4">
        Editing menu: <strong>{menu.MenuName}</strong>
      </p>

      {/* TITLE */}
      <label className="font-medium">
        Title <span className="text-red-500">*</span>
      </label>
      <input
        className="border p-2 w-full rounded"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      {errors.title && <p className="text-red-500">{errors.title}</p>}

      {/* HERO IMAGE */}
      <label className="font-medium mt-4 block">
        Hero Image <span className="text-red-500">*</span>
      </label>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        className="border p-2 w-full rounded"
        onChange={handleImageSelect}
      />
      {errors.heroImage && (
        <p className="text-red-500">{errors.heroImage}</p>
      )}

      {/* EXISTING IMAGE */}
      {existingImage && !removeImage && !newImage && (
        <div className="relative mt-3 w-64">
          <img
            src={`${backendUrl}/images/menu/${existingImage}`}
            className="rounded border"
          />
          <button
            onClick={() => {
              setRemoveImage(true);
              setExistingImage(null);
            }}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2"
          >
            ×
          </button>
        </div>
      )}

      {/* NEW IMAGE PREVIEW */}
      {newImage && (
        <div className="relative mt-3 w-64">
          <img
            src={URL.createObjectURL(newImage)}
            className="rounded border"
          />
          <button
            onClick={() => setNewImage(null)}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2"
          >
            ×
          </button>
        </div>
      )}

      {/* DESCRIPTION */}
      <label className="font-medium mt-4 block">
        Description <span className="text-red-500">*</span>
      </label>
      <Editor
        value={form.description}
        onTextChange={(e) =>
          setForm({ ...form, description: e.htmlValue || "" })
        }
        style={{ height: 260 }}
      />
      {errors.description && (
        <p className="text-red-500">{errors.description}</p>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          className="bg-brand-500 text-white px-6 py-3 rounded"
        >
          {saving ? "Saving…" : "Update Menu"}
        </button>

        <button
          className="border px-6 py-3 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
