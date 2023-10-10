export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type_enum"]
          approval_status: Database["public"]["Enums"]["approval_status_enum"]
          approval_status_set_by: string | null
          id: string
          updated_at: string | null
          user_name: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type_enum"]
          approval_status?: Database["public"]["Enums"]["approval_status_enum"]
          approval_status_set_by?: string | null
          id: string
          updated_at?: string | null
          user_name: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type_enum"]
          approval_status?: Database["public"]["Enums"]["approval_status_enum"]
          approval_status_set_by?: string | null
          id?: string
          updated_at?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      account_type_enum: "personal" | "shared"
      approval_status_enum: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
