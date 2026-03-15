export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      borrow_requests: {
        Row: {
          borrower_id: string
          circle_id: string
          created_at: string
          due_date: string | null
          handed_off_at: string | null
          id: string
          lender_id: string
          message: string | null
          nuts_amount: number
          responded_at: string | null
          returned_at: string | null
          status: Database["public"]["Enums"]["request_status"]
          tool_id: string
          updated_at: string
        }
        Insert: {
          borrower_id: string
          circle_id: string
          created_at?: string
          due_date?: string | null
          handed_off_at?: string | null
          id?: string
          lender_id: string
          message?: string | null
          nuts_amount?: number
          responded_at?: string | null
          returned_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          tool_id: string
          updated_at?: string
        }
        Update: {
          borrower_id?: string
          circle_id?: string
          created_at?: string
          due_date?: string | null
          handed_off_at?: string | null
          id?: string
          lender_id?: string
          message?: string | null
          nuts_amount?: number
          responded_at?: string | null
          returned_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          tool_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "borrow_requests_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "borrow_requests_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "borrow_requests_lender_id_fkey"
            columns: ["lender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "borrow_requests_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_members: {
        Row: {
          circle_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          circle_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          circle_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_members_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      circles: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          invite_code: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          invite_code?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          invite_code?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "circles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          email_sent: boolean
          id: string
          read: boolean
          related_request_id: string | null
          sms_sent: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          email_sent?: boolean
          id?: string
          read?: boolean
          related_request_id?: string | null
          sms_sent?: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          email_sent?: boolean
          id?: string
          read?: boolean
          related_request_id?: string | null
          sms_sent?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_request_id_fkey"
            columns: ["related_request_id"]
            isOneToOne: false
            referencedRelation: "borrow_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nuts_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          related_request_id: string | null
          type: Database["public"]["Enums"]["nuts_transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          related_request_id?: string | null
          type: Database["public"]["Enums"]["nuts_transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          related_request_id?: string | null
          type?: Database["public"]["Enums"]["nuts_transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nuts_transactions_related_request_id_fkey"
            columns: ["related_request_id"]
            isOneToOne: false
            referencedRelation: "borrow_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nuts_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          email: string
          id: string
          notification_prefs: Json
          nuts_balance: number
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          email: string
          id: string
          notification_prefs?: Json
          nuts_balance?: number
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          notification_prefs?: Json
          nuts_balance?: number
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tool_categories: {
        Row: {
          icon: string | null
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          icon?: string | null
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      tool_circle_listings: {
        Row: {
          circle_id: string
          id: string
          listed_at: string
          tool_id: string
        }
        Insert: {
          circle_id: string
          id?: string
          listed_at?: string
          tool_id: string
        }
        Update: {
          circle_id?: string
          id?: string
          listed_at?: string
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_circle_listings_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_circle_listings_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          nuts_cost: number
          owner_id: string
          photo_url: string | null
          sku: string | null
          status: Database["public"]["Enums"]["tool_status"]
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          nuts_cost?: number
          owner_id: string
          photo_url?: string | null
          sku?: string | null
          status?: Database["public"]["Enums"]["tool_status"]
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          nuts_cost?: number
          owner_id?: string
          photo_url?: string | null
          sku?: string | null
          status?: Database["public"]["Enums"]["tool_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tools_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "tool_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tools_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      audit_insert: {
        Args: {
          p_action: string
          p_entity_id?: string
          p_entity_type: string
          p_metadata?: Json
          p_user_id: string
        }
        Returns: undefined
      }
      create_circle: {
        Args: { p_description?: string; p_name: string }
        Returns: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          invite_code: string
          name: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "circles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_tool_with_listings: {
        Args: {
          p_category_id?: string
          p_circle_ids?: string[]
          p_description?: string
          p_name: string
          p_nuts_cost?: number
          p_photo_url?: string
        }
        Returns: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          nuts_cost: number
          owner_id: string
          photo_url: string | null
          sku: string | null
          status: Database["public"]["Enums"]["tool_status"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "tools"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      ensure_profile: { Args: never; Returns: undefined }
      get_circle_by_invite_code: {
        Args: { code: string }
        Returns: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          invite_code: string
          name: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "circles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_circle_mate_ids: { Args: never; Returns: string[] }
      get_my_circle_ids: { Args: never; Returns: string[] }
      process_borrow_action: {
        Args: { p_action: string; p_request_id: string }
        Returns: {
          borrower_id: string
          circle_id: string
          created_at: string
          due_date: string | null
          handed_off_at: string | null
          id: string
          lender_id: string
          message: string | null
          nuts_amount: number
          responded_at: string | null
          returned_at: string | null
          status: Database["public"]["Enums"]["request_status"]
          tool_id: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "borrow_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_tool_with_listings: {
        Args: {
          p_category_id?: string
          p_circle_ids?: string[]
          p_description?: string
          p_name: string
          p_nuts_cost?: number
          p_photo_url?: string
          p_tool_id: string
        }
        Returns: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          nuts_cost: number
          owner_id: string
          photo_url: string | null
          sku: string | null
          status: Database["public"]["Enums"]["tool_status"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "tools"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      notification_type:
        | "borrow_request"
        | "request_approved"
        | "request_declined"
        | "tool_handed_off"
        | "tool_returned"
        | "return_reminder"
      nuts_transaction_type:
        | "signup_bonus"
        | "lend_earn"
        | "borrow_spend"
        | "bonus"
        | "refund"
      request_status:
        | "pending"
        | "approved"
        | "declined"
        | "handed_off"
        | "returned"
        | "cancelled"
      tool_status: "available" | "lent_out" | "not_available"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      notification_type: [
        "borrow_request",
        "request_approved",
        "request_declined",
        "tool_handed_off",
        "tool_returned",
        "return_reminder",
      ],
      nuts_transaction_type: [
        "signup_bonus",
        "lend_earn",
        "borrow_spend",
        "bonus",
        "refund",
      ],
      request_status: [
        "pending",
        "approved",
        "declined",
        "handed_off",
        "returned",
        "cancelled",
      ],
      tool_status: ["available", "lent_out", "not_available"],
    },
  },
} as const
