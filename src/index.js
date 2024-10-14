// Your code here
document.addEventListener("DOMContentLoaded", () => {
    const filmList = document.getElementById("films");
    const filmDetails = document.getElementById("film-details");
    const buyTicketButton = document.getElementById("buy-ticket");
  
    // Fetch and display all films
    fetch('http://localhost:3000/films')
      .then(response => response.json())
      .then(films => {
        films.forEach(film => {
          const li = document.createElement('li');
          li.textContent = film.title;
          li.classList.add('film', 'item');
          li.dataset.id = film.id; // Store film ID for future reference
  
          // Create a delete button
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.classList.add('delete-button');
          
          // Add event listener to the delete button
          deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the click on the list item
            deleteFilm(film.id, li);
          });
  
          // Append the button to the list item
          li.appendChild(deleteButton);
  
          // Add event listener to display film details when clicked
          li.addEventListener('click', () => {
            displayFilmDetails(film);
          });
  
          filmList.appendChild(li);
        });
      });
  
    function displayFilmDetails(film) {
      filmDetails.innerHTML = `
        <h2>${film.title}</h2>
        <img src="${film.poster}" alt="${film.title} poster">
        <p>Runtime: ${film.runtime} minutes</p>
        <p>Showtime: ${film.showtime}</p>
        <p>Available Tickets: ${film.capacity - film.tickets_sold}</p>
      `;
      updateBuyTicketButton(film);
    }
  
    function updateBuyTicketButton(film) {
      const availableTickets = film.capacity - film.tickets_sold;
      buyTicketButton.disabled = availableTickets <= 0;
      buyTicketButton.textContent = availableTickets > 0 ? "Buy Ticket" : "Sold Out";
  
      buyTicketButton.onclick = () => {
        if (availableTickets > 0) {
          // Update tickets sold
          fetch(`http://localhost:3000/films/${film.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tickets_sold: film.tickets_sold + 1 })
          })
          .then(response => response.json())
          .then(updatedFilm => {
            displayFilmDetails(updatedFilm);
            // Log the ticket purchase
            fetch('http://localhost:3000/tickets', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ film_id: updatedFilm.id, number_of_tickets: 1 })
            });
          });
        }
      };
    }
  
    function deleteFilm(filmId, listItem) {
      // Send DELETE request to the server
      fetch(`http://localhost:3000/films/${filmId}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          // Remove the film from the UI
          listItem.remove();
        } else {
          console.error("Error deleting film");
        }
      })
      .catch(error => console.error("Network error:", error));
    }
  });
//   document.addEventListener("DOMContentLoaded", () => {
//     const filmList = document.getElementById("films");
//     const filmDetails = document.getElementById("film-details");
//     const buyTicketButton = document.getElementById("buy-ticket");
  
//     // Fetch and display all films
//     fetch('http://localhost:3000/films')
//       .then(response => response.json())
//       .then(films => {
//         films.forEach(film => {
//           const li = document.createElement('li');
//           li.textContent = film.title;
//           li.classList.add('film', 'item');
//           li.dataset.id = film.id; // Store film ID for future reference
  
//           // Create a delete button
//           const deleteButton = document.createElement('button');
//           deleteButton.textContent = 'Delete';
//           deleteButton.classList.add('delete-button');
  
//           // Add event listener to the delete button
//           deleteButton.addEventListener('click', (e) => {
//             e.stopPropagation(); // Prevent triggering the click on the list item
//             deleteFilm(film.id, li);
//           });
  
//           // Append the delete button to the list item
//           li.appendChild(deleteButton);
  
//           // Add event listener to display film details when clicked
//           li.addEventListener('click', () => {
//             displayFilmDetails(film);
//           });
  
//           filmList.appendChild(li);
//         });
//       });
  
//     function displayFilmDetails(film) {
//       filmDetails.innerHTML = `
//         <h2>${film.title}</h2>
//         <img src="${film.poster}" alt="${film.title} poster">
//         <p>Runtime: ${film.runtime} minutes</p>
//         <p>Showtime: ${film.showtime}</p>
//         <p>Available Tickets: ${film.capacity - film.tickets_sold}</p>
//       `;
//       updateBuyTicketButton(film);
//     }
  
//     function updateBuyTicketButton(film) {
//       const availableTickets = film.capacity - film.tickets_sold;
//       buyTicketButton.disabled = availableTickets <= 0;
//       buyTicketButton.textContent = availableTickets > 0 ? "Buy Ticket" : "Sold Out";
  
//       buyTicketButton.onclick = () => {
//         if (availableTickets > 0) {
//           // Update tickets sold
//           fetch(`http://localhost:3000/films/${film.id}`, {
//             method: 'PATCH',
//             headers: {
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ tickets_sold: film.tickets_sold + 1 })
//           })
//           .then(response => response.json())
//           .then(updatedFilm => {
//             displayFilmDetails(updatedFilm);
//             // Log the ticket purchase
//             fetch('http://localhost:3000/tickets', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify({ film_id: updatedFilm.id, number_of_tickets: 1 })
//             });
//           });
//         }
//       };
//     }
  
//     function deleteFilm(filmId, listItem) {
//       // Send DELETE request to the server
//       fetch(`http://localhost:3000/films/${filmId}`, {
//         method: 'DELETE',
//       })
//       .then(response => {
//         if (response.ok) {
//           // Remove the film from the UI
//           listItem.remove();
//         } else {
//           console.error("Error deleting film");
//         }
//       })
//       .catch(error => console.error("Network error:", error));
//     }
//   });
   