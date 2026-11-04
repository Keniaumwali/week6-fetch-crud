
import './style.css'
import { api } from './api/http.js'

// Main application container
const app = document.querySelector('#app')

// Application layout
app.innerHTML = `
  <div class="min-h-screen bg-slate-50">
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-indigo-700">Fetch CRUD</h1>
          <p class="text-sm text-slate-500">Posts Management Dashboard</p>
        </div>
        <span class="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
          Week 6 Project
        </span>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-10">
      <section class="mb-8">
        <h2 class="text-3xl font-bold text-slate-800 mb-2">Manage Your Posts</h2>
        <p class="text-slate-500">Create, view, edit and delete posts using the Fetch API.</p>
      </section>

      <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h3 class="text-xl font-semibold text-slate-800 mb-5">Create a New Post</h3>

        <form id="post-form" class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-slate-700 mb-2">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter your post title"
              required
              class="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label for="body" class="block text-sm font-medium text-slate-700 mb-2">
              Post Description
            </label>
            <textarea
              id="body"
              name="body"
              rows="4"
              placeholder="Write something about your post..."
              required
              class="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <button
            id="publish-button"
            type="submit"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
          >
            Publish Post
          </button>

          <p id="form-status" class="text-sm text-slate-500" aria-live="polite"></p>
        </form>
      </section>

      <section>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 class="text-2xl font-bold text-slate-800">All Posts</h3>
            <p class="text-sm text-slate-500">Browse and manage your posts.</p>
          </div>

          <div>
            <label for="user-filter" class="block text-sm font-medium text-slate-700 mb-2">
              Filter by User
            </label>
            <select
              id="user-filter"
              class="border border-slate-300 rounded-lg px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Users</option>
              ${Array.from({ length: 10 }, (_, index) =>
                `<option value="${index + 1}">User ${index + 1}</option>`
              ).join('')}
            </select>
          </div>
        </div>

        <p id="loading" class="hidden text-center text-indigo-600 py-8">
          Loading posts...
        </p>

        <p id="error-message" class="hidden text-center text-red-600 py-4" role="alert"></p>

        <div id="posts-container" class="grid grid-cols-1 md:grid-cols-2 gap-6"></div>

        <p id="empty-message" class="hidden text-center text-slate-500 py-8">
          No posts found.
        </p>

        <p id="list-status" class="text-sm text-center text-slate-500 mt-4"></p>
      </section>
    </main>

    <footer class="border-t border-slate-200 bg-white mt-12">
      <div class="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-slate-500">
        Week 6 · Advanced Frontend Web Development
      </div>
    </footer>
  </div>
`

// Application state
let posts = []
let createdPosts = []
const updatedPosts = new Map()
const deletedPostIds = new Set()

// DOM elements
const postForm = document.querySelector('#post-form')
const titleInput = document.querySelector('#title')
const bodyInput = document.querySelector('#body')
const publishButton = document.querySelector('#publish-button')
const formStatus = document.querySelector('#form-status')
const userFilter = document.querySelector('#user-filter')
const postsContainer = document.querySelector('#posts-container')
const loadingMessage = document.querySelector('#loading')
const errorMessage = document.querySelector('#error-message')
const emptyMessage = document.querySelector('#empty-message')
const listStatus = document.querySelector('#list-status')

// Escape HTML
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
    return entities[character]
  })
}

// Get all visible posts, including local changes
function getVisiblePosts() {
  const visiblePosts = posts
    .filter((post) => !deletedPostIds.has(post.id))
    .map((post) => ({
      ...post,
      ...(updatedPosts.get(post.id) || {}),
    }))

  const extraPosts = createdPosts
    .filter((post) => !deletedPostIds.has(post.id))

  return [...extraPosts, ...visiblePosts].filter((post) => {
    return userFilter.value === 'all' ||
      String(post.userId) === userFilter.value
  })
}

// Render posts
function renderPosts() {
  const visiblePosts = getVisiblePosts()
  postsContainer.innerHTML = ''

  emptyMessage.classList.toggle('hidden', visiblePosts.length > 0)

  postsContainer.innerHTML = visiblePosts.map((post) => `
    <article class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          User ${escapeHTML(post.userId)}
        </span>
        <span class="text-xs text-slate-400">
          Post #${escapeHTML(post.id)}
        </span>
      </div>

      <h4 class="text-lg font-bold text-slate-800 mb-3">
        ${escapeHTML(post.title)}
      </h4>

      <p class="text-slate-600 text-sm leading-6 mb-5">
        ${escapeHTML(post.body)}
      </p>

      <div class="flex gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          data-action="edit"
          data-id="${escapeHTML(post.id)}"
          class="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Edit
        </button>

        <button
          type="button"
          data-action="delete"
          data-id="${escapeHTML(post.id)}"
          class="text-sm font-semibold text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </article>
  `).join('')
}

