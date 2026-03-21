import { storage } from "./storage";

async function seedHotspots() {
  const existing = await storage.getAllHotspots();
  if (existing.length > 0) {
    console.log("Hotspots already exist, skipping seed");
    return;
  }

  const hotspots = [
    { label: "기계실", top: "8%", left: "72%" },
    { label: "승강로", top: "40%", left: "50%" },
    { label: "카 내", top: "55%", left: "50%" },
    { label: "피트",   top: "88%", left: "50%" },
  ];

  for (const h of hotspots) {
    await storage.createHotspot(h);
    console.log(`Created hotspot: ${h.label}`);
  }

  console.log("Hotspot seed complete!");
}

seedHotspots().catch(console.error);
