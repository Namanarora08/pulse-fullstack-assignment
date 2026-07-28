"use client";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Power,
  Search,
  X,
  AlertTriangle,
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";
import { useAdmin } from "@/components/admin/admin-context";
import { adminNavItems } from "@/lib/admin-nav";
import { Button } from "@/components/ui/button";
import { DiseaseTemplate, QuestionTemplateItem } from "@/lib/admin-store";

export default function AdminTemplatesPage() {
  const { templates, addTemplate, updateTemplate, deleteTemplate, toggleTemplateStatus } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [diseaseFilter, setDiseaseFilter] = useState("ALL");

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DiseaseTemplate | null>(null);
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formDiseaseName, setFormDiseaseName] = useState("Heart Disease");
  const [formDescription, setFormDescription] = useState("");
  const [formQuestions, setFormQuestions] = useState<QuestionTemplateItem[]>([
    {
      id: "q1",
      prompt: "Did you experience any chest pain or shortness of breath today?",
      type: "YES_NO",
      category: "SYMPTOM",
    },
  ]);

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const diseaseCategories = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Asthma",
    "Kidney Disease",
    "Cancer Recovery",
    "Post Surgery",
  ];

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDisease = diseaseFilter === "ALL" || t.diseaseName === diseaseFilter;

    return matchesSearch && matchesDisease;
  });

  const openCreateModal = () => {
    setFormTitle("");
    setFormDiseaseName("Heart Disease");
    setFormDescription("");
    setFormQuestions([
      {
        id: "q-1",
        prompt: "Did you experience any shortness of breath or dizziness today?",
        type: "YES_NO",
        category: "SYMPTOM",
      },
    ]);
    setFormError("");
    setFormSuccess("");
    setIsCreateModalOpen(true);
  };

  const openEditModal = (t: DiseaseTemplate) => {
    setEditingTemplate(t);
    setFormTitle(t.title);
    setFormDiseaseName(t.diseaseName);
    setFormDescription(t.description);
    setFormQuestions(t.questions ? [...t.questions] : []);
    setFormError("");
    setFormSuccess("");
  };

  const addQuestionField = () => {
    setFormQuestions((prev) => [
      ...prev,
      {
        id: "q-" + Date.now() + Math.random().toString(36).substring(2, 5),
        prompt: "",
        type: "YES_NO",
        category: "SYMPTOM",
      },
    ]);
  };

  const removeQuestionField = (index: number) => {
    setFormQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestionField = (index: number, key: keyof QuestionTemplateItem, value: QuestionTemplateItem[keyof QuestionTemplateItem]) => {
    setFormQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [key]: value } : q))
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      setFormError("Please provide template title and description.");
      return;
    }

    if (formQuestions.some((q) => !q.prompt.trim())) {
      setFormError("All question prompts must be filled out.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    setTimeout(() => {
      try {
        addTemplate({
          title: formTitle,
          diseaseName: formDiseaseName,
          description: formDescription,
          enabled: true,
          usageCount: 1,
          questions: formQuestions,
        });

        setFormSuccess("Disease template published successfully!");
        setTimeout(() => {
          setIsCreateModalOpen(false);
          setFormSuccess("");
        }, 800);
      } catch {
        setFormError("Failed to save disease template.");
      } finally {
        setIsSubmitting(false);
      }
    }, 400);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    if (!formTitle.trim() || !formDescription.trim()) {
      setFormError("Please provide template title and description.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    setTimeout(() => {
      try {
        updateTemplate(editingTemplate.id, {
          title: formTitle,
          diseaseName: formDiseaseName,
          description: formDescription,
          questions: formQuestions,
        });

        setFormSuccess("Disease template updated successfully!");
        setTimeout(() => {
          setEditingTemplate(null);
          setFormSuccess("");
        }, 800);
      } catch {
        setFormError("Failed to update disease template.");
      } finally {
        setIsSubmitting(false);
      }
    }, 400);
  };

  return (
    <RoleShell
      role="admin"
      title="Question Templates"
      description="Create check-in questionnaires for different conditions."
      navItems={adminNavItems}
    >
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Templates ({filteredTemplates.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Build daily check-in questions for your conditions.
            </p>
          </div>

          <Button
            onClick={openCreateModal}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs shrink-0"
          >
            <Plus className="h-4 w-4" /> Add Template
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates or disease names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <select
            value={diseaseFilter}
            onChange={(e) => setDiseaseFilter(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            <option value="ALL">All Disease Protocols</option>
            {diseaseCategories.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {tmpl.diseaseName}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {tmpl.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleTemplateStatus(tmpl.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      tmpl.enabled
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                    title="Toggle Template Activation"
                  >
                    <Power className="h-3.5 w-3.5" />
                    {tmpl.enabled ? "Active" : "Disabled"}
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {tmpl.description}
                </p>

                {/* Questions Preview */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Configured Questions ({tmpl.questions.length})</span>
                    <span className="text-[10px] text-slate-400 font-mono">Usage: {tmpl.usageCount} patients</span>
                  </p>

                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                    {tmpl.questions.slice(0, 3).map((q, idx) => (
                      <li key={q.id || idx} className="flex items-start gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                        <span className="font-mono text-blue-600 dark:text-blue-400 shrink-0">Q{idx + 1}:</span>
                        <span className="line-clamp-2">{q.prompt} ({q.type})</span>
                      </li>
                    ))}
                    {tmpl.questions.length > 3 && (
                      <li className="text-[10px] text-blue-600 font-semibold text-right">
                        +{tmpl.questions.length - 3} more question prompts
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px]">Updated {tmpl.updatedAt}</span>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5 text-blue-600 hover:bg-blue-50"
                    onClick={() => openEditModal(tmpl)}
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit Template
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-rose-600 hover:bg-rose-50"
                    onClick={() => setDeletingTemplateId(tmpl.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm">
              No disease templates match the selected filter.
            </div>
          )}
        </div>

        {/* Create / Edit Template Modal */}
        {(isCreateModalOpen || editingTemplate) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 space-y-4 relative max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingTemplate(null);
                }}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingTemplate ? `Edit Disease Questionnaire: ${editingTemplate.title}` : "Create New Disease Questionnaire Protocol"}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure daily symptom prompts and adherence questions for target disease cohort.
                </p>
              </div>

              {formError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
                  {formSuccess}
                </div>
              )}

              <form onSubmit={editingTemplate ? handleEditSubmit : handleCreateSubmit} className="space-y-4 text-xs">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Template Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Type 2 Diabetes Glycemic Protocol"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Target Disease Cohort *</label>
                    <select
                      value={formDiseaseName}
                      onChange={(e) => setFormDiseaseName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white font-semibold"
                    >
                      {diseaseCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Protocol Description & Objectives *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Describe clinical tracking purpose, target vitals, or symptom flags..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Questions Builder */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Question Prompts Builder ({formQuestions.length})
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addQuestionField}
                      className="text-xs gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Question
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {formQuestions.map((q, idx) => (
                      <div
                        key={q.id || idx}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60 space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-600 dark:text-blue-400">Question #{idx + 1}</span>
                          {formQuestions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestionField(idx)}
                              className="text-rose-600 hover:text-rose-800 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          required
                          placeholder="e.g. Rate your pain or discomfort level today..."
                          value={q.prompt}
                          onChange={(e) => updateQuestionField(idx, "prompt", e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                        />

                        <div className="grid gap-2 sm:grid-cols-2">
                          <div>
                            <label className="text-[10px] text-slate-500 font-semibold">Input Response Type</label>
                            <select
                              value={q.type}
                              onChange={(e) => updateQuestionField(idx, "type", e.target.value as "YES_NO" | "SCALE" | "NUMERIC")}
                              className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                            >
                              <option value="YES_NO">Yes / No Toggle</option>
                              <option value="SCALE">Numeric Pain / Intensity Scale (0-10)</option>
                              <option value="NUMERIC">Numeric Value (e.g. BP, Glucose, HR)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-500 font-semibold">Category Type</label>
                            <select
                              value={q.category}
                              onChange={(e) => updateQuestionField(idx, "category", e.target.value as "SYMPTOM" | "ADHERENCE")}
                              className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                            >
                              <option value="SYMPTOM">Symptom Log</option>
                              <option value="ADHERENCE">Medication / Diet Adherence</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingTemplate(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white hover:bg-blue-700">
                    {isSubmitting ? "Saving..." : editingTemplate ? "Update Protocol" : "Publish Questionnaire"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingTemplateId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-base font-bold">Confirm Template Deletion</h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                Are you sure you want to delete this disease questionnaire protocol from the hospital template catalog?
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setDeletingTemplateId(null)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-rose-600 text-white hover:bg-rose-700"
                  onClick={() => {
                    deleteTemplate(deletingTemplateId);
                    setDeletingTemplateId(null);
                  }}
                >
                  Delete Template
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleShell>
  );
}
