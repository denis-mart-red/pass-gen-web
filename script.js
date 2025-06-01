// Sync number input with range slider
const lengthInput = document.getElementById('length');
const lengthSlider = document.getElementById('lengthSlider');

lengthInput.addEventListener('input', (e) => {
  lengthSlider.value = e.target.value;
  updateStrengthMeter();
});

lengthSlider.addEventListener('input', (e) => {
  lengthInput.value = e.target.value;
  updateStrengthMeter();
});

function toggleOption(checkboxId, card) {
  const checkbox = document.getElementById(checkboxId);
  checkbox.checked = !checkbox.checked;
  card.classList.toggle('active', checkbox.checked);
  updateStrengthMeter();
}

function updateStrengthMeter() {
  const length = parseInt(lengthInput.value);
  const hasUpper = document.getElementById('uppercase').checked;
  const hasLower = document.getElementById('lowercase').checked;
  const hasNumbers = document.getElementById('numbers').checked;
  const hasSymbols = document.getElementById('symbols').checked;
  
  let score = 0;
  let typeCount = 0;
  
  if (hasUpper) typeCount++;
  if (hasLower) typeCount++;
  if (hasNumbers) typeCount++;
  if (hasSymbols) typeCount++;
  
  // Calculate strength based on length and character types
  score = Math.min(100, (length * 2) + (typeCount * 15));
  
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  
  strengthFill.style.width = score + '%';
  
  if (score < 40) {
    strengthText.textContent = 'Weak Password';
    strengthText.style.color = '#ef4444';
    strengthFill.style.background = '#ef4444';
  } else if (score < 70) {
    strengthText.textContent = 'Medium Password';
    strengthText.style.color = '#f59e0b';
    strengthFill.style.background = 'linear-gradient(90deg, #f59e0b, #eab308)';
  } else {
    strengthText.textContent = 'Strong Password';
    strengthText.style.color = '#10b981';
    strengthFill.style.background = 'linear-gradient(90deg, #10b981, #059669)';
  }
}

function generatePassword() {
  const length = parseInt(lengthInput.value);
  const includeUpper = document.getElementById('uppercase').checked;
  const includeLower = document.getElementById('lowercase').checked;
  const includeNumbers = document.getElementById('numbers').checked;
  const includeSymbols = document.getElementById('symbols').checked;

  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?~';

  let characters = '';
  if (includeUpper) characters += upper;
  if (includeLower) characters += lower;
  if (includeNumbers) characters += numbers;
  if (includeSymbols) characters += symbols;

  if (characters === '') {
    alert('⚠️ Please select at least one character type!');
    return;
  }

  // Use crypto.getRandomValues for better randomness
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters[array[i] % characters.length];
  }

  document.getElementById('output').value = password;
  
  // Add generate animation
  const btn = document.querySelector('.generate-btn');
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => {
    btn.style.transform = '';
  }, 150);
}

async function copyPassword() {
  const password = document.getElementById('output').value;
  if (!password) return;
  
  try {
    await navigator.clipboard.writeText(password);
    showCopyFeedback();
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = password;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showCopyFeedback();
  }
}

function showCopyFeedback() {
  const feedback = document.getElementById('copyFeedback');
  feedback.classList.add('show');
  setTimeout(() => {
    feedback.classList.remove('show');
  }, 2000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateStrengthMeter();
  generatePassword();
});