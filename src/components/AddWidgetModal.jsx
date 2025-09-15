import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';

const AddWidgetModal = ({ open, onClose, categories, onAddWidget }) => {
  const [widgetName, setWidgetName] = useState('');
  const [widgetContent, setWidgetContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmit = () => {
    if (widgetName && widgetContent && selectedCategory) {
      onAddWidget({
        name: widgetName,
        content: widgetContent,
        categoryId: parseInt(selectedCategory)
      });
      setWidgetName('');
      setWidgetContent('');
      setSelectedCategory('');
      onClose();
    }
  };

  const handleClose = () => {
    setWidgetName('');
    setWidgetContent('');
    setSelectedCategory('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Widget</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Widget Name"
            fullWidth
            variant="outlined"
            value={widgetName}
            onChange={(e) => setWidgetName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Widget Content"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={widgetContent}
            onChange={(e) => setWidgetContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!widgetName || !widgetContent || !selectedCategory}
        >
          Add Widget
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWidgetModal;
