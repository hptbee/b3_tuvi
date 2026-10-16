// Run only after the independently authored fixture packet is complete.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const base = path.dirname(fileURLToPath(import.meta.url));
const read = p => fs.readFileSync(path.join(base,p),'utf8');
const json = p => JSON.parse(read(p));
const hash = data => createHash('sha256').update(data).digest('hex');
const write = (p,v) => fs.writeFileSync(path.join(base,p),JSON.stringify(v,null,2)+'\n');
const legacy = json('../modern-minor/review-bundle.json');
const major = json('../modern-decadal-stem/review-bundle.json');
const profile = 'iztro-pinned-age1-sex-triad-stem';
const fixturesFile = 'independent-fixtures/fixtures.json';
const fixtures = json(fixturesFile);
const algorithmSpec = {
  profileId: profile, baseProfileId: legacy.profileId, baseAlgorithmSpec: legacy.algorithmSpec,
  inputFields: ['birthYearBranch','birthYearStem','gender','nominalAge'],
  selection: 'select_natal_palace_by_ages_includes_explicit_nominalAge_not_decadal_range',
  stemOrder: ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'],
  tigerStartStemByBirthStem: ['Bính','Mậu','Canh','Nhâm','Giáp','Bính','Mậu','Canh','Nhâm','Giáp'],
  sourcePalaceCoordinate: 'mod12(selectedProductBranchId - 3)',
  natalStemDerivation: 'mod10(mod10(tigerStartStemIndex+soulIndex)-soulIndex+sourcePalaceCoordinate)',
  reducedStemIndex: 'mod10(tigerStartStemIndex+sourcePalaceCoordinate)',
  output: 'canonical_pinned_vi_VN_natal_stem_at_selected_minor_physical_palace',
  nominalAge: { integer:true,min:1,max:120 },
  calendarAgeDerivation:false, interpretationReviewed:false, publicFortune:false
};
const exceptions = ['upstream_calendar_equivalence','whole_upstream_natal_equivalence','upstream_yearDivide_selection',
  'upstream_dayDivide_selection','upstream_horoscopeDivide_selection','upstream_ageDivide_selection',
  'upstream_from_rearrangement','plugins_or_custom_configuration','date_to_nominal_age','classical_quanshu_approval',
  'default_profile_change','existing_natal_label_or_formula_change','decadal_stem_selection','minor_stars',
  'fortune_tu_hoa','interpretation','public_predictions'];
const compatibilitySpec = {
  scope:'server_lunar_birth_stem_branch_sex_explicit_age_projection_not_full_iztro_astrolabe',
  receivingSchoolId:'vn-tam-hop-default', upstreamSchoolId:null,
  requestContract:{field:'minorPeriod',exactKeys:['profile','nominalAge'],profile,nominalAge:{integer:true,min:1,max:120}},
  baseCompatibilitySpec:legacy.compatibilitySpec, baseApprovalRequired:true, stemApprovalSeparate:true,
  birthYearStem:'trusted_server_lunar_canIndex_0_to9_canName_exact_agreement_and_sexagenary_parity_with_branch',
  birthYearBranch:'trusted_server_lunar_chiIndex_0_to11_chiName_exact_agreement',
  gender:'validated_product_1_male_minus1_female',
  nominalAge:'caller_supplied_integer_1_to120_not_date_derived',
  sourceBranchAndGenderMapping:major.compatibilitySpec.baseCompatibilitySpec.sourceBranchAndGenderMapping,
  target:'same_unique_validated_natal_physical_palace_as_existing_minor_placement',
  locale:'pinned_Vietnamese_ten_stem_labels_equal_B3_THIEN_CAN_no_aliases',
  oldProfileUnchanged:true, defaultActivated:false, from:'not_applied',
  closed:'no_stem_unless_both_bindings_valid_trusted_metadata_and_selected_branch_mapped',
  knownNatalDifference:'B3_leap_day15_and_upstream_day_gt15_timeIndex12_behavior_not_whole_chart_equivalent',
  publicRelease:false, exclusions:exceptions
};
const conditionIds = ['explicit_distinct_minor_stem_profile','accepted_legacy_minor_branch_age_projection',
  'trusted_server_lunar_year_stem_index_name_and_parity','tiger_rule_ten_year_stem_mapping',
  'natal_palace_stem_selected_by_minor_ages_not_decadal_range','dan_relative_selected_branch_coordinate',
  'canonical_pinned_vietnamese_stem_names','same_source_palace_for_stem_and_branch',
  'closed_states_no_stem_old_profile_unchanged','independent_valid_solar_lunar_chart_fixtures',
  'no_full_calendar_from_or_classical_equivalence','no_stars_transforms_interpretation_or_public_release'];
