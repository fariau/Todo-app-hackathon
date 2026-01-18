'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Task, Task as TaskType } from '../../../types';
import { taskApi } from '../../../lib/api';

const TasksPage = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all'); // all, todo, in-progress, done, archived
  const [sort, setSort] = useState<string>('newest'); // newest, oldest, priority, due-date
  const [search, setSearch] = useState<string>('');
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Toggle task completion status
  const toggleTaskStatus = async (task: TaskType) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    setUpdatingTaskId(task.id);

    try {
      const response = await taskApi.partialUpdate(task.id, { status: newStatus });
      const updatedTask = response.data;

      // Update the task in the local state
      setTasks(prevTasks =>
        prevTasks.map(t => t.id === task.id ? updatedTask : t)
      );

      showToast(`Task marked as ${newStatus}`, 'success');
    } catch (err) {
      console.error('Error updating task:', err);
      showToast('Failed to update task status', 'error');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskApi.getAll();
        setTasks(response.data);
      } catch (err) {
        setError('Failed to load tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Apply filtering and sorting
  useEffect(() => {
    let result = [...tasks];

    // Apply filter
    if (filter !== 'all') {
      result = result.filter(task => task.status === filter);
    }

    // Apply search
    if (search) {
      const searchTerm = search.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority':
          const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'due-date':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        default:
          return 0;
      }
    });

    setFilteredTasks(result);
  }, [tasks, filter, sort, search]);

  // Check if due date is overdue
  const isOverdue = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  // Loading skeleton component
  const TaskSkeleton = () => (
    <div className="bg-white rounded-lg shadow p-4 animate-pulse">
      <div className="flex items-center">
        <div className="h-5 w-5 bg-gray-200 rounded-full mr-3"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <Link
            href="/dashboard/tasks/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Task
          </Link>
        </div>

        {/* Filters and Search Skeleton */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Task List Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="text-sm text-red-700">{error}</div>
        </div>
        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg text-white ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="flex items-center">
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-4 text-white hover:text-gray-200">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <Link
          href="/dashboard/tasks/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Task
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority</option>
              <option value="due-date">Due Date</option>
            </select>
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search || filter !== 'all'
              ? 'Try changing your search or filter criteria.'
              : 'Get started by creating a new task.'}
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/tasks/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Task
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 ${
                task.status === 'done' ? 'opacity-70' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={task.status === 'done'}
                    onChange={() => toggleTaskStatus(task)}
                    disabled={!!updatingTaskId}
                    className="h-5 w-5 mt-0.5 text-indigo-600 rounded focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <div className="ml-3 flex-1 min-w-0">
                    <Link href={`/dashboard/tasks/${task.id}`}>
                      <h3 className={`text-sm font-medium ${
                        task.status === 'done'
                          ? 'text-gray-500 line-through'
                          : 'text-gray-900 hover:text-indigo-600'
                      }`}>
                        {task.title}
                      </h3>
                    </Link>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === 'todo' ? 'bg-gray-100 text-gray-800' :
                      task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      task.status === 'done' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {task.status.replace('-', ' ')}
                  </span>

                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.priority === 'low' ? 'bg-blue-100 text-blue-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>

                  {task.dueDate && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isOverdue(task.dueDate) ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {isOverdue(task.dueDate) ? 'Overdue!' : new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex justify-between text-xs text-gray-500">
                  <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/dashboard/tasks/${task.id}`}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-900"
                  >
                    View details
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;