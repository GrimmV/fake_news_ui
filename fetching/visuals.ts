
interface ModuleParams {
    [key: string]: string | number;
}

/**
 * Calls the visual model prediction endpoint
 * @param module The module name to call (e.g., "feature distribution")
 * @param params Parameters required by the module
 * @returns Promise containing the visual response
 */
export async function getModelVisual(module: string, params: ModuleParams) {
    const endpoint = "http://localhost:5000/api/v1/visual"; // Replace with your actual base URL if needed
    
    let body = JSON.stringify({
        module,
        params
    })

    console.log(body)

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.blob();
    } catch (error) {
        console.error('Error calling visual endpoint:', error);
        throw error;
    }
}