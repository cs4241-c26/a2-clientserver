// Function to fetch and display anime list
async function fetchAnimeList() {
    try {
        const response = await fetch('/api/anime');
        const animeList = await response.json();
        displayAnimeList(animeList);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to display anime list
function displayAnimeList(animeList) {
    const tableBody = document.getElementById('animeList');
    tableBody.innerHTML = '';

    animeList.forEach(anime => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${anime.title}</td>
            <td>${anime.rating}</td>
            <td>${anime.episodes}</td>
            <td>${anime.dateAdded}</td>
            <td>${anime.popularityScore}</td>
            <td>
                <button class="edit-btn" onclick="editAnime(${anime.id})">Edit</button>
                <button class="delete-btn" onclick="deleteAnime(${anime.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to handle form submission
const submit = async function(event) {
    event.preventDefault();

    const formData = {
        title: document.getElementById('title').value,
        rating: Number(document.getElementById('rating').value),
        episodes: Number(document.getElementById('episodes').value)
    };

    const editId = event.target.dataset.editId;
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/anime/${editId}` : '/api/anime';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const updatedList = await response.json();
        displayAnimeList(updatedList);
        
        // Reset form
        event.target.reset();
        delete event.target.dataset.editId;
        document.querySelector('#animeForm button').textContent = 'Add Anime';
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to delete anime
async function deleteAnime(id) {
    try {
        const response = await fetch(`/api/anime/${id}`, {
            method: 'DELETE'
        });
        const updatedList = await response.json();
        displayAnimeList(updatedList);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to edit anime
async function editAnime(id) {
    try {
        const response = await fetch('/api/anime');
        const animeList = await response.json();
        const anime = animeList.find(a => a.id === id);
        
        if (anime) {
            document.getElementById('title').value = anime.title;
            document.getElementById('rating').value = anime.rating;
            document.getElementById('episodes').value = anime.episodes;
            
            // Change form submit button to update
            const form = document.getElementById('animeForm');
            form.dataset.editId = id;
            document.querySelector('#animeForm button').textContent = 'Update Anime';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

window.onload = function() {
    const form = document.getElementById('animeForm');
    form.onsubmit = submit;
    fetchAnimeList();
}
