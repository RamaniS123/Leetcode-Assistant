package com.leetcode.assistant;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
// Map all the endpoints defined in this controller with this URL
@RequestMapping("/api/leetcode")
// Allow accessing all the endpoints in this controller from any frontend
@CrossOrigin(origins="*")
// Make an all argument constructor with all the fields that are defined
@AllArgsConstructor
public class LeetcodeController {
    private final LeetcodeService leetcodeService;

    // Controller setup
    // Link to a POST request
    @PostMapping("/process")
    // Add an endpoint
    public ResponseEntity<String> processContent(@RequestBody LeetcodeRequest request) {
        String result = leetcodeService.processContent(request);
        return ResponseEntity.ok(result);
    }

}
