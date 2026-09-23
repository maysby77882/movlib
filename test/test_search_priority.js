/**
 * Test Suite: Movlib Search Priority & Source Fallback Verification
 */

import { performUnifiedSearch } from "../services/unifiedSearch.js";
import { searchWikipedia, identifyWikipediaEntity } from "../services/wikipedia.js";
import { searchEntities, getCrossMediaRecommendations } from "../services/crossMediaEngine.js";

async function runTests() {
  console.log("==================================================");
  console.log("Running Movlib Search Priority & Fallback Tests");
  console.log("==================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${message}`);
    }
  }

  // TEST 1: Wikipedia Entity Classifier
  console.log("[Test Group 1: Wikipedia Entity Classification]");
  const filmEntity = identifyWikipediaEntity("The Proposal (2009 film)", "The Proposal is a 2009 American romantic comedy film directed by Anne Fletcher.");
  assert(filmEntity.type === "Movie", "Classifies '(2009 film)' as Movie");
  assert(filmEntity.year === "2009", "Extracts year 2009 from film title/extract");
  assert(filmEntity.creator === "Anne Fletcher", "Extracts director Anne Fletcher");

  const tvEntity = identifyWikipediaEntity("Business Proposal", "Business Proposal is a South Korean romantic comedy television series.");
  assert(tvEntity.type === "TV Show", "Classifies television series as TV Show");

  const bookEntity = identifyWikipediaEntity("Dune (novel)", "Dune is a 1965 epic science fiction novel by Frank Herbert.");
  assert(bookEntity.type === "Book", "Classifies novel as Book");
  assert(bookEntity.year === "1965", "Extracts year 1965 from book extract");

  const disambigEntity = identifyWikipediaEntity("Proposal (disambiguation)", "Proposal may refer to:");
  assert(disambigEntity.isDisambiguation === true, "Flags disambiguation page correctly");

  // TEST 2: Wikipedia Live Official Search
  console.log("\n[Test Group 2: Wikipedia Live Official API]");
  const wikiResults = await searchWikipedia("Indecent Proposal");
  assert(Array.isArray(wikiResults), "Returns array of Wikipedia results");
  assert(wikiResults.length > 0, "Finds matching Wikipedia articles");
  assert(wikiResults.every(r => r.source === "wikipedia"), "All results have source: 'wikipedia'");
  assert(wikiResults[0].externalUrl.startsWith("https://en.wikipedia.org/"), "Provides valid Wikipedia article URL");

  // TEST 3: Primary Source Search Priority (TMDB vs Wikipedia)
  console.log("\n[Test Group 3: Primary Source Search Priority]");
  
  // Case A: TMDB unconfigured or empty -> should fallback to Wikipedia for movies/TV
  const fallbackSearch = await performUnifiedSearch("The Proposal", { tmdbApiKey: "" });
  assert(fallbackSearch.sourcePriority.moviesTv === "wikipedia", "Falls back to Wikipedia for Movies/TV when TMDB yields 0 results");
  assert(fallbackSearch.results.movies.length > 0 || fallbackSearch.results.tv.length > 0 || fallbackSearch.results.fallback.length > 0, "Returns normalized Wikipedia results in fallback scenario");

  // Case B: Open Library search for books
  assert(fallbackSearch.results.books.length > 0, "Open Library finds books for query");
  assert(fallbackSearch.sourcePriority.books === "openlibrary", "Open Library remains primary source for books");

  // TEST 4: Nonexistent title handling
  console.log("\n[Test Group 4: Nonexistent Query Handling]");
  const nonExistentSearch = await performUnifiedSearch("zzqxj_completely_nonexistent_title_9988");
  assert(nonExistentSearch.counts.total === 0, "Returns 0 total counts for non-existent title");
  assert(nonExistentSearch.results.movies.length === 0, "Movies array is empty for non-existent title");
  assert(nonExistentSearch.results.tv.length === 0, "TV array is empty for non-existent title");
  assert(nonExistentSearch.results.books.length === 0, "Books array is empty for non-existent title");

  // TEST 5: Entity Disambiguation & Cross-Media Recommendations
  console.log("\n[Test Group 5: Cross-Media Recommendations]");
  const recs = await getCrossMediaRecommendations("Dune", {});
  assert(recs.source !== null, "Resolves source entity for Dune");
  assert(recs.recommendations.movies.length > 0, "Produces movie recommendations");
  assert(recs.recommendations.tv.length > 0, "Produces TV recommendations");
  assert(recs.recommendations.books.length > 0, "Produces book recommendations");

  console.log("\n==================================================");
  console.log(`Test Results: ${passed} / ${total} passed`);
  console.log("==================================================");

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
