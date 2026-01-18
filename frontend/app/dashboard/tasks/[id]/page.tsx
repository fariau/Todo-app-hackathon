'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Task as TaskType, ValidationError, ValidationResult } from '../../../../types';
import { taskApi } from '../../../../lib/api';

const TaskDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<TaskType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalTask, setOriginalTask] = useState<TaskType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: ''
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (typeof id === 'string') {
          const response = await taskApi.getById(id);
          const fetchedTask = response.data;
          setTask(fetchedTask);
          setOriginalTask({ ...fetchedTask });

          // Set form data for editing
          setFormData({
            title: fetchedTask.title,
            description: fetchedTask.description || '',
            status: fetchedTask.status,
            priority: fetchedTask.priority,
            dueDate: fetchedTask.dueDate || ''
          });
        }
      } catch (err) {
        setError('Failed to load task');
        console.error('Error fetching task:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const validateForm = (): ValidationResult => {
    const newErrors: ValidationError[] = [];

    // Title validation
    if (!formData.title.trim()) {
      newErrors.push({ field: 'title', message: 'Title is required' });
    } else if (formData.title.trim().length > 255) {
      newErrors.push({ field: 'title', message: 'Title must be 255 characters or less' });
    }

    // Due date validation
    if (formData.dueDate && isNaN(Date.parse(formData.dueDate))) {
      newErrors.push({ field: 'dueDate', message: 'Invalid date format' });
    }

    return {
      isValid: newErrors.length === 0,
      errors: newErrors
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      if (typeof id === 'string') {
        const response = await taskApi.update(id, formData);
        setTask(response.data);
        setOriginalTask({ ...response.data });

        // Exit edit mode
        setIsEditing(false);

        // Show success message or redirect
        router.refresh(); // Refresh to update any cached data
      }
    } catch (err: any) {
      console.error('Task update error:', err);

      // Handle specific error responses
      if (err.response?.data?.detail) {
        setErrors([{ field: 'general', message: err.response.data.detail }]);
      } else {
        setErrors([{ field: 'general', message: 'Task update failed. Please try again.' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Revert form data to original values
    if (originalTask) {
      setFormData({
        title: originalTask.title,
        description: originalTask.description || '',
        status: originalTask.status,
        priority: originalTask.priority,
        dueDate: originalTask.dueDate || ''
      });
    }
    setIsEditing(false);
    setErrors([]);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setLoading(true);
    try {
      if (typeof id === 'string') {
        await taskApi.delete(id);
        // Redirect to tasks list after successful deletion
        router.push('/dashboard/tasks');
        router.refresh();
      }
    } catch (err: any) {
      console.error('Task deletion error:', err);

      // Handle specific error responses
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Task deletion failed. Please try again.');
      }
    } finally {
      setLoading(false);
      setDeleteConfirm(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!task) return;

    // Cycle through statuses: todo -> in-progress -> done -> todo
    let newStatus = '';
    switch (task.status) {
      case 'todo':
        newStatus = 'in-progress';
        break;
      case 'in-progress':
        newStatus = 'done';
        break;
      case 'done':
        newStatus = 'todo';
        break;
      default:
        newStatus = 'todo';
    }

    try {
      if (typeof id === 'string') {
        const response = await taskApi.partialUpdate(id, { status: newStatus });
        setTask(response.data);
        setOriginalTask({ ...response.data });
        router.refresh(); // Refresh to update any cached data
      }
    } catch (err) {
      console.error('Status update error:', err);
      setError('Failed to update task status');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="text-sm text-red-700">{error || 'Task not found'}</div>
        </div>
        <Link
          href="/dashboard/tasks"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Task Details</h1>
        <div className="flex space-x-3">
          {!isEditing ? (
            <>
              <button
                onClick={handleStatusToggle}
                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  task.status === 'todo' ? 'bg-gray-500 hover:bg-gray-600' :
                  task.status === 'in-progress' ? 'bg-yellow-500 hover:bg-yellow-600' :
                  task.status === 'done' ? 'bg-green-500 hover:bg-green-600' :
                  'bg-purple-500 hover:bg-purple-600'
                }`}
              >
                Toggle Status
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit
              </button>
            </>
          ) : null}
          <Link
            href="/dashboard/tasks"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Tasks
          </Link>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          {errors.some(e => e.field === 'general') && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="text-sm text-red-700">
                {errors.find(e => e.field === 'general')?.message}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.some(e => e.field === 'title') ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.some(e => e.field === 'title') && (
                  <p className="mt-1 text-sm text-red-600">{errors.find(e => e.field === 'title')?.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="mt-1">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <div className="mt-1">
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.some(e => e.field === 'dueDate') ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.some(e => e.field === 'dueDate') && (
                  <p className="mt-1 text-sm text-red-600">{errors.find(e => e.field === 'dueDate')?.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{task.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and information about the task.</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Title</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{task.title}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {task.description || <span className="text-gray-400">No description provided</span>}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${task.status === 'todo' ? 'bg-gray-100 text-gray-800' :
                        task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        task.status === 'done' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'}`}
                  >
                    {task.status.replace('-', ' ')}
                  </span>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Priority</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${task.priority === 'low' ? 'bg-blue-100 text-blue-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'}`}
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : <span className="text-gray-400">Not set</span>}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(task.createdAt).toLocaleString()}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Updated</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(task.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {/* Delete Section */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-90 text-red-600">Danger Zone</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Delete this task permanently. This action cannot be undone.</p>
        </div>
        <div className="mt-5">
          {deleteConfirm ? (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Are you sure?</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>This will permanently delete the task "{task.title}".</p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Yes, delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(false)}
                      className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Task
            </button>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back
          </button>
          <button
            onClick={handleStatusToggle}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              task.status === 'todo' ? 'bg-gray-500 hover:bg-gray-600' :
              task.status === 'in-progress' ? 'bg-yellow-500 hover:bg-yellow-600' :
              task.status === 'done' ? 'bg-green-500 hover:bg-green-600' :
              'bg-purple-500 hover:bg-purple-600'
            }`}
          >
            Toggle Status
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Task
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskDetailPage;