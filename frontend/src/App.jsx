import { useEffect, useState } from 'react'
import api, { setAuthToken } from './api'

export default function App() {
  const [mode, setMode] = useState('login')
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('taskflow_auth')
    return saved ? JSON.parse(saved) : null
  })
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [projectForm, setProjectForm] = useState({ name: '', description: '' })
  const [taskForm, setTaskForm] = useState({ projectId: '', title: '', description: '', status: 'TODO', assigneeEmail: '' })
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (auth?.token) {
      setAuthToken(auth.token)
      localStorage.setItem('taskflow_auth', JSON.stringify(auth))
      loadProjects(auth.email)
    } else {
      setAuthToken(null)
      localStorage.removeItem('taskflow_auth')
    }
  }, [auth])

  const onChange = (setter) => (e) => setter(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const submitAuth = async () => {
    setError('')
    setMessage('')
    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }
      const { data } = await api.post(url, payload)
      setAuth(data)
      setForm({ name: '', email: '', password: '' })
    } catch (e) {
      setError(e.response?.data?.message || 'Request failed')
    }
  }

  const loadProjects = async (email = auth?.email) => {
    if (!email) return
    const { data } = await api.get('/api/projects', { params: { ownerEmail: email } })
    setProjects(data)
    if (data.length > 0) {
      const pid = selectedProjectId || String(data[0].id)
      setSelectedProjectId(pid)
      loadTasks(pid)
      setTaskForm(prev => ({ ...prev, projectId: pid, assigneeEmail: auth?.email || email }))
    } else {
      setTasks([])
    }
  }

  const loadTasks = async (projectId) => {
    if (!projectId) return
    const { data } = await api.get(`/api/tasks/project/${projectId}`)
    setTasks(data)
  }

  const createProject = async () => {
    setError('')
    const { data } = await api.post('/api/projects', {
      ...projectForm,
      ownerEmail: auth.email
    })
    setProjectForm({ name: '', description: '' })
    await loadProjects(auth.email)
    setSelectedProjectId(String(data.id))
    await loadTasks(data.id)
  }

  const createTask = async () => {
    setError('')
    await api.post('/api/tasks', {
      ...taskForm,
      projectId: Number(taskForm.projectId),
      assigneeEmail: taskForm.assigneeEmail || auth.email
    })
    setTaskForm(prev => ({ ...prev, title: '', description: '', status: 'TODO' }))
    await loadTasks(taskForm.projectId)
    setMessage('Task created')
  }

  const updateTaskStatus = async (task, status) => {
    await api.put(`/api/tasks/${task.id}`, { ...task, status })
    await loadTasks(task.projectId)
  }

  const deleteTask = async (id) => {
    await api.delete(`/api/tasks/${id}`)
    await loadTasks(selectedProjectId)
  }

  const logout = () => {
    setAuth(null)
    setProjects([])
    setTasks([])
    setSelectedProjectId('')
    setMessage('')
    setError('')
  }

  if (!auth) {
    return (
      <div className="page center">
        <div className="card auth-card">
          <h1>TaskFlow</h1>
          <p className="muted">Full-stack microservices dashboard</p>
          {mode === 'register' && <input name="name" value={form.name} onChange={onChange(setForm)} placeholder="Name" />}
          <input name="email" value={form.email} onChange={onChange(setForm)} placeholder="Email" />
          <input name="password" type="password" value={form.password} onChange={onChange(setForm)} placeholder="Password" />
          <button onClick={submitAuth}>{mode === 'login' ? 'Login' : 'Register'}</button>
          <button className="secondary" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            Switch to {mode === 'login' ? 'Register' : 'Login'}
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h1>TaskFlow</h1>
          <p className="muted">Welcome, {auth.name}. Manage your projects and tasks in one place.</p>
        </div>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Create Project</h2>
          <input name="name" value={projectForm.name} onChange={onChange(setProjectForm)} placeholder="Project name" />
          <textarea name="description" value={projectForm.description} onChange={onChange(setProjectForm)} placeholder="Project description" />
          <button onClick={createProject}>Add Project</button>
        </div>

        <div className="card">
          <h2>Projects</h2>
          <select value={selectedProjectId} onChange={e => {
            const value = e.target.value
            setSelectedProjectId(value)
            setTaskForm(prev => ({ ...prev, projectId: value }))
            loadTasks(value)
          }}>
            <option value="">Select project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <div className="list">
            {projects.map(project => (
              <div key={project.id} className="list-item">
                <div>{project.name}</div>
                <div className="muted small">{project.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card wide">
          <h2>Create Task</h2>
          <div className="row">
            <input name="projectId" value={taskForm.projectId} onChange={onChange(setTaskForm)} placeholder="Project ID" />
            <input name="title" value={taskForm.title} onChange={onChange(setTaskForm)} placeholder="Task title" />
          </div>
          <textarea name="description" value={taskForm.description} onChange={onChange(setTaskForm)} placeholder="Task description" />
          <div className="row">
            <select name="status" value={taskForm.status} onChange={onChange(setTaskForm)}>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
            <input name="assigneeEmail" value={taskForm.assigneeEmail} onChange={onChange(setTaskForm)} placeholder="Assignee email" />
          </div>
          <button onClick={createTask}>Add Task</button>
        </div>
      </div>

      <div className="card">
        <h2>Tasks</h2>
        <p className="muted">{tasks.length} task(s) in the selected project</p>
        <div className="task-grid">
          {tasks.map(task => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="muted small">{task.assigneeEmail}</div>
              <div className="badge">{task.status}</div>
              <div className="row gap">
                <button onClick={() => updateTaskStatus(task, 'TODO')}>Todo</button>
                <button onClick={() => updateTaskStatus(task, 'IN_PROGRESS')}>Progress</button>
                <button onClick={() => updateTaskStatus(task, 'DONE')}>Done</button>
                <button className="danger" onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  )
}
