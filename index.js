const fs = require('fs');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const fileName = 'tasks.json';

// Function to load tasks from the file
const loadTasks = () => {
  try {
    const data = fs.readFileSync(fileName, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return []; // Return an empty array if file doesn't exist
  }
};

// Function to save tasks to the file
const saveTasks = (tasks) => {
  fs.writeFileSync(fileName, JSON.stringify(tasks, null, 2));
};

// Function to display tasks
const displayTasks = (tasks) => {
  console.log("\nYour tasks:");
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task.description} [${task.status}]`);
  });
  console.log();
};

// Function to add a new task
const addTask = () => {
  rl.question('Enter your new task description: ', (taskDescription) => {
    const tasks = loadTasks();
    tasks.push({ description: taskDescription, status: 'to do' });
    saveTasks(tasks);
    console.log('Task added successfully!');
    promptUser(); // Return to main menu
  });
};


// Function to update a task status
const updateTask = () => {
  const tasks = loadTasks();
  displayTasks(tasks);
  
  rl.question('Enter the task number to update: ', (taskNumber) => {
    const taskIndex = parseInt(taskNumber) - 1;
    
    if (taskIndex >= 0 && taskIndex < tasks.length) {
      rl.question('Enter new status (to do, in progress, done): ', (newStatus) => {
        tasks[taskIndex].status = newStatus;
        saveTasks(tasks);
        console.log('Task status updated!');
        promptUser(); // Return to main menu
      });
    } else {
      console.log('Invalid task number.');
      promptUser(); // Return to main menu
    }
  });
};

// Function to delete a task
const deleteTask = () => {
  const tasks = loadTasks();
  displayTasks(tasks);
  
  rl.question('Enter the task number to delete: ', (taskNumber) => {
    const taskIndex = parseInt(taskNumber) - 1;
    
    if (taskIndex >= 0 && taskIndex < tasks.length) {
      tasks.splice(taskIndex, 1);
      saveTasks(tasks);
      console.log('Task deleted!');
      promptUser(); // Return to main menu
    } else {
      console.log('Invalid task number.');
      promptUser(); // Return to main menu
    }
  });
};

// Function to prompt the user for input
const promptUser = () => {
  rl.question(
    'What do you need to do?\n1- Add New Task\n2- Update Task State\n3- Delete Task\n4- View All Tasks\n5- Exit\nPlease enter your choice: ', 
    (choice) => {
      const valueAfterParsing = parseInt(choice, 10);

      switch (valueAfterParsing) {
        case 1:
          addTask();
          break;
        case 2:
          updateTask();
          break;
        case 3:
          deleteTask();
          break;
        case 4:
          displayTasks(loadTasks());
          promptUser(); // Show tasks and prompt again
          break;
        case 5:
          rl.close(); // Exit the application
          break;
        default:
          console.log('Please choose a valid option.');
          promptUser();
      }
    }
  );
};

// Start the CLI
promptUser();
