"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";

type Element = {
  _id: string;
  template_id: string;
  type: number;
  question: string;
  placeholder: string;
  isDel: boolean;
  section_id?: string;
  answer_result?: Record<string, string> | string[];
};

type Section = {
  _id: string;
  title: string;
  template_id: string;
  isDel: boolean;
};

export default function PolicyElementsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [prevElements, setPrevElements] = useState<Element[]>([]);
  const elementsPerPage = 1;

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);

  const templateId = useParams().id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsRes, elementsRes] = await Promise.all([
          api.get(`/api/admin/section/${templateId}`),
          api.get(`/api/admin/template/element/${templateId}`)
        ]);

        const sortedSections = sectionsRes.data
          .filter((section: Section) => !section.isDel)
          .sort((a: Section, b: Section) => a.title.localeCompare(b.title));

        const activeElements = elementsRes.data.filter((element: Element) => !element.isDel);

        setSections(sortedSections);
        setElements(activeElements);
        setPrevElements(activeElements);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [templateId]);

  const handleSave = async () => {
    try {
      const changedElements = elements.filter(currentElement => {
        const prevElement = prevElements.find(prev => prev._id === currentElement._id);
        return prevElement && JSON.stringify(currentElement) !== JSON.stringify(prevElement);
      });

      if (changedElements.length > 0) {
        await api.put('/api/admin/template/element', { elements: changedElements });
        setPrevElements(elements);
      }
      window.location.href = '/policies'
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleElementClick = (element: Element) => {
    setSelectedElement(element);
    setSelectedSection(null);
  };

  const handleCheckboxChange = (elementId: string, checked: boolean) => {
    if (!selectedSection) return;

    setElements(prevElements =>
      prevElements.map(element =>
        element._id === elementId
          ? { ...element, section_id: checked ? selectedSection : undefined }
          : element
      )
    );
  };

  const handleCreateSection = async () => {
    if (!sectionTitle.trim()) return;

    try {
      const response = await api.post(`/api/admin/section`, {
        title: sectionTitle.trim(),
        template_id: templateId
      });
      setSections(prev => [...prev, response.data]);
      setSectionTitle("");
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating section:', error);
    }
  };

  const handleEditSection = async () => {
    if (!editingSection || !sectionTitle.trim()) return;

    try {
      const response = await api.put(`/api/admin/section/${editingSection._id}`, {
        title: sectionTitle.trim()
      });
      setSections(prev => prev.map(section =>
        section._id === editingSection._id ? response.data : section
      ));
      setSectionTitle("");
      setEditingSection(null);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  const handleDeleteSection = async () => {
    if (!deletingSection) return;

    try {
      await api.delete(`/api/admin/section/${deletingSection._id}`);
      setSections(prev => prev.filter(section => section._id !== deletingSection._id));
      setDeletingSection(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  const getCurrentElements = () => {
    if (!selectedSection) return [];
    const sectionElements = elements.filter(element => element.section_id === selectedSection);
    const startIndex = (currentPage - 1) * elementsPerPage;
    return sectionElements.slice(startIndex, startIndex + elementsPerPage);
  };

  const totalPages = selectedSection
    ? Math.ceil(elements.filter(e => e.section_id === selectedSection).length / elementsPerPage)
    : 0;

  const renderElementPreview = (element: Element) => (
    <div className="flex-1 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{element.question}</h1>
      <div className="text-gray-500 text-base mb-2">Placeholder: {element.placeholder}</div>
      {element.type === 0 ? (
        <input
          type="text"
          placeholder={element.placeholder}
          className="w-full max-w-md px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-4"
        />
      ) : element.type === 1 && element.answer_result && (
        <div className="gap-2 mt-4">
          {(Array.isArray(element.answer_result) ? element.answer_result : Object.values(element.answer_result))
            .map((option, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`element-${element._id}`}
                  value={option}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sections List */}
      <div className="w-1/5 border-r border-gray-200 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <a href="/policies" className="text-black hover:text-gray-700 transition">← Back</a>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </div>
        <button
          className="w-full px-4 py-2 mb-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={() => setShowCreateModal(true)}
        >
          + Section
        </button>
        <div className="flex-1 overflow-y-auto">
          {sections.map((section) => (
            <div
              key={section._id}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition group ${
                selectedSection === section._id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => { setSelectedSection(section._id); setSelectedElement(null); }}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">{section.title}</div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingSection(section); setSectionTitle(section.title); setShowEditModal(true); }}
                    className="p-1 text-gray-500 hover:text-blue-600"
                  >
                    ✎
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeletingSection(section); setShowDeleteModal(true); }}
                    className="p-1 text-gray-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Element Preview */}
      <div className="w-3/5 border-r border-gray-200 p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="flex-1 h-[90%]">
          {selectedElement ? (
            <div className="bg-white rounded-lg p-4 shadow h-full w-full">
              <div className="flex justify-between items-start mb-6">
                <div className="text-lg font-semibold text-gray-800">
                  {sections.find(s => s._id === selectedElement.section_id)?.title}
                </div>
                <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                  {selectedElement.type === 0 ? 'Input' : 'Select'}
                </span>
              </div>
              {renderElementPreview(selectedElement)}
            </div>
          ) : selectedSection ? (
            <div className="bg-white rounded-lg p-4 shadow h-full w-full">
              <h2 className="text-xl font-semibold mb-4">
                {sections.find(s => s._id === selectedSection)?.title}
              </h2>
              {getCurrentElements().map((element, idx) => (
                <div key={idx} style={{ height: '85%' }}>
                  {renderElementPreview(element)}
                </div>
              ))}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              Select a section to view its elements
            </div>
          )}
        </div>
      </div>

      {/* Elements List */}
      <div className="w-1/5 p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Elements</h2>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center text-gray-500">Loading elements...</div>
          ) : (
            elements.map((element) => {
              const elementSection = sections.find(s => s._id === element.section_id);
              const isCheckboxDisabled = !selectedSection || (selectedSection !== element.section_id && element.section_id !== undefined);

              return (
                <div
                  key={element._id}
                  className={`flex items-center p-3 mb-2 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50 ${
                    selectedElement?._id === element._id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleElementClick(element)}
                >
                  <input
                    type="checkbox"
                    checked={element.section_id !== undefined}
                    onChange={(e) => handleCheckboxChange(element._id, e.target.checked)}
                    disabled={isCheckboxDisabled}
                    className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${
                      isCheckboxDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="ml-3 flex-1">
                    <div className="text-gray-700">{element.question}</div>
                    {elementSection && (
                      <div className="text-xs text-gray-500">Section: {elementSection.title}</div>
                    )}
                    <div className="text-xs text-gray-400">Placeholder: {element.placeholder}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Create New Section</h3>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Enter section title"
              className="w-full px-3 py-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowCreateModal(false); setSectionTitle(""); }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSection}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Section</h3>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Enter section title"
              className="w-full px-3 py-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowEditModal(false); setSectionTitle(""); setEditingSection(null); }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSection}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Delete Section</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{deletingSection?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowDeleteModal(false); setDeletingSection(null); }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSection}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
