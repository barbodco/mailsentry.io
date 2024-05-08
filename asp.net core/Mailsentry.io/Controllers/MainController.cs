using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Mailsentry.io.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string xـapiـkey = "PRODUCTION_KMW5ARA_FJAAWS:WD4F_M1RM_QPENRE5KLVFSWSXFFICXYDS5W";
        private readonly string base_url = "https://api.mailsentry.io/api/v1/email/verify";
        public EmailController(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        [HttpGet("bulk")]
        public async Task<IActionResult> bulk(string emails, int layers)
        {
            if (string.IsNullOrWhiteSpace(emails))
            {
                return BadRequest("Email is required.");
            }

            var httpClient = _clientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Add("x-api-key", xـapiـkey);

            var url = $"{base_url}/bulk?emails={emails}&layers={layers}";
            var response = await httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var resultContent = await response.Content.ReadAsStringAsync();
                return Ok(resultContent);
            }
            else
            {
                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
        }

        [HttpGet("instant")]
        public async Task<IActionResult> instant(string email, int layers)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("Email is required.");
            }

            var httpClient = _clientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Add("x-api-key", xـapiـkey);

            var url = $"{base_url}/instant?email={email}&layers={layers}";
            var response = await httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var resultContent = await response.Content.ReadAsStringAsync();
                return Ok(resultContent);
            }
            else
            {
                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
        }

        [HttpPost("file")]
        public async Task<IActionResult> file(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File is required.");
            }

            var httpClient = _clientFactory.CreateClient();
            var requestContent = new MultipartFormDataContent();

            // Add file content to the form data
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                var fileContent = new ByteArrayContent(ms.ToArray());
                fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("text/csv");
                requestContent.Add(fileContent, "file", file.FileName);
            }

            // Securely get API key and secret from configuration
            httpClient.DefaultRequestHeaders.Add("x-api-key", xـapiـkey);

            // Send request
            var response = await httpClient.PostAsync($"{base_url}/file", requestContent);

            if (response.IsSuccessStatusCode)
            {
                var resultContent = await response.Content.ReadAsStringAsync();
                return Ok(resultContent);
            }
            else
            {
                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
        }
        [HttpGet("{reportId}")]
        public async Task<IActionResult> GetResult(string reportId, int page = 1, int limit = 10)
        {
            try
            {
                var url = $"{base_url}/result/{reportId}?page={page}&limit={limit}";

                var httpClient = _clientFactory.CreateClient();

                // Set the x-api-key header
                httpClient.DefaultRequestHeaders.Add("x-api-key", xـapiـkey);

                // Send the GET request
                var response = await httpClient.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    var resultContent = await response.Content.ReadAsStringAsync();
                    return Ok(resultContent);
                }
                else
                {
                    return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
                }
            }
            catch (HttpRequestException ex)
            {
                // Log or handle the exception
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}
