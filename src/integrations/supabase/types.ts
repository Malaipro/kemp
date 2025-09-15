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
      admin_access_log: {
        Row: {
          accessed_at: string | null
          action: string
          admin_user_id: string | null
          id: string
          ip_address: unknown | null
          table_name: string
          user_agent: string | null
        }
        Insert: {
          accessed_at?: string | null
          action: string
          admin_user_id?: string | null
          id?: string
          ip_address?: unknown | null
          table_name: string
          user_agent?: string | null
        }
        Update: {
          accessed_at?: string | null
          action?: string
          admin_user_id?: string | null
          id?: string
          ip_address?: unknown | null
          table_name?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      contact_rate_limit: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown
          submission_count: number | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address: unknown
          submission_count?: number | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown
          submission_count?: number | null
          window_start?: string | null
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
      cooper_test_results: {
        Row: {
          completion_time_seconds: number | null
          created_at: string
          distance_meters: number
          fitness_level: string | null
          id: string
          notes: string | null
          participant_id: string
          test_date: string
          test_number: number
          time_minutes: number
          updated_at: string
        }
        Insert: {
          completion_time_seconds?: number | null
          created_at?: string
          distance_meters: number
          fitness_level?: string | null
          id?: string
          notes?: string | null
          participant_id: string
          test_date?: string
          test_number?: number
          time_minutes?: number
          updated_at?: string
        }
        Update: {
          completion_time_seconds?: number | null
          created_at?: string
          distance_meters?: number
          fitness_level?: string | null
          id?: string
          notes?: string | null
          participant_id?: string
          test_date?: string
          test_number?: number
          time_minutes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cooper_test_results_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cooper_test_results_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "участники"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "участники"
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
      gallery_images: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_active: boolean | null
          sort_order: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      intensive_streams: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          is_active: boolean
          is_current: boolean
          name: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean
          is_current?: boolean
          name: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          is_current?: boolean
          name?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          content_type: string
          content_value: string | null
          created_at: string
          id: string
          is_active: boolean | null
          page_name: string
          section_name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          content_type?: string
          content_value?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          page_name: string
          section_name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          content_type?: string
          content_value?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          page_name?: string
          section_name?: string
          sort_order?: number | null
          updated_at?: string
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
            referencedRelation: "участники"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule: {
        Row: {
          activity_name: string
          ascetic_meaning_kemp: string | null
          ascetic_meaning_nutrition: string | null
          created_at: string
          date_specific: string | null
          day_of_week: number
          description: string | null
          event_type: string | null
          highlight_color: string | null
          id: string
          instructor: string | null
          is_active: boolean
          lecturer: string | null
          location: string | null
          max_participants: number | null
          time_end: string
          time_start: string
          updated_at: string
        }
        Insert: {
          activity_name: string
          ascetic_meaning_kemp?: string | null
          ascetic_meaning_nutrition?: string | null
          created_at?: string
          date_specific?: string | null
          day_of_week: number
          description?: string | null
          event_type?: string | null
          highlight_color?: string | null
          id?: string
          instructor?: string | null
          is_active?: boolean
          lecturer?: string | null
          location?: string | null
          max_participants?: number | null
          time_end: string
          time_start: string
          updated_at?: string
        }
        Update: {
          activity_name?: string
          ascetic_meaning_kemp?: string | null
          ascetic_meaning_nutrition?: string | null
          created_at?: string
          date_specific?: string | null
          day_of_week?: number
          description?: string | null
          event_type?: string | null
          highlight_color?: string | null
          id?: string
          instructor?: string | null
          is_active?: boolean
          lecturer?: string | null
          location?: string | null
          max_participants?: number | null
          time_end?: string
          time_start?: string
          updated_at?: string
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
      testimonials: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          position: string | null
          sort_order: number | null
          text_content: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          position?: string | null
          sort_order?: number | null
          text_content?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          position?: string | null
          sort_order?: number | null
          text_content?: string | null
          updated_at?: string
          video_url?: string | null
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
      trainers: {
        Row: {
          bio: string | null
          created_at: string
          experience: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          quote: string | null
          role: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          experience?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          quote?: string | null
          role: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          experience?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          quote?: string | null
          role?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      training_programs: {
        Row: {
          benefits: Json | null
          created_at: string
          description: string | null
          features: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          price_info: string | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: Json | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price_info?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: Json | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price_info?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
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
            referencedRelation: "участники"
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
            referencedRelation: "участники"
            referencedColumns: ["id"]
          },
        ]
      }
      аскезы_участников: {
        Row: {
          completion_percentage: number | null
          created_at: string
          description: string | null
          duration_days: number
          end_date: string
          id: string
          is_completed: boolean | null
          name: string
          participant_id: string
          start_date: string
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string
          description?: string | null
          duration_days?: number
          end_date: string
          id?: string
          is_completed?: boolean | null
          name: string
          participant_id: string
          start_date: string
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string
          description?: string | null
          duration_days?: number
          end_date?: string
          id?: string
          is_completed?: boolean | null
          name?: string
          participant_id?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "participant_ascetics_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_ascetics_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "участники"
            referencedColumns: ["id"]
          },
        ]
      }
      кэмп_активности: {
        Row: {
          activity_date: string
          activity_type_new:
            | Database["public"]["Enums"]["activity_type_new"]
            | null
          attendance_counted: boolean | null
          auto_points: number | null
          created_at: string
          description: string | null
          id: string
          lecture_subtype:
            | Database["public"]["Enums"]["lecture_subtype_new"]
            | null
          multiplier: number | null
          participant_id: string
          points: number
          reward_type: Database["public"]["Enums"]["reward_type"]
          shram_subtype: Database["public"]["Enums"]["shram_subtype"] | null
          training_subtype:
            | Database["public"]["Enums"]["training_subtype_new"]
            | null
          verified_by: string | null
          zakal_subtype: Database["public"]["Enums"]["zakal_subtype"] | null
        }
        Insert: {
          activity_date?: string
          activity_type_new?:
            | Database["public"]["Enums"]["activity_type_new"]
            | null
          attendance_counted?: boolean | null
          auto_points?: number | null
          created_at?: string
          description?: string | null
          id?: string
          lecture_subtype?:
            | Database["public"]["Enums"]["lecture_subtype_new"]
            | null
          multiplier?: number | null
          participant_id: string
          points?: number
          reward_type: Database["public"]["Enums"]["reward_type"]
          shram_subtype?: Database["public"]["Enums"]["shram_subtype"] | null
          training_subtype?:
            | Database["public"]["Enums"]["training_subtype_new"]
            | null
          verified_by?: string | null
          zakal_subtype?: Database["public"]["Enums"]["zakal_subtype"] | null
        }
        Update: {
          activity_date?: string
          activity_type_new?:
            | Database["public"]["Enums"]["activity_type_new"]
            | null
          attendance_counted?: boolean | null
          auto_points?: number | null
          created_at?: string
          description?: string | null
          id?: string
          lecture_subtype?:
            | Database["public"]["Enums"]["lecture_subtype_new"]
            | null
          multiplier?: number | null
          participant_id?: string
          points?: number
          reward_type?: Database["public"]["Enums"]["reward_type"]
          shram_subtype?: Database["public"]["Enums"]["shram_subtype"] | null
          training_subtype?:
            | Database["public"]["Enums"]["training_subtype_new"]
            | null
          verified_by?: string | null
          zakal_subtype?: Database["public"]["Enums"]["zakal_subtype"] | null
        }
        Relationships: [
          {
            foreignKeyName: "kamp_activities_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kamp_activities_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "участники"
            referencedColumns: ["id"]
          },
        ]
      }
      прогресс_аскез: {
        Row: {
          ascetic_id: string
          completed: boolean | null
          created_at: string
          date: string
          id: string
          notes: string | null
        }
        Insert: {
          ascetic_id: string
          completed?: boolean | null
          created_at?: string
          date: string
          id?: string
          notes?: string | null
        }
        Update: {
          ascetic_id?: string
          completed?: boolean | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ascetic_progress_ascetic_id_fkey"
            columns: ["ascetic_id"]
            isOneToOne: false
            referencedRelation: "аскезы_участников"
            referencedColumns: ["id"]
          },
        ]
      }
      тотемы_участников: {
        Row: {
          earned_at: string
          id: string
          participant_id: string
          requirements_met: Json | null
          totem_type: Database["public"]["Enums"]["totem_type"]
        }
        Insert: {
          earned_at?: string
          id?: string
          participant_id: string
          requirements_met?: Json | null
          totem_type: Database["public"]["Enums"]["totem_type"]
        }
        Update: {
          earned_at?: string
          id?: string
          participant_id?: string
          requirements_met?: Json | null
          totem_type?: Database["public"]["Enums"]["totem_type"]
        }
        Relationships: [
          {
            foreignKeyName: "participant_totems_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_totems_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "участники"
            referencedColumns: ["id"]
          },
        ]
      }
      требования_тотемов: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          requirements: Json
          totem_type: Database["public"]["Enums"]["totem_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          requirements: Json
          totem_type: Database["public"]["Enums"]["totem_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          requirements?: Json
          totem_type?: Database["public"]["Enums"]["totem_type"]
        }
        Relationships: []
      }
      участники: {
        Row: {
          birth_date: string | null
          created_at: string
          email: string | null
          height_cm: number | null
          id: string
          last_name: string | null
          name: string
          points: number
          stream_id: string | null
          user_id: string | null
          weight_kg: number | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          name: string
          points?: number
          stream_id?: string | null
          user_id?: string | null
          weight_kg?: number | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          name?: string
          points?: number
          stream_id?: string | null
          user_id?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "участники_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "intensive_streams"
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
      calculate_activity_points: {
        Args: {
          p_activity_type: Database["public"]["Enums"]["activity_type_new"]
          p_multiplier?: number
        }
        Returns: number
      }
      calculate_participant_progress: {
        Args: { p_participant_id: string }
        Returns: Json
      }
      check_and_award_totems: {
        Args: { p_participant_id: string }
        Returns: Json
      }
      check_contact_rate_limit: {
        Args: { p_ip_address: unknown }
        Returns: boolean
      }
      get_contact_submissions_with_audit: {
        Args: Record<PropertyKey, never>
        Returns: {
          course: string
          created_at: string
          id: string
          name: string
          phone: string
          social: string | null
        }[]
      }
      get_leaderboard_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          points: number
          rank: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_super_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      log_admin_access: {
        Args: { p_action: string; p_table_name: string }
        Returns: undefined
      }
    }
    Enums: {
      activity_type_new:
        | "training"
        | "lecture"
        | "homework"
        | "crash_test_bjj"
        | "crash_test_kick"
        | "heroes_race"
        | "tactics"
        | "ascetic"
      app_role: "admin" | "moderator" | "user"
      event_type_enum: "training" | "lecture" | "test" | "special"
      highlight_color_enum: "none" | "red" | "yellow" | "green" | "blue"
      lecture_subtype: "kemp" | "tactics" | "nutrition" | "psychology"
      lecture_subtype_new: "kemp" | "nutrition"
      reward_type: "zakal" | "gran" | "shram" | "totem"
      shram_subtype: "bjj" | "kick" | "ofp" | "tactics"
      totem_type:
        | "snake"
        | "paw"
        | "hammer"
        | "star"
        | "sprout"
        | "compass"
        | "monk"
        | "blade"
        | "lighthouse"
        | "bear"
      training_subtype: "bjj" | "kick" | "ofp" | "boxing" | "wrestling"
      training_subtype_new: "bjj" | "kick" | "ofp"
      zakal_subtype: "bjj" | "kick" | "ofp"
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
      activity_type_new: [
        "training",
        "lecture",
        "homework",
        "crash_test_bjj",
        "crash_test_kick",
        "heroes_race",
        "tactics",
        "ascetic",
      ],
      app_role: ["admin", "moderator", "user"],
      event_type_enum: ["training", "lecture", "test", "special"],
      highlight_color_enum: ["none", "red", "yellow", "green", "blue"],
      lecture_subtype: ["kemp", "tactics", "nutrition", "psychology"],
      lecture_subtype_new: ["kemp", "nutrition"],
      reward_type: ["zakal", "gran", "shram", "totem"],
      shram_subtype: ["bjj", "kick", "ofp", "tactics"],
      totem_type: [
        "snake",
        "paw",
        "hammer",
        "star",
        "sprout",
        "compass",
        "monk",
        "blade",
        "lighthouse",
        "bear",
      ],
      training_subtype: ["bjj", "kick", "ofp", "boxing", "wrestling"],
      training_subtype_new: ["bjj", "kick", "ofp"],
      zakal_subtype: ["bjj", "kick", "ofp"],
    },
  },
} as const
