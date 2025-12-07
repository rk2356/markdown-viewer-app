
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Editor from './components/Editor';
import Preview from './components/Preview';
import TableOfContents from './components/TableOfContents';
import { DEFAULT_MARKDOWN } from './lib/constants';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(() => {
    const saved = localStorage.getItem('promark-content');
    return saved !== null ? saved : DEFAULT_MARKDOWN;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditorVisible, setIsEditorVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem('promark-content', markdown);
  }, [markdown]);

  const handleUpload = (content: string) => {
    setMarkdown(content);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the editor? This cannot be undone.')) {
      setMarkdown('');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const toggleEditor = () => {
    setIsEditorVisible(!isEditorVisible);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-custom-dark text-slate-200 print:h-auto print:overflow-visible print:bg-white">
      <Header 
        onUpload={handleUpload} 
        onClear={handleClear} 
        isSidebarOpen={isSidebarOpen} 
        onToggleSidebar={toggleSidebar}
        isEditorVisible={isEditorVisible}
        onToggleEditor={toggleEditor}
        markdown={markdown}
      />
      
      <div className="flex-1 flex overflow-hidden relative print:h-auto print:overflow-visible print:block">
        
        {/* Sidebar: Table of Contents - Hidden on print */}
        {isSidebarOpen && (
            <aside className="w-64 bg-[#2a2a28] border-r border-white/5 flex-shrink-0 hidden md:block transition-all duration-300 no-print">
                <TableOfContents markdown={markdown} />
            </aside>
        )}

        {/* Main Content Area: Split View */}
        <main className="flex-1 flex flex-col md:flex-row min-w-0 print:block print:h-auto print:overflow-visible">
          {/* Editor Pane (Hidden by default, toggled via Header) - Hidden on print */}
          {isEditorVisible && (
             <div className="h-1/2 md:h-full md:w-1/2 border-r border-custom-border z-10 no-print min-w-0">
                <Editor value={markdown} onChange={setMarkdown} />
             </div>
          )}

          {/* Preview Pane (Always visible, takes full width if editor hidden) */}
          <div className={`h-full bg-custom-dark min-w-0 print:w-full print:h-auto print:overflow-visible print:bg-white ${isEditorVisible ? 'md:w-1/2' : 'w-full'}`}>
            <Preview markdown={markdown} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
