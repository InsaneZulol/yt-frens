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
      friendships: {
        Row: {
          accepted_on: string | null
          friends: string[] | null
          id: number
          user_id: string | null
        }
        Insert: {
          accepted_on?: string | null
          friends?: string[] | null
          id?: number
          user_id?: string | null
        }
        Update: {
          accepted_on?: string | null
          friends?: string[] | null
          id?: number
          user_id?: string | null
        }
      }
      user_data: {
        Row: {
          friends: string[] | null
          id: number
          nickname: string | null
          user_id: string | null
        }
        Insert: {
          friends?: string[] | null
          id?: number
          nickname?: string | null
          user_id?: string | null
        }
        Update: {
          friends?: string[] | null
          id?: number
          nickname?: string | null
          user_id?: string | null
        }
      }
    }
    Views: {
      view_my_friends: {
        Row: {
          nickname: string | null
          user_id: string | null
        }
      }
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
