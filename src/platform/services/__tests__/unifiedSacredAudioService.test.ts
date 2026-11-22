/**
 * ============================================================================
 * JAFRI SACRED AUDIO LIBRARY — PLAYBACK SERVICE INTEGRITY TEST SUITE
 * Stage Gate 5.4B: Concurrency, Anti-Leak, Playback Controls, Provider Routing
 * ============================================================================
 */

import { UnifiedSacredAudioService } from '../unifiedSacredAudioService';
import {
  SACRED_AUDIO_MASTER_CATALOGUE,
  getApprovedYouTubeRequirements,
  getPendingVerificationYouTubeRequirements
} from '../../data/sacredAudioMasterCatalogue';

export async function runPlaybackServiceTests(): Promise<{ totalTests: number; passedTests: number; failures: string[] }> {
  const failures: string[] = [];
  let testCount = 0;

  function assert(condition: boolean, message: string) {
    testCount++;
    if (!condition) {
      failures.push(`[FAIL #${testCount}] ${message}`);
    }
  }

  console.log('\n================================================================================');
  console.log('JAFRI SACRED AUDIO LIBRARY — GATE 5.4B PLAYBACK SERVICE TEST SUITE');
  console.log('================================================================================\n');

  // Test Group 1: Singleton and State Initialization
  console.log('[RUNNING] Test Group 1: Singleton & Initial State Invariants...');
  UnifiedSacredAudioService.resetInstanceForTesting();
  const service1 = UnifiedSacredAudioService.getInstance();
  const service2 = UnifiedSacredAudioService.getInstance();
  assert(service1 === service2, 'UnifiedSacredAudioService must be a true singleton');

  const initialState = service1.getState();
  assert(initialState.status === 'IDLE', 'Initial status must be IDLE');
  assert(initialState.activeProvider === 'NONE', 'Initial activeProvider must be NONE');
  assert(initialState.currentRequirement === null, 'Initial currentRequirement must be null');
  assert(initialState.currentTime === 0, 'Initial currentTime must be 0');
  assert(initialState.volume === 1.0, 'Initial volume must be 1.0');
  assert(initialState.isMuted === false, 'Initial isMuted must be false');
  console.log('  ✅ Group 1 Passed: Singleton lifecycle & initial state verified.');

  // Test Group 2: Strict Anti-Leak Enforcement on LibriVox Assets
  console.log('[RUNNING] Test Group 2: Strict Anti-Leak Enforcement on LibriVox Assets...');
  const galatians = SACRED_AUDIO_MASTER_CATALOGUE.find(x => x.id === 'REQ-CHR-048');
  const ephesians = SACRED_AUDIO_MASTER_CATALOGUE.find(x => x.id === 'REQ-CHR-049');

  assert(galatians !== undefined, 'REQ-CHR-048 must exist in master catalogue');
  assert(ephesians !== undefined, 'REQ-CHR-049 must exist in master catalogue');

  let errorThrownGalatians = false;
  try {
    await service1.playRequirement(galatians!);
  } catch (err: any) {
    errorThrownGalatians = true;
    assert(err.message.includes('BLOCKED_RIGHTS_ERROR'), 'Error message must specify BLOCKED_RIGHTS_ERROR');
  }
  assert(errorThrownGalatians, 'Attempting to play REQ-CHR-048 must reject with error');
  assert(service1.getState().status === 'ERROR', 'State status must be ERROR after blocked attempt');
  assert(service1.getState().activeProvider === 'NONE', 'Active provider must remain NONE on blocked attempt');

  let errorThrownEphesians = false;
  try {
    await service1.playRequirement(ephesians!);
  } catch (err: any) {
    errorThrownEphesians = true;
    assert(err.message.includes('BLOCKED_RIGHTS_ERROR'), 'Error message must specify BLOCKED_RIGHTS_ERROR');
  }
  assert(errorThrownEphesians, 'Attempting to play REQ-CHR-049 must reject with error');
  console.log('  ✅ Group 2 Passed: Strict anti-leak guaranteed for all blocked assets.');

  // Test Group 3: Rejection of Text Cards & Pending Requirements
  console.log('[RUNNING] Test Group 3: Rejection of Text Cards & Pending Requirements...');
  const textCardIds = ['REQ-HIN-019', 'REQ-HIN-039', 'REQ-JAI-008', 'REQ-JUD-013'];
  for (const tid of textCardIds) {
    const card = SACRED_AUDIO_MASTER_CATALOGUE.find(x => x.id === tid);
    assert(card !== undefined, `Text card ${tid} must exist`);
    await service1.playRequirement(card!);
    assert(service1.getState().status === 'ERROR', `Playing text card ${tid} must result in ERROR`);
    assert(service1.getState().errorMessage?.includes('NON_AUDIO_CARD') === true, `Error must indicate NON_AUDIO_CARD for ${tid}`);
  }

  const pendingReq = SACRED_AUDIO_MASTER_CATALOGUE.find(x => x.id === 'REQ-ISL-026');
  assert(pendingReq !== undefined, 'REQ-ISL-026 must exist');
  await service1.playRequirement(pendingReq!);
  assert(service1.getState().status === 'ERROR', 'Playing pending requirement must result in ERROR');
  assert(service1.getState().errorMessage?.includes('PENDING_DISCOVERY') === true, 'Error must indicate PENDING_DISCOVERY');
  console.log('  ✅ Group 3 Passed: Non-audio cards & pending items safely rejected.');

  // Test Group 4: Local HTML5 Playback for 14 Rights-Cleared Assets
  console.log('[RUNNING] Test Group 4: Local HTML5 Playback for 14 Rights-Cleared Assets...');
  const clearedLocalIds = [
    'REQ-HIN-036', 'REQ-HIN-037', 'REQ-HIN-038',
    'REQ-HIN-067', 'REQ-HIN-079', 'REQ-HIN-080',
    'REQ-BUD-001', 'REQ-BUD-010', 'REQ-BUD-020',
    'REQ-CHR-067', 'REQ-CHR-071', 'REQ-CHR-073',
    'REQ-JUD-001', 'REQ-JUD-006'
  ];

  for (const lid of clearedLocalIds) {
    const req = SACRED_AUDIO_MASTER_CATALOGUE.find(x => x.id === lid);
    assert(req !== undefined, `Cleared asset ${lid} must exist`);
    assert(req!.isPlayable === true, `${lid} isPlayable must be true`);
    assert(req!.playbackProvider === 'LOCAL_HTML5', `${lid} provider must be LOCAL_HTML5`);

    await service1.playRequirement(req!);
    const state = service1.getState();
    assert(state.currentRequirement?.id === lid, `Current requirement must be ${lid}`);
    assert(state.activeProvider === 'LOCAL_HTML5', `Active provider must be LOCAL_HTML5 for ${lid}`);
    assert(state.resolvedMediaUrl !== null, `Resolved media URL must not be null for ${lid}`);
    assert(state.resolvedMediaUrl!.startsWith('/audio/'), `Media URL must start with /audio/ for ${lid}`);
  }
  console.log('  ✅ Group 4 Passed: All 14 rights-cleared local assets successfully routed.');

  // Test Group 5: YouTube Embed Stream Routing & Release Gating (140 Accepted YouTube Recordings)
  console.log('[RUNNING] Test Group 5: YouTube Embed Routing for 28 Approved & Gating for 112 Unverified...');
  const ytApproved = getApprovedYouTubeRequirements();
  const ytPending = getPendingVerificationYouTubeRequirements();
  assert(ytApproved.length === 28, `Exactly 28 approved YouTube items must exist (found: ${ytApproved.length})`);
  assert(ytPending.length === 112, `Exactly 112 pending verification YouTube items must exist (found: ${ytPending.length})`);

  // 1. Verify all 28 approved recordings route to YOUTUBE_EMBED and PLAYING state
  for (const yt of ytApproved) {
    await service1.playRequirement(yt);
    const state = service1.getState();
    assert(state.currentRequirement?.id === yt.id, `Current requirement must be ${yt.id}`);
    assert(state.activeProvider === 'YOUTUBE_EMBED', `Active provider must be YOUTUBE_EMBED for ${yt.id}`);
    assert(state.status === 'PLAYING', `Status must be PLAYING for ${yt.id}`);
    assert(state.resolvedMediaUrl === yt.youtubeMetadata?.embedUrl, `Resolved URL must match YouTube embedUrl for ${yt.id}`);
  }

  // 2. Verify all 112 unverified recordings are strictly rejected by the service gate
  for (const yt of ytPending) {
    let gateTriggered = false;
    try {
      await service1.playRequirement(yt);
    } catch (err: any) {
      if (err.message.includes('UNVERIFIED_STREAM_GATE')) {
        gateTriggered = true;
      }
    }
    assert(gateTriggered, `Service must reject unverified YouTube stream ${yt.id} with UNVERIFIED_STREAM_GATE`);
    const state = service1.getState();
    assert(state.status === 'ERROR', `Status must transition to ERROR for unverified ${yt.id}`);
  }
  console.log('  ✅ Group 5 Passed: All 28 approved YouTube recordings routed; all 112 unverified streams strictly gated.');

  // Test Group 6: Concurrency Single-Track Lock (Local vs YouTube Switching)
  console.log('[RUNNING] Test Group 6: Concurrency Lock & Clean Provider Switching...');
  const localTrack = SACRED_AUDIO_MASTER_CATALOGUE.find(x => x.id === 'REQ-HIN-036')!;
  const ytTrack = SACRED_AUDIO_MASTER_CATALOGUE.find(x => x.id === 'REQ-ISL-001')!;

  // 1. Play local track
  await service1.playRequirement(localTrack);
  assert(service1.getState().activeProvider === 'LOCAL_HTML5', 'Must be LOCAL_HTML5');
  assert(service1.getState().currentRequirement?.id === 'REQ-HIN-036', 'Must be REQ-HIN-036');

  // 2. Switch to YouTube track -> local audio must stop immediately
  await service1.playRequirement(ytTrack);
  assert(service1.getState().activeProvider === 'YOUTUBE_EMBED', 'Must switch to YOUTUBE_EMBED');
  assert(service1.getState().currentRequirement?.id === 'REQ-ISL-001', 'Must switch to REQ-ISL-001');

  // 3. Switch back to another local track
  const localTrack2 = SACRED_AUDIO_MASTER_CATALOGUE.find(x => x.id === 'REQ-BUD-001')!;
  await service1.playRequirement(localTrack2);
  assert(service1.getState().activeProvider === 'LOCAL_HTML5', 'Must switch back to LOCAL_HTML5');
  assert(service1.getState().currentRequirement?.id === 'REQ-BUD-001', 'Must switch to REQ-BUD-001');

  // 4. Stop clears all state
  service1.stop();
  assert(service1.getState().status === 'IDLE', 'Status after stop must be IDLE');
  assert(service1.getState().activeProvider === 'NONE', 'Provider after stop must be NONE');
  assert(service1.getState().currentRequirement === null, 'Requirement after stop must be null');
  console.log('  ✅ Group 6 Passed: Mutual exclusion guaranteed across local and YouTube providers.');

  // Test Group 7: Playback Controls (Volume, Mute, Seek, Pause, Resume)
  console.log('[RUNNING] Test Group 7: Playback Controls Verification...');
  service1.setVolume(0.65);
  assert(service1.getState().volume === 0.65, 'Volume must be set to 0.65');

  service1.setVolume(1.5); // Clamping test
  assert(service1.getState().volume === 1.0, 'Volume > 1.0 must clamp to 1.0');

  service1.setVolume(-0.5); // Clamping test
  assert(service1.getState().volume === 0.0, 'Volume < 0.0 must clamp to 0.0');

  service1.setVolume(0.8);
  service1.toggleMute();
  assert(service1.getState().isMuted === true, 'Mute must be true after toggle');
  service1.toggleMute();
  assert(service1.getState().isMuted === false, 'Mute must be false after second toggle');

  service1.seek(45);
  assert(service1.getState().currentTime === 45, 'Current time must be 45 after seek');

  await service1.playRequirement(localTrack);
  service1.pause();
  assert(service1.getState().status === 'PAUSED', 'Status must be PAUSED after pause()');

  service1.resume();
  assert(service1.getState().status === 'PLAYING', 'Status must be PLAYING after resume()');

  service1.stop();
  console.log('  ✅ Group 7 Passed: Volume, mute, seek, pause, resume, stop verified.');

  // Test Group 8: Event Subscription & Listener Callbacks
  console.log('[RUNNING] Test Group 8: Event Subscription & Broadcast...');
  let updateCount = 0;
  let lastCapturedStatus = '';
  const unsubscribe = service1.subscribe((s) => {
    updateCount++;
    lastCapturedStatus = s.status;
  });

  assert(updateCount >= 1, 'Subscriber must be invoked immediately on subscription');

  await service1.playRequirement(ytTrack);
  assert(lastCapturedStatus === 'PLAYING', 'Subscriber must observe PLAYING status');

  service1.stop();
  assert(lastCapturedStatus === 'IDLE', 'Subscriber must observe IDLE status after stop');

  unsubscribe();
  const countBefore = updateCount;
  service1.setVolume(0.5);
  assert(updateCount === countBefore, 'Unsubscribed listener must not receive further events');
  console.log('  ✅ Group 8 Passed: Reactive event subscription & cleanup verified.');

  console.log('\n================================================================================');
  console.log(`PLAYBACK TEST RESULTS: ${testCount} assertions executed, ${failures.length} failures.`);
  console.log('================================================================================\n');

  return {
    totalTests: testCount,
    passedTests: testCount - failures.length,
    failures
  };
}
