// Debug script to create a sample user
(function() {
  const DEFAULT_DATA = [
    { id: 1, label: 'Category 1', value: 5, color: '#4E79A7' },
    { id: 2, label: 'Category 2', value: 5, color: '#F28E2B' },
    { id: 3, label: 'Category 3', value: 5, color: '#E15759' },
    { id: 4, label: 'Category 4', value: 5, color: '#76B7B2' },
    { id: 5, label: 'Category 5', value: 5, color: '#59A14F' },
  ];

  // Generate a simple UUID
  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Clear existing data
  localStorage.clear();
  
  // Create a sample user
  const sampleUser = {
    id: generateId(),
    name: 'Sample User',
    chartData: DEFAULT_DATA
  };
  
  // Save to localStorage
  localStorage.setItem('lifeChartUsers', JSON.stringify([sampleUser]));
  localStorage.setItem('currentUserId', sampleUser.id);
  
  console.log('Sample user created:', sampleUser);
  console.log('Reloading page...');
  
  // Reload the page
  setTimeout(() => {
    window.location.reload();
  }, 500);
})(); 