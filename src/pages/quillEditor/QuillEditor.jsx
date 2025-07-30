import { useEffect, useRef } from 'react';
import Quill from 'quill';

const QuillEditor = ({ onContentChange, value }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your blog content here...',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
          ],
        },
      });

      // Trigger content change callback
      quillInstance.current.on('text-change', () => {
        const html = editorRef.current.querySelector('.ql-editor').innerHTML;
        onContentChange(html);
      });

      // Set initial content if provided
      if (value) {
        quillInstance.current.clipboard.dangerouslyPasteHTML(value);
      }
    }
  }, []);

  // Optional: Update editor if value changes from outside
  useEffect(() => {
    if (quillInstance.current && value) {
      const currentHtml = editorRef.current.querySelector('.ql-editor').innerHTML;
      if (currentHtml !== value) {
        quillInstance.current.clipboard.dangerouslyPasteHTML(value);
      }
    }
  }, [value]);

  return <div ref={editorRef} style={{ height: '300px' }} />;
};

export default QuillEditor;
