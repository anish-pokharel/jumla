document.addEventListener("DOMContentLoaded", function () {
    // Dummy credentials for login
    const dummyCredentials = {
        username: "admin",
        password: "password123"
    };

    // Handle login form submission
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (username === dummyCredentials.username && password === dummyCredentials.password) {
            // Hide login form and show sidebar & sections
            document.getElementById("loginSection").style.display = "none";
            document.getElementById("sidebar").style.display = "block";
            document.getElementById("content").style.display = "block";
        } else {
            document.getElementById("loginError").style.display = "block";
        }
    });

    // Sidebar navigation
    document.getElementById("contactLink").addEventListener("click", function () {
        showSection("contactSection");
    });

    document.getElementById("noticeLink").addEventListener("click", function () {
        showSection("noticeSection");
    });

    document.getElementById("populationLink").addEventListener("click", function () {
        showSection("populationSection");
    });

    document.getElementById("logoutLink").addEventListener("click", function () {
        document.getElementById("loginSection").style.display = "block";
        document.getElementById("sidebar").style.display = "none";
        document.getElementById("content").style.display = "none";
    });

    // Show selected section and hide others
    function showSection(sectionId) {
        document.getElementById("contactSection").style.display = "none";
        document.getElementById("noticeSection").style.display = "none";
        document.getElementById("populationSection").style.display = "none";

        document.getElementById(sectionId).style.display = "block";
    }

    // Sample contact data fetching (mocking)
    function fetchContacts() {
        fetch('http://localhost:3200/getContactsDetails')  // Replace with your API endpoint
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById('contactData');
                data.forEach(contact => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${contact.name}</td>
                        <td>${contact.email}</td>
                        <td>${contact.phone}</td>
                        <td>${contact.message}</td>
                        <td>${contact.date}</td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching contacts:', error));
    }

    // Show Notice form when clicking 'Add Notice'

    document.getElementById("submitNoticeBtn").addEventListener("click", function(event) {
        event.preventDefault();
    
        // Get the values from the input fields
        var noticeTitle = document.getElementById("noticeTitle").value.trim();
        var noticeText = document.getElementById("noticeText").value.trim();
    
        // Validate that both fields are filled
        if (noticeTitle === "" || noticeText === "") {
            alert("Please fill in both the title and description.");
            return;
        }
    
        // Prepare data to be sent to the backend
        var noticeData = {
            title: noticeTitle,
            description: noticeText
        };
    
        // Send the data to the backend using fetch
        fetch('http://localhost:3200/addnotices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noticeData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert("Notice added successfully.");
    
                // Create a new list item for the notice
                var noticeItem = document.createElement("li");
                noticeItem.classList.add("list-group-item");
    
                // Add the notice title and description
                noticeItem.innerHTML = "<strong>" + noticeTitle + "</strong><br>" + noticeText;
    
                // Append the new notice to the notice list
                document.getElementById("noticeList").appendChild(noticeItem);
    
                // Clear the input fields
                document.getElementById("noticeTitle").value = "";
                document.getElementById("noticeText").value = "";
    
                // Optionally, hide the form after submission
                document.getElementById("noticeForm").style.display = "none";
            } else {
                
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("There was an error submitting the notice.");
        });
    });
    document.getElementById("cancelNoticeBtn").addEventListener("click", function() {
        // Clear the input fields and hide the form if canceled
        document.getElementById("noticeTitle").value = "";
        document.getElementById("noticeText").value = "";
        document.getElementById("noticeForm").style.display = "none";
    });


    // Handle Population Data form submission
    document.getElementById("populationForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const areaName = document.getElementById("areaName").value.trim();
        const population = document.getElementById("population").value.trim();

        if (areaName && population) {
            alert("Population data for " + areaName + " has been submitted.");
            document.getElementById("areaName").value = '';
            document.getElementById("population").value = '';
        }
    });

    // Call fetchContacts when the page is loaded
    fetchContacts();
});
