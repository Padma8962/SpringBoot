package com.example.transcriber.controller;

import com.example.transcriber.dto.TranscriptionResponse;
import org.springframework.ai.openai.OpenAiAudioTranscriptionModel;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class TranscriptionController {

    private static final long MAX_FILE_SIZE_BYTES = 25L * 1024 * 1024;

    private final OpenAiAudioTranscriptionModel transcriptionModel;

    public TranscriptionController(OpenAiAudioTranscriptionModel transcriptionModel) {
        this.transcriptionModel = transcriptionModel;
    }

    @PostMapping(value = "/transcribe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TranscriptionResponse> transcribe(@RequestParam("file") MultipartFile file)
            throws Exception {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            return ResponseEntity.badRequest().build();
        }

        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "audio";
        ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return filename;
            }
        };

        String text = transcriptionModel.call(resource);
        return ResponseEntity.ok(new TranscriptionResponse(text, filename));
    }
}
