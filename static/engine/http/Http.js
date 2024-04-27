export class Http {

	static get(endpoint) {
	const xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://localhost:3000/data', false); // Synchronous request
		xhr.send();

		if (xhr.status === 200) {
		  const jsonData = JSON.parse(xhr.responseText);
		  console.log('JSON data:', jsonData);
		  // Use the JSON data as needed
		} else {
		  console.error('Request failed with status:', xhr.status);
		}
		}
}
