
function checkCookie() {
  console.log("Checking cookie...");
  var username = getCookie("username");
  console.log("Username from cookie:", username);
  if (!username) {
      console.log("Redirecting to login.html");
      window.location = "login.html";
  } else {
    console.log("Username found:", username);
    // Update the DOM with the username
    const usernameDisplay = document.getElementById("usernameDisplay");
    if (usernameDisplay) {
        usernameDisplay.innerText = "Welcome, " + username;
    } else {
        console.error("Element with ID 'usernameDisplay' not found");
    }
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}




// Function to fetch and update leaderboard data
async function fetchLeaderboard() {
  try {
      // Fetch fall leaderboard data from the server
      const response = await fetch('/leaderboard');
      const leaderboardData = await response.json();

      // Clear existing leaderboard content
      const leaderboardContainer = document.getElementById('leaderboard');
      leaderboardContainer.innerHTML = '';

      // Iterate through the received data and update the leaderboard
      for (const [index, entry] of Object.entries(leaderboardData)) {
          const currentnum = parseInt(index) + 1;

          // Create a new row element
          const row = document.createElement('div');
          row.classList.add('row');

          // Create elements for leaderboard number, username, score, and like button
          const leaderboardNumber = document.createElement('div');
          leaderboardNumber.className = 'LeaderBoardNumber';
          row.appendChild(leaderboardNumber);

          const leaderboardText = document.createElement('h1');
          leaderboardText.className = 'LeaderBoardNumber' + currentnum;

          // Get username and fallgamescore from the entry
          const username = entry.username || 'N/A';
          const dinogamescore = entry.dinogamescore || 'N/A';

          // Set the text content for the leaderboard entry
          leaderboardText.innerHTML = `${username}  Score: ${dinogamescore !== 'N/A' ? dinogamescore : '0'}`;


          // Create a like button
          const likeButton = document.createElement('button');
          likeButton.innerHTML = 'Like';

          // Create a span element for displaying the like count
          const likeCountSpan = document.createElement('span');
          likeCountSpan.innerHTML = '0'; // Initial like count
          likeButton.appendChild(likeCountSpan);

          // Fetch the current like count from the server
          const likeCountResponse = await fetch('/getLikeCount', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  username: username,
              }),
          });

          if (likeCountResponse.ok) {
              const likeCountData = await likeCountResponse.json();
              clickCount = likeCountData.likeCount;
              likeCountSpan.innerHTML = clickCount;
          } else {
              console.error('Failed to fetch like count from the server.');
          }

          // Add a click event listener to the like button
          likeButton.addEventListener('click', async () => {
              // Increment the click count
              clickCount++;

              // Update the like count in the span element
              likeCountSpan.innerHTML = clickCount;

              // Send a request to the server to update the like count
              const likeResponse = await fetch('/likeScore', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      username: username,
                      updatedLikeCount: clickCount,
                  }),
              });

              if (!likeResponse.ok) {
                  console.error('Failed to update like count on the server.');
                  // You might want to handle this error appropriately
              }
          });

          // Append elements to the row
          leaderboardNumber.appendChild(leaderboardText);
          leaderboardNumber.appendChild(likeButton);

          // Append the row to the leaderboard container
          leaderboardContainer.appendChild(row);
      }
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
  fetchLeaderboard();
  fetchComments(); // Fetch and update comments when the page loads
});







