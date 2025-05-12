/**
 * ConfigStore - Manages application configuration
 * Handles storing and retrieving settings like API keys
 *
 * @format
 */

import { makeAutoObservable } from "mobx";
import { GEMINI_API_KEY_STORAGE_KEY } from "../AI/gemini";
import { POLISH_PROMPT } from "../AI/gemini";

// Storage key constants
const API_KEY_STORAGE_KEY = "openai-api-key";
const SYSTEM_PROMPT_KEY = "system-prompt";
const SILENCE_DURATION_KEY = "silence-duration-ms";
const PREFIX_PADDING_KEY = "prefix-padding-ms";
const VAD_THRESHOLD_KEY = "vad-threshold";
const MODEL_KEY = "transcription-model";

// Default values for transcription settings
const DEFAULT_SILENCE_DURATION = 700;
const DEFAULT_PREFIX_PADDING = 500;
const DEFAULT_VAD_THRESHOLD = 0.5;
const DEFAULT_MODEL = "gpt-4o-transcribe";
/**
 * Config Store for managing application settings
 */
export class ConfigStore {
  // API key for OpenAI services
  private _openAIApiKey: string = "";

  // API key for Gemini services
  private _geminiApiKey: string = "";

  // System prompt for Gemini refinement
  private _systemPrompt: string = POLISH_PROMPT;

  // OpenAI transcription parameters
  private _silenceDurationMs: number = DEFAULT_SILENCE_DURATION;
  private _prefixPaddingMs: number = DEFAULT_PREFIX_PADDING;
  private _vadThreshold: number = DEFAULT_VAD_THRESHOLD;
  private _model: string = DEFAULT_MODEL;

  // Visibility state for config panel
  public isConfigOpen: boolean = false;

  /**
   * Creates a new ConfigStore and loads saved settings
   */
  constructor() {
    makeAutoObservable(this);
    this.loadSettings();
  }

  /**
   * Updates the OpenAI API key and saves it to local storage
   * @param newKey - New API key
   */
  public set openAIKey(newKey: string) {
    this._openAIApiKey = newKey;
    localStorage.setItem(API_KEY_STORAGE_KEY, newKey);
  }

  /**
   * Gets the current OpenAI API key
   * @returns The current API key
   */
  public get openAIKey(): string {
    return this._openAIApiKey;
  }

  /**
   * Updates the Gemini API key and saves it to local storage
   * @param newKey - New Gemini API key
   */
  public set geminiApiKey(newKey: string) {
    this._geminiApiKey = newKey;
    localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, newKey);
  }

  /**
   * Gets the current Gemini API key
   * @returns The current Gemini API key
   */
  public get geminiApiKey(): string {
    return this._geminiApiKey;
  }

  /**
   * Updates the System Prompt for Gemini refinement
   * @param prompt - New system prompt
   */
  public set systemPrompt(prompt: string) {
    this._systemPrompt = prompt;
    localStorage.setItem(SYSTEM_PROMPT_KEY, prompt);
  }

  /**
   * Gets the current System Prompt
   * @returns The current system prompt
   */
  public get systemPrompt(): string {
    return this._systemPrompt;
  }

  /**
   * Updates the silence duration parameter for OpenAI transcription
   * @param duration - New duration in milliseconds
   */
  public set silenceDuration(duration: number) {
    this._silenceDurationMs = duration;
    localStorage.setItem(SILENCE_DURATION_KEY, String(duration));
  }

  /**
   * Gets the current silence duration
   * @returns The current silence duration in milliseconds
   */
  public get silenceDuration() {
    return this._silenceDurationMs;
  }

  /**
   * Updates the prefix padding parameter for OpenAI transcription
   * @param padding - New padding in milliseconds
   */
  public set prefixPadding(padding: number) {
    this._prefixPaddingMs = padding;
    localStorage.setItem(PREFIX_PADDING_KEY, String(padding));
  }

  /**
   * Gets the current prefix padding
   * @returns The current prefix padding in milliseconds
   */
  public get prefixPadding(): number {
    return this._prefixPaddingMs;
  }

  /**
   * Updates the VAD threshold parameter for OpenAI transcription
   * @param threshold - New threshold value
   */
  public set vadThreshold(threshold: number) {
    this._vadThreshold = threshold;
    localStorage.setItem(VAD_THRESHOLD_KEY, String(threshold));
  }

  /**
   * Gets the current VAD threshold
   * @returns The current VAD threshold value
   */
  public get vadThreshold(): number {
    return this._vadThreshold;
  }

  /**
   * Gets the current model
   * @returns The current model
   */
  public get model(): string {
    return this._model;
  }

  /**
   * Updates the model
   * @param model - New model
   */
  public set model(model: string) {
    this._model = model;
    localStorage.setItem(MODEL_KEY, model);
  }

  public resetSystemPrompt(): void {
    this.systemPrompt = POLISH_PROMPT;
  }

  /**
   * Resets all transcription parameters to their default values
   */
  public resetTranscriptionParams(): void {
    this.silenceDuration = DEFAULT_SILENCE_DURATION;
    this.prefixPadding = DEFAULT_PREFIX_PADDING;
    this.vadThreshold = DEFAULT_VAD_THRESHOLD;
  }

  public toggle(): void {
    this.isConfigOpen = !this.isConfigOpen;
  }

  /**
   * Opens the configuration panel
   */
  public openConfig(): void {
    this.isConfigOpen = true;
  }

  /**
   * Closes the configuration panel
   */
  public closeConfig(): void {
    this.isConfigOpen = false;
  }

  /**
   * Toggles the configuration panel visibility
   */
  public toggleConfig(): void {
    this.isConfigOpen = !this.isConfigOpen;
  }

  /**
   * Loads settings from local storage
   */
  private loadSettings(): void {
    try {
      const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (savedApiKey) {
        this._openAIApiKey = savedApiKey;
      }

      const savedGeminiApiKey = localStorage.getItem(
        GEMINI_API_KEY_STORAGE_KEY,
      );
      if (savedGeminiApiKey) {
        this._geminiApiKey = savedGeminiApiKey;
      }

      // Load system prompt
      const savedSystemPrompt = localStorage.getItem(SYSTEM_PROMPT_KEY);
      if (savedSystemPrompt) {
        this.systemPrompt = savedSystemPrompt;
      } else {
        // Initialize with default prompt
        this.systemPrompt = POLISH_PROMPT;
      }

      // Load transcription parameters
      const savedSilenceDuration = localStorage.getItem(SILENCE_DURATION_KEY);
      if (savedSilenceDuration) {
        this._silenceDurationMs = Number(savedSilenceDuration);
      }

      const savedPrefixPadding = localStorage.getItem(PREFIX_PADDING_KEY);
      if (savedPrefixPadding) {
        this._prefixPaddingMs = Number(savedPrefixPadding);
      }

      const savedThreshold = localStorage.getItem(VAD_THRESHOLD_KEY);
      if (savedThreshold) {
        this._vadThreshold = Number(savedThreshold);
      }

      const savedModel = localStorage.getItem(MODEL_KEY);
      if (savedModel) {
        this._model = savedModel;
      }
    } catch (error) {
      console.error("Failed to load settings from local storage:", error);
    }
  }
}
