// Vite forwards /api requests to the stream server in development.
// Keeping browser requests on the frontend origin prevents CORS errors.
export const baseUrl = "http://localhost:5051";
