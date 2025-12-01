import { db } from "./db";
import { categories, standards, hotspots } from "@shared/schema";
import { ELEVATOR_DATA } from "../client/src/lib/elevator-data";

const INITIAL_HOTSPOTS = [
  { label: "기계실", top: "10%", left: "50%", categoryKey: 'machine' },
  { label: "카 상부", top: "35%", left: "55%", categoryKey: 'car' },
  { label: "승강로", top: "40%", left: "20%", categoryKey: 'shaft' },
  { label: "카 내", top: "55%", left: "55%", categoryKey: 'car' },
  { label: "피트", top: "80%", left: "50%", categoryKey: 'pit' },
];

async function seed() {
  try {
    console.log("Starting database seed...");

    // Clear existing data
    console.log("Clearing existing data...");
    await db.delete(hotspots);
    await db.delete(standards);
    await db.delete(categories);

    // Create categories and get their IDs
    console.log("Creating categories...");
    const categoryMap = new Map<string, number>();
    
    for (const [key, sectionData] of Object.entries(ELEVATOR_DATA)) {
      const [category] = await db.insert(categories).values({
        key,
        title: sectionData.title,
        description: sectionData.desc,
      }).returning();
      
      categoryMap.set(key, category.id);
      console.log(`Created category: ${category.title} (ID: ${category.id})`);

      // Create standards for this category
      console.log(`Creating ${sectionData.items.length} standards for ${category.title}...`);
      for (const item of sectionData.items) {
        await db.insert(standards).values({
          categoryId: category.id,
          title: item.title,
          standardNumber: item.std,
          body: item.body,
          imageUrl: item.imageUrl || null,
          permitDate: item.permitDate || null,
          inspectionDate: item.inspectionDate || null,
        });
      }
    }

    // Create hotspots
    console.log("Creating hotspots...");
    for (const hotspot of INITIAL_HOTSPOTS) {
      const categoryId = categoryMap.get(hotspot.categoryKey);
      if (categoryId) {
        await db.insert(hotspots).values({
          label: hotspot.label,
          top: hotspot.top,
          left: hotspot.left,
          categoryId,
        });
        console.log(`Created hotspot: ${hotspot.label}`);
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
