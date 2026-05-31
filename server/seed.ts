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
    // ✅ 기존 데이터 보호: categories 또는 standards가 있으면 seed 건너뜀
    const existingCategories = await db.select().from(categories);
    const existingStandards = await db.select().from(standards);

    if (existingCategories.length > 0 || existingStandards.length > 0) {
      console.log(
        `[SEED SKIP] 기존 데이터가 있어 seed를 건너뜁니다. ` +
        `(categories: ${existingCategories.length}개, standards: ${existingStandards.length}개)`
      );
      console.log("[SEED SKIP] 사용자 데이터를 보호합니다.");
      return;
    }

    // 데이터가 없는 경우에만 초기 데이터 생성 (최초 설치 시)
    console.log("Starting database seed (fresh install)...");

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
