import { getCrossMediaRecommendations } from "./services/crossMediaEngine.js";
import { initDb } from "./db/index.js";

async function runTests() {
  await initDb();

  const testCases = [
    { name: "Taxi Driver", query: "Taxi Driver" },
    { name: "Oppenheimer", query: "Oppenheimer" },
    { name: "Interstellar", query: "Interstellar" },
    { name: "The Dark Knight", query: "The Dark Knight" },
    { name: "Dune", query: "Dune" },
    { name: "Dark", query: "Dark" },
    { name: "Severance", query: "Severance" },
    { name: "The Three-Body Problem", query: "The Three-Body Problem" },
    { name: "1984", query: "1984" },
    { name: "Old School", query: "Old School" }
  ];

  console.log("=================================================================");
  console.log("MOVLIB STORY-FIRST RECOMMENDATION ENGINE — REGRESSION TEST SUITE");
  console.log("=================================================================\n");

  for (const tc of testCases) {
    console.log(`\n-------------------------------------------------------------`);
    console.log(`TEST TARGET: ${tc.name} (Query: "${tc.query}")`);
    console.log(`-------------------------------------------------------------`);

    try {
      const res = await getCrossMediaRecommendations(tc.query, { debug: true, limitPerCategory: 3 });
      
      console.log(`[SOURCE IDENTIFIED]: "${res.source.title}" (${res.source.year}) [${res.source.type}]`);
      console.log(`  Premise: ${res.source.premise}`);
      console.log(`  Narrative Structure: ${res.source.narrativeStructure}`);
      console.log(`  Protagonist Role: ${res.source.protagonistRole}`);

      console.log(`\n  [RECOMMENDED MOVIES]:`);
      if (!res.recommendations.movies.length) console.log(`    None (gate applied)`);
      for (const m of res.recommendations.movies) {
        console.log(`    * ${m.title} (${m.year}) [Score: ${m.matchScore}%] - Why: ${m.why}`);
      }

      console.log(`\n  [RECOMMENDED TV SHOWS]:`);
      if (!res.recommendations.tv.length) console.log(`    None (gate applied)`);
      for (const t of res.recommendations.tv) {
        console.log(`    * ${t.title} (${t.year}) [Score: ${t.matchScore}%] - Why: ${t.why}`);
      }

      console.log(`\n  [RECOMMENDED BOOKS]:`);
      if (!res.recommendations.books.length) console.log(`    None (gate applied)`);
      for (const b of res.recommendations.books) {
        console.log(`    * ${b.title} (${b.year}) [Score: ${b.matchScore}%] - Why: ${b.why}`);
      }

      // Verification assertions
      if (tc.name === "Taxi Driver") {
        const movieTitles = res.recommendations.movies.map(m => m.title.toLowerCase());
        const tvTitles = res.recommendations.tv.map(t => t.title.toLowerCase());
        const bookTitles = res.recommendations.books.map(b => b.title.toLowerCase());

        const hasProcedural = [...movieTitles, ...tvTitles, ...bookTitles].some(t => 
          t.includes("law & order") || t.includes("csi") || t.includes("castle") || t.includes("alien crimes")
        );

        if (hasProcedural) {
          console.error(`  [FAIL] Procedural found in Taxi Driver recommendations!`);
        } else {
          console.log(`  [PASS] Successfully rejected generic crime procedurals.`);
        }

        const hasPsychDescent = movieTitles.some(t => t.includes("joker") || t.includes("nightcrawler")) ||
                               tvTitles.some(t => t.includes("mr. robot")) ||
                               bookTitles.some(t => t.includes("notes from underground") || t.includes("crime and punishment"));
        if (hasPsychDescent) {
          console.log(`  [PASS] Successfully recommended psychological descent / alienation stories!`);
        }
      }
    } catch (err) {
      console.error(`  [ERROR]:`, err);
    }
  }

  console.log("\n=================================================================");
  console.log("TEST SUITE COMPLETE");
  console.log("=================================================================");
}

runTests();
