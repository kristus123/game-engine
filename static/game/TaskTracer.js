class TaskTracker {
    constructor() {
        this.taskCompleted = false;
    }

    // Method to be called when the task is successfully completed
    completeTask() {
        this.taskCompleted = true;
    }

    // Getter method to check if the task is completed
    isTaskCompleted() {
        return this.taskCompleted;
    }
}
