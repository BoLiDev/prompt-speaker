/**
 * ConfigStore - Manages application configuration
 * Handles storing and retrieving settings like API keys
 *
 * @format
 */

import { makeAutoObservable } from "mobx";
import { GEMINI_API_KEY_STORAGE_KEY } from "../AI/gemini";

// Storage key constants
const API_KEY_STORAGE_KEY = "openai-api-key";

/**
 * Config Store for managing application settings
 */
export class ConfigStore {
  // API key for OpenAI services
  public apiKey: string = "";

  // API key for Gemini services
  public geminiApiKey: string = "";

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
  public setApiKey(newKey: string): void {
    this.apiKey = newKey;
    localStorage.setItem(API_KEY_STORAGE_KEY, newKey);
  }

  /**
   * Gets the current OpenAI API key
   * @returns The current API key
   */
  public getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Updates the Gemini API key and saves it to local storage
   * @param newKey - New Gemini API key
   */
  public setGeminiApiKey(newKey: string): void {
    this.geminiApiKey = newKey;
    localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, newKey);
  }

  /**
   * Gets the current Gemini API key
   * @returns The current Gemini API key
   */
  public getGeminiApiKey(): string {
    return this.geminiApiKey;
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
        this.apiKey = savedApiKey;
      }

      const savedGeminiApiKey = localStorage.getItem(
        GEMINI_API_KEY_STORAGE_KEY,
      );
      if (savedGeminiApiKey) {
        this.geminiApiKey = savedGeminiApiKey;
      }
    } catch (error) {
      console.error("Failed to load settings from local storage:", error);
    }
  }
}
