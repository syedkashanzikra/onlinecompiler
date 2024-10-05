using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using Newtonsoft.Json;

namespace OnlineCompiler.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompileController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> CompileCode([FromBody] CodeRequest request)
        {
            // Call CompileWithJudge0 method here
            string result = await CompileWithJudge0(request.Code, request.Language);
            return Ok(new { result });
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

                var response = await client.PostAsync("https://api.judge0.com/submissions?base64_encoded=false&wait=true", requestContent);
                var result = await response.Content.ReadAsStringAsync();
                return result;
            }
        }

        private int GetLanguageId(string language)
        {
            // Return appropriate language ID for Judge0 API
            switch (language.ToLower())
            {
                case "python": return 71;
                case "cpp": return 54;
                // Add more languages here
                default: return 71;
            }
        }
    }

    public class CodeRequest
    {
        public string Code { get; set; }
        public string Language { get; set; }
    }
}
