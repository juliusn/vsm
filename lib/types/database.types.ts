export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          assignee: string
          created_at: string
          duration_minutes: number
          id: number
          port_event: string
          standby_minutes: number
        }
        ComputedFields: never
        Insert: {
          assignee: string
          created_at?: string
          duration_minutes: number
          id?: number
          port_event: string
          standby_minutes: number
        }
        Update: {
          assignee?: string
          created_at?: string
          duration_minutes?: number
          id?: number
          port_event?: string
          standby_minutes?: number
        }
        Relationships: [
          {
            foreignKeyName: 'assignments_assignee_fkey'
            columns: ['assignee']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assignments_port_event_fkey'
            columns: ['port_event']
            isOneToOne: false
            referencedRelation: 'port_events'
            referencedColumns: ['id']
          },
        ]
      }
      berth_service_translations: {
        Row: {
          abbreviation: string
          berth_service: string
          locale: Database['public']['Enums']['locale']
          title: string
        }
        ComputedFields: never
        Insert: {
          abbreviation: string
          berth_service: string
          locale: Database['public']['Enums']['locale']
          title: string
        }
        Update: {
          abbreviation?: string
          berth_service?: string
          locale?: Database['public']['Enums']['locale']
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: 'berth_service_translations_service_fkey'
            columns: ['berth_service']
            isOneToOne: false
            referencedRelation: 'berth_services'
            referencedColumns: ['id']
          },
        ]
      }
      berth_services: {
        Row: {
          berth_code: string
          enabled: boolean
          id: string
          locode: string
          port_area_code: string
          port_event: Database['public']['Enums']['port_event'] | null
          sort_order: number
        }
        ComputedFields: never
        Insert: {
          berth_code: string
          enabled?: boolean
          id?: string
          locode: string
          port_area_code: string
          port_event?: Database['public']['Enums']['port_event'] | null
          sort_order?: number
        }
        Update: {
          berth_code?: string
          enabled?: boolean
          id?: string
          locode?: string
          port_area_code?: string
          port_event?: Database['public']['Enums']['port_event'] | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: 'berth_services_locode_port_area_code_berth_code_fkey'
            columns: ['locode', 'port_area_code', 'berth_code']
            isOneToOne: false
            referencedRelation: 'berths'
            referencedColumns: ['locode', 'port_area_code', 'berth_code']
          },
        ]
      }
      berthing_shiftings: {
        Row: {
          berthing: string
          id: string
          port_event: string
        }
        ComputedFields: never
        Insert: {
          berthing: string
          id?: string
          port_event: string
        }
        Update: {
          berthing?: string
          id?: string
          port_event?: string
        }
        Relationships: [
          {
            foreignKeyName: 'berthing_shiftings_berthing_fkey'
            columns: ['berthing']
            isOneToOne: false
            referencedRelation: 'berthings'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'berthing_shiftings_port_event_fkey'
            columns: ['port_event']
            isOneToOne: true
            referencedRelation: 'port_events'
            referencedColumns: ['id']
          },
        ]
      }
      berthings: {
        Row: {
          arrival: string | null
          created_at: string
          departure: string | null
          id: string
          vessel_imo: number
          vessel_name: string | null
        }
        ComputedFields: never
        Insert: {
          arrival?: string | null
          created_at?: string
          departure?: string | null
          id?: string
          vessel_imo: number
          vessel_name?: string | null
        }
        Update: {
          arrival?: string | null
          created_at?: string
          departure?: string | null
          id?: string
          vessel_imo?: number
          vessel_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'berthings_arrival_fkey'
            columns: ['arrival']
            isOneToOne: false
            referencedRelation: 'port_events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'berthings_departure_fkey'
            columns: ['departure']
            isOneToOne: false
            referencedRelation: 'port_events'
            referencedColumns: ['id']
          },
        ]
      }
      berths: {
        Row: {
          berth_code: string
          berth_name: string
          enabled: boolean
          locode: string
          port_area_code: string
        }
        ComputedFields: never
        Insert: {
          berth_code: string
          berth_name: string
          enabled?: boolean
          locode: string
          port_area_code: string
        }
        Update: {
          berth_code?: string
          berth_name?: string
          enabled?: boolean
          locode?: string
          port_area_code?: string
        }
        Relationships: [
          {
            foreignKeyName: 'berths_locode_fkey'
            columns: ['locode']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['locode']
          },
          {
            foreignKeyName: 'berths_locode_port_area_code_fkey'
            columns: ['locode', 'port_area_code']
            isOneToOne: false
            referencedRelation: 'port_areas'
            referencedColumns: ['locode', 'port_area_code']
          },
        ]
      }
      common_service_order: {
        Row: {
          common_service: string
          created_at: string
          id: string
          order: string
        }
        ComputedFields: never
        Insert: {
          common_service: string
          created_at?: string
          id?: string
          order: string
        }
        Update: {
          common_service?: string
          created_at?: string
          id?: string
          order?: string
        }
        Relationships: [
          {
            foreignKeyName: 'common_service_order_common_service_fkey'
            columns: ['common_service']
            isOneToOne: false
            referencedRelation: 'common_services'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'common_service_order_order_fkey'
            columns: ['order']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      common_service_translations: {
        Row: {
          abbreviation: string
          common_service: string
          locale: Database['public']['Enums']['locale']
          title: string
        }
        ComputedFields: never
        Insert: {
          abbreviation: string
          common_service: string
          locale: Database['public']['Enums']['locale']
          title: string
        }
        Update: {
          abbreviation?: string
          common_service?: string
          locale?: Database['public']['Enums']['locale']
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: 'common_service_translations_service_fkey'
            columns: ['common_service']
            isOneToOne: false
            referencedRelation: 'common_services'
            referencedColumns: ['id']
          },
        ]
      }
      common_services: {
        Row: {
          id: string
          port_event: Database['public']['Enums']['port_event'] | null
          sort_order: number | null
        }
        ComputedFields: never
        Insert: {
          id?: string
          port_event?: Database['public']['Enums']['port_event'] | null
          sort_order?: number | null
        }
        Update: {
          id?: string
          port_event?: Database['public']['Enums']['port_event'] | null
          sort_order?: number | null
        }
        Relationships: []
      }
      counterparties: {
        Row: {
          business_id: string
          created_at: string
          name: string
        }
        ComputedFields: never
        Insert: {
          business_id: string
          created_at?: string
          name: string
        }
        Update: {
          business_id?: string
          created_at?: string
          name?: string
        }
        Relationships: []
      }
      counterparty_translations: {
        Row: {
          counterparty: string
          created_at: string
          locale: Database['public']['Enums']['locale']
          title: string
        }
        ComputedFields: never
        Insert: {
          counterparty: string
          created_at?: string
          locale: Database['public']['Enums']['locale']
          title: string
        }
        Update: {
          counterparty?: string
          created_at?: string
          locale?: Database['public']['Enums']['locale']
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: 'counterparty_names_counterparty_fkey'
            columns: ['counterparty']
            isOneToOne: false
            referencedRelation: 'counterparties'
            referencedColumns: ['business_id']
          },
        ]
      }
      locations: {
        Row: {
          country: string
          enabled: boolean
          location_name: string
          locode: string
        }
        ComputedFields: never
        Insert: {
          country: string
          enabled?: boolean
          location_name: string
          locode: string
        }
        Update: {
          country?: string
          enabled?: boolean
          location_name?: string
          locode?: string
        }
        Relationships: []
      }
      metadata: {
        Row: {
          data_updated_time: string
          dataset_name: string
        }
        ComputedFields: never
        Insert: {
          data_updated_time: string
          dataset_name: string
        }
        Update: {
          data_updated_time?: string
          dataset_name?: string
        }
        Relationships: []
      }
      order_permissions: {
        Row: {
          id: string
          order_permission: Database['public']['Enums']['order_permission']
          receiver_counterparty_business_id: string
          sender_counterparty_business_id: string
          user_id: string
        }
        ComputedFields: never
        Insert: {
          id?: string
          order_permission: Database['public']['Enums']['order_permission']
          receiver_counterparty_business_id: string
          sender_counterparty_business_id: string
          user_id: string
        }
        Update: {
          id?: string
          order_permission?: Database['public']['Enums']['order_permission']
          receiver_counterparty_business_id?: string
          sender_counterparty_business_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'order_permissions_receiver_counterparty_business_id_fkey'
            columns: ['receiver_counterparty_business_id']
            isOneToOne: false
            referencedRelation: 'counterparties'
            referencedColumns: ['business_id']
          },
          {
            foreignKeyName: 'order_permissions_sender_counterparty_business_id_fkey'
            columns: ['sender_counterparty_business_id']
            isOneToOne: false
            referencedRelation: 'counterparties'
            referencedColumns: ['business_id']
          },
          {
            foreignKeyName: 'order_permissions_user_id_fkey1'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      orders: {
        Row: {
          berthing: string
          created_at: string
          id: string
          receiver_counterparty_business_id: string
          sender_counterparty_business_id: string
          status: Database['public']['Enums']['order_status']
        }
        ComputedFields: never
        Insert: {
          berthing: string
          created_at?: string
          id?: string
          receiver_counterparty_business_id: string
          sender_counterparty_business_id: string
          status?: Database['public']['Enums']['order_status']
        }
        Update: {
          berthing?: string
          created_at?: string
          id?: string
          receiver_counterparty_business_id?: string
          sender_counterparty_business_id?: string
          status?: Database['public']['Enums']['order_status']
        }
        Relationships: [
          {
            foreignKeyName: 'orders_berthing_fkey'
            columns: ['berthing']
            isOneToOne: true
            referencedRelation: 'berthings'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'orders_receiver_fkey'
            columns: ['receiver_counterparty_business_id']
            isOneToOne: false
            referencedRelation: 'counterparties'
            referencedColumns: ['business_id']
          },
          {
            foreignKeyName: 'orders_sender_fkey'
            columns: ['sender_counterparty_business_id']
            isOneToOne: false
            referencedRelation: 'counterparties'
            referencedColumns: ['business_id']
          },
        ]
      }
      port_areas: {
        Row: {
          enabled: boolean
          geometry: unknown
          locode: string
          port_area_code: string
          port_area_name: string
        }
        ComputedFields: never
        Insert: {
          enabled?: boolean
          geometry?: unknown
          locode: string
          port_area_code: string
          port_area_name: string
        }
        Update: {
          enabled?: boolean
          geometry?: unknown
          locode?: string
          port_area_code?: string
          port_area_name?: string
        }
        Relationships: [
          {
            foreignKeyName: 'port_areas_locode_fkey'
            columns: ['locode']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['locode']
          },
        ]
      }
      port_events: {
        Row: {
          berth_code: string | null
          created_at: string
          default_duration_minutes: number
          default_standby_minutes: number
          estimated_date: string
          estimated_time: string | null
          id: string
          is_public: boolean
          locode: string | null
          max_assignees: number
          port_area_code: string | null
          position: string | null
          type: Database['public']['Enums']['port_event']
        }
        ComputedFields: never
        Insert: {
          berth_code?: string | null
          created_at?: string
          default_duration_minutes?: number
          default_standby_minutes?: number
          estimated_date: string
          estimated_time?: string | null
          id?: string
          is_public?: boolean
          locode?: string | null
          max_assignees: number
          port_area_code?: string | null
          position?: string | null
          type: Database['public']['Enums']['port_event']
        }
        Update: {
          berth_code?: string | null
          created_at?: string
          default_duration_minutes?: number
          default_standby_minutes?: number
          estimated_date?: string
          estimated_time?: string | null
          id?: string
          is_public?: boolean
          locode?: string | null
          max_assignees?: number
          port_area_code?: string | null
          position?: string | null
          type?: Database['public']['Enums']['port_event']
        }
        Relationships: [
          {
            foreignKeyName: 'port_events_locode_port_area_code_berth_code_fkey'
            columns: ['locode', 'port_area_code', 'berth_code']
            isOneToOne: false
            referencedRelation: 'berths'
            referencedColumns: ['locode', 'port_area_code', 'berth_code']
          },
        ]
      }
      profiles: {
        Row: {
          admin: boolean
          approval_status: Database['public']['Enums']['approval_status']
          approval_status_set_by: string | null
          first_name: string
          id: string
          last_name: string | null
          updated_at: string | null
        }
        ComputedFields: never
        Insert: {
          admin?: boolean
          approval_status?: Database['public']['Enums']['approval_status']
          approval_status_set_by?: string | null
          first_name: string
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          admin?: boolean
          approval_status?: Database['public']['Enums']['approval_status']
          approval_status_set_by?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize_orders: {
        Args: {
          receiver_business_id: string
          requested_permission: Database['public']['Enums']['order_permission']
          sender_business_id: string
        }
        Returns: boolean
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      delete_user: { Args: Record<PropertyKey, never>; Returns: undefined }
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
    }
    Enums: {
      approval_status: 'pending' | 'approved' | 'rejected'
      locale: 'en' | 'fi'
      order_permission: 'read' | 'create' | 'edit' | 'delete'
      order_status: 'submitted' | 'received' | 'completed' | 'canceled'
      port_event: 'arrival' | 'departure' | 'shifting'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      approval_status: ['pending', 'approved', 'rejected'],
      locale: ['en', 'fi'],
      order_permission: ['read', 'create', 'edit', 'delete'],
      order_status: ['submitted', 'received', 'completed', 'canceled'],
      port_event: ['arrival', 'departure', 'shifting'],
    },
  },
} as const
