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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievement_types: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
          shape: string
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
          shape: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
          shape?: string
        }
        Relationships: []
      }
      activities: {
        Row: {
          created_at: string
          icon: string
          id: string
          points: number
          title: string
        }
        Insert: {
          created_at?: string
          icon: string
          id?: string
          points: number
          title: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          points?: number
          title?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          course: string
          created_at: string
          id: string
          name: string
          phone: string
          social: string | null
        }
        Insert: {
          course: string
          created_at?: string
          id?: string
          name: string
          phone: string
          social?: string | null
        }
        Update: {
          course?: string
          created_at?: string
          id?: string
          name?: string
          phone?: string
          social?: string | null
        }
        Relationships: []
      }
      direction_progress: {
        Row: {
          activities_completed: number | null
          created_at: string
          direction_id: string
          final_test_passed: boolean | null
          id: string
          lectures_completed: number | null
          participant_id: string
          progress_percentage: number | null
          totem_earned: boolean | null
          updated_at: string
        }
        Insert: {
          activities_completed?: number | null
          created_at?: string
          direction_id: string
          final_test_passed?: boolean | null
          id?: string
          lectures_completed?: number | null
          participant_id: string
          progress_percentage?: number | null
          totem_earned?: boolean | null
          updated_at?: string
        }
        Update: {
          activities_completed?: number | null
          created_at?: string
          direction_id?: string
          final_test_passed?: boolean | null
          id?: string
          lectures_completed?: number | null
          participant_id?: string
          progress_percentage?: number | null
          totem_earned?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "direction_progress_direction_id_fkey"
            columns: ["direction_id"]
            isOneToOne: false
            referencedRelation: "directions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direction_progress_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direction_progress_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      directions: {
        Row: {
          created_at: string
          description: string | null
          has_final_test: boolean | null
          id: string
          name: string
          required_activities: number | null
          required_lectures: number | null
          totem_description: string | null
          totem_icon: string | null
          totem_name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          has_final_test?: boolean | null
          id?: string
          name: string
          required_activities?: number | null
          required_lectures?: number | null
          totem_description?: string | null
          totem_icon?: string | null
          totem_name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          has_final_test?: boolean | null
          id?: string
          name?: string
          required_activities?: number | null
          required_lectures?: number | null
          totem_description?: string | null
          totem_icon?: string | null
          totem_name?: string | null
        }
        Relationships: []
      }
      participant_activities: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          participant_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          participant_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participant_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_activities_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_activities_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          created_at: string
          id: string
          name: string
          points: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          points?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          points?: number
          user_id?: string | null
        }
        Relationships: []
      }
      service_bookings: {
        Row: {
          created_at: string
          id: string
          name: string
          package_id: string
          package_price: number
          package_title: string
          phone: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          package_id: string
          package_price: number
          package_title: string
          phone: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          package_id?: string
          package_price?: number
          package_title?: string
          phone?: string
          status?: string
        }
        Relationships: []
      }
      special_badges: {
        Row: {
          created_at: string
          criteria: string | null
          description: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          criteria?: string | null
          description: string
          icon: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          criteria?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      totems: {
        Row: {
          created_at: string
          description: string
          direction_id: string | null
          icon: string
          id: string
          name: string
          requirements: string | null
        }
        Insert: {
          created_at?: string
          description: string
          direction_id?: string | null
          icon: string
          id?: string
          name: string
          requirements?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          direction_id?: string | null
          icon?: string
          id?: string
          name?: string
          requirements?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "totems_direction_id_fkey"
            columns: ["direction_id"]
            isOneToOne: false
            referencedRelation: "directions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_type_id: string
          activity_id: string | null
          created_at: string
          direction_id: string | null
          earned_at: string
          id: string
          participant_id: string
          position: number | null
          totem_id: string | null
        }
        Insert: {
          achievement_type_id: string
          activity_id?: string | null
          created_at?: string
          direction_id?: string | null
          earned_at?: string
          id?: string
          participant_id: string
          position?: number | null
          totem_id?: string | null
        }
        Update: {
          achievement_type_id?: string
          activity_id?: string | null
          created_at?: string
          direction_id?: string | null
          earned_at?: string
          id?: string
          participant_id?: string
          position?: number | null
          totem_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_type_id_fkey"
            columns: ["achievement_type_id"]
            isOneToOne: false
            referencedRelation: "achievement_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_direction_id_fkey"
            columns: ["direction_id"]
            isOneToOne: false
            referencedRelation: "directions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_totem_id_fkey"
            columns: ["totem_id"]
            isOneToOne: false
            referencedRelation: "totems"
            referencedColumns: ["id"]
          },
        ]
      }
      user_special_badges: {
        Row: {
          badge_id: string
          created_at: string
          earned_at: string
          id: string
          participant_id: string
        }
        Insert: {
          badge_id: string
          created_at?: string
          earned_at?: string
          id?: string
          participant_id: string
        }
        Update: {
          badge_id?: string
          created_at?: string
          earned_at?: string
          id?: string
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_special_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "special_badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_special_badges_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_special_badges_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      leaderboard: {
        Row: {
          id: string | null
          name: string | null
          points: number | null
          rank: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
