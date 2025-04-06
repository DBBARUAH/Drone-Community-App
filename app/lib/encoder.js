// email.js
// Encoded email parts (Replace with your actual encoded values)
const encodedUsername = "dXNlcm5hbWU="; // base64 encoded "username"
const encodedDomain   = "ZXhhbXBsZQ=="; // base64 encoded "example"
const encodedTld      = "Y29t";         // base64 encoded "com"

// Decode function
export function decodeEmail() {
  const username = atob(encodedUsername);
  const domain   = atob(encodedDomain);
  const tld      = atob(encodedTld);
  return `${username}@${domain}.${tld}`;
}

// Setup email click handler on the specified selector
export function setupEmailHandler(selector) {
  const emailElement = document.querySelector(selector);
  if (emailElement) {
    emailElement.addEventListener('click', event => {
      event.preventDefault(); // Prevent default link behavior
      const decodedEmail = decodeEmail();
      console.log("Decoded Email:", decodedEmail); // Debugging
      window.location.href = `mailto:${decodedEmail}`;
    });
  }
}