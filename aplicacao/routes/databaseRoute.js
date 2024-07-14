const express = require('express');
const { getApp } = require('firebase/app');
const { update } = require('firebase/database');
const { getFirestore, Timestamp, doc, setDoc, getDoc, collection, getDocs, updateDoc, arrayUnion } = require('firebase/firestore');

const router = express.Router();
const firebase = getApp();
const db = getFirestore(firebase);

// Route to add new project
router.post('/addnewproject', async (req, res) => {
  const { project_id, name, description, members } = req.body;

  try {
    // Create a new project document
    const projectRef = await setDoc(doc(db, 'projects', project_id), {
      name,
      description,
      members,
    });
    console.log('Projeto adicionado com ID: ', project_id);

    // Update each user document to include the new project in their projects array
    members.forEach(member => {
      // const userRef = db.collection('users').doc(member.user_id);
      const userRef = updateDoc(doc(db, 'users', member.user_id), {
        projects: arrayUnion({
          projects: project_id,
          role: member.role  // Assuming member.role is defined
        })
      })
    });

    console.log('Usuário atualizado com projeto associado.');

    // Success response
    res.redirect('consultaTarefa');
  } catch (error) {
    console.error('Falha ao adicionar projeto:', error);
    // Error response below
  }
});

// Route to add a new user
router.post('/addnewuser', async (req, res) => {
  const { userid, name, email } = req.body;

  try {
    // Check if user already exists
    const userSnap = await getDoc(doc(db, 'users', userid));

    if (userSnap.exists()) {
      return res.status(400).json({ error: 'Usuário já cadastrado.' });
    }

    // Create a new user document
    await setDoc(doc(db, 'users', userid), {
      name,
      email,
      projects: []  // Initialize with an empty array of projects
    });
    console.log(`Usuário adicionado com ID: ${userid}`);

    // Success response
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', userid });
  } catch (error) {
    console.error('Falha ao adicionar usuário:', error);
    // Error response
    res.status(500).json({ error: 'Falha ao adicionar usuário.' });
  }
});

// Route to add a new task
router.post('/addnewtask', async (req, res) => {
  const { taskid, title, description, dueDate, priority, workHours, assignedTo } = req.body;
  ;  // Convert dueDate string to Firestore Timestamp
  const dueDateTimestamp = Timestamp.fromDate(new Date(dueDate));

  try {
    const taskRef = await setDoc(doc(db, 'tasks', taskid), {
      title: title,
      description: description,
      dueDate: dueDateTimestamp,
      priority: priority,
      workHours: workHours,
      assignedTo: assignedTo
    });

    console.log('Tarefa adicionada com ID: ', taskid)
  }
  catch (errors) {
    console.error('Erro ao adicionar tarefa: ', errors);
  }
  res.redirect('consultaTarefa');
});

// Router to read all tasks
router.get('/displaytasks', async (req, res) => {
  try {
    const tasksSnapshot = await getDocs(collection(db, 'tasks'));
    const tasks = [];

    tasksSnapshot.forEach(doc => {
      tasks.push({
        taskid: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        dueDate: doc.data().dueDate.toDate(), // Convert Firestore Timestamp to JavaScript Date object
        priority: doc.data().priority,
        workHours: doc.data().workHours,
        assignedTo: doc.data().assignedTo
      });
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

module.exports = router;