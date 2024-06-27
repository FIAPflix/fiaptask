const express = require('express');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const router = express.Router();
const db = getFirestore();

// Route to add new project
router.post('/projects', async (req, res) => {
    const { project_id, name, description, members } = req.body;
  
    try {
      // Create a new project document
      const projectRef = db.collection('projects').doc(project_id);
      await projectRef.set({
        name,
        description,
        members
      });
      console.log(`Added project with ID: ${project_id}`);
  
      // Update each user document to include the new project in their projects array
      const batch = db.batch();
      members.forEach(member => {
        const userRef = db.collection('users').doc(member.user_id);
        batch.update(userRef, {
          projects: db.FieldValue.arrayUnion({
            project_id,
            role: member.role  // Assuming member.role is defined
          })
        });
      });
  
      // Commit updates
      await batch.commit();
      console.log('Users updated with new project association.');
  
      // Success response
      res.status(201).json({ message: 'Project added successfully.', project_id });
    } catch (error) {
      console.error('Error adding project:', error);
      // Error response
      res.status(500).json({ error: 'Failed to add project.' });
    }
  });
  
  module.exports = router;