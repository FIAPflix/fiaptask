const express = require('express');
const { getApp } = require('firebase/app');
const { update } = require('firebase/database');
const { getFirestore, Timestamp, doc, setDoc, getDoc, collection, getDocs, updateDoc, arrayUnion, query, where, deleteDoc } = require('firebase/firestore');
const moment = require('moment');

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
  const { name, email, responsibility, status, assignedTeam } = req.body;
  const user = req.session.userInfo;

  try {
    // Check if user already exists
    const userSnap = await getDoc(doc(db, 'users', email));

    if (userSnap.data()) {
      return res.status(400).json({ error: 'Usuário já cadastrado.' });
    }
    else {
      // Create a new user document
      await setDoc(doc(db, 'users', email), {
        name,
        email,
        responsibility,
        status,
        assignedTeam,
        projects: [],  // Initialize with an empty array of projects
        createdBy: user.email
      });
      console.log(`Usuário adicionado com ID: ${email}`);

      // Success response
      res.redirect('/consultaColaborador')
    }
  } catch (error) {
    console.error('Falha ao adicionar usuário:', error);
    // Error response
    res.status(500).json({ error: 'Falha ao adicionar usuário.' });
  }
});

router.get('/displayusers', async (req, res) => {
  try {
    const user = req.session.userInfo;
    const tasksSnapshot = await getDocs(query(collection(db, 'users'), where('createdBy', '==', user.email)));
    const users = [];

    tasksSnapshot.forEach(doc => {
      users.push({
        name: doc.data().name,
        email: doc.id,
        cargo: doc.data().responsibility,
        status: doc.data().status,
        assignedTeam: doc.data().assignedTeam
      });
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Router to update a user
router.post('/updateuser', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const userSnap = await getDoc(doc(db, 'users', email));
    res.redirect('atualizacaoColaborador', { userSnap });
  } catch (error) {
    console.error('Erro ao atualizar colaborador: ', error);
    res.status(500).json({ error: 'Erro ao atualizar colaborador' });
  }
})

// Router to delete a user
router.post('/deleteuser', async (req, res) => {
  try {
    const userid = req.body.userId;

    await deleteDoc(doc(db, 'users', userid));
    res.status(200).json({ message: 'Colaborador apagada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar colaborador: ', error);
    res.status(500).json({ error: 'Erro ao deletar colaborador' });
  }
})

// Route to add a new task
router.post('/addnewtask', async (req, res) => {
  const { taskid, title, description, dueDate, priority, workHours, assignedTo } = req.body;
  ;  // Convert dueDate string to Firestore Timestamp
  const dueDateTimestamp = Timestamp.fromDate(new Date(dueDate));
  const user = req.session.userInfo;
 console.log(req.body)
  try {
    const taskRef = await setDoc(doc(db, 'tasks', taskid), {
      title: title,
      description: description,
      dueDate: dueDateTimestamp,
      priority: priority,
      workHours: workHours,
      assignedTo: assignedTo,
      createdBy: user.email
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
    const user = req.session.userInfo;
    const tasksSnapshot = await getDocs(query(collection(db, 'tasks'), where('createdBy', '==', user.email)));
    const tasks = [];

    tasksSnapshot.forEach(doc => {
      const dueDate = doc.data().dueDate.toDate();
      const formattedDueDate = moment(dueDate).format('DD-MM-YYYY');

      tasks.push({
        taskid: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        dueDate: formattedDueDate,
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

// Router to delete a task
router.post('/deletetask', async (req, res) => {
  try {
    const taskid = req.body.taskId;

    await deleteDoc(doc(db, 'tasks', taskid));
    res.status(200).json({ message: 'Tarefa apagada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar tarefa: ', error);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
})

// Router to update a task
router.get('/atualizacaoTarefa', async (req, res) => {
  try {
      const taskId = req.query.taskId;
      // Assuming getDoc is a function that retrieves task data from Firestore
      const taskSnap = await getDoc(doc(db, 'tasks', taskId));
      let taskData = taskSnap.data();
      taskData.id = taskId;
      console.log(taskData);
      // Render atualizacaoTarefa page with taskData passed as data
      res.render('atualizacaoTarefa', { taskData });
  } catch (error) {
      console.error('Error fetching task details:', error);
      res.status(500).json({ error: 'Failed to fetch task details' });
  }
});

module.exports = router;