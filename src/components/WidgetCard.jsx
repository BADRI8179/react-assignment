import React from 'react';
import { Card, CardContent, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const WidgetCard = ({ widget, onRemove }) => {
  const getChartData = () => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    
    const numericValue = parseInt(widget.content.match(/\d+/)?.[0] || 50);
    
    if (widget.name.toLowerCase().includes('score') || widget.name.toLowerCase().includes('usage')) {
      return {
        labels: ['Current', 'Remaining'],
        datasets: [
          {
            data: [numericValue, 100 - numericValue],
            backgroundColor: [colors[0], colors[1]],
            hoverBackgroundColor: [colors[0], colors[1]],
          },
        ],
      };
    }
    
    if (widget.name.toLowerCase().includes('threat') || widget.name.toLowerCase().includes('user')) {
      return {
        labels: ['Current', 'Previous'],
        datasets: [
          {
            label: widget.name,
            data: [numericValue, Math.max(1, numericValue - 2)],
            backgroundColor: [colors[2], colors[3]],
          },
        ],
      };
    }
    
    if (widget.name.toLowerCase().includes('trend') || widget.name.toLowerCase().includes('rate')) {
      return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: widget.name,
            data: [numericValue - 2, numericValue - 1, numericValue, numericValue + 1],
            borderColor: colors[4],
            tension: 0.1,
            fill: false,
          },
        ],
      };
    }
    
    return {
      labels: ['Value 1', 'Value 2', 'Value 3'],
      datasets: [
        {
          data: [30, 40, 30],
          backgroundColor: [colors[0], colors[1], colors[2]],
          hoverBackgroundColor: [colors[0], colors[1], colors[2]],
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
        },
      },
    },
  };

  const renderChart = () => {
    if (widget.name.toLowerCase().includes('score') || widget.name.toLowerCase().includes('usage')) {
      return <Pie data={getChartData()} options={chartOptions} />;
    } else if (widget.name.toLowerCase().includes('threat') || widget.name.toLowerCase().includes('user')) {
      return <Bar data={getChartData()} options={chartOptions} />;
    } else if (widget.name.toLowerCase().includes('trend') || widget.name.toLowerCase().includes('rate')) {
      return <Line data={getChartData()} options={chartOptions} />;
    } else {
      return <Pie data={getChartData()} options={chartOptions} />;
    }
  };

  return (
    <Card sx={{ 
      width: 300, 
      height: 350,
      m: 1, 
      position: 'relative',
      boxShadow: 2,
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <IconButton 
        sx={{ position: 'absolute', right: 4, top: 4, zIndex: 10 }} 
        onClick={() => onRemove(widget.id)}
        aria-label="remove widget"
        size="small"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography variant="h6" component="div" gutterBottom align="center">
          {widget.name}
        </Typography>
        <Box sx={{ height: 200, flexGrow: 1 }}>
          {renderChart()}
        </Box>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          {widget.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WidgetCard;
