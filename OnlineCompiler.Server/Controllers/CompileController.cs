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

                string result = await CompileWithPiston(request.Code, request.Language, request.UserInput);  // Include user input
                return Ok(new { result });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        //private async Task<string> CompileWithPiston(string code, string language, string? userInput)
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
        //            new { content = code }
        //                },
        //                stdin = userInput  // Include user input (stdin) here
        //            }),
        //            Encoding.UTF8,
        //            "application/json"
        //        );

        //        try
        //        {
        //            var response = await client.PostAsync("https://emkc.org/api/v2/piston/execute", requestContent);

        //            if (!response.IsSuccessStatusCode)
        //            {
        //                string errorMessage = await response.Content.ReadAsStringAsync();
        //                Console.WriteLine($"Piston API Error: {response.StatusCode} - {errorMessage}");
        //                throw new Exception("Error from Piston API.");
        //            }

        //            var result = await response.Content.ReadAsStringAsync();
        //            var parsedResult = JObject.Parse(result);
        //            string stdout = parsedResult["run"]?["stdout"]?.ToString() ?? "";
        //            string stderr = parsedResult["run"]?["stderr"]?.ToString() ?? "";
        //            return !string.IsNullOrEmpty(stderr) ? $"Error: {stderr}" : stdout;
        //        }
        //        catch (Exception ex)
        //        {
        //            Console.WriteLine($"Error calling Piston API: {ex.Message}");
        //            throw;
        //        }
        //    }
        //}





        private async Task<string> CompileWithPiston(string code, string language, string? userInput)
        {
            using (var client = new HttpClient())
            {
                // Split multiple inputs by newline or other delimiter, e.g., commas, then join with newlines.
                string formattedInput = userInput != null ? string.Join("\n", userInput.Split(',')) : "";

                var requestContent = new StringContent(
                    JsonConvert.SerializeObject(new
                    {
                        language = language.ToLower(),
                        version = "*", // Use the latest version available for the language
                        files = new[] { new { content = code } },
                        stdin = formattedInput  // Include formatted input (split into multiple lines)
                    }),
                    Encoding.UTF8,
                    "application/json"
                );

                try
                {
                    var response = await client.PostAsync("https://emkc.org/api/v2/piston/execute", requestContent);

                    if (!response.IsSuccessStatusCode)
                    {
                        string errorMessage = await response.Content.ReadAsStringAsync();
                        Console.WriteLine($"Piston API Error: {response.StatusCode} - {errorMessage}");
                        throw new Exception("Error from Piston API.");
                    }

                    var result = await response.Content.ReadAsStringAsync();
                    var parsedResult = JObject.Parse(result);
                    string stdout = parsedResult["run"]?["stdout"]?.ToString() ?? "";
                    string stderr = parsedResult["run"]?["stderr"]?.ToString() ?? "";
                    return !string.IsNullOrEmpty(stderr) ? $"Error: {stderr}" : stdout;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error calling Piston API: {ex.Message}");
                    throw;
                }
            }
        }

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

        public string? UserInput { get; set; }
    }
}