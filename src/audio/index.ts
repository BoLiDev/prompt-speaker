/**
 * AudioRecorder - Handles audio capture and processing
 * Manages microphone access, audio context and worklet for real-time audio processing.
 *
 * @format
 */

/**
 * Interface for audio data provider
 * Any class implementing this interface can provide audio data to the transcription service
 */
export interface AudioDataProvider {
  /**
   * Register a callback to receive audio data
   * @param callback Function to be called when audio data is available
   */
  onAudioData(callback: (data: string) => void): void;

  /**
   * Start capturing audio
   */
  start(): Promise<void>;

  /**
   * Stop capturing audio
   */
  stop(): Promise<void>;
}

/**
 * Interface for AudioRecorder configuration options
 */
export interface AudioRecorderOptions {
  /**
   * Sample rate for audio recording in Hz
   */
  sampleRate?: number;
  /**
   * Duration of each audio chunk in milliseconds
   */
  chunkDurationMs?: number;
}

/**
 * Class responsible for handling audio recording and processing
 */
export class AudioRecorder implements AudioDataProvider {
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private mediaStream: MediaStream | null = null;
  private audioBufferQueue = new Int16Array(0);
  private isRecording: boolean = false;
  private audioDataCallback: ((data: string) => void) | null = null;
  private readonly options: AudioRecorderOptions;

  /**
   * Creates an instance of AudioRecorder
   */
  public constructor(options: AudioRecorderOptions = {}) {
    this.options = {
      sampleRate: options.sampleRate || 24000,
      chunkDurationMs: options.chunkDurationMs || 100,
    };
  }

  /**
   * Register callback to receive audio data
   * @param callback - Function that receives encoded audio data
   */
  public onAudioData(callback: (data: string) => void): void {
    this.audioDataCallback = callback;
  }

  /**
   * Starts the audio recording process
   */
  public async start(): Promise<void> {
    if (this.isRecording) return;

    try {
      await this.requestUserMedia();
      await this.initializeAudio();
      this.isRecording = true;
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Stops the audio recording process
   */
  public async stop(): Promise<void> {
    if (!this.isRecording) return;

    await this.cleanup();
    this.isRecording = false;
  }

  /**
   * Requests access to user's microphone
   */
  private async requestUserMedia(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    } catch (error) {
      throw new Error(
        `Failed to access microphone: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Initializes the audio processing components
   */
  private async initializeAudio(): Promise<void> {
    if (!this.mediaStream) {
      throw new Error("Media stream not initialized");
    }

    try {
      this.audioContext = new AudioContext({
        sampleRate: this.options.sampleRate,
      });

      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      await this.loadAudioWorklet();
      this.setupAudioGraph();
    } catch (error) {
      throw new Error(
        `Failed to initialize audio processing: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Loads the audio worklet processor
   */
  private async loadAudioWorklet(): Promise<void> {
    if (!this.audioContext) return;

    try {
      await this.audioContext.audioWorklet.addModule("audio-processor.js");
    } catch (error) {
      throw new Error(
        `Failed to load audio worklet: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Sets up the audio processing graph
   */
  private setupAudioGraph(): void {
    if (!this.audioContext || !this.mediaStream) return;

    try {
      if (this.mediaStream.getAudioTracks().length === 0) {
        throw new Error("Media stream does not contain audio tracks");
      }

      const source = this.audioContext.createMediaStreamSource(
        this.mediaStream,
      );
      this.workletNode = new AudioWorkletNode(
        this.audioContext,
        "audio-processor",
      );

      this.workletNode.port.onmessage = (event: MessageEvent) => {
        this.processAudioChunk(event.data.audio_data);
      };

      source.connect(this.workletNode);
      this.audioBufferQueue = new Int16Array(0);
    } catch (error) {
      throw new Error(
        `Failed to setup audio graph: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Processes an audio chunk received from the worklet
   * @param audioData - Raw audio data buffer
   */
  private processAudioChunk(audioData: ArrayBuffer): void {
    if (!this.isRecording) return;

    const currentBuffer = new Int16Array(audioData);
    this.audioBufferQueue = this.mergeBuffers(
      this.audioBufferQueue,
      currentBuffer,
    );
    this.sendAudioChunks();
  }

  /**
   * Sends audio chunks to the callback
   */
  private sendAudioChunks(): void {
    if (!this.audioContext || !this.isRecording) return;

    const samplesPerChunk = Math.floor(
      this.audioContext.sampleRate * (this.options.chunkDurationMs! / 1000),
    );

    while (this.audioBufferQueue.length >= samplesPerChunk) {
      const chunkToSend = this.audioBufferQueue.subarray(0, samplesPerChunk);
      this.audioBufferQueue = this.audioBufferQueue.subarray(samplesPerChunk);

      const encodedData = this.encodeAudioToBase64(chunkToSend);
      if (this.audioDataCallback) {
        this.audioDataCallback(encodedData);
      }
    }
  }

  /**
   * Merges two Int16Array buffers
   * @param lhs - First buffer
   * @param rhs - Second buffer
   * @returns Merged buffer
   */
  private mergeBuffers(lhs: Int16Array, rhs: Int16Array): Int16Array {
    const merged = new Int16Array(lhs.length + rhs.length);
    merged.set(lhs, 0);
    merged.set(rhs, lhs.length);
    return merged;
  }

  /**
   * Encodes an Int16Array to a base64 string
   * @param buffer - Audio buffer to encode
   * @returns Base64 encoded string
   */
  private encodeAudioToBase64(buffer: Int16Array): string {
    const bytes = new Uint8Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength,
    );
    let binaryString = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return btoa(binaryString);
  }

  /**
   * Cleans up all audio resources
   */
  private async cleanup(): Promise<void> {
    if (this.workletNode) {
      this.workletNode.port.onmessage = null;
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    if (this.audioContext && this.audioContext.state !== "closed") {
      await this.audioContext
        .close()
        .catch((e) => console.error("Error closing AudioContext:", e));
      this.audioContext = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    this.audioBufferQueue = new Int16Array(0);
  }
}
