document.addEventListener("DOMContentLoaded", function () {
    // Dummy credentials for login
    const dummyCredentials = {
        username: "admin",
        password: "password123"
    };

    // Global variables
    let allNotices = [];

    // DOM Elements
    const loginSection = document.getElementById("loginSection");
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");
    const loginForm = document.getElementById("loginForm");
    const loginError = document.getElementById("loginError");

    // Login functionality
    // loginForm.addEventListener("submit", function (event) {
    //     event.preventDefault();
    //     const username = document.getElementById("username").value.trim();
    //     const password = document.getElementById("password").value.trim();

    //     if (username === dummyCredentials.username && password === dummyCredentials.password) {
    //         loginSection.style.display = "none";
    //         sidebar.style.display = "block";
    //         content.style.display = "block";
    //         fetchContacts(); // Load initial data
    //     } else {
    //         loginError.style.display = "block";
    //     }
    // });
    if (localStorage.getItem("isLoggedIn") === "true") {
        loginSection.style.display = "none";
        sidebar.style.display = "block";
        content.style.display = "block";
        fetchContacts(); // Load initial data
    }
    
    // Login functionality
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
    
        if (username === dummyCredentials.username && password === dummyCredentials.password) {
            localStorage.setItem("isLoggedIn", "true"); // Set login flag
            loginSection.style.display = "none";
            sidebar.style.display = "block";
            content.style.display = "block";
            fetchContacts(); // Load initial data
        } else {
            loginError.style.display = "block";
        }
    });

    // Sidebar navigation
    document.getElementById("contactLink").addEventListener("click", function () {
        showSection("contactSection");
        fetchContacts();
    });

    document.getElementById("noticeLink").addEventListener("click", function () {
        showSection("noticeSection");
        fetchNotices();
    });

    document.getElementById("populationLink").addEventListener("click", function () {
        showSection("populationSection");
        fetchPopulationData();
    });
    document.getElementById("teamLink").addEventListener("click", function () {
        showSection("teamSection");
    });

    document.getElementById("logoutLink").addEventListener("click", function () {
        loginSection.style.display = "block";
        sidebar.style.display = "none";
        content.style.display = "none";
        loginForm.reset();
        loginError.style.display = "none";
    });

    // Notice form handling
    document.getElementById("addNoticeBtn").addEventListener("click", function() {
        document.getElementById("noticeForm").style.display = "block";
    });

    document.getElementById("cancelNoticeBtn").addEventListener("click", function() {
        document.getElementById("noticeForm").style.display = "none";
        document.getElementById("noticeTitle").value = "";
        document.getElementById("noticeText").value = "";
    });

    // Section management
    function showSection(sectionId) {
        document.getElementById("contactSection").style.display = "none";
        document.getElementById("noticeSection").style.display = "none";
        document.getElementById("populationSection").style.display = "none";
        document.getElementById(sectionId).style.display = "block";
    }

    // Contact fetching function (single implementation)
    function fetchContacts() {
        const tableBody = document.getElementById('contactData');
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Loading contacts...</td></tr>`;
        
        fetch('https://jumlabackend.vercel.app/getContactsDetails')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error("Invalid data format received");
                }
                
                renderContacts(data);
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
                // Fallback to dummy data if API fails
                const dummyContacts = [
                    {
                        name: "John Doe",
                        email: "john@example.com",
                        phone: "1234567890",
                        message: "Sample message 1",
                        date: new Date()
                    },
                    {
                        name: "Jane Smith",
                        email: "jane@example.com",
                        phone: "9876543210",
                        message: "Sample message 2",
                        date: new Date()
                    }
                ];
                renderContacts(dummyContacts);
            });
    }

    function fetchContacts() {
        fetch('https://jumlabackend.vercel.app/getContactsDetails')  // Replace with your API endpoint
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById('contactData');
                tableBody.innerHTML = ""; // Clear existing rows to prevent duplication

                let serialNo = 1; // Initialize serial number
                data.forEach(contact => {
                    const row = document.createElement('tr');
                    const formattedDate = new Date(contact.date).toLocaleString('en-GB', { 
                        year: 'numeric', month: '2-digit', day: '2-digit', 
                        hour: '2-digit', minute: '2-digit' 
                    });

                    row.innerHTML = `
                        <td>${serialNo}</td>  <!-- Serial number column -->
                        <td>${contact.name}</td>
                        <td>${contact.email}</td>
                        <td>${contact.phone}</td>
                        <td>${contact.message}</td>
                        <td>${formattedDate}</td>
                    `;
                    tableBody.appendChild(row);
                    serialNo++; // Increment serial number for each row
                });
            })
            .catch(error => console.error('Error fetching contacts:', error));
    }

    // Notice handling functions
    async function fetchNotices() {
        try {
            const response = await fetch("https://jumlabackend.vercel.app/allnotices");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const data = await response.json();
            if (data.success && Array.isArray(data.notices)) {
                allNotices = data.notices;
                renderNotices();
            } else {
                throw new Error("Invalid data format");
            }
        } catch (error) {
            console.error("Error fetching notices:", error);
            loadDummyNotices();
        }
    }

    function loadDummyNotices() {
        allNotices = [
            {
                _id: "1",
                title: "Sample Notice 1",
                description: "This is a sample notice description.",
                date: new Date()
            },
            {
                _id: "2",
                title: "Sample Notice 2",
                description: "Another sample notice for testing purposes.",
                date: new Date(Date.now() - 86400000)
            }
        ];
        renderNotices();
    }

    // async function fetchNotices() {
    //     try {
    //         const response = await fetch("https://jumlabackend.vercel.app/allnotices");
    //         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
    //         const data = await response.json();
    //         if (data.success && Array.isArray(data.notices)) {
    //             allNotices = data.notices;
    //             renderNotices(); // Call render function after successfully fetching the data
    //         } else {
    //             throw new Error("Invalid data format");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching notices:", error);
    //         loadDummyNotices();
    //     }
    // }
    
    // function loadDummyNotices() {
    //     allNotices = [
    //         {
    //             _id: "1",
    //             title: "Sample Notice 1",
    //             description: "This is a sample notice description.",
    //             date: new Date()
    //         },
    //         {
    //             _id: "2",
    //             title: "Sample Notice 2",
    //             description: "Another sample notice for testing purposes.",
    //             date: new Date(Date.now() - 86400000)
    //         }
    //     ];
    //     renderNotices();
    // }
    
    function renderNotices() {
        const noticeTable = document.getElementById('noticeTable');
        noticeTable.innerHTML = "";
    
        if (allNotices.length === 0) {
            noticeTable.innerHTML = `<tr><td colspan="5" class="text-center">No notices found</td></tr>`;
            return;
        }
    
        allNotices.forEach((notice, index) => {
            const row = document.createElement('tr');
            const formattedDate = new Date(notice.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
    
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${notice.title}</td>
                <td>${notice.description}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteNotice('${notice._id}')">Delete</button>
                </td>
            `;
            noticeTable.appendChild(row);
        });
    }
    
    // Notice submission logic
    document.getElementById("submitNoticeBtn").addEventListener("click", function(event) {
        event.preventDefault();
        
        // Ensure the button is disabled to prevent multiple submissions
        const submitButton = document.getElementById("submitNoticeBtn");
        if (submitButton.disabled) return;  // Prevent submission if the button is disabled
        
        const noticeTitle = document.getElementById("noticeTitle").value.trim();
        const noticeText = document.getElementById("noticeText").value.trim();
    
        // Check if both fields are filled
        if (!noticeTitle || !noticeText) {
            alert("Please fill in both the title and description.");
            return;
        }
    
        // Disable submit button to prevent multiple submissions
        submitButton.disabled = true;
    
        // Make the API request to save the notice
        fetch('https://jumlabackend.vercel.app/addnotices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: noticeTitle, 
                description: noticeText 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Use AlertifyJS for a beautiful success message
            
                alert("Notice added successfully!");
                // Clear the form fields
                document.getElementById("noticeTitle").value = "";
                document.getElementById("noticeText").value = "";
    
                // Hide the form after submission
                document.getElementById("noticeForm").style.display = "none";
    
                // Fetch and display updated notices
                fetchNotices();
            } else {
                alertify.error("Failed to add notice.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alertify.error("There was an error submitting the notice.");
        })
        .finally(() => {
            // Re-enable the submit button after the fetch is complete
            submitButton.disabled = false;
        });
    });
    
    
    // Notice deletion logic
    window.deleteNotice = function(noticeId) {
        if (!confirm("Are you sure you want to delete this notice?")) return;
    
        fetch(`https://jumlabackend.vercel.app/deleteNotice/${noticeId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Notice deleted successfully.");
                fetchNotices();  // Re-fetch notices after deletion
            } else {
                alert("Failed to delete notice.");
            }
        })
        .catch(error => console.error("Error deleting notice:", error));
    };
    
    // Initial fetch of notices when the page loads
    window.onload = fetchNotices;
    
    document.getElementById("logoutLink").addEventListener("click", function () {
        localStorage.removeItem("isLoggedIn"); // Clear login flag
        loginSection.style.display = "block";
        sidebar.style.display = "none";
        content.style.display = "none";
        loginForm.reset();
        loginError.style.display = "none";
    });
    const teamAPI = 'https://jumlabackend.vercel.app';
    document.getElementById('teamForm').addEventListener('submit', e => {
        e.preventDefault();
        const newMember = {
          name: document.getElementById('name').value,
          post: document.getElementById('post').value,
          phone: document.getElementById('phone').value,
          photo: document.getElementById('photo').value
        };
    
        fetch(`${teamAPI}/postTeamMembers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMember)
        })
        .then(res => res.json())
        .then(() => {
          document.getElementById('teamForm').reset();
          loadTeamMembers();
          fetchPopulationData();
        });
      });
      function loadTeamMembers() {
        fetch(`${teamAPI}/getTeamMembers`)
          .then(res => res.json())
          .then(data => {
            const tbody = document.getElementById('teamTableBody');
            tbody.innerHTML = '';
            data.forEach(member => {
              tbody.innerHTML += `
                <tr>
                  <td>
                    <img src="https://jumlabackend.vercel.app/img/${member.photo}" 
                         alt="${member.name}" 
                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;">
                  </td>
                  <td>${member.name}</td>
                  <td>${member.post}</td>
                  <td>${member.phone}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteMember('${member._id}')">Delete</button>
                  </td>
                </tr>
              `;
            });
          })
          .catch(err => console.error('Error loading team members:', err));
      }
    
      // Delete a team member
      function deleteMember(id) {
        if (confirm("Are you sure you want to delete this member?")) {
          fetch(`${teamAPI}/${id}`, {
            method: 'DELETE'
          })
          .then(res => res.json())
          .then(data => {
            console.log(data.message);
            loadTeamMembers(); // reload after delete
          })
          .catch(err => console.error('Delete error:', err));
        }
      }
    
      // Initial load
      window.addEventListener('DOMContentLoaded', loadTeamMembers);
    //   function fetchPopulationData() {
    //     fetch('https://jumlabackend.vercel.app/getPopulation')
    //         .then(response => response.json())
    //         .then(data => {
    //             const tableBody = document.getElementById('populationTableBody');
    //             tableBody.innerHTML = ''; // Clear existing rows
    //             data.forEach(item => {
    //                 const row = document.createElement('tr');
    //                 row.innerHTML = `
    //                     <td>${item.areaName}</td>
    //                     <td>${item.population}</td>
    //                     <td>
    //                         <button class="btn btn-danger" onclick="deletePopulationData('${item._id}')">Delete</button>
    //                     </td>
    //                 `;
    //                 tableBody.appendChild(row);
    //             });
    //         });
    // }

    // Handle form submission for creating new population data
    document.getElementById("populationForm").addEventListener("submit", function (event) {
        event.preventDefault();  // Prevent the form from submitting the default way
        
        const areaName = document.getElementById("areaName").value.trim();
        const population = document.getElementById("population").value.trim();
        
        console.log(areaName, population);  // Check if data is correct here
        
        if (areaName && population) {
            // Ensure population is converted to a number if it's a string
            const payload = { areaName, population: Number(population) };
            
            fetch('https://jumlabackend.vercel.app/postPopulation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);  // Check the response from the server
                if (data.success) {
                    alert('Population data added successfully!');
                    fetchPopulationData();  // Reload the data to reflect the new entry
                    document.getElementById("populationForm").reset(); // Reset form
                } else {
                    alert('Error adding data!');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error.');
            });
        }
    });
    function fetchPopulationData() {
        fetch('https://jumlabackend.vercel.app/getPopulation')  // Correct endpoint
            .then(response => response.json())
            .then(data => {
                console.log(data);  // Check if the data is fetched correctly
                const tableBody = document.getElementById('populationTableBody');
                tableBody.innerHTML = ''; // Clear the table before appending new data
    
                data.forEach(item => {
                    const row = document.createElement('tr');
                    
                    const areaNameCell = document.createElement('td');
                    areaNameCell.textContent = item.areaName;
                    row.appendChild(areaNameCell);
                    
                    const populationCell = document.createElement('td');
                    populationCell.textContent = item.population;
                    row.appendChild(populationCell);
                    
                    const actionsCell = document.createElement('td');
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('btn', 'btn-danger');
                    deleteButton.addEventListener('click', function() {
                        deletePopulationData(item._id); // Pass the ID of the population to delete
                    });
                    actionsCell.appendChild(deleteButton);
                    row.appendChild(actionsCell);
                    
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    function deletePopulationData(id) {
        if (confirm("Are you sure you want to delete this record?")) {
            fetch(`https://jumlabackend.vercel.app/population/${id}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    console.log(data);  // Log the response for debugging
                    if (data.success) {
                        alert('Population data deleted successfully!');
                        fetchPopulationData(); // Reload the data after deletion
                    } else {
                        alert('Error deleting data: ' + (data.message || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error.');
                });
        }
    }
    
    
});