// Load posts from API
async function loadPosts() {
  loadingMessage.classList.remove('hidden')
  errorMessage.classList.add('hidden')
  emptyMessage.classList.add('hidden')
  postsContainer.innerHTML = ''

  try {
    const params = new URLSearchParams()

    if (userFilter.value === 'all') {
      params.set('_limit', '10')
    } else {
      params.set('userId', userFilter.value)
    }

    posts = await api.get(`/posts?${params.toString()}`)
    renderPosts()
  } catch (error) {
    console.error('Loading error:', error)
    errorMessage.textContent = `Could not load posts: ${error.message}`
    errorMessage.classList.remove('hidden')
  } finally {
    loadingMessage.classList.add('hidden')
  }
}

// CREATE: Publish a new post
postForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const newPost = {
    title: titleInput.value.trim(),
    body: bodyInput.value.trim(),
    userId: 1,
  }

  if (!newPost.title || !newPost.body) {
    formStatus.textContent = 'Please complete all fields.'
    formStatus.className = 'text-sm text-red-600'
    return
  }

  publishButton.disabled = true
  publishButton.textContent = 'Publishing...'
  formStatus.textContent = 'Sending your post...'
  formStatus.className = 'text-sm text-indigo-600'

  try {
    const createdPost = await api.post('/posts', newPost)

    // Keep the new post visible during this browser session
    createdPosts.unshift(createdPost)

    if (userFilter.value !== 'all' && userFilter.value !== '1') {
      userFilter.value = 'all'
    }

    renderPosts()
    postForm.reset()

    formStatus.textContent = 'Post published successfully!'
    formStatus.className = 'text-sm text-green-600'
  } catch (error) {
    console.error('Publishing error:', error)
    formStatus.textContent = `Could not publish post: ${error.message}`
    formStatus.className = 'text-sm text-red-600'
  } finally {
    publishButton.disabled = false
    publishButton.textContent = 'Publish Post'
  }
})

// FILTER: Load posts for selected user
userFilter.addEventListener('change', () => {
  loadPosts()
})

// EDIT and DELETE: Handle post button clicks
postsContainer.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]')
  if (!button) return

  const action = button.dataset.action
  const postId = Number(button.dataset.id)

  const post = getVisiblePosts().find(
    (item) => Number(item.id) === postId
  )

  if (!post) return

  // EDIT: PATCH request
  if (action === 'edit') {
    const newTitle = prompt('Enter the new post title:', post.title)
    if (newTitle === null) return

    const trimmedTitle = newTitle.trim()
    if (!trimmedTitle) {
      alert('The title cannot be empty.')
      return
    }

    const newBody = prompt('Enter the new post description:', post.body)
    if (newBody === null) return

    const trimmedBody = newBody.trim()
    if (!trimmedBody) {
      alert('The description cannot be empty.')
      return
    }

    button.disabled = true
    button.textContent = 'Saving...'

    try {
      const updatedPost = await api.patch(`/posts/${postId}`, {
        title: trimmedTitle,
        body: trimmedBody,
      })

      updatedPosts.set(postId, {
        ...post,
        ...updatedPost,
        title: trimmedTitle,
        body: trimmedBody,
      })

      createdPosts = createdPosts.map((item) =>
        item.id === postId
          ? { ...item, title: trimmedTitle, body: trimmedBody }
          : item
      )

      renderPosts()
      listStatus.textContent = 'Post updated successfully.'
      listStatus.className = 'text-sm text-center text-green-600 mt-4'
    } catch (error) {
      console.error('Update error:', error)
      alert(`Could not update post: ${error.message}`)
      button.disabled = false
      button.textContent = 'Edit'
    }
  }

  // DELETE: DELETE request
  if (action === 'delete') {
    const confirmed = confirm(
      `Are you sure you want to delete "${post.title}"?`
    )

    if (!confirmed) return

    button.disabled = true
    button.textContent = 'Deleting...'

    try {
      await api.del(`/posts/${postId}`)

      deletedPostIds.add(postId)
      createdPosts = createdPosts.filter((item) => item.id !== postId)
      updatedPosts.delete(postId)

      renderPosts()
      listStatus.textContent = 'Post deleted successfully.'
      listStatus.className = 'text-sm text-center text-green-600 mt-4'
    } catch (error) {
      console.error('Delete error:', error)
      alert(`Could not delete post: ${error.message}`)
      button.disabled = false
      button.textContent = 'Delete'
    }
  }
})

// Start application
loadPosts()
