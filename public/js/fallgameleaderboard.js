// Update your JavaScript file (leaderboardSetting.js)
function checkCookie() {
    console.log("Checking cookie...");
    var username = getCookie("username");
    console.log("Username from cookie:", username);
    if (!username) {
        console.log("Redirecting to login.html");
        window.location = "login.html";
    } else {
        
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }


  // Update your JavaScript file (leaderboardSetting.js)

// Update your JavaScript file (leaderboardSetting.js)

// Function to fetch and update leaderboard data
async function fetchfallLeaderboard() {
    try {
      const response = await fetch('/fallleaderboard');
      const leaderboardData = await response.json();
  
      const leaderboardContainer = document.getElementById('leaderboard');
      leaderboardContainer.innerHTML = '';
  
      Object.values(leaderboardData).forEach((entry, index) => {
        const currentnum = index + 1;
  
        const row = document.createElement('div');
        row.classList.add('row');
  
        const leaderboardNumber = document.createElement('div');
        leaderboardNumber.className = 'LeaderBoardNumber';
        row.appendChild(leaderboardNumber);
  
        const leaderboardText = document.createElement('h1');
        leaderboardText.className = 'LeaderBoardNumber' + currentnum;
  
        const username = entry.username || 'N/A';
        const fallgamescore = entry.fallgamescore || 'N/A';
  
        leaderboardText.innerHTML = `${username}  Score: ${fallgamescore}`;
        leaderboardNumber.appendChild(leaderboardText);
  
        leaderboardContainer.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching and updating leaderboard:', error);
    }
  }
  
 // Add a function to post comments
async function postComment() {
    try {
        // Get the comment text from the textarea
        const commentText = document.getElementById('textmsg').value;

        // Make sure the comment is not empty
        if (commentText.trim() === '') {
            alert('Please enter a comment before posting.');
            return;
        }

        // Send the comment to the server
        const response = await fetch('/submitComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commentText }),
        });

        if (response.ok) {
            // If the server successfully handles the comment, fetch and update the comments
            fetchComments();
            // Clear the textarea after posting
            document.getElementById('textmsg').value = '';
        } else {
            console.error('Failed to submit comment to server.');
        }
    } catch (error) {
        console.error('Error posting comment:', error);
    }
}

// Add a function to fetch and update comments
async function fetchComments() {
    try {
        const response = await fetch('/getComments');
        const commentsData = await response.json();

        const feedContainer = document.getElementById('feed-container');
        feedContainer.innerHTML = '';

        commentsData.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `<p>${comment.username}: ${comment.commentText}</p>`;
            feedContainer.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Error fetching and updating comments:', error);
    }
}

// Ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {
    checkCookie();
    fetchfallLeaderboard();
    fetchComments(); // Fetch and update comments when the page loads
});

  



  

