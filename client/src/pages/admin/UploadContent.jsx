import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useContent } from '../../hooks';
import '../../styles/form.css';
import './AdminPages.css';

const UploadContent = () => {
  const {
    content,
    loading,
    error,
    createContent,
    deleteContent
  } = useContent();

  const [title, setTitle] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter state
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUploads = content.filter(upload => {
    return (
      (!filterClass || upload.class.toLowerCase().includes(filterClass.toLowerCase())) &&
      (!filterSubject || upload.subject.toLowerCase().includes(filterSubject.toLowerCase())) &&
      (!filterType || upload.type === filterType) &&
      (!searchTerm || 
        upload.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  useEffect(()=> {
    if (!loading && !error && content.length) {
      setMessage('');
    }
  }, [content, loading, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file to upload.');
      setMessageType('error');
      return;
    }

    if (!title || !classLevel || !subject) {
      setMessage('Please fill in all required fields.');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setMessage('');
    setMessageType('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const data = await createContent(formData);

      setTitle('');
      setClassLevel('');
      setSubject('');
      setFile(null);
      setUploadProgress(0);
      setMessage('File successfully uploaded.');
      setMessageType('success');
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Upload failed. Please try again.');
      setMessageType('error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent(contentId);
        setMessage('Content deleted successfully.');
        setMessageType('success');
      } catch (error) {
        console.error('Delete error:', error);
        setMessage('Failed to delete content. Please try again.');
        setMessageType('error');
      }
    }
  };

  // Filter and paginate uploads
  useEffect(() => {
    let filtered = uploads;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(upload => 
        upload.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(upload => {
        if (filterType === 'video') return upload.type === 'video/mp4';
        if (filterType === 'pdf') return upload.type === 'application/pdf';
        return true;
      });
    }
    
    setFilteredUploads(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [uploads, searchTerm, filterType]);

  const loadUploads = () => {
    const videos = load('videos', []);
    const pdfs = load('pdfs', []);
    setUploads([...videos, ...pdfs]);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('Please select a file to upload.');
      setMessageType('error');
      return;
    }

    if (!title || !classLevel || !subject) {
      setMessage('Please fill in all required fields.');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setMessage('');
    setMessageType('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use XHR for progress tracking
      const uploadPromise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        };
        
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data);
            } catch (error) {
              reject(new Error('Invalid response from server'));
            }
          } else {
            reject(new Error('Upload failed'));
          }
        };
        
        xhr.onerror = () => reject(new Error('Upload failed'));
        
        xhr.open('POST', `${API_BASE_URL}/api/upload`);
        xhr.send(formData);
      });

      const data = await uploadPromise;
      
      const contentData = {
        id: Date.now().toString(),
        title,
        class: classLevel,
        subject,
        url: data.url,
        type: file.type,
        fileName: file.name,
        size: file.size,
        uploadDate: new Date().toISOString(),
      };

      // Save to appropriate localStorage array based on file type
      if (file.type === 'video/mp4') {
        const videos = load('videos', []);
        videos.push(contentData);
        save('videos', videos);
      } else if (file.type === 'application/pdf') {
        const pdfs = load('pdfs', []);
        pdfs.push(contentData);
        save('pdfs', pdfs);
      }

      // Reset form
      setTitle('');
      setClassLevel('');
      setSubject('');
      setFile(null);
      setUploadProgress(0);
      setMessage('File successfully uploaded.');
      setMessageType('success');
      
      // Refresh uploads list
      loadUploads();
      
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Upload failed. Please try again.');
      setMessageType('error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (contentId, type) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        // Future: Make DELETE request to backend
        // await fetch(`${API_BASE_URL}/api/upload/${contentId}`, {
        //   method: 'DELETE',
        // });
        
        // For now, remove from localStorage
        if (type === 'video/mp4') {
          const videos = load('videos', []);
          const updatedVideos = videos.filter(video => video.id !== contentId);
          save('videos', updatedVideos);
        } else if (type === 'application/pdf') {
          const pdfs = load('pdfs', []);
          const updatedPdfs = pdfs.filter(pdf => pdf.id !== contentId);
          save('pdfs', updatedPdfs);
        }
        
        loadUploads();
        setMessage('Content deleted successfully.');
        setMessageType('success');
      } catch (error) {
        console.error('Delete error:', error);
        setMessage('Failed to delete content. Please try again.');
        setMessageType('error');
      }
    }
  };

  // Helper functions
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type === 'video/mp4') return '🎥';
    if (type === 'application/pdf') return '📄';
    return '📁';
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredUploads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUploads = filteredUploads.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <ProtectedRoute role="school">
      <div className="admin-page">
        <div className="page-header">
          <h1>Upload Educational Content</h1>
          <p>Upload videos, PDFs, and other educational resources for students.</p>
        </div>

        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="classLevel">Class *</label>
            <input
              type="text"
              id="classLevel"
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              placeholder="e.g., 10th Grade"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="file">File Upload * (MP4 videos or PDF files only)</label>
            <input 
              type="file" 
              id="file" 
              onChange={handleFileChange} 
              accept="video/mp4,application/pdf"
              required 
            />
          </div>

          <button type="submit" className="btn-primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="upload-progress-container">
              <div className="upload-progress-bar">
                <div 
                  className="upload-progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="upload-progress-text">{uploadProgress}%</span>
            </div>
          )}

          {/* File Preview */}
          {file && (
            <div className="file-preview">
              <div className="file-info">
                <span className="file-icon">{getFileIcon(file.type)}</span>
                <div className="file-details">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{formatFileSize(file.size)}</div>
                </div>
              </div>
            </div>
          )}

          {message && <div className={`form-message ${messageType}`}>{message}</div>}
        </form>

        {/* Filter and Search */}
        <div className="filter-search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, class, or subject..."
            className="search-input"
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="video">Videos</option>
            <option value="pdf">PDFs</option>
          </select>
        </div>

        {/* Uploads Table */}
        <div className="uploads-section">
          <h2>Uploaded Content</h2>
          {paginatedUploads.length === 0 ? (
            <p>No content found.</p>
          ) : (
            <div className="uploads-table-container">
              <table className="uploads-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Upload Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUploads.map((upload) => (
                    <tr key={upload.id}>
                      <td>{upload.title}</td>
                      <td>{upload.class}</td>
                      <td>{upload.subject}</td>
                      <td>
                        <span className={`file-type ${upload.type === 'video/mp4' ? 'video' : 'pdf'}`}>
                          {upload.type === 'video/mp4' ? 'Video' : 'PDF'}
                        </span>
                      </td>
                      <td>{formatFileSize(upload.size)}</td>
                      <td>{new Date(upload.uploadDate).toLocaleDateString()}</td>
                      <td>
                        <a
                          href={upload.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="preview-btn"
                        >
                          Preview
                        </a>
                        <button
                          onClick={() => handleDelete(upload.id, upload.type)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="pagination-controls">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UploadContent;

