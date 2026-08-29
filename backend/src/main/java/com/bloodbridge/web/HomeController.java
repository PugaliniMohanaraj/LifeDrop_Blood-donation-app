package com.bloodbridge.web;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String home() {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>Blood Bridge API</title>
              <style>
                body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 4rem auto; padding: 0 1.5rem; color: #0F1C2E; }
                h1 { color: #9B1B1B; }
                a { color: #9B1B1B; font-weight: 600; }
                code { background: #F5F7FA; padding: 0.15rem 0.4rem; border-radius: 0.35rem; }
              </style>
            </head>
            <body>
              <h1>Blood Bridge API</h1>
              <p>This port serves the backend API only. It is not the website.</p>
              <p>Open the application here:</p>
              <p><a href="http://localhost:5173">http://localhost:5173</a></p>
              <p>API health check: <a href="/api/health"><code>/api/health</code></a></p>
            </body>
            </html>
            """;
    }
}
