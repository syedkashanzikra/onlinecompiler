using System.Text;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq; // For parsing JSON response

namespace OnlineCompiler.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompileController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> CompileCode([FromBody] CodeRequest request)
        {
            try
            {
                Console.WriteLine($"Received Code: {request.Code}");
                Console.WriteLine($"Language: {request.Language}");

                // Call CompileWithJudge0 method to get the result
                string result = await CompileWithJudge0(request.Code, request.Language);

                // Return the result back to the frontend
                return Ok(new { result });
            }
            catch (Exception ex)
            {
                // Log the error and return 500 Internal Server Error
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        private async Task<string> CompileWithJudge0(string code, string language)
        {
            using (var client = new HttpClient())
            {
                var requestContent = new StringContent(
                    JsonConvert.SerializeObject(new
                    {
                        source_code = code,
                        language_id = GetLanguageId(language) // e.g., 71 for Python
                    }),
                    Encoding.UTF8,
                    "application/json"
                );

                try
                {
                    // Call Judge0 API and wait for response
                    var response = await client.PostAsync("https://api.judge0.com/submissions?base64_encoded=false&wait=true", requestContent);

                    if (!response.IsSuccessStatusCode)
                    {
                        // Log the status code if the response failed
                        string errorMessage = await response.Content.ReadAsStringAsync();
                        Console.WriteLine($"Judge0 API Error: {response.StatusCode} - {errorMessage}");
                        throw new Exception("Error from Judge0 API.");
                    }

                    var result = await response.Content.ReadAsStringAsync();

                    // Parse the JSON response to extract useful info
                    var parsedResult = JObject.Parse(result);

                    // Extract 'stdout' (standard output) or 'stderr' (errors)
                    string output = parsedResult["stdout"]?.ToString() ?? parsedResult["stderr"]?.ToString() ?? "No output or error.";

                    return output;
                }
                catch (Exception ex)
                {
                    // Log any exceptions that occur during the HTTP request
                    Console.WriteLine($"Error calling Judge0 API: {ex.Message}");
                    throw; // Rethrow the exception to be handled by the controller
                }
            }
        }

        // Helper method to map language to Judge0 language ID
        private int GetLanguageId(string language)
        {
            switch (language.ToLower())
            {
                case "python": return 71;
                case "cpp": return 54;
                case "javascript": return 63; // Add more languages as needed
                default: return 71; // Default to Python if unknown
            }
        }
    }

    // Request model
    public class CodeRequest
    {
        public string Code { get; set; }
        public string Language { get; set; }
    }
}
