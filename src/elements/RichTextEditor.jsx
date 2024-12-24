import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import mention from 'quill-mention';
import { uploadAttachment } from '../services/attachment';
import ImageResize from 'quill-image-resize';
import { Label } from '@/componentss/ui/label';
import { Image } from 'lucide-react';
Quill.register('modules/imageResize', ImageResize);

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link'],
  [{ color: [] }, { background: [] }],
  [{ align: [] }]
];

const RichTextEditor = ({
  label,
  required = false,
  maxLength,
  value,
  onChange,
  placeholder = '',
  style,
  form,
  atValues,
  taggedEmails,
  setTaggedEmails,
  validation,
  disabled
}) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [helperText, setHelperText] = useState('');
  const editorContainerRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState(310);
  const [showToolbar, setShowToolbar] = useState(false);
  const [touched, setTouched] = useState(false);
  const [mentionedNames, setMentionedNames] = useState([]);
  const [contentLength, setContentLength] = useState(value?.length || 0);
  const URL = process.env.REACT_APP_STORAGE_URL;

  const hashValues = [];

  useEffect(() => {
    if (required && touched && contentLength === 0) {
      setHelperText(`${label} field can't be empty..!`);
    } else if (maxLength && contentLength > maxLength) {
      setHelperText(`Maximum allowed characters is ${maxLength}.`);
    } else if (validation?.type) {
      setHelperText(validation?.message || `${label} field can't be empty..!`);
    } else {
      setHelperText('');
    }
  }, [
    touched,
    value,
    required,
    label,
    maxLength,
    contentLength,
    validation?.message
  ]);

  const uploadAttachmentsHandler = async (file) => {
    if (!file || !form) return null;

    try {
      const res = await uploadAttachment(form.name, file);
      const { result } = res;
      const { filePath, fileName } = result;
      const imageUrl = `${URL}/${filePath}/${fileName}`;
      return imageUrl;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      return null;
    }
  };
  const extractMentionedNames = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const mentions = doc.querySelectorAll('.mention');
    const names = [];

    mentions.forEach((mention) => {
      const nameElement = mention.querySelector(
        'span[contenteditable="false"]'
      );
      if (nameElement) {
        const text = nameElement.childNodes[1].textContent.trim();
        names.push(text);
      }
    });

    return names;
  };

  const handleImageUpload = async (file) => {
    const url = await uploadAttachmentsHandler(file);
    const editor = quillRef.current;

    if (editor && url) {
      const range = editor.selection;
      if (range) {
        editor.insertEmbed(range.index, 'image', url);
        editor.setSelection(range.index + 1);
      } else {
        console.warn('No selection found. Image not inserted.');
      }
    } else {
      console.warn('Editor not initialized or image upload failed.');
    }
  };

  const openImageDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        await handleImageUpload(file);
      }
    };
    input.click();
  };

  const startResizing = (e) => {
    const startY = e.clientY;
    const startHeight = editorHeight;

    const onMouseMove = (event) => {
      const newHeight = startHeight + (event.clientY - startY);
      if (newHeight > 100) {
        setEditorHeight(newHeight);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleClickOutside = (event, disabled) => {
    if (disabled) return;
    if (
      editorContainerRef.current &&
      !editorContainerRef.current.contains(event.target)
    ) {
      setShowToolbar(false);
    } else {
      if (disabled) {
        setShowToolbar(false);
      } else {
        setShowToolbar(true);
      }
    }
  };

  useEffect(() => {
    if (disabled) {
      setShowToolbar(false);
    }
  }, [showToolbar]);

  useEffect(() => {
    if (disabled) return;
    document.addEventListener('mousedown', (e) =>
      handleClickOutside(e, disabled)
    );
    return () => {
      document.removeEventListener('mousedown', (e) =>
        handleClickOutside(e, disabled)
      );
    };
  }, []);

  useEffect(() => {
    if (mentionedNames) {
      if (mentionedNames && mentionedNames.length > 0) {
        const filteredUsers = atValues?.filter((user) =>
          mentionedNames?.includes(user?.name)
        );
        if (typeof setTaggedEmails === 'function') {
          setTaggedEmails(filteredUsers);
        }
      } else {
        if (typeof setTaggedEmails === 'function') {
          setTaggedEmails([]);
        }
      }
    }
  }, [mentionedNames, atValues]);
  useEffect(() => {
    const mentionedNames = extractMentionedNames(value);
    setMentionedNames(mentionedNames);
  }, []);

  const handleContentChange = (content) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) {
      setContentLength(textContent.length);
      onChange(content);
    }

    const mentionedNames = extractMentionedNames(content);

    setMentionedNames(mentionedNames);
  };

  useEffect(() => {
    if (!quillRef.current) {
      const quill = new Quill(editorRef.current, {
        debug: 'info',
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: TOOLBAR_OPTIONS,
          imageResize: {},
          mention: {
            allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
            mentionDenotationChars: ['@', '#'],
            source: function (searchTerm, renderList, mentionChar) {
              let values;

              if (mentionChar === '@') {
                values = atValues;
              } else {
                values = hashValues;
              }

              if (searchTerm.length >= 3) {
                const matches = values?.filter((user) =>
                  user?.email
                    ?.toLowerCase()
                    ?.includes(searchTerm?.toLowerCase())
                );

                renderList(
                  matches?.map((user) => ({
                    id: user?.id,
                    value: user?.name,
                    email: user?.email
                  })),
                  searchTerm
                );
              }
            },
            renderItem: function (item) {
              return `${item?.email}`;
            },
            onSelect: function (item, insertItem) {
              // Check if the user is already mentioned
              if (!mentionedNames.includes(item?.value)) {
                const emailAnchor = `<a href="mailto:${item?.email}">${item?.value}</a>`;
                insertItem(emailAnchor);
              } else {
                console.log('User already mentioned!');
              }
            }
          }
        }
      });

      quillRef.current = quill;
      if (value) {
        const updatedValue = value?.replace(/STORAGE_URL/g, URL);
        quillRef?.current?.clipboard?.dangerouslyPasteHTML(updatedValue);
      }

      quillRef?.current?.on('text-change', () => {
        const html = editorRef?.current?.querySelector('.ql-editor')?.innerHTML;
        handleContentChange(html);
      });
    }

    if (disabled && quillRef.current) {
      quillRef.current.enable(false);
    } else if (quillRef.current) {
      quillRef.current.enable(true);
    }
  }, [value, atValues, hashValues, maxLength, placeholder, disabled]);

  const currentContentRef = useRef(value);

  useEffect(() => {
    if (quillRef.current && currentContentRef.current !== value) {
      const updatedValue = value.replace(/STORAGE_URL/g, URL);
      quillRef.current.root.innerHTML = updatedValue || '';
      currentContentRef.current = updatedValue;
    }
  }, [URL]);
  useEffect(() => {
    const toolbarElements =
      document.getElementsByClassName('ql-toolbar ql-snow');

    if (toolbarElements.length > 0) {
      const toolbar = toolbarElements[0];
      toolbar.style.display = showToolbar ? 'block' : 'none';
    }
  }, [showToolbar]);
  return (
    <div style={{ ...style, width: '100%' }}>
      {label && (
        <Label className="text-sm">
          {label}
          {required && <span className="text-destructive"> &#42;</span>}
        </Label>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div
          ref={editorContainerRef}
          style={{
            '& .quill': {
              backgroundColor: 'grey.50',
              borderRadius: '5px',
              border: !showToolbar && '1px solid grey',
              position: 'relative',
              '& .ql-toolbar': {
                display: showToolbar ? 'block' : 'none !important',
                backgroundColor: 'grey.100',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px'
              },
              '& .ql-container': {
                border: !showToolbar && 'none',
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px',
                height: `${editorHeight}px`,
                paddingBottom: '10px'
              }
            },
            position: 'relative'
          }}
        >
          <div
            ref={editorRef}
            style={{
              height: `${editorHeight}px`,
              overflow: 'auto',
              resize: 'vertical',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <div
              className="quill"
              style={{
                borderRadius: '5px',
                border: !showToolbar ? '1px solid grey' : 'none',
                position: 'relative'
              }}
            >
              {showToolbar && (
                <div
                  className="ql-toolbar"
                  style={{
                    display: showToolbar ? 'block' : 'none',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '5px'
                  }}
                />
              )}
              <div
                className="ql-container"
                style={{
                  border: !showToolbar ? 'none' : '1px solid grey',
                  borderBottomLeftRadius: '5px',
                  borderBottomRightRadius: '5px',
                  height: `${editorHeight}px`,
                  paddingBottom: '10px'
                }}
              />
            </div>
          </div>
          {showToolbar && (
            <Image
              onClick={openImageDialog}
              style={{
                position: 'absolute',
                top: '10px',
                right: '16px',
                zIndex: 10,
                cursor: 'pointer',
                fontSize: '20px'
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              bottom: '-4px',
              width: '100%',
              height: '4px',
              cursor: 'ns-resize'
            }}
            onMouseDown={startResizing}
          />
        </div>
      </div>

      <p
        className={`text-xs ${
          contentLength === maxLength ? 'text-destructive' : 'text-gray-500'
        }`}
      >
        {contentLength}/{maxLength} characters
      </p>

      {/* {helperText && (
          <p
            className={`h-3 text-xs font-medium ${
              validation?.type === 'info' ? 'text-warning' : 'text-destructive'
            }`}
          >
            {helperText}
          </p>
        )} */}
    </div>
  );
};

export default RichTextEditor;
