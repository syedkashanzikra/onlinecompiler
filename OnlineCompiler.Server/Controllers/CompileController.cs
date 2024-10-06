using System.Text;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq; 

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

                // Call CompileWithPiston method to get the result
                string result = await CompileWithPiston(request.Code, request.Language);

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

        //private async Task<string> CompileWithPiston(string code, string language)
        //{
        //    using (var client = new HttpClient())
        //    {
        //        var requestContent = new StringContent(
        //            JsonConvert.SerializeObject(new
        //            {
        //                language = language.ToLower(),
        //                version = "*", // Use the latest version available for the language
        //                files = new[]
        //                {
        //                    new { content = code }
        //                }
        //            }),
        //            Encoding.UTF8,
        //            "application/json"
        //        );

        //        try
        //        {
        //            // Use the public Piston API endpoint
        //            var response = await client.PostAsync("https://emkc.org/api/v2/piston/execute", requestContent);

        //            if (!response.IsSuccessStatusCode)
        //            {
        //                string errorMessage = await response.Content.ReadAsStringAsync();
        //                Console.WriteLine($"Piston API Error: {response.StatusCode} - {errorMessage}");
        //                throw new Exception("Error from Piston API.");
        //            }

        //            var result = await response.Content.ReadAsStringAsync();

        //            // Parse the JSON response to extract useful info
        //            var parsedResult = JObject.Parse(result);

        //            // Extract 'stdout' (standard output) or 'stderr' (errors)
        //            string output = parsedResult["run"]?["stdout"]?.ToString() ?? parsedResult["run"]?["stderr"]?.ToString() ?? "No output or error.";

        //            return output;
        //        }
        //        catch (Exception ex)
        //        {
        //            Console.WriteLine($"Error calling Piston API: {ex.Message}");
        //            throw; // Rethrow the exception to be handled by the controller
        //        }
        //    }
        //}




        private async Task<string> CompileWithPiston(string code, string language)
        {
            using (var client = new HttpClient())
            {
                var requestContent = new StringContent(
                    JsonConvert.SerializeObject(new
                    {
                        language = language.ToLower(),
                        version = "*", // Use the latest version available for the language
                        files = new[]
                        {
                    new { content = code }
                        }
                    }),
                    Encoding.UTF8,
                    "application/json"
                );

                try
                {
                    // Use the public Piston API endpoint
                    var response = await client.PostAsync("https://emkc.org/api/v2/piston/execute", requestContent);

                    if (!response.IsSuccessStatusCode)
                    {
                        string errorMessage = await response.Content.ReadAsStringAsync();
                        Console.WriteLine($"Piston API Error: {response.StatusCode} - {errorMessage}");
                        throw new Exception("Error from Piston API.");
                    }

                    var result = await response.Content.ReadAsStringAsync();

                    // Parse the JSON response to extract useful info
                    var parsedResult = JObject.Parse(result);

                    // Extract 'stdout' (standard output) and 'stderr' (errors)
                    string stdout = parsedResult["run"]?["stdout"]?.ToString() ?? "";
                    string stderr = parsedResult["run"]?["stderr"]?.ToString() ?? "";

                    // Return error message if stderr exists, otherwise return stdout
                    return !string.IsNullOrEmpty(stderr) ? $"Error: {stderr}" : stdout;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error calling Piston API: {ex.Message}");
                    throw; // Rethrow the exception to be handled by the controller
                }
            }
        }

        // Helper method to map language to Piston language name
        private string GetLanguage(string language)
        {
            switch (language.ToLower())
            {
                case "python": return "python";
                case "cpp": return "cpp";
                case "javascript": return "javascript";
                case "typescript": return "typescript";
                case "c": return "c";
                case "go": return "go";
                case "php": return "php";
                case "java": return "java";
                case "dart": return "dart";
                case "assembly": return "nasm";  // 32-bit NASM Assembly
                case "assembly64": return "nasm64";  // 64-bit NASM Assembly
               
                case "r": return "r";
                case "swift": return "swift";
                default: return "python";  // Default to Python if the language is unknown
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