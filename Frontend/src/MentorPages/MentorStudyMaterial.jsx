import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, GetApp as DownloadIcon } from '@mui/icons-material';

const MentorStudyMaterials = () => {
  const [materials, setMaterials] = useState([
    {
      id: 1,
      title: 'React Fundamentals',
      subject: 'Web Development',
      description: 'Complete guide to React basics',
      uploadDate: '2024-01-15'
    }
  ]);

  const [uploadDialog, setUploadDialog] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    subject: '',
    description: '',
    file: null
  });

  const handleUpload = () => {
    // Upload logic here
    const material = {
      id: materials.length + 1,
      ...newMaterial,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setMaterials([...materials, material]);
    setUploadDialog(false);
    setNewMaterial({ title: '', subject: '', description: '', file: null });
  };

  const handleDelete = (id) => {
    setMaterials(materials.filter(material => material.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Study Materials</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setUploadDialog(true)}
        >
          Upload Material
        </Button>
      </Box>

      <Grid container spacing={3}>
        {materials.map((material) => (
          <Grid item xs={12} sm={6} md={4} key={material.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {material.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {material.subject}
                </Typography>
                <Typography variant="body2">
                  {material.description}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Uploaded: {material.uploadDate}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small">
                  <DownloadIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => handleDelete(material.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upload Dialog */}
      <Dialog 
        open={uploadDialog} 
        onClose={() => setUploadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Study Material</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={newMaterial.title}
            onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Subject</InputLabel>
            <Select
              value={newMaterial.subject}
              label="Subject"
              onChange={(e) => setNewMaterial(prev => ({ ...prev, subject: e.target.value }))}
            >
              <MenuItem value="Web Development">Web Development</MenuItem>
              <MenuItem value="AI/ML">AI/ML</MenuItem>
              <MenuItem value="DevOps">DevOps</MenuItem>
              <MenuItem value="Data Science">Data Science</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={newMaterial.description}
            onChange={(e) => setNewMaterial(prev => ({ ...prev, description: e.target.value }))}
            margin="normal"
          />
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload PDF
            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={(e) => setNewMaterial(prev => ({ ...prev, file: e.target.files[0] }))}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpload} 
            variant="contained"
            disabled={!newMaterial.title || !newMaterial.subject || !newMaterial.file}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MentorStudyMaterials;