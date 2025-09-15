import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Category from './components/Category';
import SearchBar from './components/SearchBar';
import AddWidgetModal from './components/AddWidgetModal';
import AddCategoryModal from './components/AddCategoryModal';
import initialData from './data/initialData.json';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('dashboardData');
    return savedData ? JSON.parse(savedData) : initialData;
  });
  
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWidgets, setSelectedWidgets] = useState([]);

  useEffect(() => {
    localStorage.setItem('dashboardData', JSON.stringify(data));
  }, [data]);

  const handleAddWidget = (newWidget) => {
    const newId = Math.max(...data.allWidgets.map(w => w.id), 0) + 1;
    const widgetToAdd = {
      ...newWidget,
      id: newId
    };

    const updatedAllWidgets = [...data.allWidgets, widgetToAdd];
    
    const updatedCategories = data.categories.map(category => {
      if (category.id === widgetToAdd.categoryId) {
        return {
          ...category,
          widgets: [...category.widgets, widgetToAdd]
        };
      }
      return category;
    });

    setData({
      ...data,
      allWidgets: updatedAllWidgets,
      categories: updatedCategories
    });
  };

  const handleAddCategory = (categoryName) => {
    const newId = Math.max(...data.categories.map(c => c.id), 0) + 1;
    const newCategory = {
      id: newId,
      name: categoryName,
      widgets: []
    };

    setData({
      ...data,
      categories: [...data.categories, newCategory]
    });
  };

  const handleRemoveWidget = (widgetId) => {
    const updatedCategories = data.categories.map(category => ({
      ...category,
      widgets: category.widgets.filter(widget => widget.id !== widgetId)
    }));

    const updatedAllWidgets = data.allWidgets.filter(widget => widget.id !== widgetId);

    setData({
      ...data,
      allWidgets: updatedAllWidgets,
      categories: updatedCategories
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredWidgets = data.allWidgets.filter(widget =>
    widget.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleManageWidgets = () => {
    setShowManageModal(true);
  };

  const handleToggleWidget = (widgetId) => {
    setSelectedWidgets(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId) 
        : [...prev, widgetId]
    );
  };

  const handleRemoveSelectedWidgets = () => {
    const updatedCategories = data.categories.map(category => ({
      ...category,
      widgets: category.widgets.filter(widget => !selectedWidgets.includes(widget.id))
    }));

    const updatedAllWidgets = data.allWidgets.filter(widget => !selectedWidgets.includes(widget.id));

    setData({
      ...data,
      allWidgets: updatedAllWidgets,
      categories: updatedCategories
    });

    setSelectedWidgets([]);
    setShowManageModal(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Dashboard
          </Typography>
          <Box>
            <Button 
              variant="outlined" 
              onClick={handleManageWidgets}
              sx={{ mr: 1 }}
            >
              Manage Widgets
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setShowAddCategoryModal(true)}
              sx={{ mr: 1 }}
            >
              Add Category
            </Button>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setShowAddWidgetModal(true)}
            >
              Add Widget
            </Button>
          </Box>
        </Box>

        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={handleSearch}
        />

        {data.categories.map(category => (
          <Category 
            key={category.id} 
            category={category} 
            onRemoveWidget={handleRemoveWidget}
          />
        ))}

        <AddWidgetModal
          open={showAddWidgetModal}
          onClose={() => setShowAddWidgetModal(false)}
          categories={data.categories}
          onAddWidget={handleAddWidget}
        />

        <AddCategoryModal
          open={showAddCategoryModal}
          onClose={() => setShowAddCategoryModal(false)}
          onAddCategory={handleAddCategory}
        />

        <Dialog open={showManageModal} onClose={() => setShowManageModal(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Manage Widgets
            <IconButton
              aria-label="close"
              onClick={() => setShowManageModal(false)}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Select widgets to remove from all categories
            </Typography>
            <List>
              {data.allWidgets.map(widget => (
                <ListItem key={widget.id} dense>
                  <Checkbox
                    edge="start"
                    checked={selectedWidgets.includes(widget.id)}
                    tabIndex={-1}
                    disableRipple
                    onChange={() => handleToggleWidget(widget.id)}
                  />
                  <ListItemText 
                    primary={widget.name} 
                    secondary={
                      <Box>
                        <Typography variant="body2" component="span">
                          {widget.content}
                        </Typography>
                        <Typography variant="caption" display="block" color="textSecondary">
                          Category: {data.categories.find(c => c.id === widget.categoryId)?.name || 'Uncategorized'}
                        </Typography>
                      </Box>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowManageModal(false)}>Cancel</Button>
            <Button 
              onClick={handleRemoveSelectedWidgets} 
              color="error"
              disabled={selectedWidgets.length === 0}
            >
              Remove Selected ({selectedWidgets.length})
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default App;

