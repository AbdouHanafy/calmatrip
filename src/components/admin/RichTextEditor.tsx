'use client';
import { useRef, useEffect, useCallback, useState } from "react";
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link, Link2Off,
  Heading1, Heading2, Heading3,
  Undo, Redo, RemoveFormatting,
  Quote,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;           // HTML string
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;      // px, default 160
}

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolBtn({
  onClick, title, active, children,
}: {
  onClick: () => void;
  title: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded-lg transition-all duration-150 ${
        active
          ? "bg-[#87CEEB]/20 text-[#87CEEB]"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5" />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your description here...",
  minHeight = 160,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const savedRange = useRef<Range | null>(null);
  const isInternalUpdate = useRef(false);

  // Sync external value → DOM (only when value changes externally)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (isInternalUpdate.current) { isInternalUpdate.current = false; return; }
    if (el.innerHTML !== value) el.innerHTML = value;
  }, [value]);

  // Track active formats on selection change
  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    const tags = ["bold", "italic", "underline", "strikeThrough", "insertOrderedList", "insertUnorderedList"];
    tags.forEach((cmd) => { try { if (document.queryCommandState(cmd)) formats.add(cmd); } catch {} });
    const block = document.queryCommandValue("formatBlock").toLowerCase();
    if (block) formats.add(block);
    setActiveFormats(formats);
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveFormats);
    return () => document.removeEventListener("selectionchange", updateActiveFormats);
  }, [updateActiveFormats]);

  const exec = useCallback((cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    isInternalUpdate.current = true;
    onChange(editorRef.current?.innerHTML ?? "");
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  const formatBlock = useCallback((tag: string) => {
    const current = document.queryCommandValue("formatBlock").toLowerCase();
    exec("formatBlock", current === tag ? "p" : tag);
  }, [exec]);

  // Save selection before opening link input
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const insertLink = () => {
    if (!linkUrl.trim()) return;
    restoreSelection();
    exec("createLink", linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`);
    setShowLinkInput(false);
    setLinkUrl("");
    savedRange.current = null;
  };

  const handleInput = () => {
    isInternalUpdate.current = true;
    onChange(editorRef.current?.innerHTML ?? "");
  };

  // Toolbar groups
  const toolbar = [
    [
      { cmd: "undo", icon: <Undo className="w-4 h-4" />, title: "Undo" },
      { cmd: "redo", icon: <Redo className="w-4 h-4" />, title: "Redo" },
    ],
    [
      { cmd: "bold",          icon: <Bold className="w-4 h-4" />,          title: "Bold (Ctrl+B)" },
      { cmd: "italic",        icon: <Italic className="w-4 h-4" />,        title: "Italic (Ctrl+I)" },
      { cmd: "underline",     icon: <Underline className="w-4 h-4" />,     title: "Underline (Ctrl+U)" },
      { cmd: "strikeThrough", icon: <Strikethrough className="w-4 h-4" />, title: "Strikethrough" },
    ],
    [
      { cmd: "h1", icon: <Heading1 className="w-4 h-4" />, title: "Heading 1", isBlock: true },
      { cmd: "h2", icon: <Heading2 className="w-4 h-4" />, title: "Heading 2", isBlock: true },
      { cmd: "h3", icon: <Heading3 className="w-4 h-4" />, title: "Heading 3", isBlock: true },
      { cmd: "blockquote", icon: <Quote className="w-4 h-4" />, title: "Quote", isBlock: true },
    ],
    [
      { cmd: "justifyLeft",    icon: <AlignLeft className="w-4 h-4" />,    title: "Align left" },
      { cmd: "justifyCenter",  icon: <AlignCenter className="w-4 h-4" />,  title: "Center" },
      { cmd: "justifyRight",   icon: <AlignRight className="w-4 h-4" />,   title: "Align right" },
      { cmd: "justifyFull",    icon: <AlignJustify className="w-4 h-4" />, title: "Justify" },
    ],
    [
      { cmd: "insertUnorderedList", icon: <List className="w-4 h-4" />,        title: "Bullet list" },
      { cmd: "insertOrderedList",   icon: <ListOrdered className="w-4 h-4" />, title: "Numbered list" },
    ],
  ];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#87CEEB] focus-within:border-transparent transition-all">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        {toolbar.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <Divider />}
            {group.map((item) => {
              const { cmd, icon, title } = item as any;
              const isBlock = 'isBlock' in item ? (item as any).isBlock : false;
              return (
                <ToolBtn
                  key={cmd}
                  title={title}
                  active={isBlock ? activeFormats.has(cmd) : activeFormats.has(cmd)}
                  onClick={() => (isBlock ? formatBlock(cmd) : exec(cmd))}
                >
                  {icon}
                </ToolBtn>
              );
            })}
          </div>
        ))}

        <Divider />

        {/* Link button */}
        <ToolBtn
          title="Insert link"
          active={showLinkInput}
          onClick={() => {
            if (showLinkInput) { setShowLinkInput(false); return; }
            saveSelection();
            setShowLinkInput(true);
          }}
        >
          <Link className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn title="Remove link" onClick={() => exec("unlink")}>
          <Link2Off className="w-4 h-4" />
        </ToolBtn>

        <Divider />

        {/* Clear formatting */}
        <ToolBtn title="Remove formatting" onClick={() => exec("removeFormat")}>
          <RemoveFormatting className="w-4 h-4" />
        </ToolBtn>
      </div>

      {/* ── Link input bar ── */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#87CEEB]/5 border-b border-gray-200">
          <input
            autoFocus
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insertLink(); } if (e.key === "Escape") setShowLinkInput(false); }}
            placeholder="https://example.com"
            className="flex-1 text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
          />
          <button
            type="button"
            onClick={insertLink}
            className="px-3 py-1.5 bg-[#87CEEB] text-white text-sm rounded-lg hover:bg-[#6ab8d8] transition-colors"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ── Editable area ── */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={(e) => {
            // Tab → indent list
            if (e.key === "Tab") { e.preventDefault(); exec(e.shiftKey ? "outdent" : "indent"); }
          }}
          style={{ minHeight }}
          className="px-4 py-3 text-gray-800 text-sm leading-relaxed focus:outline-none
            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:text-gray-900
            [&_h2]:text-xl  [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:text-gray-900
            [&_h3]:text-lg  [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:text-gray-900
            [&_ul]:list-disc   [&_ul]:pl-5 [&_ul]:my-1
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1
            [&_li]:my-0.5
            [&_blockquote]:border-l-4 [&_blockquote]:border-[#87CEEB] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-2
            [&_a]:text-[#87CEEB] [&_a]:underline [&_a]:cursor-pointer
            [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through
            [&_p]:my-1"
        />
        {/* Placeholder */}
        {!value && (
          <p className="absolute top-3 left-4 text-gray-400 text-sm pointer-events-none select-none">
            {placeholder}
          </p>
        )}
      </div>

      {/* ── Word count ── */}
      <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 flex justify-end">
        <span className="text-xs text-gray-400">
          {(editorRef.current?.innerText ?? value.replace(/<[^>]+>/g, "")).trim().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
    </div>
  );
}
