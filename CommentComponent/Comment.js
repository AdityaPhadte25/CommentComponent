document.addEventListener('DOMContentLoaded', function () {

  const dialog = document.getElementById('dialog');
  const overlay = document.getElementById('overlay');
  const openBtn = document.getElementById('openBtn');
  const closeBtn = document.getElementById('closeBtn');
  const commentInput = document.getElementById('commentInput');
  const submitBtn = document.getElementById('submitBtn');
  const fileInput = document.getElementById('fileInput');
  const fileName = document.getElementById('fileName');
  const uploadBox = document.getElementById('uploadBox');
  const discardBtn = document.getElementById('discardBtn');
  const fieldValue = document.getElementById('fieldValue');
  const commentsList = document.getElementById('commentsList');
  const currentValueText = 'The quick brown fox jumps over the lazy dog';

  let comments = [
    {
      text: currentValueText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fileName: null,
      fileSize: null,
      isInitial: true
    }
  ];

  let editingIndex = null;

  function openDialog() {
    dialog.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }

  function closeDialog() {
    dialog.classList.add('hidden');
    overlay.classList.add('hidden');
  }

  openBtn.addEventListener('click', openDialog);
  closeBtn.addEventListener('click', closeDialog);
  overlay.addEventListener('click', closeDialog);

  uploadBox.addEventListener('click', function () {
    fileInput.click();
  });

  commentInput.addEventListener('input', function () {
    submitBtn.disabled = commentInput.value.trim() === '';
  });

  fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    fileName.textContent = file ? file.name : 'Select a file to upload';
  });

  discardBtn.addEventListener('click', function () {
    resetForm();
  });

  submitBtn.addEventListener('click', function () {

    const text = commentInput.value.trim();
    if (!text) return;

    const file = fileInput.files[0];

    if (editingIndex !== null) {

      comments[editingIndex].text = text;

      if (file) {
        comments[editingIndex].fileName = file.name;
        comments[editingIndex].fileSize = file.size;
      }

      comments[editingIndex].time =
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      renderComments();

      const node = commentsList.children[editingIndex];
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      resetForm();
      return;
    }

    const newComment = {
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fileName: file ? file.name : null,
      fileSize: file ? file.size : null,
      isInitial: false
    };

    comments.push(newComment);
    renderComments();

    const last = commentsList.lastElementChild;
    if (last) {
      last.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    resetForm();
  });

  function resetForm() {
    commentInput.value = '';
    fieldValue.value = '';
    fileInput.value = '';
    fileName.textContent = 'Select a file to upload';
    submitBtn.disabled = true;
    editingIndex = null;
  }

  function formatBytes(bytes) {
    if (!bytes) return '';
    const kb = bytes / 1024;
    return kb < 1024
      ? kb.toFixed(1) + ' KB'
      : (kb / 1024).toFixed(1) + ' MB';
  }

  function renderComments() {

    commentsList.innerHTML = '';

    comments.forEach(function (c, index) {

      const wrapper = document.createElement('div');
      wrapper.className = 'bg-slate-100 rounded-lg p-3 space-y-2';

      const fileHtml = c.fileName
        ? `<div class="text-xs text-slate-500 font-medium">
            Supporting document attached
          </div>

          <div class="border border-slate-200 rounded-md px-3 py-2
                      flex items-center justify-between">

            <div class="min-w-0">
              <div class="text-sm text-slate-700 truncate">
                ${c.fileName}
              </div>
              <div class="text-xs text-slate-400">
                ${formatBytes(c.fileSize)}
              </div>
            </div>

            <div class="flex items-center gap-3 text-slate-400">

              <!-- eye icon -->
              <svg xmlns="http://www.w3.org/2000/svg"
                   class="h-4 w-4 cursor-pointer hover:text-slate-600"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5
                         c4.478 0 8.268 2.943 9.542 7
                         -1.274 4.057-5.064 7-9.542 7
                         -4.477 0-8.268-2.943-9.542-7z"/>
              </svg>

              <!-- download icon -->
              <svg xmlns="http://www.w3.org/2000/svg"
                   class="h-4 w-4 cursor-pointer hover:text-slate-600"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1
                         M12 12v9m0-9l-3 3m3-3l3 3M12 3v9"/>
              </svg>

            </div>
          </div>`
        : '';

      const actions = c.isInitial ? '' : 
      `<div class="flex gap-2 pt-2">
          <button class="deleteBtn text-xs px-2 py-1 rounded-md border border-orange-400 text-orange-500"
                  data-index="${index}">
            Delete Comment
          </button>
          <button class="editBtn text-xs px-2 py-1 rounded bg-red-500 text-white"
                  data-index="${index}">
            Edit Comment
          </button>
        </div>`;

      wrapper.innerHTML = 
      `<div class="flex justify-between text-xs text-slate-500">
          <span>${c.isInitial ? 'Current value' : 'User'}</span>
          <span>${c.time}</span>
        </div>
        <div class="text-sm text-slate-800">${c.text}</div>
        ${fileHtml}
        ${actions}
      `;

      commentsList.appendChild(wrapper);
    });
  }

  commentsList.addEventListener('click', function (e) {

    if (e.target.classList.contains('deleteBtn')) {
      const i = Number(e.target.dataset.index);
      comments.splice(i, 1);
      renderComments();
      return;
    }

    if (e.target.classList.contains('editBtn')) {

      const i = Number(e.target.dataset.index);
      const c = comments[i];

      editingIndex = i;
      commentInput.value = c.text;
      submitBtn.disabled = false;
      commentInput.focus();
    }

  });

  renderComments();

});
