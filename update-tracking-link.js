/**
 * Update Tracking Link Script
 *
 * Updates the existing tracking link to redirect to local survey-campaign page
 */

const linkId = '01b7597e-9e0b-459e-9b02-32dd473bf4b8';
const newDestinationUrl = 'http://localhost:4200/survey-campaign';

async function updateTrackingLink() {
  try {
    console.log('Updating tracking link...');
    console.log('Link ID:', linkId);
    console.log('New destination:', newDestinationUrl);
    console.log('');

    const response = await fetch(`http://localhost:3000/api/v1/analytics/links/${linkId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add your admin token here
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN', // REPLACE THIS
      },
      body: JSON.stringify({
        destinationUrl: newDestinationUrl,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Tracking link updated successfully!');
      console.log('');
      console.log('Updated link details:');
      console.log('  Short Code:', data.data.shortCode);
      console.log('  Destination:', data.data.destinationUrl);
      console.log('  Full Tracking URL:', data.data.fullTrackingUrl);
      console.log('');
      console.log('🔗 Test with:');
      console.log(`  Frontend: http://localhost:4200/t/${data.data.shortCode}`);
      console.log(`  Backend:  http://localhost:3000/t/${data.data.shortCode}`);
    } else {
      const error = await response.text();
      console.error('❌ Failed to update:', error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateTrackingLink();
