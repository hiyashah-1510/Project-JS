class Task {
  constructor(title, desc, category, date) {
    this.title = title;
    this.desc = desc || "No description";
    this.category = category || "General";
    this.date = date || new Date().toISOString().split("T")[0];
    this.completed = false;
  }

  getStatus() {
    if (this.completed) return "completed";
    let today = new Date();
    let taskDate = new Date(this.date);
    today.setHours(0, 0, 0, 0);
    if (taskDate < today) return "overdue";
    return "pending";
  }

  toggleComplete() {
    this.completed = !this.completed;
  }
}

class TaskManager {
  constructor() {
    this.tasks = [];
    this.taskList = document.getElementById("task-list");
    this.dashboard = document.getElementById("dashboard");
    document.getElementById("addBtn").addEventListener("click", () => this.addTask());
  }

  addTask() {
    const title = document.getElementById("title").value.trim();
    const desc = document.getElementById("desc").value.trim();
    const category = document.getElementById("category").value.trim();
    const date = document.getElementById("date").value;

    if (!title) {
      alert("⚠️ Please enter a task title!");
      return;
    }

    this.tasks.push(new Task(title, desc, category, date));
    this.render();
    this.clearFields();
  }

  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("category").value = "";
    document.getElementById("date").value = "";
  }

  toggleComplete(index) {
    this.tasks[index].toggleComplete();
    this.render();
  }

  deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
      this.tasks.splice(index, 1);
      this.render();
    }
  }

  updateDashboard() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = this.tasks.filter(t => !t.completed && t.getStatus() === "pending").length;
    const progress = total ? Math.round((completed / total) * 100) : 0;

    this.dashboard.innerHTML = `
      <h3>📊 Dashboard</h3>
      <p>Total Tasks: ${total}</p>
      <p>Completed: ${completed}</p>
      <p>Pending: ${pending}</p>
      <p>Progress: ${progress}%</p>
    `;
  }

  render() {
    this.taskList.innerHTML = "";

    this.tasks.forEach((task, index) => {
      const card = document.createElement("div");
      card.classList.add("task-card");

      const statusClass = task.getStatus();

      card.innerHTML = `
        <div class="task-title">${task.title}</div>
        <div class="task-desc">${task.desc}</div>
        <div class="task-meta"><strong>Category:</strong> ${task.category} | <strong>Due:</strong> ${task.date}</div>
        <div class="status ${statusClass}">Status: ${statusClass}</div>
        <div class="task-footer">
          <button class="complete-btn" aria-label="Mark as complete">✔</button>
          <button class="delete-btn" aria-label="Delete task">🗑</button>
        </div>
      `;

      card.querySelector(".complete-btn").onclick = () => this.toggleComplete(index);
      card.querySelector(".delete-btn").onclick = () => this.deleteTask(index);

      this.taskList.appendChild(card);
    });

    this.updateDashboard();
  }
}

const app = new TaskManager();