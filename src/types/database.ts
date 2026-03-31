export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string;
          business_name: string;
          address_street: string;
          address_city: string;
          address_state: string;
          address_zip: string;
          phone_office: string;
          phone_sales: string;
          email: string;
          hours_display: string;
          facebook_url: string | null;
          instagram_url: string | null;
          youtube_url: string | null;
          google_maps_embed: string | null;
          meta_description: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          address_street: string;
          address_city: string;
          address_state: string;
          address_zip: string;
          phone_office: string;
          phone_sales: string;
          email: string;
          hours_display: string;
          facebook_url?: string | null;
          instagram_url?: string | null;
          youtube_url?: string | null;
          google_maps_embed?: string | null;
          meta_description?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string;
          address_street?: string;
          address_city?: string;
          address_state?: string;
          address_zip?: string;
          phone_office?: string;
          phone_sales?: string;
          email?: string;
          hours_display?: string;
          facebook_url?: string | null;
          instagram_url?: string | null;
          youtube_url?: string | null;
          google_maps_embed?: string | null;
          meta_description?: string | null;
          updated_at?: string;
        };
      };
      slider_slides: {
        Row: {
          id: string;
          image_url: string;
          image_alt: string;
          headline: string | null;
          subtitle: string | null;
          sub_subtitle: string | null;
          cta_text: string | null;
          cta_link: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          image_alt: string;
          headline?: string | null;
          subtitle?: string | null;
          sub_subtitle?: string | null;
          cta_text?: string | null;
          cta_link?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          image_alt?: string;
          headline?: string | null;
          subtitle?: string | null;
          sub_subtitle?: string | null;
          cta_text?: string | null;
          cta_link?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          title: string;
          image_url: string | null;
          image_alt: string | null;
          icon_class: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          image_url?: string | null;
          image_alt?: string | null;
          icon_class?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          image_url?: string | null;
          image_alt?: string | null;
          icon_class?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      service_items: {
        Row: {
          id: string;
          service_id: string;
          text: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          service_id: string;
          text: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          service_id?: string;
          text?: string;
          sort_order?: number;
        };
      };
      gallery_items: {
        Row: {
          id: string;
          type: "image" | "video";
          url: string;
          thumbnail_url: string | null;
          title: string | null;
          alt_text: string | null;
          category: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: "image" | "video";
          url: string;
          thumbnail_url?: string | null;
          title?: string | null;
          alt_text?: string | null;
          category?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: "image" | "video";
          url?: string;
          thumbnail_url?: string | null;
          title?: string | null;
          alt_text?: string | null;
          category?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      promotions: {
        Row: {
          id: string;
          title: string;
          season: string | null;
          image_url: string | null;
          image_alt: string | null;
          icon_class: string | null;
          sort_order: number;
          is_active: boolean;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          season?: string | null;
          image_url?: string | null;
          image_alt?: string | null;
          icon_class?: string | null;
          sort_order?: number;
          is_active?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          season?: string | null;
          image_url?: string | null;
          image_alt?: string | null;
          icon_class?: string | null;
          sort_order?: number;
          is_active?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
        };
      };
      promotion_items: {
        Row: {
          id: string;
          promotion_id: string;
          text: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          promotion_id: string;
          text: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          promotion_id?: string;
          text?: string;
          sort_order?: number;
        };
      };
      testimonials: {
        Row: {
          id: string;
          quote: string;
          author_name: string;
          author_location: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          quote: string;
          author_name: string;
          author_location?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          quote?: string;
          author_name?: string;
          author_location?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      content_blocks: {
        Row: {
          id: string;
          page: string;
          section: string;
          heading: string | null;
          body: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page: string;
          section: string;
          heading?: string | null;
          body?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          page?: string;
          section?: string;
          heading?: string | null;
          body?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience type aliases
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type SiteSettingsInsert = Database["public"]["Tables"]["site_settings"]["Insert"];
export type SiteSettingsUpdate = Database["public"]["Tables"]["site_settings"]["Update"];

export type SliderSlide = Database["public"]["Tables"]["slider_slides"]["Row"];
export type SliderSlideInsert = Database["public"]["Tables"]["slider_slides"]["Insert"];
export type SliderSlideUpdate = Database["public"]["Tables"]["slider_slides"]["Update"];

export type Service = Database["public"]["Tables"]["services"]["Row"];
export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
export type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

export type ServiceItem = Database["public"]["Tables"]["service_items"]["Row"];
export type ServiceItemInsert = Database["public"]["Tables"]["service_items"]["Insert"];
export type ServiceItemUpdate = Database["public"]["Tables"]["service_items"]["Update"];

export type GalleryItem = Database["public"]["Tables"]["gallery_items"]["Row"];
export type GalleryItemInsert = Database["public"]["Tables"]["gallery_items"]["Insert"];
export type GalleryItemUpdate = Database["public"]["Tables"]["gallery_items"]["Update"];

export type Promotion = Database["public"]["Tables"]["promotions"]["Row"];
export type PromotionInsert = Database["public"]["Tables"]["promotions"]["Insert"];
export type PromotionUpdate = Database["public"]["Tables"]["promotions"]["Update"];

export type PromotionItem = Database["public"]["Tables"]["promotion_items"]["Row"];
export type PromotionItemInsert = Database["public"]["Tables"]["promotion_items"]["Insert"];
export type PromotionItemUpdate = Database["public"]["Tables"]["promotion_items"]["Update"];

export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type TestimonialInsert = Database["public"]["Tables"]["testimonials"]["Insert"];
export type TestimonialUpdate = Database["public"]["Tables"]["testimonials"]["Update"];

export type ContentBlock = Database["public"]["Tables"]["content_blocks"]["Row"];
export type ContentBlockInsert = Database["public"]["Tables"]["content_blocks"]["Insert"];
export type ContentBlockUpdate = Database["public"]["Tables"]["content_blocks"]["Update"];
