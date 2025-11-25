import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
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
import { Add as AddIcon, Delete as DeleteIcon, PlayArrow as PlayIcon } from '@mui/icons-material';

const MentorVideoLectures = () => {
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'React Hooks Tutorial',
      subject: 'Web Development',
      duration: '15:30',
      uploadDate: '2024-01-10',
      thumbnailUrl: '/placeholder-thumbnail.jpg'
    }
  ]);

  const [uploadDialog, setUploadDialog] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    subject: '',
    description: '',
    duration: '',
    videoFile: null,
    thumbnailFile: null
  });

  const handleUpload = () => {
    // Upload logic here
    const video = {
      id: videos.length + 1,
      ...newVideo,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setVideos([...videos, video]);
    setUploadDialog(false);
    setNewVideo({
      title: '',
      subject: '',
      description: '',
      duration: '',
      videoFile: null,
      thumbnailFile: null
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Video Lectures</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setUploadDialog(true)}
        >
          Upload Video
        </Button>
      </Box>

      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={video.thumbnailUrl}
                alt={video.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {video.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {video.subject} • {video.duration}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Uploaded: {video.uploadDate}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" color="primary">
                  <PlayIcon />
                </IconButton>
                <IconButton size="small" color="error">
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
        <DialogTitle>Upload Video Lecture</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={newVideo.title}
            onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Subject</InputLabel>
            <Select
              value={newVideo.subject}
              label="Subject"
              onChange={(e) => setNewVideo(prev => ({ ...prev, subject: e.target.value }))}
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
            value={newVideo.description}
            onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Duration (HH:MM)"
            value={newVideo.duration}
            onChange={(e) => setNewVideo(prev => ({ ...prev, duration: e.target.value }))}
            margin="normal"
            placeholder="15:30"
          />
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 1 }}
          >
            Upload Video
            <input
              type="file"
              hidden
              accept="video/*"
              onChange={(e) => setNewVideo(prev => ({ ...prev, videoFile: e.target.files[0] }))}
            />
          </Button>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 1 }}
          >
            Upload Thumbnail
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setNewVideo(prev => ({ ...prev, thumbnailFile: e.target.files[0] }))}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpload} 
            variant="contained"
            disabled={!newVideo.title || !newVideo.subject || !newVideo.videoFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MentorVideoLectures;