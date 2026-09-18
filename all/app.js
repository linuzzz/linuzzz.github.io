const rootElement = document.querySelector('#bookmarks-root');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#bookmark-search');
const clearSearchButton = document.querySelector('#clear-search');
const searchStatus = document.querySelector('#search-status');
let bookmarksData;

function countBookmarks(node) {
  if (!node || node.type === 'bookmark') {
    return node?.type === 'bookmark' ? 1 : 0;
  }

  return (node.children || []).reduce((total, child) => total + countBookmarks(child), 0);
}

function filterBookmarks(node, query) {
  if (!query) return node;

  if (node.type === 'bookmark') {
    const searchableText = `${node.name} ${node.url}`.toLowerCase();
    return searchableText.includes(query) ? node : null;
  }

  const matchingChildren = (node.children || [])
    .map((child) => filterBookmarks(child, query))
    .filter(Boolean);

  return matchingChildren.length > 0 ? { ...node, children: matchingChildren } : null;
}

function renderBookmarks(query = '') {
  const filteredData = Array.isArray(bookmarksData)
    ? bookmarksData
      .map((section) => filterBookmarks(section, query.trim().toLowerCase()))
      .filter(Boolean)
    : filterBookmarks(bookmarksData, query.trim().toLowerCase());
  const hasFilteredData = Array.isArray(filteredData) ? filteredData.length > 0 : Boolean(filteredData);
  rootElement.replaceChildren();

  if (hasFilteredData) {
    if (Array.isArray(filteredData)) {
      filteredData.forEach((section) => rootElement.appendChild(createFolderCard(section)));
    } else {
      rootElement.appendChild(createFolderCard(filteredData));
    }
  } else {
    const empty = document.createElement('div');
    empty.className = 'empty-folder';
    empty.textContent = 'No bookmarks match your search';
    rootElement.appendChild(empty);
  }

  const hasQuery = query.trim().length > 0;
  clearSearchButton.hidden = !hasQuery;
  const matchingCount = Array.isArray(filteredData)
    ? filteredData.reduce((total, section) => total + countBookmarks(section), 0)
    : countBookmarks(filteredData);
  searchStatus.textContent = hasQuery && hasFilteredData
    ? `${matchingCount} matching bookmark${matchingCount === 1 ? '' : 's'}`
    : '';
}

function createBookmarkLink(bookmark) {
  const link = document.createElement('a');
  link.href = bookmark.url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.className = 'bookmark-item';
  link.title = bookmark.name;

  const main = document.createElement('div');
  main.className = 'bookmark-main';

  const icon = document.createElement('span');
  icon.className = 'bookmark-link-icon';
  icon.innerHTML = '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';

  const label = document.createElement('span');
  label.className = 'bookmark-label';
  label.textContent = bookmark.name;

  const url = document.createElement('span');
  url.className = 'bookmark-url';
  url.textContent = bookmark.url;

  main.append(icon, label);
  link.append(main, url);

  return link;
}

function createFolderCard(node, depth = 0) {
  const isLeaf = !node.children || node.children.length === 0;
  const item = document.createElement('article');
  item.className = 'folder-card';
  item.style.marginLeft = `${depth * 16}px`;

  const header = document.createElement('button');
  header.type = 'button';
  header.className = 'folder-header';
  header.setAttribute('aria-expanded', String(!isLeaf));

  const titleGroup = document.createElement('div');
  titleGroup.className = 'folder-title-group';

  const icon = document.createElement('span');
  icon.className = 'folder-icon';
  icon.innerHTML = '<i class="fa-regular fa-folder" aria-hidden="true"></i>';

  const name = document.createElement('span');
  name.className = 'folder-name';
  name.textContent = node.name;

  const count = document.createElement('span');
  count.className = 'folder-meta';
  count.textContent = isLeaf ? '0 items' : `${countBookmarks(node)} items`;

  titleGroup.append(icon, name);

  const toggle = document.createElement('span');
  toggle.className = 'folder-toggle';
  toggle.innerHTML = `<i class="fa-solid ${isLeaf ? 'fa-arrow-right' : 'fa-arrow-down'}" aria-hidden="true"></i>`;

  header.append(titleGroup, count, toggle);

  const body = document.createElement('div');
  body.className = 'folder-body';

  const children = document.createElement('div');
  children.className = 'folder-children';

  if (!isLeaf) {
    item.classList.add('is-open');
    (node.children || []).forEach((child) => {
      const childElement = child.type === 'folder' ? createFolderCard(child, depth + 1) : createBookmarkLink(child);
      if (child.type === 'bookmark') {
        childElement.classList.add('is-bookmark');
      }
      children.appendChild(childElement);
    });
  } else {
    const empty = document.createElement('div');
    empty.className = 'empty-folder';
    empty.textContent = 'No bookmarks in this folder';
    children.appendChild(empty);
  }

  body.appendChild(children);

  header.addEventListener('click', () => {
    const isOpen = item.classList.toggle('is-open');
    header.setAttribute('aria-expanded', String(isOpen));
    const toggleIcon = toggle.querySelector('i');
    toggleIcon.classList.toggle('fa-arrow-down', isOpen);
    toggleIcon.classList.toggle('fa-arrow-right', !isOpen);
  });

  item.append(header, body);
  return item;
}

async function loadBookmarks() {
  try {
    const response = await fetch('./data/bookmarks.json');
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    bookmarksData = await response.json();
    renderBookmarks();
  } catch (error) {
    rootElement.innerHTML = `
      <div class="folder-card">
        <div class="folder-header">
          <div class="folder-title-group">
            <span class="folder-icon">⚠️</span>
            <span class="folder-name">Unable to load bookmarks</span>
          </div>
        </div>
        <div class="folder-body" style="display:block;">
          <div class="empty-folder">${error.message}. Please place your JSON export in data/bookmarks.json.</div>
        </div>
      </div>
    `;
  }
}

searchForm.addEventListener('submit', (event) => event.preventDefault());
searchInput.addEventListener('input', () => renderBookmarks(searchInput.value));
clearSearchButton.addEventListener('click', () => {
  searchInput.value = '';
  searchInput.focus();
  renderBookmarks();
});

loadBookmarks();
