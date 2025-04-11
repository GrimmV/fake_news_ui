
/**
 * Calls the visual model prediction endpoint
 * @param module The module name to call (e.g., "feature distribution")
 * @param params Parameters required by the module
 * @returns Promise containing the visual response
 */
export async function getPrediction(datapoint_id: number) {

    let base_url = import.meta.env.VITE_URL
    
    const endpoint = base_url + "/api/v1/prediction?datapoint_id=" + datapoint_id; 

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