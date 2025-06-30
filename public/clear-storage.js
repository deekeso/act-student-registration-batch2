// Script to clear localStorage for the student registration app
console.log('Checking localStorage...');

// Check if the item exists
const studentData = localStorage.getItem('student-registration-data');

if (studentData) {
  console.log('Found student-registration-data in localStorage:');
  console.log(JSON.parse(studentData));
  
  // Remove the specific item
  localStorage.removeItem('student-registration-data');
  console.log('Successfully cleared "student-registration-data" from localStorage.');
} else {
  console.log('No "student-registration-data" found in localStorage.');
}

// Verify it's gone
const checkAgain = localStorage.getItem('student-registration-data');
console.log('After clearing, student-registration-data exists:', checkAgain !== null);
