async function loadBlogPosts(containerId, isRoot = false, limit = 15, asList = false) {
  try {
    // Adjust fetch path based on where we are executing
    const finalPath = isRoot ? 'blog/data.json' : 'data.json';

    const res = await fetch(finalPath);
    const posts = await res.json();
    
    const container = document.getElementById(containerId);
    if (!container) return;

    // Filter out current post if we are on a blog page
    const currentFilename = window.location.pathname.split('/').pop();
    const filteredPosts = posts.filter(post => post.link !== currentFilename);

    // Sort by date descending (newest first)
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Apply limit
    const displayPosts = filteredPosts.slice(0, limit);

    // Helper to format date
    const formatDate = (dateString) => {
      const [year, month, day] = dateString.split('-');
      const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
    };

    if (asList) {
      const listHtml = displayPosts.map(post => {
        let linkPath = post.link;
        if (isRoot) {
          linkPath = 'blog/' + post.link;
        }
        return `<li><a href="${linkPath}">${post.title}</a> <span style="color: #777; font-size: 0.9em;">(${formatDate(post.date)})</span></li>`;
      }).join('');
      
      container.innerHTML = `<ul class="recent-posts-list">${listHtml}</ul>`;
    } else {
      container.innerHTML = displayPosts.map(post => {
        // Fix image and link paths depending on where we are
        
        let imagePath = post.image;
        let linkPath = post.link;

        if (isRoot) {
          // We are in root. JSON has "../images/..." -> need "images/..."
          imagePath = post.image.replace('../', '');
          // Link in JSON is "filename.html" (relative to blog). From root it should be "blog/filename.html"
          linkPath = 'blog/' + post.link;
        }

        return `
          <div class="blog-card">
            <div class="blog-img-container">
              <img src="${imagePath}" alt="${post.title}">
            </div>
            <div class="blog-content">
              <span class="blog-date">${formatDate(post.date)}</span>
              <h3>${post.title}</h3>
              <p>${post.summary}</p>
              <a href="${linkPath}" class="btn-text">Leer más &rarr;</a>
            </div>
          </div>
        `;
      }).join('');
    }

  } catch (error) {
    console.error('Error loading blog posts:', error);
  }
}

async function loadAllPostsList(containerId, isRoot = false, itemsPerPage = 10) {
  try {
    const finalPath = isRoot ? 'blog/data.json' : 'data.json';
    const res = await fetch(finalPath);
    let posts = await res.json();
    
    const container = document.getElementById(containerId);
    if (!container) return;

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Helper to format date
    const formatDate = (dateString) => {
      const [year, month, day] = dateString.split('-');
      const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
    };

    let currentPage = 1;
    const totalPages = Math.ceil(posts.length / itemsPerPage);

    const renderList = (page) => {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pagePosts = posts.slice(start, end);

      const listHtml = pagePosts.map(post => {
        let linkPath = post.link;
        if (isRoot) {
          linkPath = 'blog/' + post.link;
        }
        return `<li><a href="${linkPath}">${post.title}</a> <span style="color: #777; font-size: 0.9em;">(${formatDate(post.date)})</span></li>`;
      }).join('');

      const controlsHtml = `
        <div class="pagination-controls">
          <button class="pagination-btn" id="prev-btn" ${page === 1 ? 'disabled' : ''}>&larr; Anterior</button>
          <span style="color: #777; font-size: 0.9em;">Página ${page} de ${totalPages}</span>
          <button class="pagination-btn" id="next-btn" ${page === totalPages ? 'disabled' : ''}>Siguiente &rarr;</button>
        </div>
      `;

      container.innerHTML = `<ul class="recent-posts-list">${listHtml}</ul>${totalPages > 1 ? controlsHtml : ''}`;

      if (totalPages > 1) {
        document.getElementById('prev-btn').addEventListener('click', () => {
          if (currentPage > 1) {
            currentPage--;
            renderList(currentPage);
          }
        });
        document.getElementById('next-btn').addEventListener('click', () => {
          if (currentPage < totalPages) {
            currentPage++;
            renderList(currentPage);
          }
        });
      }
    };

    renderList(currentPage);

  } catch (error) {
    console.error('Error loading all posts list:', error);
  }
}
