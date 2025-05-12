/**
 * Interface for OpenAI WebSocket message base
 *
 * @format
 */

export interface OpenAIMessageBase {
  type: string;
}

/**
 * Interface for OpenAI transcription completed message
 */
export interface OpenAITranscriptionCompletedMessage extends OpenAIMessageBase {
  type: "conversation.item.input_audio_transcription.completed";
  transcript: string;
  content_index: number;
}

/**
 * Interface for OpenAI error message
 */
export interface OpenAIErrorMessage extends OpenAIMessageBase {
  type: "error";
  error: {
    message: string;
  };
}

/**
 * Interface for OpenAI delta message (incremental transcription)
 */
export interface OpenAIDeltaMessage extends OpenAIMessageBase {
  type: "conversation.item.input_audio_transcription.delta";
  delta: string;
  item_id: string;
  content_index: number;
}

/**
 * Configuration options for OpenAITranscriber
 */
export interface LiveTranscriptionConfig {
  /**
   * OpenAI API key for authentication
   */
  apiKey?: string;
  /**
   * Transcription model to use
   */
  model?: string;
  /**
   * Language for transcription
   */
  language?: string;
  /**
   * Maximum number of reconnect attempts
   */
  maxReconnectAttempts?: number;
  /**
   * Prefix padding in milliseconds
   */
  prefix_padding_ms?: number;
  /**
   * Silence duration in milliseconds
   */
  silence_duration_ms?: number;
  /**
   * Threshold for VAD
   */
  threshold?: number;
}

/**
 * Callbacks for OpenAITranscriber events
 */
export interface LiveTranscriptionCallbacks {
  /**
   * Called when a transcript is received
   * @param text The transcribed text
   * @param isFinal Whether this is a final transcript
   */
  onTranscript: (text: string, isFinal: boolean) => void;
  /**
   * Called when an error occurs
   * @param error The error object
   */
  onError: (error: Error) => void;
  /**
   * Called when the transcription process ends
   */
  onEnd: () => void;
}
