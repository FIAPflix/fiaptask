const express = require('express');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const router = express.Router();
const db = getFirestore();

// Route to add new project
router.post('/addnewproject', async (req, res) => {
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
          projects: FieldValue.arrayUnion({
            project_id,
            role: member.role  // Assuming member.role is defined
          })
        });
      });
  
      // Commit updates
      await batch.commit();
      console.log('Usuário atualizado com projeto associado.');
  
      // Success response
      res.status(201).json({ message: 'Projeto adicionado com sucesso.', project_id });
    } catch (error) {
      console.error('alha ao adicionar projeto:', error);
      // Error response
      res.status(500).json({ error: 'Falha ao adicionar projeto.' });
    }
  });

  // Route to add a new user
router.post('/addnewuser', async (req, res) => {
  const { user_id, name, email } = req.body;

  try {
    // Check if user already exists
    const userRef = db.collection('users').doc(user_id);
    const doc = await userRef.get();
    if (doc.exists) {
      return res.status(400).json({ error: 'Usuário já cadastrado.' });
    }

    // Create a new user document
    await userRef.set({
      name,
      email,
      projects: []  // Initialize with an empty array of projects
    });
    console.log(`Added user with ID: ${user_id}`);

    // Success response
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', user_id });
  } catch (error) {
    console.error('Falha ao adicionar usuário:', error);
    // Error response
    res.status(500).json({ error: 'Falha ao adicionar usuário.' });
  }
});

// Route to add a new task
router.post('/addnewtask', async (req, res) => {
  const { task_id, title, description, dueDate, assignedTo } = req.body;

  // Convert dueDate string to Firestore Timestamp
  const dueDateTimestamp = Timestamp.fromDate(new Date(dueDate));

  try {
    // Create a new task document
    const taskRef = db.collection('tasks').doc(task_id);
    await taskRef.set({
      title,
      description,
      dueDate: dueDateTimestamp,
      assignedTo
    });
    console.log(`Added task with ID: ${task_id}`);

    // Success response
    res.status(201).json({ message: 'Tafera adicionada com sucesso.', task_id });
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    // Error response
    res.status(500).json({ error: 'Erro ao adicionar tarefa.' });
  }
});
  
  module.exports = router;