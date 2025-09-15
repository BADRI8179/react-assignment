import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import WidgetCard from './WidgetCard';

const Category = ({ category, onRemoveWidget }) => {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ pb: 1, borderBottom: '1px solid #e0e0e0' }}>
        {category.name}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
        {category.widgets.map((widget) => (
          <WidgetCard 
            key={widget.id} 
            widget={widget} 
            onRemove={onRemoveWidget}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default Category;
