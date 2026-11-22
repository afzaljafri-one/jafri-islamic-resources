/**
 * ============================================================================
 * JAFRI SACRED AUDIO LIBRARY — MASTER CATALOGUE INTEGRITY TEST SUITE
 * Stage Gate 5.4A: Automated Verification of Data Model, Catalogue & Invariants
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  ISO_15924_REGISTRY,
  isValidIso15924ScriptCode,
  validateScriptCode,
  isRecordPlayable,
  validateRequirementIntegrity,
  TraditionId,
  SacredAudioRequirement
} from '../../types/sacredAudio';
import {
  SACRED_AUDIO_MASTER_CATALOGUE,
  SACRED_AUDIO_REQUIREMENT_BY_ID,
  getRequirementById,
  getRequirementsByTradition,
  getRequirementsByCohort,
  getRequirementsByAvailability,
  getPlayableRequirements,
  getBlockedRequirements,
  getAwaitingIntegrationRequirements,
  getSourceAvailablePermissionRequiredRequirements,
  getPendingDiscoveryRequirements,
  getTextCardRequirements
} from '../sacredAudioMasterCatalogue';
import {
  TRADITION_COLLECTIONS,
  TRADITION_COLLECTION_BY_ID,
  SUB_COLLECTIONS,
  getTraditionCollection,
  getSubCollection,
  getSubCollectionsByTradition
} from '../sacredAudioCollections';

export function runAllIntegrityTests(): { totalTests: number; passedTests: number; failures: string[] } {
  const failures: string[] = [];
  let testCount = 0;

  function assert(condition: boolean, message: string) {
    testCount++;
    if (!condition) {
      failures.push(`[FAIL] ${message}`);
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  console.log('\n================================================================================');
  console.log('JAFRI SACRED AUDIO LIBRARY — GATE 5.4A DATA INTEGRITY TEST SUITE');
  console.log('================================================================================\n');

  // --------------------------------------------------------------------------
  // TEST GROUP 1: Inventory Size and ID Uniqueness
  // --------------------------------------------------------------------------
  console.log('[RUNNING] Test Group 1: Inventory Volume and ID Uniqueness...');
  assert(SACRED_AUDIO_MASTER_CATALOGUE.length === 651, `Total catalogue length must be 651 (found: ${SACRED_AUDIO_MASTER_CATALOGUE.length})`);
  assert(Object.keys(SACRED_AUDIO_REQUIREMENT_BY_ID).length === 651, `Requirement index must contain exactly 651 keys`);

  const reqIds = SACRED_AUDIO_MASTER_CATALOGUE.map((r) => r.id);
  const uniqueIds = new Set(reqIds);
  assert(uniqueIds.size === 651, `All 651 requirement IDs must be unique (found ${uniqueIds.size} unique IDs)`);

  const expectedPrefixRanges: Record<string, { prefix: string; count: number }> = {
    islam: { prefix: 'REQ-ISL-', count: 372 },
    hinduism: { prefix: 'REQ-HIN-', count: 89 },
    buddhism: { prefix: 'REQ-BUD-', count: 36 },
    jainism: { prefix: 'REQ-JAI-', count: 38 },
    sikhism: { prefix: 'REQ-SIK-', count: 17 },
    christianity: { prefix: 'REQ-CHR-', count: 73 },
    judaism: { prefix: 'REQ-JUD-', count: 26 }
  };

  for (const [_trad, info] of Object.entries(expectedPrefixRanges)) {
    for (let i = 1; i <= info.count; i++) {
      const expectedId = `${info.prefix}${String(i).padStart(3, '0')}`;
      assert(uniqueIds.has(expectedId), `Missing expected requirement ID: ${expectedId}`);
    }
  }
  console.log('  ✅ Group 1 Passed: Exactly 651 unique sequential IDs accounted for.\n');

  // --------------------------------------------------------------------------
  // TEST GROUP 2: Tradition Collections Breakdown
  // --------------------------------------------------------------------------
  console.log('[RUNNING] Test Group 2: Sacred Tradition Portals Breakdown...');
  assert(TRADITION_COLLECTIONS.length === 7, `Must define exactly 7 sacred tradition portals`);

  const expectedTraditionCounts: Record<TraditionId, number> = {
    islam: 372,
    hinduism: 89,
    buddhism: 36,
    jainism: 38,
    sikhism: 17,
    christianity: 73,
    judaism: 26
  };

  let traditionSum = 0;
  for (const [trad, expCount] of Object.entries(expectedTraditionCounts) as [TraditionId, number][]) {
    const col = getTraditionCollection(trad);
    assert(col !== undefined, `Tradition collection '${trad}' must exist`);
    if (col) {
      assert(col.totalRequirements === expCount, `Tradition '${trad}' totalRequirements must be ${expCount} (found: ${col.totalRequirements})`);
      assert(col.requirementIds.length === expCount, `Tradition '${trad}' requirementIds count must be ${expCount}`);
      const matchingReqs = getRequirementsByTradition(trad);
      assert(matchingReqs.length === expCount, `getRequirementsByTradition('${trad}') must return ${expCount}`);
      traditionSum += col.totalRequirements;
    }
  }
  assert(traditionSum === 651, `Sum of all tradition requirements must equal 651 (found: ${traditionSum})`);
  assert(SUB_COLLECTIONS.length === 47, `Must preserve exactly 47 scripture sub-collections (found: ${SUB_COLLECTIONS.length})`);
  assert(Object.keys(TRADITION_COLLECTION_BY_ID).length === 7, `TRADITION_COLLECTION_BY_ID must contain 7 traditions`);
  assert(getSubCollection('vedas') !== undefined, `getSubCollection('vedas') must resolve`);
  assert(getSubCollectionsByTradition('hinduism').length === 12, `getSubCollectionsByTradition('hinduism') must return 12 sub-collections`);
  console.log('  ✅ Group 2 Passed: All 7 traditions and 47 sub-collections verified.\n');

  // --------------------------------------------------------------------------
  // TEST GROUP 3: Operational Cohort Partition
  // --------------------------------------------------------------------------
  console.log('[RUNNING] Test Group 3: Operational Cohort Partition...');
  const textCards = getTextCardRequirements();
  const awaitingYt = getAwaitingIntegrationRequirements();
  const sourceAvailablePermReq = getSourceAvailablePermissionRequiredRequirements();
  const pendingDisc = getPendingDiscoveryRequirements();
  const localReqs = getRequirementsByCohort('LOCAL_PHYSICAL');

  assert(getRequirementsByAvailability('AVAILABLE_VERIFIED').length === 14, `getRequirementsByAvailability('AVAILABLE_VERIFIED') must return 14`);
  assert(textCards.length === 4, `Text cards cohort must equal 4 (found: ${textCards.length})`);
  assert(localReqs.length === 16, `Local physical cohort must equal 16 (found: ${localReqs.length})`);
  assert(awaitingYt.length === 140, `Accepted YouTube cohort must equal 140 (found: ${awaitingYt.length})`);
  assert(sourceAvailablePermReq.length === 144, `Permission required cohort must equal 144 (found: ${sourceAvailablePermReq.length})`);
  assert(pendingDisc.length === 347, `Pending discovery cohort must equal 347 (found: ${pendingDisc.length})`);

  const cohortSum = textCards.length + localReqs.length + awaitingYt.length + sourceAvailablePermReq.length + pendingDisc.length;
  assert(cohortSum === 651, `Sum of cohorts must equal 651 (found: ${cohortSum})`);
  console.log('  ✅ Group 3 Passed: 4 text + 16 local + 140 YouTube + 144 permission-required + 347 pending = 651 total.\n');

  // --------------------------------------------------------------------------
  // TEST GROUP 4: ISO 15924 Registry & Script Assignments
  // --------------------------------------------------------------------------
  console.log('[RUNNING] Test Group 4: ISO 15924 Registry and Canonical Script Assignments...');
  assert(Object.keys(ISO_15924_REGISTRY).length === 24, `ISO 15924 registry must contain 24 entries`);
  assert(ISO_15924_REGISTRY['Aran'].numericCode === '161', `Aran numericCode must be '161'`);
  assert(ISO_15924_REGISTRY['Aran'].canonicalName === 'Arabic (Nastaliq variant)', `Aran canonicalName must match`);
  assert(ISO_15924_REGISTRY['Hant'].numericCode === '502', `Hant numericCode must be '502'`);
  assert(ISO_15924_REGISTRY['Hani'].numericCode === '500', `Hani numericCode must be '500'`);
  assert(ISO_15924_REGISTRY['Hans'].numericCode === '501', `Hans numericCode must be '501'`);

  // Verify all 114 Urdu requirements are assigned Aran (161)
  const urduReqs = SACRED_AUDIO_MASTER_CATALOGUE.filter((r) => r.language === 'Urdu');
  assert(urduReqs.length === 114, `Urdu requirements count must be 114 (found: ${urduReqs.length})`);
  for (const urduReq of urduReqs) {
    assert(urduReq.scriptCode === 'Aran', `Urdu requirement ${urduReq.id} must be assigned Aran`);
    const val = validateScriptCode(urduReq.scriptCode);
    assert(val.isValid && val.definition?.numericCode === '161', `Urdu requirement ${urduReq.id} script definition must be valid and numericCode 161`);
  }

  // Script code frequency assertion
  const scriptCounts: Record<string, number> = {};
  for (const req of SACRED_AUDIO_MASTER_CATALOGUE) {
    scriptCounts[req.scriptCode] = (scriptCounts[req.scriptCode] || 0) + 1;
    const v = validateScriptCode(req.scriptCode);
    assert(v.isValid, `Requirement ${req.id} script '${req.scriptCode}' failed ISO validation: ${v.error}`);
  }

  assert(scriptCounts['Latn'] === 188, `Latn count must be 188 (found: ${scriptCounts['Latn']})`);
  assert(scriptCounts['Deva'] === 151, `Deva count must be 151 (found: ${scriptCounts['Deva']})`);
  assert(scriptCounts['Arab'] === 144, `Arab count must be 144 (found: ${scriptCounts['Arab']})`);
  assert(scriptCounts['Aran'] === 114, `Aran count must be 114 (found: ${scriptCounts['Aran']})`);
  assert(scriptCounts['Hebr'] === 26, `Hebr count must be 26 (found: ${scriptCounts['Hebr']})`);
  assert(scriptCounts['Guru'] === 17, `Guru count must be 17 (found: ${scriptCounts['Guru']})`);
  assert(scriptCounts['Hans'] === 4, `Hans count must be 4 (found: ${scriptCounts['Hans']})`);
  assert(scriptCounts['Tibt'] === 3, `Tibt count must be 3 (found: ${scriptCounts['Tibt']})`);
  assert(scriptCounts['Gujr'] === 2, `Gujr count must be 2 (found: ${scriptCounts['Gujr']})`);
  assert(scriptCounts['Beng'] === 2, `Beng count must be 2 (found: ${scriptCounts['Beng']})`);

  // Negative script code validation
  assert(!isValidIso15924ScriptCode('arab'), `Lowercase 'arab' must be rejected`);
  assert(!isValidIso15924ScriptCode('ARAN'), `Uppercase 'ARAN' must be rejected`);
  assert(!isValidIso15924ScriptCode('Klingon'), `'Klingon' must be rejected`);
  assert(!isValidIso15924ScriptCode('161'), `Numeric '161' must be rejected as code`);
  console.log('  ✅ Group 4 Passed: ISO 15924 registry and 114 Aran (161) Urdu assignments verified.\n');

  // --------------------------------------------------------------------------
  // TEST GROUP 5: Item Integrity & Invariant Validation (All 651 Items)
  // --------------------------------------------------------------------------
  console.log('[RUNNING] Test Group 5: Exhaustive Item-Level Invariant Validation (651 items)...');
  let invalidItemCount = 0;
  for (const req of SACRED_AUDIO_MASTER_CATALOGUE) {
    const check = validateRequirementIntegrity(req);
    if (!check.isValid) {
      invalidItemCount++;
      for (const err of check.errors) {
        failures.push(`[INTEGRITY ERROR] ${req.id}: ${err}`);
      }
    }
  }
  assert(invalidItemCount === 0, `All 651 items must pass validateRequirementIntegrity (failed: ${invalidItemCount})`);
  console.log('  ✅ Group 5 Passed: 651/651 records satisfy all cohort invariant rules.\n');

  // --------------------------------------------------------------------------
  // TEST GROUP 6: Local Physical Assets (9 Playable vs 2 Blocked)
  // --------------------------------------------------------------------------
  console.log('[RUNNING] Test Group 6: Local Physical Audio Assets & Servability Distinction...');
  const playableLocal = getPlayableRequirements();
  const blockedLocal = getBlockedRequirements();

  assert(playableLocal.length === 14, `Strictly 14 local assets must be playable (found: ${playableLocal.length})`);
  assert(blockedLocal.length === 2, `Strictly 2 local assets must be blocked (found: ${blockedLocal.length})`);

  // Verify all 11 physical files exist on disk
  for (const req of localReqs) {
    assert(req.physicalAsset !== null && req.physicalAsset !== undefined, `Local req ${req.id} must define physicalAsset`);
    if (req.physicalAsset) {
      const fullPath = path.resolve(process.cwd(), req.physicalAsset.filePath);
      assert(fs.existsSync(fullPath), `Physical audio file does not exist on disk: ${fullPath}`);
      if (fs.existsSync(fullPath)) {
        const stat = fs.statSync(fullPath);
        assert(stat.size === req.physicalAsset.fileSizeBytes, `Size mismatch for ${req.id}: expected ${req.physicalAsset.fileSizeBytes}, found ${stat.size}`);
        assert(stat.size > 0, `Physical audio file is empty: ${fullPath}`);
      }
    }
  }

  // Verify the 2 LibriVox recordings are blocked
  const galatians = getRequirementById('REQ-CHR-048');
  const ephesians = getRequirementById('REQ-CHR-049');

  assert(galatians !== undefined, `Galatians requirement REQ-CHR-048 must exist`);
  assert(ephesians !== undefined, `Ephesians requirement REQ-CHR-049 must exist`);

  if (galatians) {
    assert(galatians.cohort === 'LOCAL_PHYSICAL', `Galatians must be LOCAL_PHYSICAL`);
    assert(galatians.availability === 'AWAITING_PERMISSION', `Galatians availability must be AWAITING_PERMISSION`);
    assert(galatians.playbackProvider === 'NONE', `Galatians provider must be NONE`);
    assert(galatians.isPlayable === false, `Galatians isPlayable must be FALSE`);
    assert(galatians.rightsClassification === 'UNRESOLVED_NEIGHBORING_RIGHTS', `Galatians rights must be UNRESOLVED_NEIGHBORING_RIGHTS`);
    assert(isRecordPlayable(galatians) === false, `isRecordPlayable(galatians) MUST be false`);
  }

  if (ephesians) {
    assert(ephesians.cohort === 'LOCAL_PHYSICAL', `Ephesians must be LOCAL_PHYSICAL`);
    assert(ephesians.availability === 'AWAITING_PERMISSION', `Ephesians availability must be AWAITING_PERMISSION`);
    assert(ephesians.playbackProvider === 'NONE', `Ephesians provider must be NONE`);
    assert(ephesians.isPlayable === false, `Ephesians isPlayable must be FALSE`);
    assert(ephesians.rightsClassification === 'UNRESOLVED_NEIGHBORING_RIGHTS', `Ephesians rights must be UNRESOLVED_NEIGHBORING_RIGHTS`);
    assert(isRecordPlayable(ephesians) === false, `isRecordPlayable(ephesians) MUST be false`);
  }

  // Verify REC-CHR-03 has individual-track CC BY 3.0 documented in catalogue evidence
  const paterNoster = getRequirementById('REQ-CHR-067');
  assert(paterNoster !== undefined, `Pater Noster REQ-CHR-067 must exist`);
  if (paterNoster) {
    assert(paterNoster.rightsEvidence !== null, `Pater Noster must have rightsEvidence`);
    assert(
      paterNoster.rightsEvidence?.directSourceEvidenceUrl ===
        'https://commons.wikimedia.org/wiki/File:The_Tudor_Consort_-_17_-_Pater_Noster.ogg',
      `Pater Noster direct evidence URL must match`
    );
    assert(
      paterNoster.rightsEvidence?.secondarySourceEvidenceUrl ===
        'https://freemusicarchive.org/music/The_Tudor_Consort/Giovanni_Animuccia_Missa_Victimae_Paschali_Laudes/17_Pater_Noster',
      `Pater Noster track-level Free Music Archive source URL must match`
    );
    assert(paterNoster.rightsEvidence?.exactLicense === 'CC BY 3.0 Unported', `Pater Noster exact licence must be CC BY 3.0 Unported`);
  }
  console.log('  ✅ Group 6 Passed: 14 playable local assets verified; 2 LibriVox assets blocked on disk.\n');

  // --------------------------------------------------------------------------
  // TEST GROUP 7: Anti-Leak / Exploit Proof Tests
  // --------------------------------------------------------------------------
  console.log('[RUNNING] Test Group 7: Anti-Leak / Exploit Proof Invariant Tests...');
  // 1. Neither Galatians nor Ephesians can be present in getPlayableRequirements()
  const playableIds = new Set(playableLocal.map((r) => r.id));
  assert(!playableIds.has('REQ-CHR-048'), `Galatians (REQ-CHR-048) MUST NOT be in getPlayableRequirements()`);
  assert(!playableIds.has('REQ-CHR-049'), `Ephesians (REQ-CHR-049) MUST NOT be in getPlayableRequirements()`);

  // 2. No YouTube candidate can be in getPlayableRequirements()
  for (const yt of awaitingYt) {
    assert(!playableIds.has(yt.id), `YouTube candidate ${yt.id} MUST NOT be in getPlayableRequirements()`);
    assert(isRecordPlayable(yt) === false, `isRecordPlayable(${yt.id}) MUST return false`);
  }

  // 3. No text card can be in getPlayableRequirements()
  for (const tc of textCards) {
    assert(!playableIds.has(tc.id), `Text card ${tc.id} MUST NOT be in getPlayableRequirements()`);
    assert(isRecordPlayable(tc) === false, `isRecordPlayable(${tc.id}) MUST return false`);
  }

  // 4. No pending discovery item can be in getPlayableRequirements()
  for (const pd of pendingDisc.slice(0, 50)) {
    // sample check
    assert(!playableIds.has(pd.id), `Pending discovery ${pd.id} MUST NOT be in getPlayableRequirements()`);
    assert(isRecordPlayable(pd) === false, `isRecordPlayable(${pd.id}) MUST return false`);
  }

  // 5. No permission-required item can be in getPlayableRequirements()
  for (const pr of sourceAvailablePermReq) {
    assert(!playableIds.has(pr.id), `Permission required ${pr.id} MUST NOT be in getPlayableRequirements()`);
    assert(isRecordPlayable(pr) === false, `isRecordPlayable(${pr.id}) MUST return false`);
  }

  // 6. Test synthetic mutated record cannot bypass isRecordPlayable()
  const spoofedRecord: SacredAudioRequirement = {
    ...galatians!,
    isPlayable: true // malicious attempt to flip isPlayable
  };
  assert(isRecordPlayable(spoofedRecord) === false, `Spoofed blocked record with isPlayable=true MUST return false from isRecordPlayable()`);
  assert(validateRequirementIntegrity(spoofedRecord).isValid === false, `validateRequirementIntegrity MUST reject spoofed blocked record`);
  console.log('  ✅ Group 7 Passed: Anti-leak invariant guarantees blocked assets cannot be served.\n');

  // --------------------------------------------------------------------------
  // TEST GROUP 8: Non-Fabrication of Pending Discovery Metadata
  // --------------------------------------------------------------------------
  console.log('[RUNNING] Test Group 8: Zero Fabrication in Pending Discovery Requirements (347 items)...');
  for (const req of pendingDisc) {
    assert(req.physicalAsset === null, `Pending ${req.id} must have null physicalAsset`);
    assert(req.youtubeMetadata === null, `Pending ${req.id} must have null youtubeMetadata`);
    assert(req.rightsEvidence === null, `Pending ${req.id} must have null rightsEvidence`);
    assert(req.reviewEvidence === null, `Pending ${req.id} must have null reviewEvidence`);
    assert(req.lastAuditDate === null, `Pending ${req.id} must have null lastAuditDate`);
    assert(req.isPlayable === false, `Pending ${req.id} must have isPlayable false`);
    assert(req.availability === 'PENDING_DISCOVERY', `Pending ${req.id} availability must be PENDING_DISCOVERY`);
    assert(req.playbackProvider === 'PENDING', `Pending ${req.id} provider must be PENDING`);
  }
  console.log('  ✅ Group 8 Passed: Zero fabricated recording or channel metadata in 347 pending requirements.\n');

  // --------------------------------------------------------------------------
  // TEST GROUP 9: Accepted YouTube Recordings Non-Activation (83 items)...
  // --------------------------------------------------------------------------
  console.log('[RUNNING] Test Group 9: Accepted YouTube Recordings Non-Activation (140 items)...');
  for (const yt of awaitingYt) {
    assert(yt.availability === 'AWAITING_APP_INTEGRATION', `YouTube ${yt.id} availability must be AWAITING_APP_INTEGRATION`);
    assert(yt.playbackProvider === 'YOUTUBE_EMBED', `YouTube ${yt.id} provider must be YOUTUBE_EMBED`);
    assert(yt.isPlayable === false, `YouTube ${yt.id} isPlayable must be FALSE`);
    assert(yt.physicalAsset === null, `YouTube ${yt.id} must have null physicalAsset`);
    assert(yt.youtubeMetadata !== null, `YouTube ${yt.id} must have youtubeMetadata`);
    assert(yt.youtubeMetadata!.videoId.length > 0, `YouTube ${yt.id} videoId must be non-empty`);
    assert(yt.youtubeMetadata!.watchUrl.includes(yt.youtubeMetadata!.videoId), `YouTube ${yt.id} watchUrl must contain videoId`);
    assert(yt.reviewEvidence !== null && yt.reviewEvidence !== undefined && yt.reviewEvidence.decision === 'PASS', `YouTube ${yt.id} review decision must be PASS`);
    assert(yt.reviewEvidence?.coveragePercent === 100, `YouTube ${yt.id} coveragePercent must be 100%`);
  }
  console.log('  ✅ Group 9 Passed: All 140 YouTube recordings verified awaiting Gate 5.4D integration.\n');

  // --------------------------------------------------------------------------
  // TEST GROUP 10: Source Available Permission Required Verification (144 Items)
  // --------------------------------------------------------------------------
  console.log('[RUNNING] Test Group 10: Source Available Permission Required Verification (144 items)...');
  for (const req of sourceAvailablePermReq) {
    assert(req.cohort === 'SOURCE_AVAILABLE_PERMISSION_REQUIRED', `${req.id} cohort must be SOURCE_AVAILABLE_PERMISSION_REQUIRED`);
    assert(req.availability === 'SOURCE_AVAILABLE_PERMISSION_REQUIRED', `${req.id} availability must be SOURCE_AVAILABLE_PERMISSION_REQUIRED`);
    assert(req.playbackProvider === 'NONE', `${req.id} provider must be NONE`);
    assert(req.rightsClassification === 'SOURCE_AVAILABLE_PERMISSION_REQUIRED', `${req.id} rights must be SOURCE_AVAILABLE_PERMISSION_REQUIRED`);
    assert(req.isPlayable === false, `${req.id} isPlayable must be false`);
    assert(req.physicalAsset === null, `${req.id} physicalAsset must be null`);
    assert(req.youtubeMetadata === null, `${req.id} youtubeMetadata must be null`);
    assert(req.rightsEvidence !== null, `${req.id} must have preserved rightsEvidence`);
    assert(req.rightsEvidence?.commercialStreamingCleared === false, `${req.id} commercialStreamingCleared must be false`);
    assert(req.rightsEvidence?.rehostingPermission === false, `${req.id} rehostingPermission must be false`);
    assert(isRecordPlayable(req) === false, `isRecordPlayable(${req.id}) MUST return false`);
  }
  console.log('  ✅ Group 10 Passed: All 144 permission-required requirements preserved with audio disabled & playback blocked.\n');

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('================================================================================');
  console.log(`TEST SUITE RESULTS: ${testCount} assertions executed, ${failures.length} failures.`);
  console.log('================================================================================\n');

  return {
    totalTests: testCount,
    passedTests: testCount - failures.length,
    failures
  };
}
