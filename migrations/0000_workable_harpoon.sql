CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "custom_inspection_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" varchar(50) NOT NULL,
	"section_id" varchar(50) NOT NULL,
	"text" text NOT NULL,
	"effective_date" varchar(20),
	"introduction_type" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "custom_inspection_items_item_id_unique" UNIQUE("item_id")
);
--> statement-breakpoint
CREATE TABLE "hotspots" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"top" varchar(10) NOT NULL,
	"left" varchar(10) NOT NULL,
	"category_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inspection_item_edits" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" varchar(50) NOT NULL,
	"text" text,
	"effective_date" varchar(20),
	"expiry_date" varchar(20),
	"introduction_type" varchar(20),
	"custom_warning" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "inspection_item_edits_item_id_unique" UNIQUE("item_id")
);
--> statement-breakpoint
CREATE TABLE "judgment_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" varchar(50) NOT NULL,
	"author" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "judgment_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" varchar(50) NOT NULL,
	"file_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"image_data" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memo_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"memo_id" integer NOT NULL,
	"file_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"image_data" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"body" text DEFAULT '' NOT NULL,
	"keywords" text[],
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "photo_annotations" (
	"id" serial PRIMARY KEY NOT NULL,
	"photo_id" integer NOT NULL,
	"tool" varchar(20) NOT NULL,
	"color" varchar(20) NOT NULL,
	"stroke_width" integer DEFAULT 2,
	"points" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "standard_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"standard_id" integer NOT NULL,
	"author" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "standards" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"hotspot_id" integer,
	"title" text NOT NULL,
	"standard_number" varchar(50),
	"body" text NOT NULL,
	"image_urls" text[],
	"permit_date" varchar(10),
	"inspection_date" varchar(10),
	"inspection_year" varchar(4),
	"inspection_round" varchar(10),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "hotspots" ADD CONSTRAINT "hotspots_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memo_photos" ADD CONSTRAINT "memo_photos_memo_id_memos_id_fk" FOREIGN KEY ("memo_id") REFERENCES "public"."memos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_annotations" ADD CONSTRAINT "photo_annotations_photo_id_memo_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."memo_photos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standard_comments" ADD CONSTRAINT "standard_comments_standard_id_standards_id_fk" FOREIGN KEY ("standard_id") REFERENCES "public"."standards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standards" ADD CONSTRAINT "standards_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standards" ADD CONSTRAINT "standards_hotspot_id_hotspots_id_fk" FOREIGN KEY ("hotspot_id") REFERENCES "public"."hotspots"("id") ON DELETE set null ON UPDATE no action;