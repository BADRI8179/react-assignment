import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const Widget = ({ widget, categoryId, onRemove, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(widget.content);

  const handleSave = () => {
    onEdit(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(widget.content);
    setIsEditing(false);
  };

  return (
    <div className="widget">
      <div className="widget-header">
        <h3>{widget.name}</h3>
        <div className="widget-actions">
          {!isEditing ? (
            <button className="edit-widget" onClick={() => setIsEditing(true)}>
              <EditIcon fontSize="small" />
            </button>
          ) : (
            <button className="save-widget" onClick={handleSave}>
              <SaveIcon fontSize="small" />
            </button>
          )}
          <button className="remove-widget" onClick={onRemove}>
            <CloseIcon fontSize="small" />
          </button>
        </div>
      </div>
      <div className="widget-content">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="widget-edit-textarea"
          />
        ) : (
          <p>{widget.content}</p>
        )}
      </div>
      {isEditing && (
        <div className="widget-edit-actions">
          <button onClick={handleCancel} className="btn-secondary btn-small">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Widget;