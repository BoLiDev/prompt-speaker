/** @format */

class AudioProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
  }

  process(inputs) {
    const inputChannel = inputs[0]?.[0];

    if (inputChannel instanceof Float32Array && inputChannel.length > 0) {
      const pcm16Array = new Int16Array(inputChannel.length);
      for (let i = 0; i < inputChannel.length; i++) {
        let val = inputChannel[i] * 32768;
        val = Math.max(-32768, Math.min(32767, val));
        pcm16Array[i] = val;
      }

      this.port.postMessage(
        {
          audio_data: pcm16Array.buffer,
        },
        [pcm16Array.buffer],
      );
    } else if (!inputChannel) {
      console.warn("AudioProcessor: No input channel data received.");
    }

    return true;
  }
}

try {
  registerProcessor("audio-processor", AudioProcessor);
} catch (error) {
  console.error(
    "Failed to register audio-processor in AudioWorkletGlobalScope:",
    error,
  );
}