const proof=json('source-proof.json');
const bundle={status:'PROPOSED_NOT_APPROVED',approval:null,modelReviews:[],subjectType:'fortune_placement_profile',
  subjectId:profile,profileId:profile,sourceProfile:profile,sourceId:legacy.sourceId,editionId:legacy.editionId,
  schoolId:legacy.schoolId,schoolCompatibilityOnly:true,sourceClass:legacy.sourceClass,
  sourceRepository:legacy.sourceRepository,sourcePin:legacy.sourcePin,
  locator:'src/astro/FunctionalAstrolabe.ts#_getHoroscopeBySolarDate:natal_minor_stem',
  sourceSpanFile:'source-span.txt',sourceSpan:read('source-span.txt'),sourceDigest:hash(read('source-span.txt')),
  contextFile:'review-context.txt',contextDigest:hash(read('review-context.txt')),
  fixturesFile,fixturesDigest:hash(read(fixturesFile)),fixturesJsonDigest:hash(JSON.stringify(fixtures)),
  algorithmSpec,algorithmDigest:hash(JSON.stringify(algorithmSpec)),
  compatibilitySpec,compatibilityDigest:hash(JSON.stringify(compatibilitySpec)),conditionIds,exceptions,
  requiredAnchors:['$.palaces.some(({ ages, heavenlyStem, earthlyBranch }, index) => {',
    'if (ages.includes(nominalAge)) {','heavenlyStemOfAge = heavenlyStem;'],
  payloadHashManifest:proof.recoveredFiles.map(f=>({path:'raw/'+f.path,upstreamPath:f.path,bytes:f.bytes,gitBlob:f.gitBlob,
    sha256:f.sha256,pinnedUrl:`https://github.com/SylarLong/iztro/blob/${legacy.sourcePin}/${f.path}`})),
  legacyEvidenceManifest:['review-bundle.json','decision.json','source-span.txt','review-context.txt'].map(p=>({
    path:'docs/knowledge/research/fortune/modern-minor/'+p,sha256:hash(read('../modern-minor/'+p))})),
  requestedReviewBindings:['subjectType','subjectId','profileId','sourceId','sourceProfile','editionId','schoolId','locator',
    'sourcePin','sourceDigest','contextDigest','algorithmDigest','compatibilityDigest','fixturesDigest','conditionIds'],
  reviewQuestion:'Does the complete pinned dependency chain support this exact explicit-age modern minor natal-stem projection and all declared compatibility conditions? Verify source selection, independent valid fixtures, digests and distinctions from decadal stems. Report PARTIAL/CONFLICT or unresolved for any gap; MATCH only for the entire bounded scope.',
  digestConventions:{file:'SHA256 exact UTF8 bytes including final LF',object:'SHA256 JSON.stringify insertion order; no terminal LF'},
  interpretationReviewed:false,expertVerified:false,bookVerified:false,publicRelease:false};
write('candidate-algorithm.json',algorithmSpec);write('compatibility.json',compatibilitySpec);write('review-bundle.json',bundle);
write('review-output-contract.json',{...Object.fromEntries(bundle.requestedReviewBindings.map(k=>[k,bundle[k]])),
  available:true,model:'ACTUAL_MODEL_REQUIRED',claimId:profile,formulaComparison:'MATCH|PARTIAL|CONFLICT|NOT_IMPLEMENTED',
  verdict:'same as formulaComparison',quotation:'exact trimmed source span containing every required anchor',
  conditions:conditionIds,exceptions,reasoning:'actual independent verification required'});
console.log(JSON.stringify({status:bundle.status,profile,sourceDigest:bundle.sourceDigest,contextDigest:bundle.contextDigest,
  algorithmDigest:bundle.algorithmDigest,compatibilityDigest:bundle.compatibilityDigest,fixturesDigest:bundle.fixturesDigest}));
