import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating
} from '@mui/material';
import { Feedback as FeedbackIcon, Visibility as ViewIcon } from '@mui/icons-material';

const MentorUsers = () => {
  const [interns] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      progress: 75,
      status: 'active',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      progress: 60,
      status: 'active',
      joinDate: '2024-02-01'
    }
  ]);

  const [feedbackDialog, setFeedbackDialog] = useState({ open: false, intern: null });
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });

  const handleOpenFeedback = (intern) => {
    setFeedbackDialog({ open: true, intern });
    setFeedback({ rating: 0, comment: '' });
  };

  const handleSubmitFeedback = () => {
    // Submit feedback logic here
    console.log('Feedback for', feedbackDialog.intern.name, feedback);
    setFeedbackDialog({ open: false, intern: null });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Interns</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interns.map((intern) => (
              <TableRow key={intern.id}>
                <TableCell>{intern.name}</TableCell>
                <TableCell>{intern.email}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <Box 
                        sx={{ 
                          height: 8, 
                          backgroundColor: '#e0e0e0', 
                          borderRadius: 4 
                        }}
                      >
                        <Box 
                          sx={{ 
                            height: '100%', 
                            backgroundColor: '#4caf50', 
                            borderRadius: 4,
                            width: `${intern.progress}%`
                          }} 
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2">{intern.progress}%</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={intern.status} 
                    color={intern.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{intern.joinDate}</TableCell>
                <TableCell>
                  <Button
                    startIcon={<FeedbackIcon />}
                    onClick={() => handleOpenFeedback(intern)}
                    size="small"
                  >
                    Feedback
                  </Button>
                  <Button
                    startIcon={<ViewIcon />}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Feedback Dialog */}
      <Dialog 
        open={feedbackDialog.open} 
        onClose={() => setFeedbackDialog({ open: false, intern: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Provide Feedback for {feedbackDialog.intern?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={feedback.rating}
              onChange={(event, newValue) => {
                setFeedback(prev => ({ ...prev, rating: newValue }));
              }}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comments"
            value={feedback.comment}
            onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog({ open: false, intern: null })}>
            Cancel
          </Button>
          <Button onClick={handleSubmitFeedback} variant="contained">
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MentorUsers;