let countdownIntervals = {};

window.onload = function() {
  const savedURLs = JSON.parse(localStorage.getItem('urls')) || [];
  savedURLs.forEach(url => {
    const sidebar = document.getElementById('sidebar');
    const shortenedURLItem = document.createElement('div');
    shortenedURLItem.className = 'shortened-url';
    shortenedURLItem.id = url.shortURL;
    shortenedURLItem.innerHTML = `<span><a href="${url.longURL}" target="_blank">${url.shortURL}</a></span><span class="delete-icon" onclick="deleteURL(this)">🗑️</span><div class="countdown" id="${url.shortURL}Countdown"></div>`;
    sidebar.appendChild(shortenedURLItem);

    const expirationTime = url.expirationTime;
  
    startCountdown(url.shortURL, expirationTime);
  });
};


function shortenURL() {
 
  const longURL = document.getElementById('longURLInput').value;
  const expirationTime = parseInt(document.getElementById('expirationTime').value, 10);


  const shortURL = shortenURLHelper(longURL);
  const sidebar = document.getElementById('sidebar');
  const shortenedURLItem = document.createElement('div');
  shortenedURLItem.className = 'shortened-url';
  shortenedURLItem.id = shortURL;
  shortenedURLItem.innerHTML = `<span><a href="${longURL}" target="_blank">${shortURL}</a></span><span class="delete-icon" onclick="deleteURL(this)">🗑️</span><div class="countdown" id="${shortURL}Countdown"></div>`;
  sidebar.appendChild(shortenedURLItem);

  saveToLocalStorage(shortURL, longURL, expirationTime);

  document.getElementById('longURLInput').value = '';

  startCountdown(shortURL, expirationTime);
}

function startCountdown(shortURL, expirationTime) {
  const countdownContainer = document.getElementById(`${shortURL}Countdown`);
  let countdown = expirationTime || 300;
  countdownIntervals[shortURL] = setInterval(() => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    countdownContainer.textContent = `Expires in ${minutes}m ${seconds}s`;
    countdown--;

    if (countdown < 0) {
      clearInterval(countdownIntervals[shortURL]);
      countdownContainer.textContent = 'Link has expired';
     
      removeFromLocalStorage(shortURL);
     
      const sidebar = document.getElementById('sidebar');
      const shortenedURLItem = document.getElementById(shortURL);
      sidebar.removeChild(shortenedURLItem);
    }
  }, 1000);
}


function deleteURL(element) {
  const sidebar = document.getElementById('sidebar');
  const shortenedURLItem = element.parentElement;
  const shortURL = shortenedURLItem.querySelector('a').textContent;
  sidebar.removeChild(shortenedURLItem);

 
  clearInterval(countdownIntervals[shortURL]);


  removeFromLocalStorage(shortURL);
}

function shortenURLHelper(longURL) {
  const shortURL = `https://dielli/${generateRandomString(6)}`;
  
  console.log(`Shortened URL ${shortURL} -> Long URL ${longURL}`);

  return shortURL;
}

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

function saveToLocalStorage(shortURL, longURL, expirationTime) {
  let urls = JSON.parse(localStorage.getItem('urls')) || [];
  urls.push({ shortURL, longURL, expirationTime });
  localStorage.setItem('urls', JSON.stringify(urls));
}

function removeFromLocalStorage(shortURL) {
  let urls = JSON.parse(localStorage.getItem('urls')) || [];
  urls = urls.filter(url => url.shortURL !== shortURL);
  localStorage.setItem('urls', JSON.stringify(urls));
}
