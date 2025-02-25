const Data = require("../models/Datadb");
const Task = require("../models/Taskdb");


AssignTask = async function (req, res, next) {
  try {
    const { taskno, gamename, id1, id2, id3, id4, id5, id6 } = req.body;

    // Check if all required fields are present in the request body
    if (!taskno || !gamename || !id1 || !id2 || !id3 || !id4 || !id5 || !id6) {
      return res.status(400).json({
        status: "Missing required fields"
      });
    }

    // Check if a task with the same taskNumber already exists for the same studentID
    const existingTask = await Task.findOne({
      studentID: req.params.id,
      taskNumber: taskno
    });

    if (existingTask) {
      return res.status(400).json({
        status: "taskNumber already exists for the same studentID"
      });
    }

    const task = new Task({
      studentID: req.params.id,
      taskNumber: taskno,
      gameName: gamename,
      done:false,
      data1ID: id1,
      data2ID: id2,
      data3ID: id3,
      data4ID: id4,
      data5ID: id5,
      data6ID: id6,
    });

    await task.save();

    res.status(200).json({
      status: "Task assigned successfully"
    });
  } catch (err) {
    res.status(500).json({
      status: "Error assigning task",
      error: err
    });
  }
};

  
  
  


TakeTask = function (req, res, next) {
  Task.find({
      studentID: req.params.id
  })
  .then((tasks) => {
      if (tasks.length < 1) {
          return res.status(404).json({
            status: "No tasks found for this student ID."
          });
      }

      const numTasks = req.body.numTasks; // Get the number of tasks requested from the request body
      const tasksToReturn = numTasks && numTasks <= tasks.length ? numTasks : tasks.length; // Determine the number of tasks to return

      // Create an empty array to store the task and data objects
      const taskDataArray = [];

      // Use Promise.all() to wait for all data retrieval promises to resolve before sending response
      Promise.all(tasks.slice(0, tasksToReturn).map((task, index) => { // Use .slice() to limit the number of tasks returned
          const dataIds = [task.data1ID, task.data2ID, task.data3ID, task.data4ID, task.data5ID, task.data6ID];

          // Return the promise returned by Data.find() to be included in Promise.all()
          return Data.find({
              _id: { $in: dataIds }
          }, {createdAt: 0, updatedAt: 0, __v: 0}) // Use projection to exclude fields
          .then((data) => {
              // Create an object that contains the task number, game name, and data objects
              const taskDataObject = {
                  taskNumber: task.taskNumber,
                  gameName: task.gameName,
                  
                  data: data.map(da => ({ taskId: da._doc._id, ...da._doc, _id: undefined })),
              };

              // Add the taskDataObject to the array
              taskDataArray.push(taskDataObject);

              // Check if all the requested tasks have been processed
              if (taskDataArray.length === tasksToReturn) {
                  // Send the taskDataArray as the response
                  res.status(200).json(taskDataArray);
              }
          })
          .catch((err) => {
              // Include error message in the taskDataArray if data retrieval fails
              const taskDataObject = {
                  taskNumber: task.taskNumber,
                  gameName: task.gameName,
                  done:task.done,
                  data: [],
                  error: err.message,
              };

              // Add the taskDataObject to the array
              taskDataArray.push(taskDataObject);

              // Check if all the requested tasks have been processed
              if (taskDataArray.length === tasksToReturn) {
                  // Send the taskDataArray as the response
                  res.status(200).json(taskDataArray);
              }
          });
      }))
      .catch((err) => {
          res.status(404).json({
            status: "Error retrieving data objects.",
              error: err,
          });
      });
  })
  .catch((err) => {
      res.status(404).json({
        status: "Error retrieving tasks.",
          error: err,
      });
  });
};





updateTask = async function (req, res, next) {
    try {
      const { taskno, gamename, id1, id2, id3, id4, id5, id6 } = req.body;
  
      // Check if all required fields are present in the request body
      if (!taskno || !gamename || !id1 || !id2 || !id3 || !id4 || !id5 || !id6) {
        return res.status(400).json({
          message: "Missing required fields"
        });
      }
  
      const updatedTask = await Task.findOneAndUpdate({
        studentID: req.params.id,
        taskNumber: taskno
      }, {
        gameName: gamename,
        data1ID: id1,
        data2ID: id2,
        data3ID: id3,
        data4ID: id4,
        data5ID: id5,
        data6ID: id6,
      }, {
        new: true
      });
  
      if (!updatedTask) {
        return res.status(404).json({
          message: "Task not found"
        });
      }
  
      res.status(200).json({
        message: "Task updated successfully",
        updatedTask
      });
    } catch (err) {
      res.status(500).json({
        message: "Error updating task",
        error: err
      });
    }
  };
  

  DeleteTask = async function (req, res, next) {
    try {
      const taskId = req.params.taskId;
  
      const result = await Task.deleteOne({ _id: taskId });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: "Task not found"
        });
      }
  
      res.status(200).json({
        message: "Task deleted successfully"
      });
    } catch (err) {
      res.status(500).json({
        message: "Error deleting task",
        error: err
      });
    }
  };
  


module.exports = {
    AssignTask: AssignTask,
    TakeTask: TakeTask,
};




