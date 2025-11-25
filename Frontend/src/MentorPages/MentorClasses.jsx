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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, VideoCall as VideoCallIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const MentorClasses = () => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      title: 'Advanced React Patterns',
      subject: 'Web Development',
      classType: 'online',
      startTime: '2024-12-01T10:00:00',
      endTime: '2024-12-01T11:30:00',
      meetingLink: 'https://meet.google.com/abc-def-ghi',
      description: 'Learn advanced React patterns and best practices'
    }
  ]);

  const [classDialog, setClassDialog] = useState({ open: false, class: null });
  const [newClass, setNewClass] = useState({
    title: '',
    subject: '',
    classType: 'online',
    startTime: null,
    endTime: null,
    meetingLink: '',
    description: ''
  });

  const handleSaveClass = () => {
    if (classDialog.class) {
      // Update existing class
      setClasses(classes.map(cls => 
        cls.id === classDialog.class.id ? { ...cls, ...newClass } : cls
      ));
    } else {
      // Add new class
      const classItem = {
        id: classes.length + 1,
        ...newClass
      };
      setClasses([...classes, classItem]);
    }
    setClassDialog({ open: false, class: null });
    setNewClass({
      title: '',
      subject: '',
      classType: 'online',
      startTime: null,
      endTime: null,
      meetingLink: '',
      description: ''
    });
  };

  const handleEdit = (classItem) => {
    setNewClass(classItem);
    setClassDialog({ open: true, class: classItem });
  };

  const handleDelete = (id) => {
    setClasses(classes.filter(cls => cls.id !== id));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Classes</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setClassDialog({ open: true, class: null })}
          >
            Schedule Class
          </Button>
        </Box>

        <Grid container spacing={3}>
          {classes.map((classItem) => (
            <Grid item xs={12} md={6} key={classItem.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6">{classItem.title}</Typography>
                    <Chip 
                      label={classItem.classType} 
                      color={classItem.classType === 'online' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    {classItem.subject}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {new Date(classItem.startTime).toLocaleString()} - {new Date(classItem.endTime).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    {classItem.description}
                  </Typography>
                  {classItem.meetingLink && (
                    <Button
                      startIcon={<VideoCallIcon />}
                      href={classItem.meetingLink}
                      target="_blank"
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Join Meeting
                    </Button>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(classItem)}
                    size="small"
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(classItem.id)}
                    size="small"
                    color="error"
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Class Dialog */}
        <Dialog 
          open={classDialog.open} 
          onClose={() => setClassDialog({ open: false, class: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {classDialog.class ? 'Edit Class' : 'Schedule New Class'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={newClass.title}
              onChange={(e) => setNewClass(prev => ({ ...prev, title: e.target.value }))}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Subject</InputLabel>
              <Select
                value={newClass.subject}
                label="Subject"
                onChange={(e) => setNewClass(prev => ({ ...prev, subject: e.target.value }))}
              >
                <MenuItem value="Web Development">Web Development</MenuItem>
                <MenuItem value="AI/ML">AI/ML</MenuItem>
                <MenuItem value="DevOps">DevOps</MenuItem>
                <MenuItem value="Data Science">Data Science</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Class Type</InputLabel>
              <Select
                value={newClass.classType}
                label="Class Type"
                onChange={(e) => setNewClass(prev => ({ ...prev, classType: e.target.value }))}
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
            <DateTimePicker
              label="Start Time"
              value={newClass.startTime}
              onChange={(newValue) => setNewClass(prev => ({ ...prev, startTime: newValue }))}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
            <DateTimePicker
              label="End Time"
              value={newClass.endTime}
              onChange={(newValue) => setNewClass(prev => ({ ...prev, endTime: newValue }))}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
            {newClass.classType === 'online' && (
              <TextField
                fullWidth
                label="Meeting Link"
                value={newClass.meetingLink}
                onChange={(e) => setNewClass(prev => ({ ...prev, meetingLink: e.target.value }))}
                margin="normal"
                placeholder="https://meet.google.com/abc-def-ghi"
              />
            )}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={newClass.description}
              onChange={(e) => setNewClass(prev => ({ ...prev, description: e.target.value }))}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClassDialog({ open: false, class: null })}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveClass} 
              variant="contained"
              disabled={!newClass.title || !newClass.subject || !newClass.startTime || !newClass.endTime}
            >
              {classDialog.class ? 'Update' : 'Schedule'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default MentorClasses;