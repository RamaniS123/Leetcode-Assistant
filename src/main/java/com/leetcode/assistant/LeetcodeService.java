package com.leetcode.assistant;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class LeetcodeService {
    // Injects the Gemini API base URL from application.properties
    @Value("${gemini.api.url}")
    private String geminiAPIUrl;

    // Injects the Gemini API key
    @Value("${gemini.api.key}")
    private String geminiAPIKey;

    private final WebClient webClient;

    private final ObjectMapper objectMapper;

    public LeetcodeService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    // Handles request processing and response retrieval
    public String processContent(LeetcodeRequest request) {
        // Build on prompt based on operation
        String prompt = buildPrompt(request);

        // Request body to send to Gemini API
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[] {
                                Map.of("text", prompt)
                        })
                }
        );

        // Send POST request to Gemini API and get raw JSON response
        String response = webClient.post()
                .uri(geminiAPIUrl + geminiAPIKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Extract the text from the response from Gemini's structured JSON response
        return extractTextFromResponse(response);
    }

    // Helper method that parses and extracts meaningful text from the API response
    private String extractTextFromResponse(String response) {
        try {
            GeminiResponse geminiResponse = objectMapper.readValue(response, GeminiResponse.class);

            if (geminiResponse.getCandidates() != null && !geminiResponse.getCandidates().isEmpty()) {
                GeminiResponse.Candidate firstCandidate = geminiResponse.getCandidates().get(0);
                if (firstCandidate.getContent() != null &&
                        !firstCandidate.getContent().getParts().isEmpty()) {
                    // Return the first generated text from Gemini
                    return firstCandidate.getContent().getParts().get(0).getText();
                }
            }
            return "No content found in response.";
        } catch (Exception e) {
            return "Error Parsing: " + e.getMessage();
        }
    }

    // Helper method to generate prompt text based on the selected operation
    private String buildPrompt(LeetcodeRequest request) {
        String url = request.getContent();
        String operation = request.getOperation().toLowerCase();

        switch(operation) {
            case "explain":
                return "Explain this problem in a concise, simple, and beginner-friendly manners:\n" + url;
            case "hint":
                return "Give one helpful hint (but not the full answer) for solving this LeetCode problem:\n" + url;
            case "coach":
                return "Give a short, step-by-step coaching plan (no more than 4 steps) to help solve this LeetCode problem efficiently:\n" + url;
            default:
                throw new IllegalArgumentException("Unknown operation: " + operation);
        }
    }
}
