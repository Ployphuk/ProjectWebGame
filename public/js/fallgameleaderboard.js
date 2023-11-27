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
  
  // Ensure the DOM is fully loaded before executing the script
  document.addEventListener('DOMContentLoaded', function () {
    checkCookie();
    fetchfallLeaderboard(); // Fetch leaderboard data when the page loads
    // pageLoad(); // Commented out or removed if not needed
  });
  
  