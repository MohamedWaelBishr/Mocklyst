import { useState, useCallback, useRef, useEffect } from "react";
import { MockSchema } from "@/types";
import { parseJsonToSchema, ValidationResult, ParseResult } from "@/lib/utils/json-parser";
import { schemaToJsonWithMockGenerator } from "@/lib/utils/schema-to-json";
import { useDebouncedCallback } from "use-debounce";

export interface EditorSyncState {
  editorValue: string;
  isFormDriven: boolean;
  isEditorDriven: boolean;
  syncInProgress: boolean;
  lastValidJson: string;
  validationResult: ValidationResult;
  parseError: string | null;
}

export interface EditorSyncActions {
  updateFromSchema: (schema: MockSchema) => void;
  updateFromEditor: (value: string) => void;
  setEditorMode: (isEditorMode: boolean) => void;
  clearError: () => void;
  forceSync: () => void;
}

interface UseEditorSyncProps {
  initialSchema: MockSchema;
  onSchemaChange: (schema: MockSchema) => void;
  debounceMs?: number;
}

export function useEditorSync({
  initialSchema,
  onSchemaChange,
  debounceMs = 300,
}: UseEditorSyncProps): [EditorSyncState, EditorSyncActions] {
  const [state, setState] = useState<EditorSyncState>(() => {
    const initialJson = schemaToJsonWithMockGenerator(initialSchema);
    return {
      editorValue: initialJson,
      isFormDriven: false,
      isEditorDriven: false,
      syncInProgress: false,
      lastValidJson: initialJson,
      validationResult: { isValid: true },
      parseError: null,
    };
  });

  // Refs to track the source of changes and prevent circular updates
  const isUpdatingFromSchema = useRef(false);
  const isUpdatingFromEditor = useRef(false);
  const lastSchemaRef = useRef<MockSchema>(initialSchema);

  // Debounced function to parse JSON and update schema
  const debouncedParseAndUpdate = useDebouncedCallback(
    (jsonValue: string) => {
      if (isUpdatingFromSchema.current) {
        return;
      }

      setState(prev => ({ ...prev, syncInProgress: true }));

      try {
        const parseResult: ParseResult = parseJsonToSchema(jsonValue);
        
        setState(prev => ({
          ...prev,
          validationResult: parseResult.validation,
          parseError: parseResult.validation.isValid ? null : parseResult.validation.error || "Invalid JSON",
          syncInProgress: false,
        }));

        if (parseResult.validation.isValid && parseResult.schema) {
          // Update the schema
          isUpdatingFromEditor.current = true;
          lastSchemaRef.current = parseResult.schema;
          onSchemaChange(parseResult.schema);
          
          setState(prev => ({
            ...prev,
            lastValidJson: jsonValue,
            isEditorDriven: true,
            isFormDriven: false,
          }));
          
          // Reset the flag after a short delay to allow the form to update
          setTimeout(() => {
            isUpdatingFromEditor.current = false;
          }, 50);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        setState(prev => ({
          ...prev,
          validationResult: { isValid: false, error: "Failed to parse JSON" },
          parseError: error instanceof Error ? error.message : "Unknown error",
          syncInProgress: false,
        }));
      }
    },
    debounceMs
  );

  // Update editor when schema changes (from form)
  const updateFromSchema = useCallback((schema: MockSchema) => {
    if (isUpdatingFromEditor.current) {
      return;
    }

    // Check if the schema actually changed to prevent unnecessary updates
    if (JSON.stringify(schema) === JSON.stringify(lastSchemaRef.current)) {
      return;
    }

    isUpdatingFromSchema.current = true;
    lastSchemaRef.current = schema;

    try {
      const newJsonValue = schemaToJsonWithMockGenerator(schema);
      
      setState(prev => ({
        ...prev,
        editorValue: newJsonValue,
        lastValidJson: newJsonValue,
        isFormDriven: true,
        isEditorDriven: false,
        validationResult: { isValid: true },
        parseError: null,
      }));
    } catch (error) {
      console.error("Error generating JSON from schema:", error);
    } finally {
      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingFromSchema.current = false;
      }, 50);
    }
  }, []);

  // Update schema when editor changes
  const updateFromEditor = useCallback((value: string) => {
    if (isUpdatingFromSchema.current) {
      return;
    }

    setState(prev => ({
      ...prev,
      editorValue: value,
      isFormDriven: false,
    }));

    // Trigger debounced parsing
    debouncedParseAndUpdate(value);
  }, [debouncedParseAndUpdate]);

  // Set editor mode (for UI mode toggles)
  const setEditorMode = useCallback((isEditorMode: boolean) => {
    setState(prev => ({
      ...prev,
      isEditorDriven: isEditorMode,
      isFormDriven: !isEditorMode,
    }));
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      parseError: null,
      validationResult: { isValid: true },
    }));
  }, []);

  // Force synchronization
  const forceSync = useCallback(() => {
    if (state.validationResult.isValid) {
      debouncedParseAndUpdate(state.editorValue);
    }
  }, [state.editorValue, state.validationResult.isValid, debouncedParseAndUpdate]);

  // Effect to handle external schema updates
  useEffect(() => {
    if (!isUpdatingFromEditor.current && 
        JSON.stringify(initialSchema) !== JSON.stringify(lastSchemaRef.current)) {
      updateFromSchema(initialSchema);
    }
  }, [initialSchema, updateFromSchema]);

  const actions: EditorSyncActions = {
    updateFromSchema,
    updateFromEditor,
    setEditorMode,
    clearError,
    forceSync,
  };

  return [state, actions];
}
