let no_visual = ["similar predictions", "counterfactuals", "word importance"];

/**
 * Calls the visual model prediction endpoint
 * @param module The module name to call (e.g., "feature distribution")
 * @param params Parameters required by the module
 * @returns Promise containing the visual response
 */
export async function getModelVisual(
  module: string,
  params: string[],
  datapoint: number,
  username: string
) {
  let base_url = import.meta.env.VITE_URL;

  const endpoint = base_url + "/api/v1/visual"; // Replace with your actual base URL if needed

  let body = JSON.stringify({
    module,
    params,
    datapoint_id: datapoint,
    username: username,
  });

  console.log(body);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (no_visual.includes(module)) {
      return await response.json();
    } else {
      return await response.blob();
    }
  } catch (error) {
    console.error("Error calling visual endpoint:", error);
    throw error;
  }
}
