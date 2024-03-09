from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()


origins = [
    "http://localhost:5173", 
    "https://your-production-app.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"], 
    allow_headers=["Content-Type", "Authorization"],
)


class Task(BaseModel):
    id: int
    title: str
    completed: bool = False  


task_id_count = 0


tasks = {}


@app.post("/createTask")
def create_task(task: Task):
    global task_id_count
    task_id = task_id_count
    task.id = task_id
    tasks[task_id] = task
    task_id_count += 1 
    return task


@app.get("/getTaskById/{task_id}")
def get_task_by_id(task_id: str):
    if task_id in tasks:
        return tasks[task_id]
    else:
        return {"error": "Task not found"}


@app.get("/getTaskByTitle/{title}")
def get_task_by_title(title: str):
    filtered_tasks = [task for task in tasks.values() if task.title == title]
    if filtered_tasks:
        return filtered_tasks
    else:
        return {"error": f"No tasks found with title '{title}'"}


@app.delete("/deleteById/{task_id}")
def delete_task_by_id(task_id: str):
    if task_id in tasks:
        del tasks[task_id]
        return {"message": "Task deleted successfully"}
    else:
        return {"error": "Task not found"}


@app.delete("/deleteByTitle/{title}")
def delete_task_by_title(title: str):
    tasks_to_delete = [task_id for task_id, task in tasks.items() if task.title == title]
    if tasks_to_delete:
        for task_id in tasks_to_delete:
            del tasks[task_id]
        return {"message": f"All tasks with title '{title}' deleted successfully"}
    else:
        return {"error": f"No tasks found with title '{title}'"}

@app.delete("/deleteAll")
def delete_all_tasks():
    tasks.clear()
    return {"message": "All tasks deleted successfully"}

@app.get("/getAllTasks")
def get_all_tasks():
    return list(tasks.values())


@app.put("/updateTask/{task_id}")
def update_task(task_id: str, updated_task: Task):
    if task_id in tasks:
        tasks[task_id] = updated_task
        return {"message": "Task updated successfully"}
    else:
        return {"error": "Task not found"}
