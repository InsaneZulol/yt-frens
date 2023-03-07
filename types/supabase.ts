export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      extra_user_data: {
        Row: {
          created_at: string | null
          id: number
          nick_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          nick_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          nick_name?: string | null
        }
      }
      friendships: {
        Row: {
          accepted_on: string | null
          friends: string[] | null
          friendship_id: number
          user_id: string | null
        }
        Insert: {
          accepted_on?: string | null
          friends?: string[] | null
          friendship_id?: number
          user_id?: string | null
        }
        Update: {
          accepted_on?: string | null
          friends?: string[] | null
          friendship_id?: number
          user_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
