import type { WorkflowNode, WorkflowEdge } from "@/components/workflow/types";
import { apiFetch } from "@/lib/csrf";

// API Response types
export interface WorkflowData {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkflowListItem {
  id: string;
  name: string;
  updatedAt: string;
}

export interface CreateWorkflowRequest {
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface UpdateWorkflowRequest {
  name?: string;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
}

export interface ApiError {
  message: string;
  code?: string;
}

// Get CSRF token from cookie
function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? match[1] : "";
}

// Base headers for API requests
function getHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-csrf-token": getCsrfToken(),
  };
}

// Result type for better error handling
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

// Fetch a single workflow by ID
export async function getWorkflow(id: string): Promise<Result<WorkflowData>> {
  try {
    const response = await apiFetch(`/api/workflows/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: { message: "Workflow not found", code: "NOT_FOUND" },
        };
      }
      return {
        success: false,
        error: { message: "Failed to fetch workflow", code: "FETCH_ERROR" },
      };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: "NETWORK_ERROR",
      },
    };
  }
}

// List all workflows
export async function listWorkflows(): Promise<Result<WorkflowListItem[]>> {
  try {
    const response = await apiFetch("/api/workflows");
    if (!response.ok) {
      return {
        success: false,
        error: { message: "Failed to fetch workflows", code: "FETCH_ERROR" },
      };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: "NETWORK_ERROR",
      },
    };
  }
}

// Create a new workflow
export async function createWorkflow(
  request: CreateWorkflowRequest
): Promise<Result<WorkflowData>> {
  try {
    const response = await apiFetch("/api/workflows", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      return {
        success: false,
        error: { message: "Failed to create workflow", code: "CREATE_ERROR" },
      };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: "NETWORK_ERROR",
      },
    };
  }
}

// Update an existing workflow
export async function updateWorkflow(
  id: string,
  request: UpdateWorkflowRequest
): Promise<Result<WorkflowData>> {
  try {
    const response = await apiFetch(`/api/workflows/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: { message: "Workflow not found", code: "NOT_FOUND" },
        };
      }
      return {
        success: false,
        error: { message: "Failed to update workflow", code: "UPDATE_ERROR" },
      };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: "NETWORK_ERROR",
      },
    };
  }
}

// Delete a workflow
export async function deleteWorkflow(id: string): Promise<Result<void>> {
  try {
    const response = await apiFetch(`/api/workflows/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: { message: "Workflow not found", code: "NOT_FOUND" },
        };
      }
      return {
        success: false,
        error: { message: "Failed to delete workflow", code: "DELETE_ERROR" },
      };
    }
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: "NETWORK_ERROR",
      },
    };
  }
}
