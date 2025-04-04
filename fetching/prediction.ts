
/**
 * Calls the visual model prediction endpoint
 * @param module The module name to call (e.g., "feature distribution")
 * @param params Parameters required by the module
 * @returns Promise containing the visual response
 */
export async function getPrediction() {
    const endpoint = "http://localhost:5000/api/v1/prediction"; // Replace with your actual base URL if needed

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error calling visual endpoint:', error);
        throw error;
    }
}